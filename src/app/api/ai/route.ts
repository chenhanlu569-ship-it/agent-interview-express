import { NextRequest, NextResponse } from 'next/server';
import { aiRepo, runSeeds } from '@/lib/db';

let seeded = false;
function ensureSeed() { if (!seeded) { runSeeds(); seeded = true; } }

export async function GET(request: NextRequest) {
  ensureSeed();
  const sp = request.nextUrl.searchParams;
  const result = aiRepo.list({
    category: sp.get('category') || undefined,
    search: sp.get('search') || undefined,
    is_favorited: sp.get('is_favorited') ? Number(sp.get('is_favorited')) : undefined,
    page: Number(sp.get('page') || 1),
    pageSize: Number(sp.get('pageSize') || 20),
  });
  const categories = aiRepo.getCategories();
  return NextResponse.json({ ...result, categories });
}

export async function POST(request: NextRequest) {
  ensureSeed();
  const body = await request.json();
  const id = aiRepo.create(body);
  return NextResponse.json({ id });
}

export async function PATCH(request: NextRequest) {
  ensureSeed();
  const body = await request.json();
  if (body.action === 'toggleFavorite' && body.id) {
    aiRepo.toggleFavorite(body.id);
  } else if (body.id) {
    aiRepo.update(body.id, body);
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  ensureSeed();
  const sp = request.nextUrl.searchParams;
  const id = Number(sp.get('id'));
  if (id) aiRepo.delete(id);
  return NextResponse.json({ success: true });
}
