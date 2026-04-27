'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

export function LangSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleSwitch = (newLocale: string) => {
    router.replace(pathname)
  }

  return (
    <div className="flex items-center rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 overflow-hidden">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleSwitch(loc)}
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
