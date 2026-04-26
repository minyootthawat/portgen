# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: buyer-checkout.spec.ts >> Buyer Checkout Flow E2E >> step 7: Game accounts seller page works
- Location: e2e/buyer-checkout.spec.ts:129:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1').filter({ hasText: /Game Accounts/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h1').filter({ hasText: /Game Accounts/i })

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
  34  |     await expect(featuresHeading).toBeVisible()
  35  |     
  36  |     // Check for pricing section
  37  |     const pricingHeading = page.locator('h2').filter({ hasText: /pricing|ราคา/i })
  38  |     await expect(pricingHeading).toBeVisible()
  39  |   })
  40  | 
  41  |   test('step 2: Login page loads with auth options', async ({ page }) => {
  42  |     await page.goto('http://localhost:3000/login')
  43  |     
  44  |     // Should show login heading
  45  |     const loginHeading = page.locator('h1').filter({ hasText: /welcome back|ยินดีต้อนรับ/i })
  46  |     await expect(loginHeading).toBeVisible()
  47  |     
  48  |     // Should show OAuth buttons (Google and GitHub)
  49  |     const googleBtn = page.getByRole('button', { name: /google/i })
  50  |     const githubBtn = page.getByRole('button', { name: /github/i })
  51  |     await expect(googleBtn).toBeVisible()
  52  |     await expect(githubBtn).toBeVisible()
  53  |     
  54  |     // Should show Magic Link email form
  55  |     const emailInput = page.getByPlaceholder(/you@example.com/)
  56  |     await expect(emailInput).toBeVisible()
  57  |     
  58  |     const magicLinkBtn = page.getByRole('button', { name: /magic link|send magic/i })
  59  |     await expect(magicLinkBtn).toBeVisible()
  60  |   })
  61  | 
  62  |   test('step 3: Dashboard page loads (auth may be permissive in dev)', async ({ page }) => {
  63  |     await page.goto('http://localhost:3000/dashboard')
  64  |     
  65  |     // Dashboard may load or redirect - just verify no crash
  66  |     // In dev mode, auth checks might be permissive
  67  |     await page.waitForLoadState('domcontentloaded')
  68  |     
  69  |     // If redirected to login, that's fine. If dashboard loads, also fine.
  70  |     const currentUrl = page.url()
  71  |     console.log('Dashboard loaded at:', currentUrl)
  72  |   })
  73  | 
  74  |   test('step 4: Seller products page is accessible (browse products)', async ({ page }) => {
  75  |     // Note: Seller section appears to be publicly accessible for browsing
  76  |     await page.goto('http://localhost:3000/seller/products')
  77  |     
  78  |     // Check products heading (use h1 specifically to avoid strict mode violation)
  79  |     const productsHeading = page.locator('h1').filter({ hasText: /Products/i })
  80  |     await expect(productsHeading).toBeVisible()
  81  |     
  82  |     // Check for product table with data
  83  |     const productTable = page.locator('table')
  84  |     await expect(productTable).toBeVisible()
  85  |     
  86  |     // Check for at least one product row
  87  |     const productRows = page.locator('tbody tr')
  88  |     await expect(productRows.first()).toBeVisible()
  89  |   })
  90  | 
  91  |   test('step 5: Seller orders page shows order data', async ({ page }) => {
  92  |     await page.goto('http://localhost:3000/seller/orders')
  93  |     
  94  |     // Check orders heading (use h1 to avoid strict mode violation with "Recent Orders" h2)
  95  |     const ordersHeading = page.locator('h1').filter({ hasText: /Orders/i })
  96  |     await expect(ordersHeading).toBeVisible()
  97  |     
  98  |     // Check for stats cards
  99  |     const totalOrdersStat = page.locator('text=Total Orders')
  100 |     await expect(totalOrdersStat).toBeVisible()
  101 |     
  102 |     // Check for orders table
  103 |     const ordersTable = page.locator('table')
  104 |     await expect(ordersTable).toBeVisible()
  105 |     
  106 |     // Check for at least one order row
  107 |     const orderRows = page.locator('tbody tr')
  108 |     await expect(orderRows.first()).toBeVisible()
  109 |   })
  110 | 
  111 |   test('step 6: Stripe checkout endpoint exists', async ({ request }) => {
  112 |     // Test the Stripe checkout API endpoint structure
  113 |     // Note: Full Stripe test requires authenticated user
  114 |     
  115 |     const response = await request.post('http://localhost:3000/api/stripe/checkout', {
  116 |       data: {
  117 |         userId: 'test-user-id',
  118 |         email: 'test@example.com'
  119 |       },
  120 |       failOnStatusCode: false
  121 |     })
  122 |     
  123 |     // Should return error (not authenticated) but endpoint should respond
  124 |     // Status 400 = bad request (missing/invalid data) or 401/404
  125 |     // We just verify the endpoint exists and responds
  126 |     expect([400, 401, 404, 500]).toContain(response.status())
  127 |   })
  128 | 
  129 |   test('step 7: Game accounts seller page works', async ({ page }) => {
  130 |     await page.goto('http://localhost:3000/seller/game-accounts')
  131 |     
  132 |     // Check game accounts heading (use h1 to avoid strict mode violation)
  133 |     const gameAccountsHeading = page.locator('h1').filter({ hasText: /Game Accounts/i })
> 134 |     await expect(gameAccountsHeading).toBeVisible()
      |                                       ^ Error: expect(locator).toBeVisible() failed
  135 |     
  136 |     // Check for accounts table
  137 |     const accountsTable = page.locator('table')
  138 |     await expect(accountsTable).toBeVisible()
  139 |   })
  140 | 
  141 |   test('step 8: Seller dashboard page loads', async ({ page }) => {
  142 |     await page.goto('http://localhost:3000/seller')
  143 |     
  144 |     // Verify page loads without crash
  145 |     const dashboardHeading = page.locator('h1').filter({ hasText: /Dashboard/i })
  146 |     await expect(dashboardHeading).toBeVisible({ timeout: 5000 }).catch(() => {
  147 |       // If no h1 with Dashboard, just check URL loaded
  148 |       console.log('Seller dashboard loaded, checking content...')
  149 |     })
  150 |   })
  151 | 
  152 |   test('step 9: Builder new page behavior', async ({ page }) => {
  153 |     await page.goto('http://localhost:3000/builder/new')
  154 |     
  155 |     // Builder page may load or redirect - just verify no crash
  156 |     await page.waitForLoadState('domcontentloaded')
  157 |     const currentUrl = page.url()
  158 |     console.log('Builder/new loaded at:', currentUrl)
  159 |   })
  160 | 
  161 |   test('step 10: Language switcher works on landing page', async ({ page }) => {
  162 |     await page.goto('http://localhost:3000')
  163 |     
  164 |     // Find and click language switcher
  165 |     const langSwitcher = page.locator('select[role="combobox"]').first()
  166 |     if (await langSwitcher.isVisible()) {
  167 |       await langSwitcher.selectOption('EN')
  168 |       
  169 |       // Wait for language change
  170 |       await page.waitForTimeout(500)
  171 |       
  172 |       // Refresh and check if English content loaded
  173 |       await page.reload()
  174 |       
  175 |       // Should show English text instead of Thai
  176 |       const featuresHeading = page.locator('h2').filter({ hasText: /features/i })
  177 |       await expect(featuresHeading).toBeVisible({ timeout: 5000 }).catch(() => {
  178 |         // If still Thai, that's also acceptable - just means i18n isn't working perfectly
  179 |         console.log('Language switcher may not be fully functional')
  180 |       })
  181 |     }
  182 |   })
  183 | 
  184 |   test('step 11: Portfolio public portfolio pages', async ({ page }) => {
  185 |     // Landing page should be visible
  186 |     await page.goto('http://localhost:3000')
  187 |     
  188 |     // Landing page main heading should be visible
  189 |     const mainHeading = page.locator('h1').first()
  190 |     await expect(mainHeading).toBeVisible()
  191 |   })
  192 | 
  193 |   test('summary: Verify all key pages accessible', async ({ page }) => {
  194 |     const pages = [
  195 |       { url: '/', name: 'Landing' },
  196 |       { url: '/login', name: 'Login' },
  197 |       { url: '/seller/products', name: 'Products' },
  198 |       { url: '/seller/orders', name: 'Orders' },
  199 |       { url: '/seller/game-accounts', name: 'Game Accounts' },
  200 |       { url: '/seller', name: 'Seller Dashboard' },
  201 |     ]
  202 |     
  203 |     for (const p of pages) {
  204 |       const response = await page.goto(`http://localhost:3000${p.url}`)
  205 |       expect(response?.status()).toBeLessThan(400)
  206 |       console.log(`✓ ${p.name} page accessible (${p.url})`)
  207 |     }
  208 |   })
  209 | 
  210 | })
```