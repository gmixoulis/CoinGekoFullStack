// ─────────────────────────────────────────────────────────────
// app/api/coins/[id]/route.ts
// API proxy route for /coins/{id} detail endpoint.
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { CoinGeckoService } from '@/lib/api/coingecko';
import { ApiClientError } from '@/lib/api/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Coin ID is required' },
        { status: 400 },
      );
    }

    const coin = await CoinGeckoService.getCoinById(id);

    return NextResponse.json(coin, {
      headers: {
        // Detail data changes less frequently — cache 5 minutes
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error(`[API] /coins/[id] error:`, error);

    if (error instanceof ApiClientError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
