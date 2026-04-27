'use client'

import { useLocaleSwitcher } from '@/hooks/useLocaleSwitcher'

export function LangSwitcher() {
  const { locale, switchLocale, locales } = useLocaleSwitcher()

  return (
    <div className="flex items-center rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 overflow-hidden">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${
            locale === loc
              ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-800'
          }`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
