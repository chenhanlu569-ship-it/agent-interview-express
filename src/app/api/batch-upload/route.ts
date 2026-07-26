import { NextRequest, NextResponse } from 'next/server';
import { knowledgeRepo, javaRepo, aiRepo, runSeeds } from '@/lib/db';

let seeded = false;
function ensureSeed() { if (!seeded) { runSeeds(); seeded = true; } }

interface BatchItem {
  type: 'knowledge' | 'java' | 'ai';
  data: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  ensureSeed();
  try {
    const body = await request.json();
    const { items, module } = body as { items: BatchItem[]; module?: string };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'items 必须是非空数组' }, { status: 400 });
    }

    const results: { index: number; id?: number; error?: string }[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      try {
        const itemAny = item as unknown as Record<string, unknown>;
        const targetType = module || itemAny.type || 'knowledge';
        // If module is provided, item fields are at top level; otherwise use item.data
        const d = module ? itemAny : (itemAny.data as Record<string, unknown>) || itemAny;
        let id: number | undefined;

        if (targetType === 'java') {
          id = Number(javaRepo.create({
            category: String(d.category || '未分类'),
            question: String(d.question || ''),
            answer: String(d.answer || ''),
            tags: String(d.tags || ''),
            importance: Number(d.importance || 3),
          }));
        } else if (targetType === 'ai') {
          id = Number(aiRepo.create({
            category: String(d.category || '未分类'),
            question: String(d.question || ''),
            answer: String(d.answer || ''),
            tags: String(d.tags || ''),
            importance: Number(d.importance || 3),
          }));
        } else {
          const srcType = String(d.source_type || 'personal');
          id = Number(knowledgeRepo.create({
            title: String(d.title || ''),
            content: String(d.content || ''),
            source_type: (srcType === 'ai_search' ? 'ai_search' : 'personal') as 'ai_search' | 'personal',
            source_url: String(d.source_url || ''),
            source_name: String(d.source_name || ''),
            category: String(d.category || '未分类'),
            tags: String(d.tags || ''),
          }));
        }
        results.push({ index: i, id });
      } catch (e) {
        results.push({ index: i, error: String(e) });
      }
    }

    const successCount = results.filter(r => r.id !== undefined).length;
    const failCount = results.filter(r => r.error).length;

    return NextResponse.json({
      success: true,
      total: items.length,
      successCount,
      failCount,
      results,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
