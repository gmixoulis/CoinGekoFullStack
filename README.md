# CryptoTracker

A production-grade cryptocurrency tracker built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**.

Live data from [CoinGecko API](https://www.coingecko.com/en/api) — paginated list of top coins + detailed coin pages.

## Architecture

```
Frontend (React)  →  API Routes (Proxy)  →  CoinGecko API
     ↕                    ↕
  useReducer         Zod Validation
  (Symbol actions)   (Runtime type safety)
```

**Key patterns:** Layered architecture, Facade/Proxy pattern, Container/Presentational components, `unique symbol` action types, Zod runtime validation.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router + Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| State | useReducer with Symbol-based actions |
| Validation | Zod |
| HTTP | Native Fetch API |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
├── page.tsx                    # Home — paginated coin list
├── coins/[id]/page.tsx         # Detail — single coin view
├── api/coins/markets/route.ts  # Proxy → CoinGecko /coins/markets
└── api/coins/[id]/route.ts     # Proxy → CoinGecko /coins/{id}

components/coins/
├── CoinTable.tsx               # Presentational table (React.memo)
├── CoinDetailCard.tsx          # Presentational detail view
└── PriceChange.tsx             # Reusable price change badge

lib/
├── types/coin.ts               # Domain types + Symbol action types
├── validations/coin.schema.ts  # Zod runtime validation schemas
├── api/client.ts               # Fetch wrapper with deduplication
├── api/coingecko.ts            # CoinGecko service layer
├── reducers/coinsReducer.ts    # Pure reducer function
└── utils/formatters.ts         # Currency/percentage formatters

hooks/
└── useCoinsReducer.ts          # Custom hook (useReducer + fetch)
```

## Design Decisions

| Decision | Chosen | Why |
|----------|--------|-----|
| HTTP Client | Native Fetch | Zero supply-chain risk, Next.js cache integration |
| State | useReducer | Atomic transitions for 6 related fields |
| Action Types | `unique symbol` | Guaranteed uniqueness + TS type narrowing |
| Validation | Zod | Runtime safety for external API data |
| Backend | Proxy API routes | API keys server-side, data filtering, caching |
| Components | Container/Presentational | Testable, reusable, SRP |

## Powered By

- [CoinGecko API](https://www.coingecko.com/en/api) — cryptocurrency market data
- [shadcn/ui](https://ui.shadcn.com/) — accessible React components
- [Next.js](https://nextjs.org/) — React framework
