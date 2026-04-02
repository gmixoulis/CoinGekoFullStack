// ─────────────────────────────────────────────────────────────
// app/api/coins/markets/route.ts
// API proxy route for /coins/markets.
//
// Architecture: The frontend calls THIS route, not CoinGecko
// directly. This is the Facade Pattern — it hides API keys,
// transforms data, and adds caching headers.
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { CoinGeckoService } from '@/lib/api/coingecko';
import { ApiClientError } from '@/lib/api/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get('page')) || 1;
    const perPage = Math.min(Number(searchParams.get('per_page')) || 20, 250);

    const coins = await CoinGeckoService.getMarkets(page, perPage);

    return NextResponse.json(coins, {
      headers: {
        // Cache for 60 seconds — matches CoinGecko's update frequency
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('[API] /coins/markets error:', error);

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
