# CryptoTracker - Cyberscope Full-Stack Assignment

A lightweight, full-stack application built for the Cyberscope assignment that provides cryptocurrency price information using the CoinGecko API.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **shadcn/ui**.

## 🚀 Assignment Implementation Details

This project is specifically designed to meet all the constraints and exact requirements of the Cyberscope Full-Stack Assignment.

### 1. Backend Proxy API
**Requirement:** *The backend should work as a proxy of the CoinGecko API. When the frontend requests `/coins/markets` or `/coins/{id}`, the request should traverse the backend.*
- **Implementation:** Next.js Route Handlers (`app/api/coins/markets/route.ts` and `app/api/coins/[id]/route.ts`) act as the proxy backend. 
- **Benefit:** The browser never communicates with CoinGecko directly. This fully secures the API Key on the server and prevents CORS issues.

### 2. Data Filtering & Zod Validation
**Requirement:** *The backend should respond to the frontend with the required fields for the render only.*
- **Implementation:** The backend utilizes **Zod runtime validation schemas** (`lib/validations/coin.schema.ts`). When the Next.js API receives the massive payload from CoinGecko, it passes the data through `coinListSchema.parse()` and `coinDetailSchema.parse()`. 
- **Benefit:** This strictly strips out all unnecessary data, ensuring the React frontend receives a very lightweight, fully type-safe payload containing *only* the fields requested in the assignment format.

### 3. API Parameters & Currency
**Requirement:** *Use proper parameters to not request unnecessary information. Currency fixed in USD.*
- **Implementation:** The backend explicitly appends `vs_currency=usd` to list requests. For the detailed coin request, it actively turns off bloated properties by appending `localization=false`, `tickers=false`, `community_data=false`, and `developer_data=false`.

### 4. List of Coins & Pagination
**Requirement:** *List of all coins with Name, Symbol, Current Price, High 24h, Low 24h, Price change % 24h. A typical pagination mechanism.*
- **Implementation:** 
  - Standard pagination is implemented on the home page via "Previous" & "Next" buttons.
  - Page state is robustly managed via `useReducer`, and a `useEffect` pushes the current page to the backend proxy (`/api/coins/markets?page=N&per_page=20`).

### 5. Detail Page
**Requirement:** *Detailed information for a specific coin (Price, Describe, Price changes across multiple periods, high/low).*
- **Implementation:** Dynamic routing via `app/coins/[id]/page.tsx` fetches data from the backend proxy specifically tailored with the requested percentage change metrics and renders them using a reusable `PriceChange` badge.

---

## 🏗 Architecture

```
Frontend (React)  →  Next.js API Routes (Backend Proxy)  →  CoinGecko API
          ↕                             ↕
     useReducer                  Zod Validation
  (Symbol actions)            (Payload Filtering & Safety)
```

**Key patterns:** 
- **Facade/Proxy Pattern:** The backend Routes hide the complexity and credentials from the frontend.
- **Container/Presentational:** Clean separation of UI elements (`CoinTable.tsx`) and state logic (`useCoinsReducer.ts`).
- **`unique symbol` Actions:** Guarantees absolute uniqueness and precise TypeScript type narrowing in the reducer.

## 🛠 Tech Stack Preference

| Component | Choice | Why |
|-----------|---|---|
| **Backend** | Next.js API Routes | Node environment perfectly coupled with React. Matches assignment stack preference. |
| **Frontend** | React (Next.js) | Component-based, responsive UI. |
| **Styling** | Tailwind CSS + shadcn/ui | Meets assignment preferences for rapid and accessible design. |
| **Validation** | Zod | Runtime type safety ensures CoinGecko's external data conforms strictly to expectations. |
| **HTTP Client**| Native Fetch | Used over Axios to avoid dependency bloat and leverage Next.js native caching. |

---

## 🚦 Getting Started

```bash
# Install dependencies
npm install

# Setup Environment
# Create a .env file and add your CoinGecko variables:
# COINGECKO_API_URL=https://api.coingecko.com/api/v3/
# COINGECKO_API_KEY=your_optional_api_key_here

# Run development server
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```
app/
├── page.tsx                    # Home — paginated coin list
├── coins/[id]/page.tsx         # Detail — single coin view
├── api/coins/markets/route.ts  # Backend Proxy → CoinGecko /coins/markets
└── api/coins/[id]/route.ts     # Backend Proxy → CoinGecko /coins/{id}

components/coins/
├── CoinTable.tsx               # Presentational table (React.memo)
├── CoinDetailCard.tsx          # Presentational detail view
└── PriceChange.tsx             # Reusable price change badge

lib/
├── types/coin.ts               # Domain types + Symbol action types
├── validations/coin.schema.ts  # Zod runtime validation schemas (Data filtering)
├── api/client.ts               # Fetch wrapper with deduplication
├── api/coingecko.ts            # CoinGecko backend service layer
├── reducers/coinsReducer.ts    # Pure reducer for localized state management
└── utils/formatters.ts         # Currency/percentage formatting utils

hooks/
└── useCoinsReducer.ts          # State management hook (useReducer + fetch)
```
