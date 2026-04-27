'use client'

import { Check, Lock } from 'lucide-react'

const THEMES = [
  {
    id: 'gradient-dark',
    name: 'Gradient Dark',
    description: 'Bold gradients, modern feel',
    preview: 'from-indigo-950 via-slate-900 to-purple-950',
    isPro: false,
  },
  {
    id: 'minimal-light',
    name: 'Minimal Light',
    description: 'Clean, professional, readable',
    preview: 'from-slate-100 to-slate-200',
    isPro: false,
  },
  {
    id: 'brutalist',
    name: 'Brutalist',
    description: 'Bold, raw, distinctive',
    preview: 'bg-white border-2 border-black',
    isPro: true,
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon lights, futuristic',
    preview: 'from-purple-950 via-slate-950 to-cyan-950',
    isPro: true,
  },
  {
    id: 'nordic',
    name: 'Nordic',
    description: 'Minimal Scandinavian style',
    preview: 'from-slate-50 to-blue-50',
    isPro: true,
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm gradient, friendly vibe',
    preview: 'from-orange-500 via-pink-500 to-purple-500',
    isPro: true,
  },
] as const

interface Props {
  selected: string
  onSelect: (themeId: string) => void
}

export function ThemeSelector({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {THEMES.map((theme) => {
        const isSelected = selected === theme.id

        return (
          <button
            key={theme.id}
            onClick={() => onSelect(theme.id)}
            disabled={theme.isPro}
            className={`
              relative rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer
              ${isSelected ? 'border-teal-500 dark:border-teal-400 ring-2 ring-teal-500/30 dark:ring-teal-400/30 shadow-lg shadow-teal-500/10' : 'border-stone-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-md'}
              ${theme.isPro ? 'opacity-50 dark:opacity-60' : ''}
              disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]
            `}
          >
            {/* Preview */}
            <div className={`aspect-[4/3] bg-gradient-to-br ${theme.preview} p-4 flex items-center justify-center`}>
              <div className="text-center">
                <div className={`w-8 h-8 rounded-full mx-auto mb-1 ${
                  theme.id === 'brutalist' ? 'bg-black' :
                  theme.id === 'minimal-light' ? 'bg-slate-400' :
                  'bg-gradient-to-br from-sky-400 to-indigo-500'
                }`} />
                <div className={`h-1.5 w-12 rounded mx-auto mb-0.5 ${
                  theme.id === 'brutalist' ? 'bg-black' :
                  theme.id === 'minimal-light' ? 'bg-slate-400' :
                  'bg-white/30'
                }`} />
                <div className={`h-1 w-16 rounded mx-auto ${
                  theme.id === 'brutalist' ? 'bg-black' :
                  theme.id === 'minimal-light' ? 'bg-slate-300' :
                  'bg-white/20'
                }`} />
              </div>
            </div>

            {/* Info */}
            <div className="p-3 bg-stone-100/80 dark:bg-slate-900/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-800 dark:text-stone-100">{theme.name}</span>
                {theme.isPro ? (
                  <span className="flex items-center gap-1 text-xs text-purple-400">
                    <Lock className="w-3 h-3" />
                    Pro
                  </span>
                ) : (
                  <span className="text-xs text-sky-400 dark:text-teal-400">ฟรี</span>
                )}
              </div>
            </div>

            {/* Selected indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-sky-500 dark:bg-teal-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
