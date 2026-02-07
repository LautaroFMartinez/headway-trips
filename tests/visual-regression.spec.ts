import { test, expect } from './helpers/fixtures';
import { waitForAnimations } from './helpers/fixtures';

test.describe('Visual Regression - Homepage', () => {
  test('homepage - desktop light mode', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await waitForAnimations(page);

    await expect(page).toHaveScreenshot('homepage-desktop-light.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
  });

  test('homepage - tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await waitForAnimations(page);

    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
  });

  test('homepage - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await waitForAnimations(page);

    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
  });
});

test.describe('Visual Regression - Trip Detail', () => {
  test('trip detail page - desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/viaje/bariloche');
    await page.waitForLoadState('networkidle');
    await waitForAnimations(page);

    await expect(page).toHaveScreenshot('trip-detail-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.15,
    });
  });

  test('trip detail page - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/viaje/bariloche');
    await page.waitForLoadState('networkidle');
    await waitForAnimations(page);

    await expect(page).toHaveScreenshot('trip-detail-mobile.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.15,
    });
  });
});

test.describe('Visual Regression - Error Pages', () => {
  test('404 page - desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/pagina-inexistente-test');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('404-page-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
  });
});

test.describe('Visual Regression - Comparador', () => {
  test('comparador page - desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/comparador');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('comparador-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
  });
});

test.describe('Visual Regression - Components', () => {
  test('header - scrolled state', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => window.scrollBy(0, 100));
    // Wait for CSS transition to complete
    await page.waitForFunction(() => window.scrollY > 0);
    await waitForAnimations(page);

    const header = page.locator('header');
    await expect(header).toHaveScreenshot('header-scrolled.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('footer - desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await waitForAnimations(page);

    await expect(footer).toHaveScreenshot('footer-desktop.png', {
      maxDiffPixelRatio: 0.05,
    });
  });
});
