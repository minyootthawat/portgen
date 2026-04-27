import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'line',
  use: {
    baseURL: 'http://localhost:5002',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm dev --port 3002',
    url: 'http://localhost:5002',
    reuseExistingServer: true,
  },
});
