import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests
 * 
 * Captures baseline screenshots for key pages to detect visual regressions.
 * Run with --update-snapshots to create/update baseline images.
 */

test.describe('Visual Regression - Homepage', () => {
  test('homepage - desktop light mode', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for animations
    
    await expect(page).toHaveScreenshot('homepage-desktop-light.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
  });

  test('homepage - desktop dark mode', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    // Enable dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('homepage-desktop-dark.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
  });

  test('homepage - tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
  });

  test('homepage - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
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
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('trip-detail-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.15, // Allow more variance for dynamic content
    });
  });

  test('trip detail page - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/viaje/bariloche');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
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
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('404-page-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
  });

  test('404 page - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pagina-inexistente-test');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('404-page-mobile.png', {
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
    await page.waitForTimeout(500);
    
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
    
    // Scroll to trigger header background
    await page.evaluate(() => window.scrollBy(0, 100));
    await page.waitForTimeout(350);
    
    const header = page.locator('header');
    await expect(header).toHaveScreenshot('header-scrolled.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('header - initial state', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForTimeout(300);
    
    const header = page.locator('header');
    await expect(header).toHaveScreenshot('header-initial.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('footer - desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    
    await expect(footer).toHaveScreenshot('footer-desktop.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('mobile menu - open', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Open mobile menu
    const menuButton = page.getByRole('button', { name: /toggle menu/i });
    await menuButton.click();
    await page.waitForTimeout(350);
    
    await expect(page).toHaveScreenshot('mobile-menu-open.png', {
      maxDiffPixelRatio: 0.1,
    });
  });
});

test.describe('Visual Regression - Hero Section', () => {
  test('hero section - desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // Capture just the hero section (viewport)
    await expect(page).toHaveScreenshot('hero-desktop.png', {
      maxDiffPixelRatio: 0.1,
    });
  });

  test('hero section - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('hero-mobile.png', {
      maxDiffPixelRatio: 0.1,
    });
  });
});

test.describe('Visual Regression - Cards', () => {
  test('trip cards grid - desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    await page.locator('#destinos').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    
    const destinosSection = page.locator('#destinos');
    await expect(destinosSection).toHaveScreenshot('trip-cards-grid.png', {
      maxDiffPixelRatio: 0.15, // More tolerance for image loading
    });
  });
});
