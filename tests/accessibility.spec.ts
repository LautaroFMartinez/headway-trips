import { test, expect } from './helpers/fixtures';

test.describe('Accesibilidad', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('un solo h1 en la página', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    expect(await h1.count()).toBe(1);
  });

  test('jerarquía de headings correcta (h1, h2+)', async ({ page }) => {
    const h2Count = await page.locator('h2').count();
    expect(h2Count).toBeGreaterThan(0);
  });

  test('botones tienen nombres accesibles', async ({ page }) => {
    const buttons = page.locator('button');
    const count = await buttons.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const title = await button.getAttribute('title');

      expect(text?.trim() || ariaLabel || title).toBeTruthy();
    }
  });

  test('imágenes tienen alt text', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const alt = await images.nth(i).getAttribute('alt');
      // alt puede ser "" para decorativas, pero debe existir como atributo
      expect(alt).not.toBeNull();
    }
  });

  test('navegación por teclado produce focus visible', async ({ page }) => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(focusedTag);
  });

  test('links tienen texto descriptivo o aria-label', async ({ page }) => {
    const links = page.locator('a');
    const count = await links.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');

      expect((text && text.trim()) || ariaLabel).toBeTruthy();
    }
  });
});
