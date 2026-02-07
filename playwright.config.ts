import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: [['html'], ['list']],

  timeout: 30_000,

  expect: {
    timeout: 10_000,
  },

  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },

  projects: [
    // MAINLINE — lo que realmente importa
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // MOBILE REAL — alto valor
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },

    // OPTIONAL — habilitar solo en CI nightly
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  webServer: {
    command: process.env.CI ? 'npm run build && npm run start -- -p 3001' : 'npm run dev -- -p 3001',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
