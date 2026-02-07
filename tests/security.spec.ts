import { test, expect } from './helpers/fixtures';

test.describe('Seguridad - XSS Prevention', () => {
  test('URL con script injection no se ejecuta', async ({ page }) => {
    await page.goto('/?search=<script>alert(1)</script>');

    await expect(page.locator('h1')).toBeVisible();

    const bodyHtml = await page.content();
    expect(bodyHtml).not.toContain('<script>alert(1)</script>');
  });

  test('no hay inline event handlers en el HTML', async ({ page }) => {
    await page.goto('/');

    const dangerousHandlers = await page.evaluate(() => {
      const handlers = ['onclick', 'onload', 'onerror', 'onmouseover'];
      const elements = document.querySelectorAll('*');
      const found: string[] = [];

      elements.forEach((el) => {
        handlers.forEach((handler) => {
          if (el.hasAttribute(handler)) {
            found.push(`${el.tagName}[${handler}]`);
          }
        });
      });

      return found;
    });

    expect(dangerousHandlers).toHaveLength(0);
  });
});

test.describe('Seguridad - External links', () => {
  test('links externos con target=_blank tienen rel="noopener"', async ({ page }) => {
    await page.goto('/');

    const blankLinks = page.locator('a[target="_blank"]');
    const count = await blankLinks.count();

    for (let i = 0; i < count; i++) {
      const rel = await blankLinks.nth(i).getAttribute('rel');
      expect(rel).toContain('noopener');
    }
  });
});

test.describe('Seguridad - API', () => {
  test('API /api/contact rechaza datos malformados', async ({ page }) => {
    const response = await page.request.post('/api/contact', {
      data: { invalid: 'data' },
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
  });

  test('ruta con payload SQL injection no causa server error', async ({ page }) => {
    const response = await page.goto("/viaje/'; DROP TABLE--");

    expect(response?.status()).toBeLessThan(500);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Seguridad - Error handling', () => {
  test('404 no expone stack traces', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-12345');

    const bodyText = await page.locator('body').innerText();
    // Verificar que no hay stack traces visibles en el texto
    expect(bodyText).not.toMatch(/at\s+\w+\s+\(/);
    expect(bodyText).not.toMatch(/Error:\s*\n\s+at/);
  });
});

test.describe('Seguridad - Admin', () => {
  test('acceso a /admin/dashboard sin auth no muestra contenido admin', async ({ page }) => {
    await page.goto('/admin/dashboard');
    const url = page.url();
    const status = (await page.goto('/admin/dashboard'))?.status();

    // Debe redirigir a login o mostrar formulario de login o devolver error
    const isProtected =
      (await page.getByLabel(/email/i).isVisible().catch(() => false)) ||
      (await page.getByText(/iniciar sesión/i).first().isVisible().catch(() => false)) ||
      url.includes('/admin') && !url.includes('dashboard') ||
      status === 401 ||
      status === 403;

    expect(isProtected).toBeTruthy();
  });
});
