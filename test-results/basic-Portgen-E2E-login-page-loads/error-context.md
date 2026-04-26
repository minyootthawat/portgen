# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: basic.spec.ts >> Portgen E2E >> login page loads
- Location: e2e/basic.spec.ts:11:7

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('button', { name: /google|github/i })
Expected: 2
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for getByRole('button', { name: /google|github/i })
    9 × locator resolved to 0 elements
      - unexpected value "0"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - heading "404" [level=1] [ref=e4]
    - heading "This page could not be found." [level=2] [ref=e6]
  - button "Open Next.js Dev Tools" [ref=e12] [cursor=pointer]:
    - img [ref=e13]
  - alert [ref=e16]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Portgen E2E', () => {
  4  |   test('landing page loads', async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await expect(page).toHaveTitle(/portgen/i);
  7  |     // Check for main CTA
  8  |     await expect(page.getByRole('link', { name: /get started free|เริ่มใช้ฟรี/i })).toBeVisible();
  9  |   });
  10 | 
  11 |   test('login page loads', async ({ page }) => {
  12 |     await page.goto('/login');
  13 |     // Check for login form elements
> 14 |     await expect(page.getByRole('button', { name: /google|github/i })).toHaveCount(2);
     |                                                                        ^ Error: expect(locator).toHaveCount(expected) failed
  15 |   });
  16 | 
  17 |   test('dashboard requires auth', async ({ page }) => {
  18 |     await page.goto('/dashboard');
  19 |     // Dashboard should show something (either redirect or auth prompt)
  20 |     await expect(page.url()).not.toBe('/dashboard');
  21 |   });
  22 | });
  23 | 
```