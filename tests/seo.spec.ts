import { test, expect } from './helpers/fixtures';

test.describe('SEO - Meta tags', () => {
  test('homepage tiene title, description y og:title', async ({ page }) => {
    await page.goto('/');

    const title = await page.title();
    expect(title).toContain('Headway Trips');

    const description = await page
      .locator('meta[name="description"]')
      .getAttribute('content');
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(50);

    const ogTitle = await page
      .locator('meta[property="og:title"]')
      .getAttribute('content');
    expect(ogTitle).toBeTruthy();

    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute('content');
    expect(ogImage).toBeTruthy();
  });
});

test.describe('SEO - Structured Data', () => {
  test('viaje detalle tiene JSON-LD si hay datos', async ({ page }) => {
    await page.goto('/viaje/bariloche');

    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    const count = await jsonLdScripts.count();

    // JSON-LD depende de que el viaje exista con datos completos
    if (count === 0) {
      test.skip();
      return;
    }

    const content = await jsonLdScripts.first().textContent();
    expect(content).toBeTruthy();

    const parsed = JSON.parse(content!);
    expect(parsed['@context']).toBe('https://schema.org');
    expect(parsed['@type']).toBeTruthy();
  });
});

test.describe('SEO - Error pages', () => {
  test('404 muestra contenido informativo', async ({ page }) => {
    await page.goto('/pagina-inexistente-test-seo');

    // Debe mostrar contenido de 404
    await expect(
      page.getByText(/no encontrad|destino no encontrado|404/i).first()
    ).toBeVisible();

    // No debe mostrar stack traces visibles al usuario
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toMatch(/at\s+\w+\s+\(/);
  });
});
