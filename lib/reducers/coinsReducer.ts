// ─────────────────────────────────────────────────────────────
// lib/reducers/coinsReducer.ts
// Pure reducer function for coin state management.
//
// PATTERN: switch statement with `unique symbol` action types.
// ─────────────────────────────────────────────────────────────
// Because our action types are declared as `unique symbol` in
// coin.ts, TypeScript can narrow the type inside each case
// branch — we get the exact same type safety as string enums,
// but with Symbol's uniqueness guarantee.
//
// This is the key insight: `unique symbol` is TypeScript's
// way of saying "this specific symbol, not just any symbol."
//
// Trade-off: useReducer over useState.
// With 6 related state fields (coins, selectedCoin, isLoading,
// error, page, perPage), useState would mean 6 separate setState
// calls that can get out of sync. useReducer guarantees atomic
// state transitions through a single dispatch.
// ─────────────────────────────────────────────────────────────

import { CoinActionType, type CoinAction, type CoinsState } from '@/lib/types/coin';

/** Initial state — clean, predictable starting point. */
export const initialCoinsState: CoinsState = {
  coins: [],
  selectedCoin: null,
  isLoading: false,
  error: null,
  page: 1,
  perPage: 20,
};

/**
 * Pure reducer: (state, action) → newState.
 *
 * The switch on Symbol-based action types gives us:
 * - Type narrowing in each case (same as string enums)
 * - Guaranteed no action type collisions (Symbol uniqueness)
 * - Clear, readable code structure
 */
export function coinsReducer(state: CoinsState, action: CoinAction): CoinsState {
  switch (action.type) {
    case CoinActionType.SET_COINS:
      return {
        ...state,
        coins: action.payload,
        isLoading: false,
        error: null,
      };

    case CoinActionType.SET_SELECTED_COIN:
      return {
        ...state,
        selectedCoin: action.payload,
        isLoading: false,
        error: null,
      };

    case CoinActionType.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case CoinActionType.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case CoinActionType.SET_PAGE:
      return {
        ...state,
        page: action.payload,
      };

    case CoinActionType.RESET_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}
