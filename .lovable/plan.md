

## Minimal Scroll Mobile Layout + Data Accuracy Fix

### Overview
Transform the mobile experience to show only **1 token per section** by default, with an expandable dropdown for the rest. Also improve data accuracy by reducing cache staleness indicators and ensuring fresh data is prioritized.

### Changes

**File: `src/components/CryptoPricesWidget.tsx`**

#### 1. Show Only First Token by Default (Mobile)

Change the slice logic from `slice(0, 5)` to `slice(0, 1)`:

```tsx
// Current (line 209-210)
const displayedTop10 = isMobile && !showAllTop10 ? data?.top10.slice(0, 5) : data?.top10;
const displayedRecommended = isMobile && !showAllRecommended ? data?.recommended.slice(0, 5) : data?.recommended;

// New
const displayedTop10 = isMobile && !showAllTop10 ? data?.top10.slice(0, 1) : data?.top10;
const displayedRecommended = isMobile && !showAllRecommended ? data?.recommended.slice(0, 1) : data?.recommended;
```

#### 2. Update Button Text to Reflect "9 more" / "19 more"

```tsx
// Current (line 333)
Show More ({data.top10.length - 5} more)

// New
Show More ({data.top10.length - 1} more)
```

Same for recommended section (line 370).

#### 3. Visual Result on Mobile

```text
+----------------------------------+
|        [Coin Icon]               |
|    LIVE CRYPTO PRICES            |
|    Updated at 2:30 PM            |
|        [ Refresh ]               |
+----------------------------------+
|                                  |
|   [TrendUp] TOP 10 BY MARKET     |
|                                  |
|  +----------------------------+  |
|  |        [BTC Logo]          |  |
|  |           BTC              |  |
|  |          Bitcoin           |  |
|  |           #1               |  |
|  |       $84,060.00           |  |
|  |    [TrendDown] -5.56%      |  |
|  |      MCap: $1.68T          |  |
|  +----------------------------+  |
|                                  |
|     [ Show More (9 more) v ]     |
|                                  |
+----------------------------------+
|                                  |
|   [Star] 3EA RECOMMENDED         |
|         [Our Picks]              |
|                                  |
|  +----------------------------+  |
|  |        [BTC Logo]          |  |
|  |          BTC  [Star]       |  |
|  |          Bitcoin           |  |
|  |           #1               |  |
|  |       $84,060.00           |  |
|  |    [TrendDown] -5.56%      |  |
|  |      MCap: $1.68T          |  |
|  +----------------------------+  |
|                                  |
|     [ Show More (19 more) v ]    |
|                                  |
+----------------------------------+
```

---

**File: `supabase/functions/fetch-crypto-prices/index.ts`**

#### 4. Improve Data Accuracy

The current implementation is already fetching real-time data from CoinGecko with a 5-minute cache. The data accuracy is good based on the network response I can see (prices match current market).

However, to ensure maximum accuracy:

**a) Reduce cache duration to 3 minutes** (CoinGecko updates frequently):
```tsx
// Current (line 10)
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// New
const CACHE_DURATION_MS = 3 * 60 * 1000; // 3 minutes for fresher data
```

**b) Add cache timestamp to response** so UI can show how old the data is:
```tsx
// Add to response
cacheAge: cachedData ? Math.floor((now - cachedData.timestamp) / 1000) : 0 // seconds since cache
```

**c) Update staking APY values** to match current rates from your watchlist images:
- Verify the APY values are accurate (current values look reasonable based on typical staking yields)
- Consider adding a note that APY rates are approximate and fetched from external sources

#### 5. Summary of Changes

| File | Change |
|------|--------|
| `CryptoPricesWidget.tsx` | Line 209-210: Change `slice(0, 5)` to `slice(0, 1)` |
| `CryptoPricesWidget.tsx` | Line 333, 370: Update button text from `-5` to `-1` |
| `fetch-crypto-prices/index.ts` | Line 10: Reduce cache to 3 minutes |
| `fetch-crypto-prices/index.ts` | Add `cacheAge` to response for transparency |

### Technical Notes

- **CoinGecko Free API**: Updates every 1-2 minutes for top coins, so 3-minute cache is reasonable
- **Staking APY**: These are hardcoded approximations - for 100% accuracy, would need to integrate with staking reward APIs (Staking Rewards API, etc.) which is a larger scope
- **Mobile UX**: Showing just 1 card dramatically reduces scroll, users tap "Show More" if interested

