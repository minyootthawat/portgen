import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'accent' | 'success' | 'danger' | 'neutral'
}

export function Badge({ className, variant = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        {
          'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300': variant === 'primary',
          'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300': variant === 'accent',
          'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300': variant === 'success',
          'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300': variant === 'danger',
          'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400': variant === 'neutral',
        },
        className
      )}
      {...props}
    />
  )
}
