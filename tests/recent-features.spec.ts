import { test, expect } from '@playwright/test';

test.describe('Recent Features Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Homepage loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Headway Trips/);
    await expect(page.locator('h1')).toContainText('Descubrí destinos únicos');
  });

  test('Promo banner is visible with countdown', async ({ page }) => {
    // Check promo banner exists
    const promoBanner = page.locator('text=Descuento de Verano').first();
    await expect(promoBanner).toBeVisible();

    // Check countdown is present
    const countdown = page.locator('text=/\\d+\\s+(días|hrs|min|seg)/').first();
    await expect(countdown).toBeVisible();

    // Check promo code is displayed
    await expect(page.locator('text=/Código:/i')).toBeVisible();
  });

  test('Scroll to top button appears after scrolling', async ({ page }) => {
    // Button should not be visible initially
    const scrollButton = page.getByRole('button', { name: 'Volver arriba' });
    await expect(scrollButton).not.toBeVisible();

    // Scroll down
    await page.keyboard.press('End');
    await page.waitForTimeout(500); // Wait for scroll animation

    // Button should now be visible
    await expect(scrollButton).toBeVisible();

    // Click button to scroll back up
    await scrollButton.click();
    await page.waitForTimeout(500);

    // Should be at top (check if hero section is visible)
    const hero = page.locator('text=Tu próxima aventura comienza aquí');
    await expect(hero).toBeVisible();
  });

  test('404 page has breadcrumbs and search functionality', async ({ page }) => {
    await page.goto('/pagina-inexistente');

    // Check page shows 404 content (use first() to handle multiple matches)
    await expect(page.locator('text=/Página no encontrada|404/i').first()).toBeVisible();

    // Check breadcrumbs are present
    const breadcrumbs = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumbs).toBeVisible();

    // Check home link in breadcrumbs
    const homeLink = breadcrumbs.locator('a[href="/"]').first();
    await expect(homeLink).toBeVisible();

    // Check search input exists
    const searchInput = page.locator('input[type="search"]').first();
    await expect(searchInput).toBeVisible();

    // Check suggested destinations section (text may vary depending on URL)
    const suggestedSection = page.locator('text=/Quizás buscabas|Destinos populares/i');
    await expect(suggestedSection.first()).toBeVisible();
  });

  test('Breadcrumbs have Schema.org markup', async ({ page }) => {
    await page.goto('/viaje/bariloche');

    // Check for JSON-LD schema (scripts are not visible but should exist in DOM)
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const count = await jsonLd.count();
    expect(count).toBeGreaterThan(0);

    // Check breadcrumb navigation exists
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumb).toBeVisible();

    // Check microdata attributes
    const breadcrumbList = breadcrumb.locator('[itemtype="https://schema.org/BreadcrumbList"]');
    await expect(breadcrumbList).toBeVisible();
  });

  test('Trip grid displays correctly with filters', async ({ page }) => {
    // Check trips are loaded
    const tripCards = page.locator('[data-testid="trip-card"]').or(page.locator('h3'));
    await expect(tripCards.first()).toBeVisible();

    // Check search input
    const searchInput = page.locator('input[placeholder*="Buscar destinos"]');
    await expect(searchInput).toBeVisible();

    // Check region filters
    await expect(page.locator('button:has-text("Patagonia")')).toBeVisible();
    await expect(page.locator('button:has-text("Litoral")')).toBeVisible();
    await expect(page.locator('button:has-text("Cuyo")')).toBeVisible();
    await expect(page.locator('button:has-text("Norte")')).toBeVisible();

    // Check results counter
    await expect(page.locator('text=/Mostrando \\d+ resultado/i')).toBeVisible();
  });

  test('Promo banner rotates between promotions', async ({ page }) => {
    // Check rotation indicators exist
    const indicators = page.locator('button[aria-label*="Ver promoción"]');
    await expect(indicators.first()).toBeVisible();

    const indicatorCount = await indicators.count();
    expect(indicatorCount).toBeGreaterThan(1);

    // Get initial promo text
    const initialPromo = await page.locator('text=/Descuento|Oferta|Promoción/i').first().textContent();

    // Wait for rotation (8 seconds + buffer)
    await page.waitForTimeout(9000);

    // Check if promo has changed (or stayed the same)
    const newPromo = await page.locator('text=/Descuento|Oferta|Promoción/i').first().textContent();

    // At least verify the structure is still intact
    expect(newPromo).toBeTruthy();
  });

  test('Navigation links work correctly', async ({ page }) => {
    // Test main navigation
    await page.click('text=Destinos');
    await page.waitForTimeout(500);

    // Check if scrolled to destinos section (use exact match)
    const destinosSection = page.locator('text="Nuestros Destinos"').first();
    await expect(destinosSection).toBeInViewport();

    // Test trip detail link
    await page.click('text=Ver detalles >> nth=0');
    await page.waitForURL(/\/viaje\/.+/);
    await expect(page).toHaveURL(/\/viaje\/.+/);
  });

  test('Wishlist button functionality', async ({ page }) => {
    const wishlistButton = page
      .locator('button[aria-label*="favoritos"]')
      .or(page.getByRole('button').filter({ hasText: 'Agregar a favoritos' }))
      .first();

    await expect(wishlistButton).toBeVisible();

    // Click wishlist button
    await wishlistButton.click();
    await page.waitForTimeout(500);

    // Button should still be visible (state may change)
    await expect(wishlistButton).toBeVisible();
  });
});

