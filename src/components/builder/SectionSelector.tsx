'use client'

import { Briefcase, GraduationCap, Award, MessageSquare, Code } from 'lucide-react'

const SECTION_TYPES = [
  { type: 'services', icon: Briefcase, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  { type: 'experience', icon: Briefcase, color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  { type: 'education', icon: GraduationCap, color: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  { type: 'testimonials', icon: MessageSquare, color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
  { type: 'certifications', icon: Award, color: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' },
]

export function SectionSelector({ onSelect }: { onSelect: (type: string) => void }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {SECTION_TYPES.map(({ type, icon: Icon, color }) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className="flex flex-col items-center gap-2 p-4 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition group"
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} group-hover:scale-110 transition`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-stone-700 dark:text-stone-200 capitalize">
            {type}
          </span>
        </button>
      ))}
    </div>
  )
}
