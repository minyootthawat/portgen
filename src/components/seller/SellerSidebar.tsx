'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string | number
}

interface SellerSidebarProps {
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

const mainNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/seller',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: 'Products',
    href: '/seller/products',
    icon: <Package className="w-5 h-5" />,
    badge: 24,
  },
  {
    label: 'Orders',
    href: '/seller/orders',
    icon: <ShoppingCart className="w-5 h-5" />,
    badge: 5,
  },
  {
    label: 'Reviews',
    href: '/seller/reviews',
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    label: 'Analytics',
    href: '/seller/analytics',
    icon: <BarChart3 className="w-5 h-5" />,
  },
]

const bottomNavItems: NavItem[] = [
  {
    label: 'Settings',
    href: '/seller/settings',
    icon: <Settings className="w-5 h-5" />,
  },
]

export function SellerSidebar({ collapsed = false, onCollapsedChange }: SellerSidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/seller') {
      return pathname === '/seller'
    }
    return pathname.startsWith(href)
  }

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 transition-all duration-200',
        collapsed ? 'w-[72px]' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-stone-200 dark:border-stone-800">
        <Link href="/seller" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-lg tracking-tight text-stone-900 dark:text-white">
              Seller
            </span>
          )}
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white'
              )}
            >
              <span className={cn(active ? 'text-teal-600 dark:text-teal-400' : '')}>
                {item.icon}
              </span>
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-semibold">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 py-4 border-t border-stone-200 dark:border-stone-800">
        {bottomNavItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white'
              )}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}

        {/* Collapse Toggle */}
        <button
          onClick={() => onCollapsedChange?.(!collapsed)}
          className="flex items-center gap-3 w-full px-3 py-2.5 mt-2 rounded-lg text-sm font-medium text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}