# I18N Plan: Thai + English for PortGen

## 1. Approach

**Recommendation: `next-intl`**

For a Next.js 14 (Pages Router) app targeting Thai + English, `next-intl` is the best balance of simplicity and robustness.

| Option | Verdict |
|---|---|
| **next-intl** | ✅ Recommended — native Next.js integration, file-based routing conventions, `useTranslation()` hook, built-in locale detection + persistence, works with Pages Router |
| react-i18next | Overkill for 2 languages; requires manual plugin wiring, i18n instance boilerplate |
| Simple JSON + context | Works but lacks URL routing, SSR support, and grows unwieldy as strings multiply |

### Why not just JSON files?
A plain JSON/context approach would work for client components, but falls apart at the SSR boundary. `next-intl` solves this uniformly. The migration cost is low: `npm install next-intl` + ~3 config files.

---

## 2. Language Detection

**Strategy: Browser locale → localStorage override → manual switch**

1. **On first visit**: Detect `Accept-Language` header via middleware (or `navigator.language` client-side as fallback)
2. **Store preference**: Save selected locale to `localStorage` key `NEXT_LOCALE` (key name required by `next-intl`)
3. **Manual override**: Language switcher in nav sets `NEXT_LOCALE` + triggers soft navigation

Middleware (in `src/middleware.ts`) will:
- Check `NEXT_LOCALE` cookie/localStorage
- Fall back to `Accept-Language`
- Default to `th` if no match (existing Thai-first users)

Supported locales: `th` (default), `en`

---

## 3. Scope

**Pages requiring translation:**

| Page | Route | Notes |
|---|---|---|
| Landing | `/` | Most strings — hero, features, pricing, CTA, nav, footer |
| Auth Dialog | (component) | Login/register form, error messages, demo button |
| Dashboard | `/dashboard` | Sidebar nav, portfolio list, stats |
| Builder | `/builder/[id]` | Section labels, tooltips, publish flow, theme picker |
| Login | `/login` | OAuth buttons, credential form |
| Seller (if exists) | `/seller` | Seller-specific UI |

**Out of scope for initial pass:** API routes (return data, not UI), error pages.

---

## 4. UI — Language Switcher

**Placement**: In the sticky nav bar, between ThemeToggle and auth actions (desktop). In mobile menu alongside ThemeToggle.

**Appearance — Option A (flag + code):**
```tsx
// TH / EN toggle button group
<button className={cn("px-2 py-1 rounded text-sm", locale === 'th' ? 'bg-teal-100 text-teal-700' : 'text-stone-500')}>TH</button>
<button className={cn("px-2 py-1 rounded text-sm", locale === 'en' ? 'bg-teal-100 text-teal-700' : 'text-stone-500')}>EN</button>
```

**Appearance — Option B (dropdown with flag icons):**
Dropdown showing 🇹🇭 ไทย / 🇬🇧 English with checkmark on selected.

**Recommendation**: Option A (button group) — simpler, faster, more compact. Fits better in the crowded nav bar.

**Behavior**: Clicking switches locale and soft-navigates to the same route with new locale (no page reload required).

---

## 5. Structure

### Directory layout

```
src/
  i18n/
    request.ts         # Locale detection config (Next.js Pages Router)
    routing.ts         # Routing config (define locales, defaultLocale)
  locales/
    th.json            # Thai translations
    en.json            # English translations
  components/
    LangSwitcher.tsx   # Language toggle component
```

### Translation file format (JSON)

```json
// src/locales/th.json
{
  "nav": {
    "features": "ฟีเจอร์",
    "pricing": "ราคา",
    "startFree": "เริ่มใช้ฟรี",
    "dashboard": "แดชบอร์ด"
  },
  "hero": {
    "badge": "🚀 ฟรีเริ่มต้น — ไม่ต้องใช้บัตรเครดิต",
    "headline": "พอร์ตโฟลิโอสวย ๆ ใน 5 นาที",
    "headlineAccent": "— ไม่ต้องรู้เรื่องโค้ดเลยสักบรรทัด",
    "subtitle": "สร้างพอร์ตโฟลิโอที่ดูโปรได้ด้วยตัวเอง..."
  }
}
```

