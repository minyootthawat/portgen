'use client'

import { useState } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { StatCard } from '@/components/ui/StatCard'
import { Package, Truck, CheckCircle, XCircle, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Order {
  id: string
  customer: string
  email: string
  product: string
  amount: number
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled' | 'refunded'
  date: string
}

const columnHelper = createColumnHelper<Order>()

const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    customer: 'Sarah Miller',
    email: 'sarah.miller@email.com',
    product: 'Premium Portfolio Template',
    amount: 49,
    status: 'completed',
    date: '2026-04-26',
  },
  {
    id: 'ORD-2024-002',
    customer: 'James Chen',
    email: 'james.chen@email.com',
    product: 'Basic Package',
    amount: 19,
    status: 'processing',
    date: '2026-04-26',
  },
  {
    id: 'ORD-2024-003',
    customer: 'Emma Wilson',
    email: 'emma.w@email.com',
    product: 'Pro Bundle',
    amount: 99,
    status: 'shipped',
    date: '2026-04-25',
  },
  {
    id: 'ORD-2024-004',
    customer: 'Michael Brown',
    email: 'mbrown@email.com',
    product: 'Premium Portfolio Template',
    amount: 49,
    status: 'completed',
    date: '2026-04-25',
  },
  {
    id: 'ORD-2024-005',
    customer: 'Lisa Park',
    email: 'lisa.park@email.com',
    product: 'Basic Package',
    amount: 19,
    status: 'cancelled',
    date: '2026-04-24',
  },
  {
    id: 'ORD-2024-006',
    customer: 'David Lee',
    email: 'dlee@email.com',
    product: 'Developer Resume Kit',
    amount: 29,
    status: 'pending',
    date: '2026-04-24',
  },
  {
    id: 'ORD-2024-007',
    customer: 'Anna Smith',
    email: 'anna.smith@email.com',
    product: 'Minimal CV Theme',
    amount: 19,
    status: 'refunded',
    date: '2026-04-23',
  },
  {
    id: 'ORD-2024-008',
    customer: 'Robert Johnson',
    email: 'rjohnson@email.com',
    product: 'Creative Agency Template',
    amount: 59,
    status: 'completed',
    date: '2026-04-23',
  },
]

const statusConfig: Record<Order['status'], { label: string; className: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', className: 'badge-accent', icon: Package },
  processing: { label: 'Processing', className: 'badge-accent', icon: Truck },
  shipped: { label: 'Shipped', className: 'badge-info', icon: Truck },
  completed: { label: 'Completed', className: 'badge-success', icon: CheckCircle },
  cancelled: { label: 'Cancelled', className: 'badge-danger', icon: XCircle },
  refunded: { label: 'Refunded', className: 'badge-neutral', icon: XCircle },
}

const stats = [
  { label: 'Total Orders', value: '1,284', change: '+8%', trend: 'up' as const, icon: Package },
  { label: 'Pending', value: '23', change: '+5', trend: 'up' as const, icon: Package },
  { label: 'Completed', value: '1,156', change: '+12%', trend: 'up' as const, icon: CheckCircle },
  { label: 'Refunded', value: '12', change: '-3', trend: 'down' as const, icon: XCircle },
]

export default function SellerOrdersPage() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
    pageCount: Math.ceil(mockOrders.length / 5),
    total: mockOrders.length,
  })

  const columns = [
    columnHelper.accessor('id', {
      header: 'Order ID',
      cell: (info) => (
        <span className="font-medium text-stone-900 dark:text-white">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('customer', {
      header: 'Customer',
      cell: (info) => (
        <div>
          <p className="font-medium text-stone-900 dark:text-white">{info.getValue()}</p>
          <p className="text-xs text-stone-500 dark:text-stone-400">{info.row.original.email}</p>
        </div>
      ),
    }),
    columnHelper.accessor('product', {
      header: 'Product',
      cell: (info) => (
        <span className="text-stone-600 dark:text-stone-400">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: (info) => (
        <span className="font-medium text-stone-900 dark:text-white">${info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const config = statusConfig[info.getValue()]
        const Icon = config.icon
        return (
          <Badge className={config.className}>
            <Icon className="w-3 h-3 mr-1" />
            {config.label}
          </Badge>
        )
      },
    }),
    columnHelper.accessor('date', {
      header: 'Date',
      cell: (info) => (
        <span className="text-sm text-stone-500 dark:text-stone-400">{info.getValue()}</span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: () => (
        <button className="p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition-colors">
          <Eye className="w-4 h-4" />
        </button>
      ),
    }),
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Orders</h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
          Manage and track your customer orders
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-700">
          <SectionHeader title="Recent Orders" subtitle="Latest customer orders" />
        </div>
        <DataTable
          columns={columns}
          data={mockOrders}
          searchKey="customer"
          searchPlaceholder="Search orders..."
          pagination={pagination}
          onPaginationChange={(p) => setPagination((prev) => ({ ...prev, ...p }))}
          emptyMessage="No orders found"
        />
      </div>
    </div>
  )
}