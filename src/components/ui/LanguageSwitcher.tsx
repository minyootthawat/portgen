'use client'

import { useI18n } from '@/i18n/context'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n()

  return (
    <div className="flex items-center gap-1.5">
      <Globe className="w-3.5 h-3.5 text-zinc-400" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'en' | 'th')}
        className="bg-transparent border-none text-zinc-500 text-sm cursor-pointer outline-none hover:text-zinc-900 transition-colors"
      >
        <option value="en">EN</option>
        <option value="th">TH</option>
      </select>
    </div>
  )
}
