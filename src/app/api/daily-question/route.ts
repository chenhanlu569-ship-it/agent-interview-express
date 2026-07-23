import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();

    // Get today's date number for deterministic daily pick
    const today = new Date();
    const dateNum = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    // Seeded random (LCG algorithm)
    let seed = dateNum;
    const seededRandom = () => {
      seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
      return seed / 0x7fffffff;
    };

    // Determine question type based on day of week
    // 0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat
    const dayOfWeek = today.getDay();
    // Mon/Wed/Fri = LeetCode, Tue/Thu = Java, Sat/Sun = AI
    const questionType = [2, 0, 1, 0, 1, 0, 2][dayOfWeek]; // 0=leetcode, 1=java, 2=ai

    if (questionType === 0) {
      // LeetCode: Medium/Hard problems weighted by heat_rating
      const problems = db.prepare(
        `SELECT id, title, title_cn, difficulty, category, tags, description, leetcode_url, solution_hint, heat_rating
         FROM leetcode_problems
         WHERE difficulty IN ('Medium', 'Hard')`
      ).all() as { heat_rating: number }[];

      if (problems.length === 0) {
        return NextResponse.json({ error: 'No problems found' }, { status: 404 });
      }

      const weighted: number[] = [];
      problems.forEach((p, idx) => {
        const w = Math.max(p.heat_rating, 1) ** 2;
        for (let i = 0; i < w; i++) weighted.push(idx);
      });

      const randIdx = Math.floor(seededRandom() * weighted.length);
      const pick = problems[weighted[randIdx]];
      return NextResponse.json({ ...pick, type: 'leetcode' });
    } else if (questionType === 1) {
      // Java questions weighted by importance
      const questions = db.prepare(
        `SELECT id, category, question, answer, tags, importance
         FROM java_questions`
      ).all() as { importance: number }[];

      if (questions.length === 0) {
        return NextResponse.json({ error: 'No questions found' }, { status: 404 });
      }

      const weighted: number[] = [];
      questions.forEach((q, idx) => {
        const w = Math.max(q.importance, 1) ** 2;
        for (let i = 0; i < w; i++) weighted.push(idx);
      });

      const randIdx = Math.floor(seededRandom() * weighted.length);
      const pick = questions[weighted[randIdx]];
      return NextResponse.json({ ...pick, type: 'java' });
    } else {
      // AI Agent questions weighted by importance
      const questions = db.prepare(
        `SELECT id, category, question, answer, tags, importance
         FROM ai_questions`
      ).all() as { importance: number }[];

      if (questions.length === 0) {
        return NextResponse.json({ error: 'No questions found' }, { status: 404 });
      }

      const weighted: number[] = [];
      questions.forEach((q, idx) => {
        const w = Math.max(q.importance, 1) ** 2;
        for (let i = 0; i < w; i++) weighted.push(idx);
      });

      const randIdx = Math.floor(seededRandom() * weighted.length);
      const pick = questions[weighted[randIdx]];
      return NextResponse.json({ ...pick, type: 'ai' });
    }
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
