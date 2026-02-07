import { test, expect } from '../helpers/fixtures';
import { newsletterData, apiResponses } from '../helpers/test-data';

test.describe('Newsletter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('suscripción exitosa con email válido', async ({ page, mockApi }) => {
    await mockApi('**/api/newsletter', {
      status: 200,
      body: apiResponses.newsletter.success,
    });

    const emailInput = page.getByPlaceholder('tu@email.com').first();
    await emailInput.scrollIntoViewIfNeeded();
    await emailInput.fill(newsletterData.validEmail);

    const submitButton = page.getByRole('button', { name: /suscribirme/i }).first();
    await submitButton.click();

    // El componente cambia a estado isSubscribed y muestra "Gracias por suscribirte"
    await expect(
      page.getByText(/gracias por suscribirte/i).first()
    ).toBeVisible();
  });

  test('email inválido no envía el formulario', async ({ page }) => {
    const emailInput = page.getByPlaceholder('tu@email.com').first();
    await emailInput.scrollIntoViewIfNeeded();
    await emailInput.fill(newsletterData.invalidEmail);

    const submitButton = page.getByRole('button', { name: /suscribirme/i }).first();
    await submitButton.click();

    // El input sigue visible (no cambió a estado suscrito)
    await expect(emailInput).toBeVisible();
    // No debe mostrar "Gracias por suscribirte"
    await expect(page.getByText(/gracias por suscribirte/i)).not.toBeVisible();
  });

  test('API error no cambia a estado suscrito', async ({ page, mockApi }) => {
    await mockApi('**/api/newsletter', {
      status: 400,
      body: apiResponses.newsletter.duplicate,
    });

    const emailInput = page.getByPlaceholder('tu@email.com').first();
    await emailInput.scrollIntoViewIfNeeded();
    await emailInput.fill(newsletterData.validEmail);

    const submitButton = page.getByRole('button', { name: /suscribirme/i }).first();
    await submitButton.click();

    // Debe NO cambiar a "Gracias" porque la API devolvió error
    // Esperar a que loading termine
    await expect(submitButton).toBeEnabled();
    // El formulario sigue visible (no cambió a estado suscrito)
    await expect(emailInput).toBeVisible();
  });
});
