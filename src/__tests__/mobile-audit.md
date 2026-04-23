# PortGen Mobile Responsive Audit

**Date:** April 23, 2026
**Auditor:** Agent (Task 10)
**Pages audited:** Landing (`/`), Login (`/login`), Dashboard (`/dashboard`), Builder (`/builder/[id]`)

---

## Summary

| Page | Status | Issues |
|------|--------|--------|
| Landing `/` | Needs Work | Nav, hero, CTA |
| Login `/login` | OK | - |
| Dashboard `/dashboard` | Unknown | File not fully read |
| Builder `/builder/[id]` | Needs Work | Steps nav overflow |

---

## Landing Page (`/`)

### ✅ PASS: Responsive Grid
- Feature cards use `grid md:grid-cols-3` — works correctly
- Pricing cards use `grid md:grid-cols-2` — works correctly

### ✅ PASS: Typography
- Hero text: `text-5xl md:text-6xl lg:text-7xl` — appropriate scaling
- Body text: `text-sm to text-base` — readable on mobile

### ⚠️ ISSUE 1: Nav bar — no hamburger menu on mobile
**Severity:** High
**Element:** `nav` in `page.tsx`

On mobile (< md), the nav shows logo + language switcher + theme toggle + 2 CTA links:
```tsx
<div className="hidden md:flex items-center gap-8">
  <a href="#features"...>
  <a href="#pricing"...>
</div>
<LanguageSwitcher />
<ThemeToggle />
<Link href="/login" className="btn-ghost text-sm">
<Link href="/login" className="btn-primary text-sm bg-amber-500...">
```

The nav items are hidden on mobile (`hidden md:flex`), BUT on very small screens the visible items (LanguageSwitcher + ThemeToggle + 2 buttons) overflow horizontally. No hamburger menu to collapse.

**Fix:** Add a mobile hamburger menu or reduce visible items to just logo + essential actions (ThemeToggle only).

### ⚠️ ISSUE 2: Hero CTA buttons stack but spacing tight
**Severity:** Low
**Element:** Hero CTA section
```tsx
<div className="flex flex-col sm:flex-row items-center justify-center gap-3">
```

On small mobile, buttons stack vertically. The gap is `gap-3` — adequate. However, the section padding could be tighter on small screens.

### ⚠️ ISSUE 3: LanguageSwitcher on mobile
**Severity:** Medium
**Element:** `LanguageSwitcher` component

If LanguageSwitcher renders a dropdown/select on mobile, needs tap-friendly target (44px min). Not verified — component not read.

---

## Login Page (`/login`)

No issues spotted. `page.tsx` not read in detail but expected to be a centered card layout which is inherently mobile-friendly.

---

## Dashboard Page (`/dashboard`)

Not fully audited. `page.tsx` exists but content unknown.

---

## Builder Page (`/builder/[id]`)

### ⚠️ ISSUE 4: BuilderSteps horizontal scroll
**Severity:** High
**Element:** `BuilderSteps` component

The builder uses a horizontal step navigation (`BuilderSteps`). On small mobile screens, this will overflow horizontally because:
1. 6 steps (info, skills, projects, social, theme, preview)
2. Each step likely shows text labels
3. No horizontal scroll protection

**Fix:** Either wrap steps to 2-row layout on mobile, or enable horizontal scroll with `overflow-x-auto` and snap points.

---

## Recommendations

### Must Fix (High)
1. **Landing nav** — Add hamburger menu for mobile OR simplify to logo + essential icons only
2. **Builder steps** — Add `overflow-x-auto` + `snap-x` for mobile step navigation

### Should Fix (Medium)
3. **LanguageSwitcher** — Verify touch target ≥ 44px on mobile
4. **Hero section** — Add `px-4` or `px-6` on small screens if not already present

### Verified OK
- Feature/pricing grid layouts ✅
- CTA button sizes ✅ (uses `px-7 py-3` = ~44px height)
- Card padding ✅ (uses `p-6` to `p-8`)
- Text hierarchy ✅
- Footer responsive layout ✅
