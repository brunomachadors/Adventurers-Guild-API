import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/features',
  timeout: 90_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html']],

  use: {
    baseURL: 'http://localhost:3000',
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'backend-testing',
    },
  ],
});
