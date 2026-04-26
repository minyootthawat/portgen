'use client'

import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
}

export function SectionHeader({ title, subtitle, action, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-6', className)}>
      <div>
        <h2 className="text-lg font-semibold text-stone-900 dark:text-white">{title}</h2>
        {subtitle && (
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  )
}