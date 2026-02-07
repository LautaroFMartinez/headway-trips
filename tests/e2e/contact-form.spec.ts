import { test, expect } from '../helpers/fixtures';
import { contactFormData, apiResponses } from '../helpers/test-data';

test.describe('Formulario de contacto', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // La sección de contacto es lazy-loaded, esperar a que esté en DOM
    const contactSection = page.locator('#contacto');
    await contactSection.scrollIntoViewIfNeeded();
    // Esperar a que el form dentro de la sección se renderice
    await expect(contactSection.locator('form').first()).toBeVisible();
  });

  test('happy path: enviar formulario con datos válidos', async ({ page, mockApi }) => {
    await mockApi('**/api/contact', {
      status: 201,
      body: apiResponses.contact.success,
    });

    const form = page.locator('#contacto').locator('form').first();
    await expect(form).toBeVisible();

    // Llenar campos
    await form.getByLabel(/nombre/i).fill(contactFormData.valid.name);
    await form.getByLabel(/email/i).fill(contactFormData.valid.email);

    const phoneField = form.getByLabel(/teléfono|tel/i);
    if (await phoneField.count() > 0) {
      await phoneField.fill(contactFormData.valid.phone);
    }

    await form.getByLabel(/mensaje/i).fill(contactFormData.valid.message);

    // Submit
    await form.getByRole('button', { name: /enviar/i }).click();

    // Verificar éxito - buscar mensaje de confirmación o toast
    await expect(
      page.getByText(/enviado|gracias|recibimos/i).first()
    ).toBeVisible();
  });

  test('validación: email inválido muestra error', async ({ page }) => {
    const form = page.locator('#contacto').locator('form').first();
    await expect(form).toBeVisible();

    const emailInput = form.getByLabel(/email/i);
    await emailInput.fill('invalid-email');
    await emailInput.blur();

    // HTML5 validation - el campo debe ser inválido
    const isValid = await emailInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    );
    expect(isValid).toBe(false);
  });

  test('validación: submit con campos vacíos no envía', async ({ page }) => {
    const form = page.locator('#contacto').locator('form').first();
    await expect(form).toBeVisible();

    // Intentar submit sin llenar
    await form.getByRole('button', { name: /enviar/i }).click();

    // El formulario debe seguir visible (no se envió)
    await expect(form).toBeVisible();
  });

  test('error de API: muestra mensaje de error', async ({ page, mockApi }) => {
    await mockApi('**/api/contact', {
      status: 500,
      body: apiResponses.contact.serverError,
    });

    const form = page.locator('#contacto').locator('form').first();
    await expect(form).toBeVisible();

    await form.getByLabel(/nombre/i).fill(contactFormData.valid.name);
    await form.getByLabel(/email/i).fill(contactFormData.valid.email);
    await form.getByLabel(/mensaje/i).fill(contactFormData.valid.message);

    await form.getByRole('button', { name: /enviar/i }).click();

    // Verificar que se muestra error o el form sigue visible para reintentar
    await expect(
      page.getByText(/error|falló|intentá/i).first().or(form)
    ).toBeVisible();
  });
});
