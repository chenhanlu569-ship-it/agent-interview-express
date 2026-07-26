import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, imageUrl, prompt } = await request.json();

    if (!imageBase64 && !imageUrl) {
      return NextResponse.json({ error: '需要提供 imageBase64 或 imageUrl' }, { status: 400 });
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    const imageSource = imageBase64
      ? { url: imageBase64, detail: 'high' as const }
      : { url: imageUrl, detail: 'high' as const };

    const systemPrompt = prompt || `你是一个面试题OCR提取专家。请从图片中提取所有面试题和答案内容。
输出格式为JSON数组，每个元素包含：
- question: 题目
- answer: 答案（如有）
- category: 分类（如Java基础、并发编程、JVM等）
- tags: 标签（逗号分隔）
- importance: 重要性(1-5)

如果图片内容不是面试题，请提取所有文字内容，用单个元素表示：
[{question: "图片内容摘要", answer: "完整文字内容", category: "其他", tags: "", importance: 3}]

只输出JSON数组，不要输出其他内容。`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      {
        role: 'user' as const,
        content: [
          { type: 'text' as const, text: '请提取这张图片中的面试题内容，以JSON数组格式输出。' },
          { type: 'image_url' as const, image_url: imageSource },
        ],
      },
    ];

    const response = await client.invoke(messages, {
      model: 'doubao-seed-2-0-pro-260215',
      temperature: 0.3,
    });

    // Parse the JSON from LLM response
    let questions;
    try {
      // Try to extract JSON from the response (may have markdown code blocks)
      let jsonStr = response.content.trim();
      const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim();
      }
      // Remove any leading/trailing brackets issues
      if (!jsonStr.startsWith('[')) {
        const bracketStart = jsonStr.indexOf('[');
        const bracketEnd = jsonStr.lastIndexOf(']');
        if (bracketStart !== -1 && bracketEnd !== -1) {
          jsonStr = jsonStr.substring(bracketStart, bracketEnd + 1);
        }
      }
      questions = JSON.parse(jsonStr);
    } catch {
      questions = [{ question: '提取失败', answer: response.content, category: '其他', tags: '', importance: 3 }];
    }

    return NextResponse.json({ success: true, questions, raw: response.content });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
