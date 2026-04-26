# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: buyer-checkout.spec.ts >> Buyer Checkout Flow E2E >> step 1: Landing page loads correctly
- Location: e2e/buyer-checkout.spec.ts:22:7

# Error details

```
Error: expect(page).toHaveTitle(expected) failed

Expected pattern: /portgen/i
Received string:  "เติมเกมออนไลน์ ราคาถูก | KeyZaa"
Timeout: 5000ms

Call log:
  - Expect "toHaveTitle" with timeout 5000ms
    9 × unexpected value "เติมเกมออนไลน์ ราคาถูก | KeyZaa"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "KZ Keyzaa ดิจิทัลมาร์เก็ตเพลสที่เชื่อถือได้" [ref=e4] [cursor=pointer]:
        - /url: /
        - generic [ref=e5]: KZ
        - generic [ref=e6]:
          - generic [ref=e7]: Keyzaa
          - generic [ref=e8]: ดิจิทัลมาร์เก็ตเพลสที่เชื่อถือได้
      - generic [ref=e10]:
        - img [ref=e11]
        - searchbox "ค้นหาสินค้า" [ref=e13]
      - generic [ref=e14]:
        - button "สลับภาษา" [ref=e15]: TH
        - 'button "Theme: Dark" [ref=e16]':
          - img [ref=e17]
        - button "เปิดตะกร้าสินค้า" [ref=e19]:
          - img [ref=e20]
          - generic [ref=e22]: "1"
        - button "โปรไฟล์" [ref=e23]:
          - img [ref=e24]
  - main [ref=e26]:
    - generic [ref=e27]:
      - generic [ref=e32]:
        - img [ref=e33]
        - generic [ref=e34]:
          - heading "เติมเกมออนไลน์ ราคาถูก" [level=1] [ref=e35]
          - paragraph [ref=e36]: บริการเติมเกม ของขวัญ และสกุลเงินดิจิทัล ส่งเร็ว ปลอดภัย ราคาคุ้มค่า
          - generic [ref=e37]:
            - link "ดูสินค้าทั้งหมด" [ref=e38] [cursor=pointer]:
              - /url: /products
            - link "ลงทะเบียนร้านค้า" [ref=e39] [cursor=pointer]:
              - /url: /seller/register
      - region "หมวดหมู่ยอดนิยม" [ref=e42]:
        - generic [ref=e44]:
          - heading "หมวดหมู่ยอดนิยม" [level=2] [ref=e45]
          - paragraph [ref=e46]: เลือกหมวดที่จัดส่งไวและมีร้านค้ายืนยันตัวตนแล้ว
        - generic [ref=e47]:
          - link "เติมเกม 8 รายการ" [ref=e48] [cursor=pointer]:
            - /url: /products?category=%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%A1%E0%B9%80%E0%B8%81%E0%B8%A1
            - generic [ref=e50]:
              - img [ref=e52]
              - generic [ref=e54]:
                - paragraph [ref=e55]: เติมเกม
                - paragraph [ref=e56]: 8 รายการ
          - link "บัตรของขวัญ 3 รายการ" [ref=e57] [cursor=pointer]:
            - /url: /products?category=Gift%20Card
            - generic [ref=e59]:
              - img [ref=e61]
              - generic [ref=e63]:
                - paragraph [ref=e64]: บัตรของขวัญ
                - paragraph [ref=e65]: 3 รายการ
          - link "สมัครสมาชิก 2 รายการ" [ref=e66] [cursor=pointer]:
            - /url: /products?category=Subscription
            - generic [ref=e68]:
              - img [ref=e70]
              - generic [ref=e72]:
                - paragraph [ref=e73]: สมัครสมาชิก
                - paragraph [ref=e74]: 2 รายการ
          - link "AI Tools 0 รายการ" [ref=e75] [cursor=pointer]:
            - /url: /products?category=AI%20Tools
            - generic [ref=e77]:
              - img [ref=e79]
              - generic [ref=e81]:
                - paragraph [ref=e82]: AI Tools
                - paragraph [ref=e83]: 0 รายการ
          - link "โปร 0 รายการ" [ref=e84] [cursor=pointer]:
            - /url: /products?category=%E0%B9%82%E0%B8%9B%E0%B8%A3
            - generic [ref=e86]:
              - img [ref=e88]
              - generic [ref=e90]:
                - paragraph [ref=e91]: โปร
                - paragraph [ref=e92]: 0 รายการ
      - region "ดีลที่ดีที่สุด" [ref=e93]:
        - generic [ref=e94]:
          - generic [ref=e95]:
            - heading "ดีลที่ดีที่สุด" [level=2] [ref=e96]
            - paragraph [ref=e97]: อัปเดตราคาทุกวันจากร้านค้าที่ผ่านการตรวจสอบแล้ว
          - link "ดูทั้งหมด →" [ref=e98] [cursor=pointer]:
            - /url: /products
        - generic [ref=e99]:
          - link "Full Flow 1777144910731 -17% topup Full Flow 1777144910731 ร้านค้ายืนยันตัวตนแล้ว 14 ร้าน พร้อมส่ง ฿93 ฿77" [ref=e100] [cursor=pointer]:
            - /url: /products/2579d557-4d05-4812-8808-889b54035377
            - generic [ref=e101]:
              - img "Full Flow 1777144910731" [ref=e102]
              - generic [ref=e105]: "-17%"
            - generic [ref=e106]:
              - generic [ref=e108]:
                - paragraph [ref=e109]: topup
                - paragraph [ref=e110]: Full Flow 1777144910731
              - generic [ref=e111]:
                - generic [ref=e112]:
                  - generic [ref=e113]:
                    - paragraph [ref=e114]: ร้านค้ายืนยันตัวตนแล้ว
                    - paragraph [ref=e115]: 14 ร้าน
                  - generic [ref=e116]: พร้อมส่ง
                - generic [ref=e118]:
                  - generic [ref=e119]: ฿93
                  - generic [ref=e120]: ฿77
          - link "HOT DEAL Image Product 1777144897415 -23% giftcard Image Product 1777144897415 ร้านค้ายืนยันตัวตนแล้ว 14 ร้าน พร้อมส่ง ฿195 ฿150" [ref=e121] [cursor=pointer]:
            - /url: /products/0e4f3dfe-099c-4d98-a667-951f157ee5bf
            - generic [ref=e122]:
              - generic [ref=e123]: HOT DEAL
              - img "Image Product 1777144897415" [ref=e124]
              - generic [ref=e127]: "-23%"
            - generic [ref=e128]:
              - generic [ref=e130]:
                - paragraph [ref=e131]: giftcard
                - paragraph [ref=e132]: Image Product 1777144897415
              - generic [ref=e133]:
                - generic [ref=e134]:
                  - generic [ref=e135]:
                    - paragraph [ref=e136]: ร้านค้ายืนยันตัวตนแล้ว
                    - paragraph [ref=e137]: 14 ร้าน
                  - generic [ref=e138]: พร้อมส่ง
                - generic [ref=e140]:
                  - generic [ref=e141]: ฿195
                  - generic [ref=e142]: ฿150
          - link "HOT DEAL Delete Test Product 1777144839705 -30% topup Delete Test Product 1777144839705 ร้านค้ายืนยันตัวตนแล้ว 14 ร้าน พร้อมส่ง ฿70 ฿49" [ref=e143] [cursor=pointer]:
            - /url: /products/622bead5-8a46-48f5-ae66-d54912d141c2
            - generic [ref=e144]:
              - generic [ref=e145]: HOT DEAL
              - img "Delete Test Product 1777144839705" [ref=e146]
              - generic [ref=e149]: "-30%"
            - generic [ref=e150]:
              - generic [ref=e152]:
                - paragraph [ref=e153]: topup
                - paragraph [ref=e154]: Delete Test Product 1777144839705
              - generic [ref=e155]:
                - generic [ref=e156]:
                  - generic [ref=e157]:
                    - paragraph [ref=e158]: ร้านค้ายืนยันตัวตนแล้ว
                    - paragraph [ref=e159]: 14 ร้าน
                  - generic [ref=e160]: พร้อมส่ง
                - generic [ref=e162]:
                  - generic [ref=e163]: ฿70
                  - generic [ref=e164]: ฿49
          - link "HOT DEAL Edited Product 1777144831621 -22% giftcard Edited Product 1777144831621 ร้านค้ายืนยันตัวตนแล้ว 14 ร้าน พร้อมส่ง ฿383 ฿299" [ref=e165] [cursor=pointer]:
            - /url: /products/6f8f4f2c-ff5c-46cf-9b74-6dc967b620f2
            - generic [ref=e166]:
              - generic [ref=e167]: HOT DEAL
              - img "Edited Product 1777144831621" [ref=e168]
              - generic [ref=e171]: "-22%"
            - generic [ref=e172]:
              - generic [ref=e174]:
                - paragraph [ref=e175]: giftcard
                - paragraph [ref=e176]: Edited Product 1777144831621
              - generic [ref=e177]:
                - generic [ref=e178]:
                  - generic [ref=e179]:
                    - paragraph [ref=e180]: ร้านค้ายืนยันตัวตนแล้ว
                    - paragraph [ref=e181]: 14 ร้าน
                  - generic [ref=e182]: พร้อมส่ง
                - generic [ref=e184]:
                  - generic [ref=e185]: ฿383
                  - generic [ref=e186]: ฿299
      - region "แนะนำสำหรับคุณ" [ref=e187]:
        - generic [ref=e189]:
          - heading "แนะนำสำหรับคุณ" [level=2] [ref=e190]
          - paragraph [ref=e191]: สินค้าที่ขายต่อเนื่อง พร้อมเรตติ้งและสต็อกที่เชื่อถือได้
        - generic [ref=e192]:
          - link "HOT DEAL E2E Test Product 1777144824006 ร้านค้ายืนยันตัวตนแล้ว topup E2E Test Product 1777144824006 ฿155 ฿99 พร้อมส่ง สต็อกพร้อม" [ref=e193] [cursor=pointer]:
            - /url: /products/bee89989-0e39-42bb-965e-a0ea12bec9fd
            - generic [ref=e194]:
              - generic [ref=e195]: HOT DEAL
              - img "E2E Test Product 1777144824006" [ref=e196]
              - generic [ref=e198]: ร้านค้ายืนยันตัวตนแล้ว
            - generic [ref=e199]:
              - paragraph [ref=e201]: topup
              - paragraph [ref=e202]: E2E Test Product 1777144824006
              - generic [ref=e203]:
                - generic [ref=e204]:
                  - generic [ref=e205]: ฿155
                  - generic [ref=e206]: ฿99
                - generic [ref=e207]:
                  - paragraph [ref=e208]: พร้อมส่ง
                  - paragraph [ref=e209]: สต็อกพร้อม
          - link "Full Flow 1777144732178 ร้านค้ายืนยันตัวตนแล้ว topup Full Flow 1777144732178 ฿94 ฿77 พร้อมส่ง สต็อกพร้อม" [ref=e210] [cursor=pointer]:
            - /url: /products/cbc24c2a-12ba-4bb6-81db-5bbc022762cd
            - generic [ref=e211]:
              - img "Full Flow 1777144732178" [ref=e212]
              - generic [ref=e214]: ร้านค้ายืนยันตัวตนแล้ว
            - generic [ref=e215]:
              - paragraph [ref=e217]: topup
              - paragraph [ref=e218]: Full Flow 1777144732178
              - generic [ref=e219]:
                - generic [ref=e220]:
                  - generic [ref=e221]: ฿94
                  - generic [ref=e222]: ฿77
                - generic [ref=e223]:
                  - paragraph [ref=e224]: พร้อมส่ง
                  - paragraph [ref=e225]: สต็อกพร้อม
          - link "Image Product 1777144718733 ร้านค้ายืนยันตัวตนแล้ว giftcard Image Product 1777144718733 ฿185 ฿150 พร้อมส่ง สต็อกพร้อม" [ref=e226] [cursor=pointer]:
            - /url: /products/79af2c1f-f6f7-453d-94a3-29e7ee2d761b
            - generic [ref=e227]:
              - img "Image Product 1777144718733" [ref=e228]
              - generic [ref=e230]: ร้านค้ายืนยันตัวตนแล้ว
            - generic [ref=e231]:
              - paragraph [ref=e233]: giftcard
              - paragraph [ref=e234]: Image Product 1777144718733
              - generic [ref=e235]:
                - generic [ref=e236]:
                  - generic [ref=e237]: ฿185
                  - generic [ref=e238]: ฿150
                - generic [ref=e239]:
                  - paragraph [ref=e240]: พร้อมส่ง
                  - paragraph [ref=e241]: สต็อกพร้อม
          - link "HOT DEAL Delete Test Product 1777144660709 ร้านค้ายืนยันตัวตนแล้ว topup Delete Test Product 1777144660709 ฿86 ฿49 พร้อมส่ง สต็อกพร้อม" [ref=e242] [cursor=pointer]:
            - /url: /products/4f1c5a14-0368-4098-9bfa-7d5419a3f6e4
            - generic [ref=e243]:
              - generic [ref=e244]: HOT DEAL
              - img "Delete Test Product 1777144660709" [ref=e245]
              - generic [ref=e247]: ร้านค้ายืนยันตัวตนแล้ว
            - generic [ref=e248]:
              - paragraph [ref=e250]: topup
              - paragraph [ref=e251]: Delete Test Product 1777144660709
              - generic [ref=e252]:
                - generic [ref=e253]:
                  - generic [ref=e254]: ฿86
                  - generic [ref=e255]: ฿49
                - generic [ref=e256]:
                  - paragraph [ref=e257]: พร้อมส่ง
                  - paragraph [ref=e258]: สต็อกพร้อม
      - region "ซื้อดิจิทัลอย่างสบายใจมากขึ้น" [ref=e259]:
        - generic [ref=e261]:
          - generic [ref=e262]:
            - text: Keyzaa
            - text: มาร์เก็ตเพลสที่เน้นความเชื่อมั่น
          - heading "ซื้อดิจิทัลอย่างสบายใจมากขึ้น" [level=2] [ref=e264]
          - paragraph [ref=e265]: เลือกสินค้าที่ต้องการ แล้วตรวจสอบราคา ร้านค้า และสถานะพร้อมส่งได้ในหน้าเดียว
          - generic [ref=e266]:
            - link "เลือกสินค้าที่เชื่อถือได้" [ref=e267] [cursor=pointer]:
              - /url: /products
            - link "ดูวิธีสั่งซื้อ" [ref=e268] [cursor=pointer]:
              - /url: /orders
  - generic [ref=e269]:
    - generic:
      - generic:
        - paragraph: มีข้อสงสัย? คุยกับเราสิ
        - paragraph: ตอบไวภายใน 1 นาที
    - link [ref=e270] [cursor=pointer]:
      - /url: https://line.me/ti/p/@keyzaa
      - img [ref=e271]
  - button "Open Next.js Dev Tools" [ref=e278] [cursor=pointer]:
    - img [ref=e279]
  - alert [ref=e282]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | 
  3   | /**
  4   |  * Buyer Checkout Flow E2E Tests
  5   |  * 
  6   |  * Flow: register → login → browse product → checkout with Stripe test → check /orders page
  7   |  * 
  8   |  * Note: This app uses Supabase Auth with OAuth (Google/GitHub) and Magic Link.
  9   |  * There's no separate register page - registration happens via OAuth flow or first Magic Link sign-in.
  10  |  * The "Upgrade to Pro" flow on /dashboard initiates Stripe checkout for subscription.
  11  |  * 
  12  |  * Seller section pages appear to be publicly accessible for browsing.
  13  |  */
  14  | 
  15  | test.describe('Buyer Checkout Flow E2E', () => {
  16  |   
  17  |   test.beforeEach(async ({ page }) => {
  18  |     // Reset language to English for consistent testing
  19  |     await page.goto('http://localhost:3000')
  20  |   })
  21  | 
  22  |   test('step 1: Landing page loads correctly', async ({ page }) => {
  23  |     await page.goto('http://localhost:3000')
  24  |     
  25  |     // Check landing page has key elements
> 26  |     await expect(page).toHaveTitle(/portgen/i)
      |                        ^ Error: expect(page).toHaveTitle(expected) failed
  27  |     
  28  |     // Check for main CTA - varies by language (Thai/English)
  29  |     const getStartedBtn = page.getByRole('link', { name: /get started free|เริ่มใช้ฟรี/i })
  30  |     await expect(getStartedBtn).toBeVisible()
  31  |     
  32  |     // Check for features section
  33  |     const featuresHeading = page.locator('h2').filter({ hasText: /features|ทุกอย่างที่คุณต้องการ/i })
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
```