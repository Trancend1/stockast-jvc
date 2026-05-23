/* eslint-disable @typescript-eslint/no-unused-expressions */
async (page) => {
  const baseUrl = 'http://localhost:3011';
  const widths = [390, 430];
  const routes = ['/login', '/onboarding', '/dashboard', '/catat', '/riwayat', '/ui-kit'];
  const onboardingState = {
    warungName: 'Bu Yati',
    location: 'salatiga',
    menu: 'Pecel lele, ayam goreng, tahu, tempe, cabai rawit',
    completedAt: '2026-05-22T00:00:00.000Z',
  };

  await page.context().addInitScript((state) => {
    window.localStorage.setItem('stockast.onboarding.v1', JSON.stringify(state));
    window.localStorage.setItem('stockast.subuh.override', 'off');
  }, onboardingState);

  const results = [];
  for (const width of widths) {
    for (const route of routes) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 45_000 });
      await page.waitForTimeout(350);

      const report = await page.evaluate(() => {
        const viewportWidth = window.innerWidth;
        const doc = document.documentElement;
        const body = document.body;
        const nodes = Array.from(document.querySelectorAll('body *'));

        const escaped = nodes
          .map((el) => {
            if (el.tagName.toLowerCase() !== 'svg' && el.closest('svg')) return null;
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            const visible =
              rect.width > 0 &&
              rect.height > 0 &&
              style.visibility !== 'hidden' &&
              style.display !== 'none';
            if (!visible) return null;
            const rightOverflow = rect.right - viewportWidth;
            const leftOverflow = -rect.left;
            if (rightOverflow <= 1 && leftOverflow <= 1) return null;
            return {
              tag: el.tagName.toLowerCase(),
              className:
                typeof el.className === 'string'
                  ? el.className.slice(0, 120)
                  : String(el.className).slice(0, 120),
              text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 90),
              left: Math.round(rect.left * 10) / 10,
              right: Math.round(rect.right * 10) / 10,
              width: Math.round(rect.width * 10) / 10,
            };
          })
          .filter(Boolean)
          .slice(0, 20);

        return {
          url: window.location.pathname,
          viewportWidth,
          documentScrollWidth: Math.max(doc.scrollWidth, body.scrollWidth),
          bodyText: body.innerText.replace(/\s+/g, ' ').trim().slice(0, 160),
          escaped,
        };
      });

      const safeRoute = route === '/' ? 'home' : route.slice(1).replace(/\//g, '-');
      await page.screenshot({
        path: `output/playwright/responsive/${safeRoute}-${width}.png`,
        fullPage: true,
      });

      results.push({
        route,
        width,
        ok:
          report.documentScrollWidth <= width + 1 &&
          report.escaped.length === 0 &&
          !report.bodyText.includes('This page could not be found'),
        report,
      });
    }
  }

  return results;
}
