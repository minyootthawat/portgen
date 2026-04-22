'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { en, Translations } from '@/locales/en'
import { th } from '@/locales/th'

type Language = 'en' | 'th'

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const translations: Record<Language, Translations> = { en, th }

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('th')
  const [isInitialized, setIsInitialized] = useState(false)

  // Load language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('portgen_language') as Language | null
    if (saved && (saved === 'en' || saved === 'th')) {
      setLanguage(saved)
    } else {
      // Detect from browser
      const browserLang = navigator.language.split('-')[0]
      if (browserLang === 'th') {
        setLanguage('th')
      }
    }
    setIsInitialized(true)
  }, [])

  // Save language to localStorage when changed
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('portgen_language', language)
    }
  }, [language, isInitialized])

  const value: I18nContextType = {
    language,
    setLanguage,
    t: translations[language],
  }

  if (!isInitialized) return null

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}
