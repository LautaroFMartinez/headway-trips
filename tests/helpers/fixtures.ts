import { test as base, expect, type Page, type Route } from '@playwright/test';

type MockApiOptions = {
  status?: number;
  body?: Record<string, unknown>;
  delay?: number;
};

type TestFixtures = {
  mockApi: (urlPattern: string | RegExp, options?: MockApiOptions) => Promise<void>;
};

export const test = base.extend<TestFixtures>({
  mockApi: async ({ page }, use) => {
    const routes: Route[] = [];

    const mockApi = async (
      urlPattern: string | RegExp,
      options: MockApiOptions = {}
    ) => {
      const { status = 200, body = { success: true }, delay = 0 } = options;

      await page.route(urlPattern, async (route) => {
        routes.push(route);
        if (delay > 0) {
          await new Promise((r) => setTimeout(r, delay));
        }
        await route.fulfill({
          status,
          contentType: 'application/json',
          body: JSON.stringify(body),
        });
      });
    };

    await use(mockApi);
  },
});

export { expect };

export async function waitForAnimations(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('domcontentloaded');
}
