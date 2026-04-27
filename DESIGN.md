# Design

## Visual Theme

**Minimal productivity** — สะอาด, เรียบ, มีสมาธิกับเนื้อหา ไม่มี decorative noise

## Color Palette

| Role | Light | Dark |
|------|-------|------|
| Background | stone-50 | stone-950 |
| Surface | white | stone-900 |
| Border | stone-200 | stone-800 |
| Text primary | stone-900 | white |
| Text muted | stone-500 | stone-400 |
| Accent | teal-500 | teal-400 |
| Accent hover | teal-600 | teal-500 |
| Danger | red-500 | red-400 |

## Typography

- **Font:** Inter (Google Fonts), fallback system-ui
- **Scale:** Tailwind default scale (text-xs through text-5xl)
- **Body:** text-sm (14px), line-height relaxed
- **Heading hierarchy:** bold weights, 1.25+ ratio between steps

## Spacing

- Tailwind spacing scale (p-4, p-6, gap-4, etc.)
- Cards: rounded-2xl, border, shadow-sm
- Generous padding inside cards (p-5 to p-6)
- Section spacing: space-y-6 to space-y-8

## Components

### Buttons

- **Primary:** bg-teal-500 text-white hover:bg-teal-600 rounded-xl px-6 py-3
- **Secondary:** bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl
- **Ghost:** transparent with hover background

### Cards

- bg-white dark:bg-stone-900
- border border-stone-200 dark:border-stone-800
- rounded-2xl
- shadow-sm

### Inputs

- bg-white dark:bg-stone-900
- border border-stone-200 dark:border-stone-700
- rounded-xl, px-4 py-3
- focus:ring-2 ring-teal-500

## Motion

- Transition duration: 150-200ms
- Ease: ease-out (no bounce)
- animate-in for entrances (slide-in-from-top-2, fade-in)

## Dark Mode

- class strategy: dark: variant throughout
- Stone palette (not slate/gray) for warmth