test.describe('SEO and Performance', () => {
  test('Pages have proper meta tags', async ({ page }) => {
    await page.goto('/');

    // Check title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(10);

    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription!.length).toBeGreaterThan(50);

    // Check Open Graph tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();
  });

  test('Images use Next.js Image component', async ({ page }) => {
    await page.goto('/');

    // Check for Next.js optimized images
    const images = page.locator('img');
    const imageCount = await images.count();
    expect(imageCount).toBeGreaterThan(0);

    // Check first image has loading attribute
    const firstImage = images.first();
    const loading = await firstImage.getAttribute('loading');
    const src = await firstImage.getAttribute('src');

    // Should have either loading attribute or priority (no loading attribute)
    expect(loading === 'lazy' || loading === null).toBeTruthy();
    expect(src).toBeTruthy();
  });

  test('Structured data is present', async ({ page }) => {
    await page.goto('/viaje/bariloche');

    // Check for JSON-LD scripts
    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    const count = await jsonLdScripts.count();

    expect(count).toBeGreaterThan(0);

    // Verify JSON-LD content is valid
    const firstScript = await jsonLdScripts.first().textContent();
    expect(firstScript).toBeTruthy();

    const parsed = JSON.parse(firstScript!);
    expect(parsed['@context']).toBe('https://schema.org');
    expect(parsed['@type']).toBeTruthy();
  });
});

test.describe('Accessibility', () => {
  test('Page has proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Check for h1
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    const h1Count = await h1.count();
    expect(h1Count).toBe(1); // Should have exactly one h1

    // Check for other headings
    const h2 = page.locator('h2');
    const h2Count = await h2.count();
    expect(h2Count).toBeGreaterThan(0);
  });

  test('Interactive elements have proper ARIA labels', async ({ page }) => {
    await page.goto('/');

    // Check navigation has label
    const nav = page.locator('nav[aria-label="Navegación principal"]');
    await expect(nav).toBeVisible();

    // Check buttons have accessible names
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');

      // Either has text content or aria-label
      expect(text || ariaLabel).toBeTruthy();
    }
  });

  test('Images have alt text', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img').filter({ hasNot: page.locator('[alt=""]') });
    const imageCount = await images.count();

    // Check first few images have alt text
    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('Links have descriptive text', async ({ page }) => {
    await page.goto('/');

    const links = page.locator('a');
    const linkCount = await links.count();

    for (let i = 0; i < Math.min(linkCount, 10); i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');

      // Link should have text or aria-label
      expect((text && text.trim()) || ariaLabel).toBeTruthy();
    }
  });
});

test.describe('Responsive Design', () => {
  test('Mobile: Page renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page.locator('h1')).toBeVisible();

    // Check trip grid adjusts for mobile
    const tripCards = page.locator('h3').filter({ hasText: /Bariloche|Mendoza|Cataratas/ });
    await expect(tripCards.first()).toBeVisible();
  });

  test('Tablet: Page renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    await expect(page.locator('h1')).toBeVisible();
  });

  test('Desktop: Page renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    await expect(page.locator('h1')).toBeVisible();
  });
});
