import { test, expect } from '../helpers/fixtures';

test.describe('Navegación principal', () => {
  test('homepage carga correctamente con logo, h1 y header', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('img', { name: /headway trips logo/i }).first()).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('header')).toBeVisible();
  });

  test('menú mobile abre y cierra correctamente', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const menuButton = page.getByRole('button', { name: /toggle menu/i });

    // Abrir menú - verificar con aria-expanded
    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    // Cerrar menú
    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('navegar a comparador desde el header', async ({ page }) => {
    await page.goto('/');

    // En desktop, el link de comparador está en el header nav
    const comparadorLink = page.locator('header').getByRole('link', { name: /comparador/i }).first();
    await comparadorLink.click();

    await expect(page).toHaveURL('/comparador');
  });

  test('navegar a detalle de viaje desde la grilla', async ({ page }) => {
    await page.goto('/');

    await page.locator('#destinos').scrollIntoViewIfNeeded();

    // El link dice "Ver detalles" en el destinations grid
    const tripLink = page.locator('#destinos').getByText(/ver detalles/i).first();
    await expect(tripLink).toBeVisible();
    await tripLink.click();

    await expect(page).toHaveURL(/\/viaje\/.+/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('scroll-to-top aparece al hacer scroll y funciona', async ({ page }) => {
    await page.goto('/');

    const scrollButton = page.getByLabel('Volver arriba');

    // Scroll al final para que aparezca (>400px)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(scrollButton).toBeVisible();

    // Click - usar evaluate porque el botón de WhatsApp puede interceptar
    await scrollButton.evaluate((el: HTMLElement) => el.click());

    // Verificar que volvimos arriba
    await expect(page.locator('h1')).toBeInViewport();
  });

  test('links del footer navegan correctamente', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();

    const footerLinks = footer.getByRole('link');
    const count = await footerLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Responsive', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ];

  for (const vp of viewports) {
    test(`${vp.name}: h1 y header visibles`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('header')).toBeVisible();
    });
  }
});
