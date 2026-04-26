# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: basic.spec.ts >> Portgen E2E >> landing page loads
- Location: e2e/basic.spec.ts:4:7

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
          - link "HOT DEAL Full Flow 1777144910731 -32% topup Full Flow 1777144910731 ร้านค้ายืนยันตัวตนแล้ว 14 ร้าน พร้อมส่ง ฿113 ฿77" [ref=e100] [cursor=pointer]:
            - /url: /products/2579d557-4d05-4812-8808-889b54035377
            - generic [ref=e101]:
              - generic [ref=e102]: HOT DEAL
              - img "Full Flow 1777144910731" [ref=e103]
              - generic [ref=e106]: "-32%"
            - generic [ref=e107]:
              - generic [ref=e109]:
                - paragraph [ref=e110]: topup
                - paragraph [ref=e111]: Full Flow 1777144910731
              - generic [ref=e112]:
                - generic [ref=e113]:
                  - generic [ref=e114]:
                    - paragraph [ref=e115]: ร้านค้ายืนยันตัวตนแล้ว
                    - paragraph [ref=e116]: 14 ร้าน
                  - generic [ref=e117]: พร้อมส่ง
                - generic [ref=e119]:
                  - generic [ref=e120]: ฿113
                  - generic [ref=e121]: ฿77
          - link "HOT DEAL Image Product 1777144897415 -41% giftcard Image Product 1777144897415 ร้านค้ายืนยันตัวตนแล้ว 14 ร้าน พร้อมส่ง ฿254 ฿150" [ref=e122] [cursor=pointer]:
            - /url: /products/0e4f3dfe-099c-4d98-a667-951f157ee5bf
            - generic [ref=e123]:
              - generic [ref=e124]: HOT DEAL
              - img "Image Product 1777144897415" [ref=e125]
              - generic [ref=e128]: "-41%"
            - generic [ref=e129]:
              - generic [ref=e131]:
                - paragraph [ref=e132]: giftcard
                - paragraph [ref=e133]: Image Product 1777144897415
              - generic [ref=e134]:
                - generic [ref=e135]:
                  - generic [ref=e136]:
                    - paragraph [ref=e137]: ร้านค้ายืนยันตัวตนแล้ว
                    - paragraph [ref=e138]: 14 ร้าน
                  - generic [ref=e139]: พร้อมส่ง
                - generic [ref=e141]:
                  - generic [ref=e142]: ฿254
                  - generic [ref=e143]: ฿150
          - link "HOT DEAL Delete Test Product 1777144839705 -25% topup Delete Test Product 1777144839705 ร้านค้ายืนยันตัวตนแล้ว 14 ร้าน พร้อมส่ง ฿65 ฿49" [ref=e144] [cursor=pointer]:
            - /url: /products/622bead5-8a46-48f5-ae66-d54912d141c2
            - generic [ref=e145]:
              - generic [ref=e146]: HOT DEAL
              - img "Delete Test Product 1777144839705" [ref=e147]
              - generic [ref=e150]: "-25%"
            - generic [ref=e151]:
              - generic [ref=e153]:
                - paragraph [ref=e154]: topup
                - paragraph [ref=e155]: Delete Test Product 1777144839705
              - generic [ref=e156]:
                - generic [ref=e157]:
                  - generic [ref=e158]:
                    - paragraph [ref=e159]: ร้านค้ายืนยันตัวตนแล้ว
                    - paragraph [ref=e160]: 14 ร้าน
                  - generic [ref=e161]: พร้อมส่ง
                - generic [ref=e163]:
                  - generic [ref=e164]: ฿65
                  - generic [ref=e165]: ฿49
          - link "Edited Product 1777144831621 -20% giftcard Edited Product 1777144831621 ร้านค้ายืนยันตัวตนแล้ว 14 ร้าน พร้อมส่ง ฿374 ฿299" [ref=e166] [cursor=pointer]:
            - /url: /products/6f8f4f2c-ff5c-46cf-9b74-6dc967b620f2
            - generic [ref=e167]:
              - img "Edited Product 1777144831621" [ref=e168]
              - generic [ref=e171]: "-20%"
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
                  - generic [ref=e185]: ฿374
                  - generic [ref=e186]: ฿299
      - region "แนะนำสำหรับคุณ" [ref=e187]:
        - generic [ref=e189]:
          - heading "แนะนำสำหรับคุณ" [level=2] [ref=e190]
          - paragraph [ref=e191]: สินค้าที่ขายต่อเนื่อง พร้อมเรตติ้งและสต็อกที่เชื่อถือได้
        - generic [ref=e192]:
          - link "HOT DEAL E2E Test Product 1777144824006 ร้านค้ายืนยันตัวตนแล้ว topup E2E Test Product 1777144824006 ฿127 ฿99 พร้อมส่ง สต็อกพร้อม" [ref=e193] [cursor=pointer]:
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
                  - generic [ref=e205]: ฿127
                  - generic [ref=e206]: ฿99
                - generic [ref=e207]:
                  - paragraph [ref=e208]: พร้อมส่ง
                  - paragraph [ref=e209]: สต็อกพร้อม
          - link "HOT DEAL Full Flow 1777144732178 ร้านค้ายืนยันตัวตนแล้ว topup Full Flow 1777144732178 ฿120 ฿77 พร้อมส่ง สต็อกพร้อม" [ref=e210] [cursor=pointer]:
            - /url: /products/cbc24c2a-12ba-4bb6-81db-5bbc022762cd
            - generic [ref=e211]:
              - generic [ref=e212]: HOT DEAL
              - img "Full Flow 1777144732178" [ref=e213]
              - generic [ref=e215]: ร้านค้ายืนยันตัวตนแล้ว
            - generic [ref=e216]:
              - paragraph [ref=e218]: topup
              - paragraph [ref=e219]: Full Flow 1777144732178
              - generic [ref=e220]:
                - generic [ref=e221]:
                  - generic [ref=e222]: ฿120
                  - generic [ref=e223]: ฿77
                - generic [ref=e224]:
                  - paragraph [ref=e225]: พร้อมส่ง
                  - paragraph [ref=e226]: สต็อกพร้อม
          - link "HOT DEAL Image Product 1777144718733 ร้านค้ายืนยันตัวตนแล้ว giftcard Image Product 1777144718733 ฿238 ฿150 พร้อมส่ง สต็อกพร้อม" [ref=e227] [cursor=pointer]:
            - /url: /products/79af2c1f-f6f7-453d-94a3-29e7ee2d761b
            - generic [ref=e228]:
              - generic [ref=e229]: HOT DEAL
              - img "Image Product 1777144718733" [ref=e230]
              - generic [ref=e232]: ร้านค้ายืนยันตัวตนแล้ว
            - generic [ref=e233]:
              - paragraph [ref=e235]: giftcard
              - paragraph [ref=e236]: Image Product 1777144718733
              - generic [ref=e237]:
                - generic [ref=e238]:
                  - generic [ref=e239]: ฿238
                  - generic [ref=e240]: ฿150
                - generic [ref=e241]:
                  - paragraph [ref=e242]: พร้อมส่ง
                  - paragraph [ref=e243]: สต็อกพร้อม
          - link "HOT DEAL Delete Test Product 1777144660709 ร้านค้ายืนยันตัวตนแล้ว topup Delete Test Product 1777144660709 ฿89 ฿49 พร้อมส่ง สต็อกพร้อม" [ref=e244] [cursor=pointer]:
            - /url: /products/4f1c5a14-0368-4098-9bfa-7d5419a3f6e4
            - generic [ref=e245]:
              - generic [ref=e246]: HOT DEAL
              - img "Delete Test Product 1777144660709" [ref=e247]
              - generic [ref=e249]: ร้านค้ายืนยันตัวตนแล้ว
            - generic [ref=e250]:
              - paragraph [ref=e252]: topup
              - paragraph [ref=e253]: Delete Test Product 1777144660709
              - generic [ref=e254]:
                - generic [ref=e255]:
                  - generic [ref=e256]: ฿89
                  - generic [ref=e257]: ฿49
                - generic [ref=e258]:
                  - paragraph [ref=e259]: พร้อมส่ง
                  - paragraph [ref=e260]: สต็อกพร้อม
      - region "ซื้อดิจิทัลอย่างสบายใจมากขึ้น" [ref=e261]:
        - generic [ref=e263]:
          - generic [ref=e264]:
            - text: Keyzaa
            - text: มาร์เก็ตเพลสที่เน้นความเชื่อมั่น
          - heading "ซื้อดิจิทัลอย่างสบายใจมากขึ้น" [level=2] [ref=e266]
          - paragraph [ref=e267]: เลือกสินค้าที่ต้องการ แล้วตรวจสอบราคา ร้านค้า และสถานะพร้อมส่งได้ในหน้าเดียว
          - generic [ref=e268]:
            - link "เลือกสินค้าที่เชื่อถือได้" [ref=e269] [cursor=pointer]:
              - /url: /products
            - link "ดูวิธีสั่งซื้อ" [ref=e270] [cursor=pointer]:
              - /url: /orders
  - generic [ref=e271]:
    - generic:
      - generic:
        - paragraph: มีข้อสงสัย? คุยกับเราสิ
        - paragraph: ตอบไวภายใน 1 นาที
    - link [ref=e272] [cursor=pointer]:
      - /url: https://line.me/ti/p/@keyzaa
      - img [ref=e273]
  - button "Open Next.js Dev Tools" [ref=e280] [cursor=pointer]:
    - img [ref=e281]
  - alert [ref=e284]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Portgen E2E', () => {
  4  |   test('landing page loads', async ({ page }) => {
  5  |     await page.goto('/');
> 6  |     await expect(page).toHaveTitle(/portgen/i);
     |                        ^ Error: expect(page).toHaveTitle(expected) failed
  7  |     // Check for main CTA
  8  |     await expect(page.getByRole('link', { name: /get started free|เริ่มใช้ฟรี/i })).toBeVisible();
  9  |   });
  10 | 
  11 |   test('login page loads', async ({ page }) => {
  12 |     await page.goto('/login');
  13 |     // Check for login form elements
  14 |     await expect(page.getByRole('button', { name: /google|github/i })).toHaveCount(2);
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