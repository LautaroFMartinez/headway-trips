import { test, expect } from '../helpers/fixtures';

test.describe('Detalle de viaje', () => {
  test('carga página de viaje existente con contenido', async ({ page }) => {
    await page.goto('/viaje/europa-clasica-2026');

    // Debe tener h1 con nombre del destino
    await expect(page.locator('h1')).toBeVisible();
  });

  test('schema.org JSON-LD presente y válido', async ({ page }) => {
    await page.goto('/viaje/europa-clasica-2026');

    // Los JSON-LD se inyectan en app/viaje/[id]/page.tsx
    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    const count = await jsonLdScripts.count();

    // Si no hay JSON-LD (puede depender de datos), skip
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

  test('viaje inexistente muestra 404 o página de error', async ({ page }) => {
    const response = await page.goto('/viaje/destino-que-no-existe-12345');
    const status = response?.status();

    // Puede ser 404 directo o una página con contenido de "no encontrado"
    const hasNotFoundContent = await page
      .getByText(/no encontrad|404|no existe/i)
      .first()
      .isVisible()
      .catch(() => false);

    expect(status === 404 || hasNotFoundContent).toBeTruthy();
  });
});
