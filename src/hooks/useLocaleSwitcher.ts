'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { routing } from '@/i18n/routing'

const STORAGE_KEY = 'portgen_locale'

export function useLocaleSwitcher() {
  const [locale, setLocale] = useState<string>(routing.defaultLocale)
  const router = useRouter()
useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && (routing.locales as unknown as string[]).includes(saved)) {
      setLocale(saved)
    }
  }, [])

  const switchLocale = useCallback((newLocale: string) => {
    localStorage.setItem(STORAGE_KEY, newLocale)
    setLocale(newLocale)
    // Set cookie via API, then refresh to re-render server with new locale
    fetch('/api/set-locale', {
      method: 'POST',
      body: JSON.stringify({ locale: newLocale }),
      headers: { 'Content-Type': 'application/json' },
    }).then(() => {
      router.refresh()
    })
  }, [router])

  return {
    locale,
    switchLocale,
    locales: routing.locales,
  }
}