### Existing Thai strings to extract

From `page.tsx`, `AuthDialog.tsx`, `BuilderEditor.tsx` — every hardcoded Thai string in JSX becomes a `t('key.path')` call. English strings (e.g., OG metadata) stay as-is.

---

## 6. Migration Steps

### Phase 1: Scaffold i18n infrastructure (no string changes yet)

1. `npm install next-intl`
2. Create `src/i18n/routing.ts`:
   ```ts
   import { defineRouting } from 'next-intl/routing'
   export const routing = defineRouting({
     locales: ['th', 'en'],
     defaultLocale: 'th',
   })
   ```
3. Create `src/i18n/request.ts`:
   ```ts
   import { getRequestConfig } from 'next-intl/server'
   import { routing } from './routing'

   export default getRequestConfig(async ({ requestLocale }) => {
     const locale = await requestLocale ?? routing.defaultLocale
     return { locale }
   })
   ```
4. Update `next.config.js` with `next-intl/plugin`:
   ```js
   const createNextIntlPlugin = require('next-intl/plugin')
   const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')
   module.exports = withNextIntl({ /* existing config */ })
   ```
5. Create `src/middleware.ts` (at project root, not in src/):
   ```ts
   import createMiddleware from 'next-intl/middleware'
   import { routing } from './src/i18n/routing'
   export default createMiddleware(routing)
   export const config = { matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'] }
   ```
6. Create empty `src/locales/th.json` and `src/locales/en.json`

### Phase 2: Add LangSwitcher component

7. Create `src/components/LangSwitcher.tsx` using `useLocale()` + `useRouter()`:
   - Reads current locale
   - On click: sets `NEXT_LOCALE` cookie + navigates to same path with new locale
   - Renders button group TH | EN

### Phase 3: Wrap pages with `NextIntlClientProvider`

8. In `src/app/layout.tsx`, add:
   ```tsx
   import { NextIntlClientProvider } from 'next-intl'
   import { getMessages } from 'next-intl/server'

   // In body — wrap children with NextIntlClientProvider
   <NextIntlClientProvider messages={messages}>
     {children}
   </NextIntlClientProvider>
   ```
   Note: Since `layout.tsx` is a Server Component, load messages via `getMessages()` from `next-intl/server`.

### Phase 4: Extract and translate strings (per-page, iterative)

9. **Landing page** — extract all Thai UI strings to `t('section.key')` calls
10. **AuthDialog** — extract all Thai strings
11. **BuilderEditor** — extract all Thai strings
12. **Dashboard** — extract all Thai strings
13. **Login page** — extract all Thai strings

### Phase 5: SEO / metadata

14. For each page, add `<link rel="alternate" hreflang="th|en" />` to layout for search engines
15. `og:locale` in metadata should match current locale

### Phase 6: Verify SSR

16. Test with `npm run dev` — ensure no hydration mismatches
17. Check language persists across page navigations
18. Check mobile menu works with LangSwitcher

---

## 7. SSR / Server Component Handling

### The problem
`useTranslation()` is a React hook — only works in Client Components. But `page.tsx` and `layout.tsx` are Server Components in Next.js.

### `next-intl` solution

**For `layout.tsx` (Server Component):**
```tsx
import { getMessages } from 'next-intl/server'
const messages = await getMessages()
// Pass to NextIntlClientProvider — client components read from context
```

**For `page.tsx` (Server Component by default):**
Since `page.tsx` doesn't use any translation strings in metadata yet (OG tags are English), no change needed for server side initially. When adding translations to page.tsx, either:
- Mark it as `'use client'` (lowest friction for Pages Router)
- Use `getTranslations` from `next-intl/server` for server-side string access

**For client components (AuthDialog, BuilderEditor):**
Use `useTranslations()` hook normally. No SSR concerns.

---

## 8. Breaking Changes Check

- **No breaking changes** to existing functionality
- All Thai strings are hardcoded today — migration extracts them, doesn't remove them
- `next-intl` is additive — existing Thai users see `th` locale by default (no change in behavior)
- No changes to API routes, database, auth logic, or Supabase integration
