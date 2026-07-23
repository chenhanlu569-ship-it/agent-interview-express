import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();

    // Get all Medium and Hard problems
    const problems = db.prepare(
      `SELECT id, title, title_cn, difficulty, category, tags, description, leetcode_url, solution_hint, heat_rating
       FROM leetcode_problems
       WHERE difficulty IN ('Medium', 'Hard')`
    ).all();

    if (problems.length === 0) {
      return NextResponse.json({ error: 'No problems found' }, { status: 404 });
    }

    // Use date as seed for deterministic daily pick
    const today = new Date();
    const dateNum = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    // Seeded random (LCG algorithm)
    let seed = dateNum;
    const seededRandom = () => {
      seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
      return seed / 0x7fffffff;
    };

    // Weighted selection: heat_rating^2 as weight
    const weighted: number[] = [];
    (problems as { heat_rating: number }[]).forEach((p, idx) => {
      const w = Math.max(p.heat_rating, 1) ** 2;
      for (let i = 0; i < w; i++) weighted.push(idx);
    });

    const randIdx = Math.floor(seededRandom() * weighted.length);
    const pick = problems[weighted[randIdx]];

    return NextResponse.json(pick);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
