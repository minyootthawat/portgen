'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { routing } from '@/i18n/routing'

const STORAGE_KEY = 'portgen_locale'

function LocaleSwitcherInner() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && (routing.locales as unknown as string[]).includes(saved) && saved !== routing.defaultLocale) {
      // Set cookie via fetch (no page reload needed for cookie to be sent on next request)
      fetch('/api/set-locale', {
        method: 'POST',
        body: JSON.stringify({ locale: saved }),
        headers: { 'Content-Type': 'application/json' },
      }).then(() => {
        router.refresh()
      })
    }
  }, [])

  return null
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <LocaleSwitcherInner />
      </Suspense>
      {children}
    </>
  )
}
