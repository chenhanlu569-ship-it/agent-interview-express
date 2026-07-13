import { NextRequest, NextResponse } from 'next/server';
import { leetcodeRepo, runSeeds } from '@/lib/db';

// 确保种子数据已加载
let seeded = false;
function ensureSeed() {
  if (!seeded) { runSeeds(); seeded = true; }
}

export async function GET(request: NextRequest) {
  ensureSeed();
  const sp = request.nextUrl.searchParams;
  const result = leetcodeRepo.list({
    category: sp.get('category') || undefined,
    difficulty: sp.get('difficulty') || undefined,
    heat_rating: sp.get('heat_rating') ? Number(sp.get('heat_rating')) : undefined,
    search: sp.get('search') || undefined,
    is_favorited: sp.get('is_favorited') ? Number(sp.get('is_favorited')) : undefined,
    is_solved: sp.get('is_solved') ? Number(sp.get('is_solved')) : undefined,
    page: Number(sp.get('page') || 1),
    pageSize: Number(sp.get('pageSize') || 20),
  });
  return NextResponse.json(result);
}

export async function PATCH(request: NextRequest) {
  ensureSeed();
  const body = await request.json();
  if (body.action === 'toggleFavorite' && body.id) {
    leetcodeRepo.toggleFavorite(body.id);
  } else if (body.action === 'toggleSolved' && body.id) {
    leetcodeRepo.toggleSolved(body.id);
  }
  return NextResponse.json({ success: true });
}
