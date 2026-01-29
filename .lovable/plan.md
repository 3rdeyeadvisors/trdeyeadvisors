
## Live Cryptocurrency Prices Widget

### Overview
Add a new cryptocurrency price tracking component to the Analytics page that displays:
1. **Top 10 Cryptocurrencies by Market Cap** - Live prices from CoinGecko
2. **3EA Recommended Watchlist** - Your personal picks highlighted with a special badge

### Your Recommended Tokens (from watchlist images)
Based on the screenshots you shared, here are the tokens to highlight:
- **Layer 1s**: BTC, ETH, SOL, AVAX, ADA, NEAR, SUI, BNB
- **DeFi Tokens**: UNI, LINK, ATOM, ARB
- **Stablecoins**: USDT, USDC, DAI
- **Privacy/Alt**: XMR, LTC, XRP
- **Newer Picks**: HYPE (Hyperliquid), POL (Polygon)

Note: Some tokens like TXC, WLFI, TRUMP, ABX, LCAP, ARRR, ZBCN may not be available on CoinGecko's free API - we'll include what's available and show "Not Available" for others.

### Technical Implementation

**New Edge Function**: `fetch-crypto-prices`
```text
Purpose: Fetch live prices from CoinGecko API
Endpoint: /simple/price with market data
Caching: 5-minute cache to respect rate limits
Data: price, 24h change, market cap, sparkline
```

**New Component**: `CryptoPricesWidget.tsx`
```text
Features:
- Top 10 by market cap grid
- "3EA Recommended" section with your picks
- Green/red price change indicators
- APY badges for staking tokens (from your images)
- Auto-refresh every 5 minutes
- Mobile-responsive design
```

### Files to Create

1. **`supabase/functions/fetch-crypto-prices/index.ts`**
   - Fetch from CoinGecko `/coins/markets` endpoint
   - Return top 10 by market cap + custom watchlist
   - 5-minute server-side caching
   - Graceful fallback if API fails

2. **`src/components/CryptoPricesWidget.tsx`**
   - Display crypto prices in a clean grid
   - "Top 10" section showing market leaders
   - "3EA Picks" section with your recommended tokens
   - Color-coded price changes (green up, red down)
   - Special badges for tokens with staking APY
   - Responsive design for mobile/desktop

3. **Update `src/pages/Analytics.tsx`**
   - Import and add the new widget
   - Place it prominently above or below the existing DeFi charts

### Visual Design

```text
+------------------------------------------+
|  LIVE CRYPTO PRICES          [Refresh]   |
|  Updated every 5 minutes                 |
+------------------------------------------+
|                                          |
|  TOP 10 BY MARKET CAP                    |
|  +--------+ +--------+ +--------+        |
|  |  BTC   | |  ETH   | |  XRP   |  ...   |
|  |$89,000 | |$2,961  | |$1.91   |        |
|  | -4.05% | | -6.94% | | -3.59% |        |
|  +--------+ +--------+ +--------+        |
|                                          |
+------------------------------------------+
|                                          |
|  3EA RECOMMENDED  [star icon]            |
|  +--------+ +--------+ +--------+        |
|  |  SOL   | | AVAX   | | LINK   |  ...   |
|  |$127.33 | |$12.27  | |$12.29  |        |
|  | -4.64% | | -3.16% | | -4.26% |        |
|  |4.25%APY| |4.47%APY|         |        |
|  +--------+ +--------+ +--------+        |
|                                          |
+------------------------------------------+
```

### CoinGecko API Details

**Endpoint Used:**
```
GET https://api.coingecko.com/api/v3/coins/markets
?vs_currency=usd
&order=market_cap_desc
&per_page=50
&sparkline=false
&price_change_percentage=24h
```

**Free Tier Limits:**
- 10-30 calls/minute (we'll cache for 5 minutes)
- No API key required for basic endpoints

### Token ID Mapping
```text
CoinGecko IDs for your picks:
- bitcoin, ethereum, solana, avalanche-2
- chainlink, cardano, near, sui, binancecoin
- uniswap, cosmos, arbitrum, polygon-ecosystem-token
- tether, usd-coin, dai
- monero, litecoin, ripple
- hyperliquid (may need to verify ID)
```

### Error Handling
- Show cached data if API fails
- Display "Data temporarily unavailable" message
- Fallback to last known prices
- Never crash or show blank screen

### Summary
This adds a clean, live cryptocurrency price widget to your Analytics page featuring the top 10 coins by market cap plus your personal recommended picks from the watchlist. It uses the same CoinGecko API already in use elsewhere in your codebase, with proper caching and error handling.
