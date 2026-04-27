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
  { id: 'ORD-2024-001', customer: 'Sarah Miller', email: 'sarah.miller@email.com', product: 'Premium Portfolio Template', amount: 49, status: 'completed', date: '2026-04-26' },
  { id: 'ORD-2024-002', customer: 'James Chen', email: 'james.chen@email.com', product: 'Basic Package', amount: 19, status: 'processing', date: '2026-04-26' },
  { id: 'ORD-2024-003', customer: 'Emma Wilson', email: 'emma.w@email.com', product: 'Pro Bundle', amount: 99, status: 'shipped', date: '2026-04-25' },
  { id: 'ORD-2024-004', customer: 'Michael Brown', email: 'mbrown@email.com', product: 'Premium Portfolio Template', amount: 49, status: 'completed', date: '2026-04-25' },
  { id: 'ORD-2024-005', customer: 'Lisa Park', email: 'lisa.park@email.com', product: 'Basic Package', amount: 19, status: 'cancelled', date: '2026-04-24' },
  { id: 'ORD-2024-006', customer: 'David Lee', email: 'dlee@email.com', product: 'Developer Resume Kit', amount: 29, status: 'pending', date: '2026-04-24' },
  { id: 'ORD-2024-007', customer: 'Anna Smith', email: 'anna.smith@email.com', product: 'Minimal CV Theme', amount: 19, status: 'refunded', date: '2026-04-23' },
  { id: 'ORD-2024-008', customer: 'Robert Johnson', email: 'rjohnson@email.com', product: 'Creative Agency Template', amount: 59, status: 'completed', date: '2026-04-23' },
]

const statusConfig: Record<Order['status'], { label: string; className: string; icon: React.ElementType }> = {
  pending: { label: 'รอดำเนินการ', className: 'badge-accent', icon: Package },
  processing: { label: 'กำลังดำเนินการ', className: 'badge-accent', icon: Truck },
  shipped: { label: 'จัดส่งแล้ว', className: 'badge-info', icon: Truck },
  completed: { label: 'เสร็จสิ้น', className: 'badge-success', icon: CheckCircle },
  cancelled: { label: 'ยกเลิก', className: 'badge-danger', icon: XCircle },
  refunded: { label: 'คืนเงิน', className: 'badge-neutral', icon: XCircle },
}

const stats = [
  { label: 'คำสั่งซื้อทั้งหมด', value: '1,284', change: '+8%', trend: 'up' as const, icon: Package },
  { label: 'รอดำเนินการ', value: '23', change: '+5', trend: 'up' as const, icon: Package },
  { label: 'เสร็จสิ้น', value: '1,156', change: '+12%', trend: 'up' as const, icon: CheckCircle },
  { label: 'คืนเงิน', value: '12', change: '-3', trend: 'down' as const, icon: XCircle },
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
      header: 'รหัสคำสั่งซื้อ',
      cell: (info) => <span className="font-medium text-stone-900 dark:text-white">{info.getValue()}</span>,
    }),
    columnHelper.accessor('customer', {
      header: 'ลูกค้า',
      cell: (info) => (
        <div>
          <p className="font-medium text-stone-900 dark:text-white">{info.getValue()}</p>
          <p className="text-xs text-stone-500 dark:text-stone-400">{info.row.original.email}</p>
        </div>
      ),
    }),
    columnHelper.accessor('product', {
      header: 'สินค้า',
      cell: (info) => <span className="text-stone-600 dark:text-stone-400">{info.getValue()}</span>,
    }),
    columnHelper.accessor('amount', {
      header: 'จำนวน',
      cell: (info) => <span className="font-medium text-stone-900 dark:text-white">${info.getValue()}</span>,
    }),
    columnHelper.accessor('status', {
      header: 'สถานะ',
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
      header: 'วันที่',
      cell: (info) => <span className="text-sm text-stone-500 dark:text-stone-400">{info.getValue()}</span>,
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
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">คำสั่งซื้อ</h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
          จัดการและติดตามคำสั่งซื้อของลูกค้า
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
          <SectionHeader title="คำสั่งซื้อล่าสุด" subtitle="คำสั่งซื้อล่าสุดจากลูกค้า" />
        </div>
        <DataTable
          columns={columns}
          data={mockOrders}
          searchKey="customer"
          searchPlaceholder="ค้นหาคำสั่งซื้อ..."
          pagination={pagination}
          onPaginationChange={(p) => setPagination((prev) => ({ ...prev, ...p }))}
          emptyMessage="ไม่พบคำสั่งซื้อ"
        />
      </div>
    </div>
  )
}
