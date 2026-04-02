// ─────────────────────────────────────────────────────────────
// lib/types/coin.ts
// Domain types for the CoinGecko crypto tracker.
//
// Uses TypeScript `unique symbol` for action types — this is
// the ONLY way to get type-safe Symbols in TypeScript.
//
// KEY LEARNING: TypeScript & Symbols
// ─────────────────────────────────────────────────────────────
// Regular `symbol` type is like `string` — it could be ANY symbol.
// `unique symbol` is like a string literal `'hello'` — it's one
// specific symbol that TypeScript can track and narrow.
//
// To declare a `unique symbol`, you MUST use:
//   const x: unique symbol = Symbol.for('some-key');
//
// This creates a nominal type — each constant has its own type
// that TypeScript can distinguish in switch/if-else statements.
// ─────────────────────────────────────────────────────────────

/** Shape returned by CoinGecko /coins/markets endpoint (trimmed). */
export interface CoinListItem {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  last_updated: string;
}

/** Shape returned by CoinGecko /coins/{id} endpoint (trimmed). */
export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  description: { en: string };
  image: { thumb: string; small: string; large: string };
  market_cap_rank: number;
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
    ath: { usd: number };
    ath_change_percentage: { usd: number };
    ath_date: { usd: string };
    atl: { usd: number };
    atl_change_percentage: { usd: number };
    atl_date: { usd: string };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_14d: number;
    price_change_percentage_30d: number;
    price_change_percentage_60d: number;
    price_change_percentage_200d: number;
    price_change_percentage_1y: number;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    subreddit_url: string;
  };
  categories: string[];
  last_updated: string;
}

// ─────────────────────────────────────────────────────────────
// Reducer state & actions
// ─────────────────────────────────────────────────────────────

/** Application state managed by useReducer. */
export interface CoinsState {
  coins: CoinListItem[];
  selectedCoin: CoinDetail | null;
  isLoading: boolean;
  error: string | null;
  page: number;
  perPage: number;
}

// ─────────────────────────────────────────────────────────────
// Action Types — using `unique symbol`
//
// HOW THIS WORKS:
//
// 1. `unique symbol` tells TypeScript: "this is not just *any*
//    symbol, it's THIS SPECIFIC symbol." This creates a
//    distinct type for each constant.
//
// 2. `Symbol.for('coins/SET_COINS')` creates the actual runtime
//    value using a global registry (so the same key always
//    returns the same Symbol across modules).
//
// 3. Together, we get:
//    - Runtime: unique Symbol values (no string collisions)
//    - Compile-time: TypeScript can narrow in switch statements
//
// WHY Symbol.for() OVER Symbol()?
// - Symbol()     → NEW unique symbol each call (dangerous in
//                   React — re-creates on re-render if inside
//                   a component)
// - Symbol.for() → Global registry lookup (same key = same
//                   Symbol, stable across modules and renders)
//
// WHY NOT PLAIN ENUMS?
// - Enums compile to strings: 'SET_COINS' === 'SET_COINS'
//   means any string can match — no uniqueness guarantee.
// - Symbols are primitives that can ONLY match by reference.
//   You must import the exact constant to dispatch the action.
// ─────────────────────────────────────────────────────────────

/** Each `unique symbol` creates a distinct TypeScript type. */
const SET_COINS: unique symbol = Symbol.for('coins/SET_COINS');
const SET_SELECTED_COIN: unique symbol = Symbol.for('coins/SET_SELECTED_COIN');
const SET_LOADING: unique symbol = Symbol.for('coins/SET_LOADING');
const SET_ERROR: unique symbol = Symbol.for('coins/SET_ERROR');
const SET_PAGE: unique symbol = Symbol.for('coins/SET_PAGE');
const RESET_ERROR: unique symbol = Symbol.for('coins/RESET_ERROR');

/**
 * Frozen object grouping all action types.
 * Object.freeze prevents modification at runtime.
 *
 * Because each value is declared as `unique symbol` above,
 * TypeScript knows that CoinActionType.SET_COINS has type
 * `typeof SET_COINS` — a specific, narrowable type, NOT
 * the generic `symbol` type. This is what makes switch
 * statements work with full type narrowing.
 */
export const CoinActionType = Object.freeze({
  SET_COINS,
  SET_SELECTED_COIN,
  SET_LOADING,
  SET_ERROR,
  SET_PAGE,
  RESET_ERROR,
});

/**
 * Discriminated union for all actions.
 *
 * `typeof CoinActionType.SET_COINS` resolves to `typeof SET_COINS`,
 * which is a `unique symbol` — a distinct type that TypeScript
 * can narrow. This means inside a switch case for SET_COINS,
 * TypeScript knows the payload is `CoinListItem[]`.
 *
 * This is identical to how string enums work — but with the
 * added guarantee that no other value can accidentally match.
 */
export type CoinAction =
  | { type: typeof CoinActionType.SET_COINS; payload: CoinListItem[] }
  | { type: typeof CoinActionType.SET_SELECTED_COIN; payload: CoinDetail }
  | { type: typeof CoinActionType.SET_LOADING; payload: boolean }
  | { type: typeof CoinActionType.SET_ERROR; payload: string }
  | { type: typeof CoinActionType.SET_PAGE; payload: number }
  | { type: typeof CoinActionType.RESET_ERROR };
