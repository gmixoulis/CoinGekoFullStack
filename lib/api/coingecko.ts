// ─────────────────────────────────────────────────────────────
// lib/api/coingecko.ts
// Service layer for CoinGecko API.
//
// Architecture: This is the ONLY file that knows about
// CoinGecko's API shape. If CoinGecko changes their API,
// only this file needs updating — components stay the same.
// This is the Dependency Inversion Principle in action.
// ─────────────────────────────────────────────────────────────

import { coinListSchema, coinDetailSchema } from '@/lib/validations/coin.schema';
import { apiGet } from '@/lib/api/client';
import type { CoinListItem, CoinDetail } from '@/lib/types/coin';

const BASE_URL = process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3';
const API_KEY = process.env.COINGECKO_API_KEY || '';

/** Build headers, optionally including API key. */
function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (API_KEY) {
    headers['x-cg-demo-api-key'] = API_KEY;
  }
  return headers;
}

/**
 * Service class with static methods.
 * Trade-off: Class with static methods vs. plain functions.
 * Class groups related methods under a namespace, which is
 * clearer when you have multiple services (CoinGeckoService,
 * UserService, etc.). For a single service, either works.
 */
export class CoinGeckoService {
  /**
   * Fetch paginated market data for top coins.
   * We request a specific set of fields to minimize payload.
   */
  static async getMarkets(page = 1, perPage = 20): Promise<CoinListItem[]> {
    const params = new URLSearchParams({
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: String(perPage),
      page: String(page),
      sparkline: 'false',
    });

    const url = `${BASE_URL}/coins/markets?${params}`;
    const raw = await apiGet<unknown[]>(url, { headers: getHeaders() });

    // Zod validates at runtime — if CoinGecko changes shape, this fails fast
    const validated = coinListSchema.parse(raw);
    return validated as CoinListItem[];
  }

  /**
   * Fetch detailed data for a single coin by ID.
   * We disable tickers, community data, and developer data
   * to reduce payload size (100+ fields → ~20 we actually use).
   */
  static async getCoinById(id: string): Promise<CoinDetail> {
    const params = new URLSearchParams({
      localization: 'false',
      tickers: 'false',
      market_data: 'true',
      community_data: 'false',
      developer_data: 'false',
      sparkline: 'false',
    });

    const url = `${BASE_URL}/coins/${encodeURIComponent(id)}?${params}`;
    const raw = await apiGet<unknown>(url, { headers: getHeaders() });

    const validated = coinDetailSchema.parse(raw);
    return validated as CoinDetail;
  }
}
