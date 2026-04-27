'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { routing } from '@/i18n/routing'

const STORAGE_KEY = 'portgen_locale'

// Read initial locale from localStorage before first render (client-only)
function getInitialLocale(): string {
  if (typeof window === 'undefined') return routing.defaultLocale
  return localStorage.getItem(STORAGE_KEY) ?? routing.defaultLocale
}

export function useLocaleSwitcher() {
  const [locale, setLocale] = useState<string>(getInitialLocale)
  const router = useRouter()

  // Sync state if localStorage changed elsewhere (e.g. another tab)
  useEffect(() => {
    const handler = () => {
      const saved = localStorage.getItem(STORAGE_KEY) ?? routing.defaultLocale
      setLocale(saved)
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const switchLocale = useCallback((newLocale: string) => {
    localStorage.setItem(STORAGE_KEY, newLocale)
    setLocale(newLocale)
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
