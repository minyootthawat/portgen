'use client'

import { cn } from '@/lib/utils'

interface BarChartProps {
  data: { label: string; value: number }[]
  height?: number
  className?: string
}

export function BarChart({ data, height = 200, className }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <div className={cn('flex items-end gap-3 px-2', className)} style={{ height }}>
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * 100
        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-teal-600 dark:bg-teal-500 rounded-t-sm transition-all duration-500"
              style={{ height: `${barHeight}%`, minHeight: '4px' }}
            />
            <span className="text-xs text-stone-500 dark:text-stone-400 truncate w-full text-center">
              {item.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}