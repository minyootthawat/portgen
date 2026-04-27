import { test, expect } from '@playwright/test';

test.describe('Portgen E2E', () => {
  test('landing page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/portgen/i);
    // Check for main CTA button (now a button, not a link, that opens auth dialog)
    await expect(page.getByRole('button', { name: /get started free|เริ่มใช้ฟรี/i })).toBeVisible();
  });

  test('login page loads with auth dialog', async ({ page }) => {
    await page.goto('/login');
    // Wait for dialog to appear (auto-opens on mount)
    await page.waitForSelector('[role="dialog"], .fixed.inset-0', { timeout: 5000 });
    // Check for OAuth buttons inside dialog
    await expect(page.getByRole('button', { name: /google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /github/i })).toBeVisible();
  });

  test('auth dialog opens on landing page CTA click', async ({ page }) => {
    await page.goto('/');
    // Click the Get Started button
    await page.getByRole('button', { name: /get started free|เริ่มใช้ฟรี/i }).click();
    // Dialog should appear
    await page.waitForSelector('[role="dialog"], .fixed.inset-0', { timeout: 5000 });
    await expect(page.getByRole('button', { name: /google/i })).toBeVisible();
  });

  test('dashboard requires auth', async ({ page }) => {
    await page.goto('/dashboard');
    // Dashboard should redirect to login or show auth
    await expect(page.url()).not.toBe('/dashboard');
  });
});
