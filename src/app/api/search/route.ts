import { NextRequest, NextResponse } from 'next/server';
import { globalSearch, runSeeds } from '@/lib/db';

let seeded = false;
function ensureSeed() { if (!seeded) { runSeeds(); seeded = true; } }

export async function GET(request: NextRequest) {
  ensureSeed();
  const query = request.nextUrl.searchParams.get('q') || '';
  if (!query.trim()) return NextResponse.json({ leetcode: [], java: [], ai: [], knowledge: [] });
  const result = globalSearch(query);
  return NextResponse.json(result);
}
