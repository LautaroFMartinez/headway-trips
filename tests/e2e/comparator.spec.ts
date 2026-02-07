import { test, expect } from '../helpers/fixtures';

test.describe('Comparador de destinos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/comparador');
  });

  test('agregar un destino al comparador', async ({ page }) => {
    const combobox = page.getByRole('combobox');
    await expect(combobox).toBeVisible();

    // Abrir selector
    await combobox.click();

    // Seleccionar primer destino
    const option = page.getByRole('option').first();
    await expect(option).toBeVisible();
    await option.click();

    // Debe aparecer contenido del destino (card o grid)
    await expect(
      page.locator('[class*="card"], [class*="grid"]').first()
    ).toBeVisible();
  });

  test('límite de 3 destinos deshabilita selector', async ({ page }) => {
    const combobox = page.getByRole('combobox');

    for (let i = 0; i < 3; i++) {
      await combobox.click();
      await page.getByRole('option').first().click();
      // Esperar a que se actualice el estado
      if (i < 2) {
        await expect(combobox).toBeEnabled();
      }
    }

    // Después de 3, el combobox debe estar deshabilitado
    await expect(combobox).toBeDisabled();
  });

  test('remover destino del comparador', async ({ page }) => {
    const combobox = page.getByRole('combobox');
    await combobox.click();
    await page.getByRole('option').first().click();

    // Buscar botón de remover
    const removeButton = page.locator('button[aria-label*="Quitar"]').first();
    await expect(removeButton).toBeVisible();
    await removeButton.click();

    // El combobox debe seguir habilitado
    await expect(combobox).toBeEnabled();
  });
});
