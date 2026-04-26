import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          {
            // Variants
            'bg-teal-600 hover:bg-teal-700 text-white focus-visible:ring-teal-600': variant === 'primary',
            'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 focus-visible:ring-stone-500': variant === 'secondary',
            'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 focus-visible:ring-stone-500': variant === 'ghost',
            'bg-amber-500 hover:bg-amber-600 text-white focus-visible:ring-amber-500': variant === 'accent',
            'bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-600': variant === 'danger',
            // Sizes
            'h-8 px-3 text-sm rounded-md': size === 'sm',
            'h-10 px-4 text-sm rounded-lg': size === 'md',
            'h-12 px-6 text-base rounded-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
