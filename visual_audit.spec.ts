import { test, expect } from '@playwright/test';

const pages = [
  '/',
  '/auth',
  '/dashboard',
  '/courses',
  '/vault-access',
  '/profile',
];

test('Capture screenshots for visual audit', async ({ page }) => {
  // Set viewport for iPhone 13 Pro Max
  await page.setViewportSize({ width: 428, height: 926 });

  for (const path of pages) {
    try {
      await page.goto(`http://localhost:8082${path}`, { waitUntil: 'networkidle' });
      // Add a small delay for animations
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `screenshot-${path.replace(/\//g, 'root')}.png`, fullPage: true });
      console.log(`Captured screenshot for ${path}`);
    } catch (e) {
      console.error(`Failed to capture screenshot for ${path}: ${e.message}`);
    }
  }
});
