import { test, expect } from '@playwright/test';

test.describe('Navegación principal', () => {
  test('debe cargar la página principal correctamente', async ({ page }) => {
    await page.goto('/');

    // Verificar que el título y el logo están presentes
    await expect(page.locator('text=Headway Trips')).toBeVisible();
    await expect(page.getByRole('img', { name: /headway trips logo/i })).toBeVisible();

    // Verificar que la sección hero está visible
    await expect(page.locator('h1')).toBeVisible();
  });

  test('debe abrir el menú mobile en dispositivos pequeños', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Click en el botón del menú
    await page.getByRole('button', { name: /abrir menú/i }).click();

    // Verificar que el menú está visible
    await expect(page.getByRole('navigation', { name: /menú móvil/i })).toBeVisible();

    // Cerrar el menú haciendo click en el overlay
    await page
      .locator('.fixed.inset-0')
      .first()
      .click({ position: { x: 10, y: 10 } });
    await expect(page.getByRole('navigation', { name: /menú móvil/i })).not.toBeVisible();
  });

  test('debe navegar a la página de comparador', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('link', { name: /comparador/i })
      .first()
      .click();

    await expect(page).toHaveURL('/comparador');
    await expect(page.getByText(/selecciona tus destinos/i)).toBeVisible();
  });
});

test.describe('Listado de viajes', () => {
  test('debe mostrar la lista de viajes', async ({ page }) => {
    await page.goto('/');

    // Scroll a la sección de destinos
    await page.locator('#destinos').scrollIntoViewIfNeeded();

    // Verificar que hay cards de viajes
    const tripCards = page.locator('[class*="card"]').filter({ hasText: /bariloche|cataratas|mendoza/i });
    await expect(tripCards.first()).toBeVisible();
  });

  test('debe poder hacer click en un viaje y ver sus detalles', async ({ page }) => {
    await page.goto('/');

    // Click en el primer viaje
    const firstTrip = page
      .getByRole('link')
      .filter({ hasText: /ver detalles|explorar/i })
      .first();
    await firstTrip.click();

    // Verificar que estamos en la página de detalle
    await expect(page).toHaveURL(/\/viaje\/.+/);
    await expect(page.locator('h1')).toBeVisible();
  });
});

test.describe('Comparador de destinos', () => {
  test('debe permitir agregar destinos al comparador', async ({ page }) => {
    await page.goto('/comparador');

    // Abrir el selector de destinos
    await page.getByRole('combobox').click();

    // Seleccionar un destino
    await page.getByRole('option').first().click();

    // Verificar que el destino se agregó
    await expect(page.locator('[class*="grid"]').filter({ hasText: /características/i })).toBeVisible();
  });

  test('debe permitir comparar hasta 3 destinos', async ({ page }) => {
    await page.goto('/comparador');

    // Agregar 3 destinos
    for (let i = 0; i < 3; i++) {
      await page.getByRole('combobox').click();
      await page.getByRole('option').first().click();
      await page.waitForTimeout(500);
    }

    // Verificar que el selector está deshabilitado
    await expect(page.getByRole('combobox')).toBeDisabled();
  });

  test('debe permitir remover destinos del comparador', async ({ page }) => {
    await page.goto('/comparador');

    // Agregar un destino
    await page.getByRole('combobox').click();
    await page.getByRole('option').first().click();

    // Hover sobre el destino y click en el botón de remover
    const removeButton = page.getByRole('button', { name: /quitar de comparación/i }).first();
    await removeButton.hover();
    await removeButton.click();

    // Verificar mensaje de vacío
    await expect(page.getByText(/no has seleccionado ningún destino/i)).toBeVisible();
  });
});

test.describe('Wishlist', () => {
  test('debe permitir agregar viajes a la wishlist', async ({ page }) => {
    await page.goto('/');

    // Click en el botón de wishlist de un viaje
    const wishlistButton = page.getByRole('button', { name: /agregar a favoritos/i }).first();
    await wishlistButton.click();

    // Verificar feedback visual (toast o cambio de estado)
    await expect(page.locator('[class*="toast"]').or(page.locator('[aria-live="polite"]')))
      .toBeVisible({ timeout: 2000 })
      .catch(() => {
        // Si no hay toast, verificar que el botón cambió de estado
        return expect(wishlistButton).toHaveAttribute('aria-pressed', 'true');
      });
  });
});

test.describe('SEO y Performance', () => {
  test('debe tener meta tags correctos en la página principal', async ({ page }) => {
    await page.goto('/');

    // Verificar meta tags
    const title = await page.title();
    expect(title).toContain('Headway Trips');

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toBeTruthy();

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
  });

  test('debe cargar en menos de 3 segundos', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
  });
});

test.describe('Accesibilidad', () => {
  test('debe ser navegable con teclado', async ({ page }) => {
    await page.goto('/');

    // Navegar con Tab
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Verificar que hay un elemento con foco
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement);
  });

  test('debe cerrar el menú mobile con Escape', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Abrir menú
    await page.getByRole('button', { name: /abrir menú/i }).click();
    await expect(page.getByRole('navigation', { name: /menú móvil/i })).toBeVisible();

    // Presionar Escape
    await page.keyboard.press('Escape');
    await expect(page.getByRole('navigation', { name: /menú móvil/i })).not.toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  const devices = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ];

  for (const device of devices) {
    test(`debe verse correctamente en ${device.name}`, async ({ page }) => {
      await page.setViewportSize({ width: device.width, height: device.height });
      await page.goto('/');

      // Verificar que el contenido principal es visible
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('header')).toBeVisible();

      // Tomar screenshot para revisión visual
      await page.screenshot({
        path: `test-results/screenshots/${device.name.toLowerCase()}.png`,
        fullPage: true,
      });
    });
  }
});
