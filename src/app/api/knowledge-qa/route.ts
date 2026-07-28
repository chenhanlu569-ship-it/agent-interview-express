import { NextRequest } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';
import { getDb } from '@/lib/db';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { question, history } = await request.json() as { question: string; history?: Array<{role: string; content: string}> };

    if (!question?.trim()) {
      return new Response(JSON.stringify({ error: '请输入问题' }), { status: 400 });
    }

    // 1. Retrieve relevant knowledge from DB
    const db = getDb();
    const keywords = question
      .replace(/[？?！!，。、；：""''（）【】《》\s]+/g, ' ')
      .trim()
      .split(' ')
      .filter(k => k.length >= 2)
      .slice(0, 5);

    let contextParts: string[] = [];

    // Search knowledge_entries
    if (keywords.length > 0) {
      const conditions = keywords.map(k => `(title LIKE '%${k}%' OR content LIKE '%${k}%')`).join(' OR ');
      const knowledgeRows = db.prepare(
        `SELECT title, content, category, source_name FROM knowledge_entries WHERE ${conditions} LIMIT 5`
      ).all() as Array<{ title: string; content: string; category: string; source_name: string }>;

      for (const row of knowledgeRows) {
        contextParts.push(`【${row.category}】${row.title}\n${row.content.slice(0, 500)}${row.source_name ? `\n(来源: ${row.source_name})` : ''}`);
      }
    }

    // Search java_questions
    if (keywords.length > 0) {
      const conditions = keywords.map(k => `(question LIKE '%${k}%' OR answer LIKE '%${k}%')`).join(' OR ');
      const javaRows = db.prepare(
        `SELECT category, question, answer FROM java_questions WHERE ${conditions} LIMIT 3`
      ).all() as Array<{ category: string; question: string; answer: string }>;

      for (const row of javaRows) {
        contextParts.push(`【Java/${row.category}】Q: ${row.question}\nA: ${row.answer}`);
      }
    }

    // Search ai_questions
    if (keywords.length > 0) {
      const conditions = keywords.map(k => `(question LIKE '%${k}%' OR answer LIKE '%${k}%')`).join(' OR ');
      const aiRows = db.prepare(
        `SELECT category, question, answer FROM ai_questions WHERE ${conditions} LIMIT 3`
      ).all() as Array<{ category: string; question: string; answer: string }>;

      for (const row of aiRows) {
        contextParts.push(`【AI/${row.category}】Q: ${row.question}\nA: ${row.answer}`);
      }
    }

    // 2. Build system prompt with context
    const contextBlock = contextParts.length > 0
      ? `\n\n以下是从你的知识库中检索到的相关内容，请基于这些内容回答问题，如果知识库内容不足以回答，可以结合你的知识补充：\n\n${contextParts.join('\n\n---\n\n')}`
      : '\n\n知识库中未找到直接相关的内容，请基于你的知识回答，并建议用户补充相关知识到知识库。';

    const systemPrompt = `你是一个专业的面试准备助手，擅长Java后端、AI Agent、LeetCode算法等面试领域。请用中文回答，结构清晰，重点突出。${contextBlock}`;

    // 3. Build messages
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
    ];

    // Add history
    if (history && Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        if (h.role === 'user' || h.role === 'assistant') {
          messages.push({ role: h.role as 'user' | 'assistant', content: h.content });
        }
      }
    }

    messages.push({ role: 'user', content: question });

    // 4. Stream LLM response
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    const stream = client.stream(messages, {
      model: 'doubao-seed-2-0-lite-260215',
      temperature: 0.7,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.content) {
              const text = chunk.content.toString();
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: String(err) })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
  }
}
