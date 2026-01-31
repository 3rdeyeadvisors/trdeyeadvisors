const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const viewports = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 }
  ];

  const routes = [
    { name: 'home', path: '/' },
    { name: 'courses', path: '/courses' },
    { name: 'dashboard', path: '/dashboard' },
    { name: 'vault', path: '/vault-access' }
  ];

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    for (const route of routes) {
      await page.goto(`http://localhost:8080${route.path}`);
      // Wait for lazy-loaded content or animations
      await page.waitForTimeout(2000);
      await page.screenshot({ path: `audit_${route.name}_${viewport.name}.png`, fullPage: false });
    }
  }

  await browser.close();
})();
