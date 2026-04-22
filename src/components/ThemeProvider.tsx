'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggle: () => void
  set: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggle: () => {},
  set: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  // Hydrate from localStorage after mount
  useEffect(() => {
    const stored = localStorage.getItem('portgen-theme') as Theme | null
    if (stored === 'dark' || stored === 'light') {
      setTheme(stored)
      document.documentElement.classList.toggle('dark', stored === 'dark')
    } else {
      // Respect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', prefersDark)
    }
  }, [])

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('portgen-theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  const set = (t: Theme) => {
    setTheme(t)
    localStorage.setItem('portgen-theme', t)
    document.documentElement.classList.toggle('dark', t === 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle, set }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
