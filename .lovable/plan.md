
# Resolving Blank Screen Error and Implementing Course Enhancements

## Root Cause Analysis

The **"TypeError: Importing a module script failed"** error with a blank screen is caused by:

1. **Service Worker Cache**: The PWA configuration (vite-plugin-pwa) is caching JavaScript module chunks. After code changes, the browser loads outdated cached chunks that reference modules that no longer exist or have different hashes.

2. **Stale Browser Cache**: The Vite development server creates module chunks with version hashes (e.g., `chunk-LFVLQP33.js?v=72ac2fe7`). When code is rebuilt, old cached versions fail to load new dependencies.

This is **not a syntax error** - the code is valid. The codebase has been verified:
- All edge function imports are correctly using `https://esm.sh/resend@2.0.0`
- Course 6 content exists and is properly structured (lines 7137-8721)
- No duplicate course definitions found
- All TypeScript imports are valid

---

## Fix Strategy

### Step 1: Force Service Worker Update

Add a version bump trigger to force the service worker to clear stale caches:

**File**: `vite.config.ts`

Add a `version` field to the PWA manifest that increments on significant updates, forcing cache invalidation.

### Step 2: Add Cache-Busting Mechanism

Modify the service worker configuration to skip caching of chunked modules more aggressively, prioritizing fresh network content over stale cached content.

### Step 3: Clear Cache Instructions for User

**Immediate Action Required**: The user needs to clear their browser cache and service worker. This can be done by:
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or: Open DevTools > Application > Storage > Clear site data
- Or: Open DevTools > Application > Service Workers > Unregister

---

## Implementation: Course Enhancements (After Build Fix)

Once the build is working, I'll implement the approved plan:

### Part 1: Enhanced Course Descriptions

Update descriptions for Courses 1-5 in both files:

| Course | Current | New Description |
|--------|---------|-----------------|
| **Course 1** | Brief | Learn why the traditional financial system leaves billions underserved and how decentralized finance offers a transparent alternative you control. Understand blockchain basics, explore key DeFi protocols like stablecoins and decentralized exchanges, and separate facts from hype. No prior crypto knowledge required to start your financial awakening journey. |
| **Course 2** | Brief | Protect your digital assets from the scams, hacks, and costly mistakes that catch even experienced users off guard. Master wallet security fundamentals, learn to spot fake projects and phishing attacks, and build habits that safeguard your wealth. This course covers everything from seed phrase management to transaction verification. |
| **Course 3** | Brief | Discover how to generate passive income through staking, yield farming, and liquidity provision without relying on traditional banks or brokers. Learn the mechanics behind APY calculations, understand impermanent loss, and identify sustainable yield opportunities versus unsustainable token emissions. Start with beginner-friendly platforms and grow your strategy. |
| **Course 4** | Brief | Build and manage a DeFi portfolio aligned with your personal financial goals, risk tolerance, and time horizon. Learn portfolio tracking tools, develop rebalancing strategies, and understand when to take profits versus reinvest. This course transforms scattered holdings into a coherent investment approach you fully control. |
| **Course 5** | Brief | Access professional-grade investment strategies through DeFi vaults while maintaining full custody of your assets. Understand how vaults automate complex strategies, evaluate vault protocols like Enzyme and Yearn, and learn the security considerations before depositing. Includes a step-by-step guide to accessing the 3EA Vault. |

**Files to update:**
- `src/pages/Courses.tsx` (lines 48, 71, 94, 115, 136)
- `src/data/courseContent.ts` (lines 58, and equivalent for courses 2-5)

### Part 2: Fullscreen Reader Mode

Create new components and hooks for immersive course viewing:

#### New Files

| File | Purpose |
|------|---------|
| `src/hooks/useFullscreen.tsx` | Manage fullscreen API (enter/exit/detect) |
| `src/hooks/useSwipeNavigation.tsx` | Touch gesture detection for swipe navigation |
| `src/components/course/FullscreenContentViewer.tsx` | Immersive reader with swipe support |

#### Modified Files

| File | Changes |
|------|---------|
| `src/components/course/EnhancedContentPlayer.tsx` | Add "Focus Mode" button to trigger fullscreen viewer |
| `src/pages/ModuleViewer.tsx` | Pass fullscreen toggle props |

#### Fullscreen Viewer Features

- Full browser fullscreen using native API
- Swipe left/right for module navigation
- Progress dots indicator (1/5, 2/5, etc.)
- Large touch-friendly Previous/Next buttons
- Visible Exit button in corner
- Keyboard support (arrow keys, Escape)
- Optimized for landscape orientation on mobile

---

## Files to Modify Summary

| Priority | File | Purpose |
|----------|------|---------|
| 1 | `vite.config.ts` | Add version field to force cache invalidation |
| 2 | `src/pages/Courses.tsx` | Update 5 course descriptions |
| 3 | `src/data/courseContent.ts` | Sync descriptions (Course 1 already has enhanced description) |
| 4 | `src/hooks/useFullscreen.tsx` | NEW - Fullscreen API hook |
| 5 | `src/hooks/useSwipeNavigation.tsx` | NEW - Touch swipe detection hook |
| 6 | `src/components/course/FullscreenContentViewer.tsx` | NEW - Main fullscreen reader component |
| 7 | `src/components/course/EnhancedContentPlayer.tsx` | Add Focus Mode button |
| 8 | `src/pages/ModuleViewer.tsx` | Wire up fullscreen props |

---

## Technical Implementation Details

### Fullscreen API Hook

```typescript
// useFullscreen.tsx
export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const enter = async (element: HTMLElement) => {
    if (element.requestFullscreen) {
      await element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      await (element as any).webkitRequestFullscreen();
    }
  };
  
  const exit = async () => {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    }
  };
  
  // Listen for fullscreen changes
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleChange);
    document.addEventListener('webkitfullscreenchange', handleChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleChange);
      document.removeEventListener('webkitfullscreenchange', handleChange);
    };
  }, []);
  
  return { isFullscreen, enter, exit };
};
```

### Swipe Navigation Hook

```typescript
// useSwipeNavigation.tsx
export const useSwipeNavigation = (
  onSwipeLeft: () => void, 
  onSwipeRight: () => void,
  threshold = 50
) => {
  const touchStartX = useRef(0);
  
  const handlers = {
    onTouchStart: (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    },
    onTouchEnd: (e: React.TouchEvent) => {
      const delta = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(delta) > threshold) {
        delta > 0 ? onSwipeLeft() : onSwipeRight();
      }
    }
  };
  
  return handlers;
};
```

---

## Immediate User Action Required

Before I can implement these changes, please clear your browser cache:

**Option 1 - Hard Refresh:**
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

**Option 2 - Clear All Site Data:**
1. Open browser DevTools (F12)
2. Go to Application tab
3. Click "Clear site data" in the Storage section

**Option 3 - Unregister Service Worker:**
1. Open DevTools > Application > Service Workers
2. Click "Unregister" for this site

After clearing, the blank screen should resolve and the app will load fresh code.
