import { test, expect } from '../helpers/fixtures';

test.describe('Blog', () => {
  test('listado de blog carga correctamente', async ({ page }) => {
    await page.goto('/blog');

    // Debe tener un título principal
    await expect(page.locator('h1')).toBeVisible();

    // Debe tener al menos un artículo/link
    const articles = page.getByRole('link').filter({ hasText: /.{10,}/ });
    const count = await articles.count();
    expect(count).toBeGreaterThan(0);
  });

  test('navegar a artículo individual', async ({ page }) => {
    await page.goto('/blog');

    // Click en el primer artículo
    const articleLink = page
      .locator('a[href*="/blog/"]')
      .first();
    await expect(articleLink).toBeVisible();

    const href = await articleLink.getAttribute('href');
    await articleLink.click();

    await expect(page).toHaveURL(new RegExp(href!));
    await expect(page.locator('h1')).toBeVisible();
  });
});
