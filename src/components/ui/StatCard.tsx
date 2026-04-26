'use client'

import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  change?: string
  trend?: 'up' | 'down'
  icon?: LucideIcon
  className?: string
}

export function StatCard({ label, value, change, trend, icon: Icon, className }: StatCardProps) {
  return (
    <div className={cn('card p-6', className)}>
      <div className="flex items-center justify-between mb-4">
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
            <Icon className="w-5 h-5 text-stone-600 dark:text-stone-400" />
          </div>
        )}
        {change && (
          <span
            className={cn(
              'flex items-center gap-1 text-xs font-semibold',
              trend === 'up' ? 'text-teal-600 dark:text-teal-400' : 'text-red-500 dark:text-red-400'
            )}
          >
            {trend === 'up' ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-stone-900 dark:text-white mb-1">{value}</div>
      <div className="text-sm text-stone-500 dark:text-stone-400">{label}</div>
    </div>
  )
}