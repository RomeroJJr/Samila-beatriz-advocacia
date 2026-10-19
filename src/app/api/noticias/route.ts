import { NextResponse } from 'next/server';
import { loadNews } from '@/lib/news';

// Dinâmico: não busca feeds durante o build. O cache real fica no fetch (30 min) e no CDN.
export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await loadNews();
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' },
  });
}
