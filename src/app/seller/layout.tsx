'use client'

import { useState } from 'react'
import { SellerSidebar } from '@/components/seller/SellerSidebar'

interface SellerLayoutProps {
  children: React.ReactNode
}

export default function SellerLayout({ children }: SellerLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-stone-50 dark:bg-stone-950">
      <SellerSidebar
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
