// ─────────────────────────────────────────────────────────────
// lib/validations/coin.schema.ts
// Zod schemas for runtime validation of CoinGecko API data.
//
// Trade-off: TypeScript only validates at compile time.
// External API data can change shape without warning.
// Zod catches this at runtime → fail fast, clear errors.
// ─────────────────────────────────────────────────────────────

import { z } from 'zod';

/**
 * Schema for a single coin from /coins/markets.
 * Uses .nullish() for fields that CoinGecko may return as null.
 */
export const coinListItemSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  image: z.string(),
  current_price: z.number().nullish().transform((v) => v ?? 0),
  market_cap: z.number().nullish().transform((v) => v ?? 0),
  market_cap_rank: z.number().nullish().transform((v) => v ?? 0),
  total_volume: z.number().nullish().transform((v) => v ?? 0),
  high_24h: z.number().nullish().transform((v) => v ?? 0),
  low_24h: z.number().nullish().transform((v) => v ?? 0),
  price_change_percentage_24h: z.number().nullish().transform((v) => v ?? 0),
  circulating_supply: z.number().nullish().transform((v) => v ?? 0),
  total_supply: z.number().nullable().optional().default(null),
  max_supply: z.number().nullable().optional().default(null),
  ath: z.number().nullish().transform((v) => v ?? 0),
  ath_change_percentage: z.number().nullish().transform((v) => v ?? 0),
  last_updated: z.string(),
});

/** Array of market coins. */
export const coinListSchema = z.array(coinListItemSchema);

/** Schema for /coins/{id} response — only the fields we use. */
export const coinDetailSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  description: z.object({
    en: z.string().default(''),
  }),
  image: z.object({
    thumb: z.string(),
    small: z.string(),
    large: z.string(),
  }),
  market_cap_rank: z.number().nullish().transform((v) => v ?? 0),
  market_data: z.object({
    current_price: z.object({ usd: z.number() }),
    market_cap: z.object({ usd: z.number() }),
    total_volume: z.object({ usd: z.number() }),
    high_24h: z.object({ usd: z.number() }),
    low_24h: z.object({ usd: z.number() }),
    circulating_supply: z.number().nullish().transform((v) => v ?? 0),
    total_supply: z.number().nullable().optional().default(null),
    max_supply: z.number().nullable().optional().default(null),
    ath: z.object({ usd: z.number() }),
    ath_change_percentage: z.object({ usd: z.number() }),
    ath_date: z.object({ usd: z.string() }),
    atl: z.object({ usd: z.number() }),
    atl_change_percentage: z.object({ usd: z.number() }),
    atl_date: z.object({ usd: z.string() }),
    price_change_percentage_24h: z.number().nullish().transform((v) => v ?? 0),
    price_change_percentage_7d: z.number().nullish().transform((v) => v ?? 0),
    price_change_percentage_14d: z.number().nullish().transform((v) => v ?? 0),
    price_change_percentage_30d: z.number().nullish().transform((v) => v ?? 0),
    price_change_percentage_60d: z.number().nullish().transform((v) => v ?? 0),
    price_change_percentage_200d: z.number().nullish().transform((v) => v ?? 0),
    price_change_percentage_1y: z.number().nullish().transform((v) => v ?? 0),
  }),
  links: z.object({
    homepage: z.array(z.string()),
    blockchain_site: z.array(z.string()),
    subreddit_url: z.string().default(''),
  }),
  categories: z.array(z.string()),
  last_updated: z.string(),
});

/** Type inferred from schema — ensures types stay in sync. */
export type ValidatedCoinListItem = z.infer<typeof coinListItemSchema>;
export type ValidatedCoinDetail = z.infer<typeof coinDetailSchema>;
