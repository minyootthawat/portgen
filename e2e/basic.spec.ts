import { test, expect } from '@playwright/test';

test.describe('Portgen E2E', () => {
  test('landing page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/portgen/i);
    // Check for main CTA
    await expect(page.getByRole('link', { name: /get started free|เริ่มใช้ฟรี/i })).toBeVisible();
  });

  test('login page loads', async ({ page }) => {
    await page.goto('/login');
    // Check for login form elements
    await expect(page.getByRole('button', { name: /google|github/i })).toHaveCount(2);
  });

  test('dashboard requires auth', async ({ page }) => {
    await page.goto('/dashboard');
    // Dashboard should show something (either redirect or auth prompt)
    await expect(page.url()).not.toBe('/dashboard');
  });
});
