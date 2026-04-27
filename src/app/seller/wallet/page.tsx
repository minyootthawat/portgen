'use client'

import { useState } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { StatCard } from '@/components/ui/StatCard'
import { BarChart } from '@/components/ui/BarChart'
import { Wallet, ArrowUpRight, ArrowDownRight, CreditCard, Building2, Bitcoin, TrendingUp } from 'lucide-react'

interface Transaction {
  id: string
  type: 'credit' | 'debit'
  description: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  date: string
}

const columnHelper = createColumnHelper<Transaction>()

const mockTransactions: Transaction[] = [
  { id: 'TXN-001', type: 'credit', description: 'Order ORD-2024-001 completed', amount: 44.10, status: 'completed', date: '2026-04-26' },
  { id: 'TXN-002', type: 'credit', description: 'Order ORD-2024-002 completed', amount: 17.10, status: 'completed', date: '2026-04-26' },
  { id: 'TXN-003', type: 'debit', description: 'Withdrawal to bank account', amount: -50.00, status: 'completed', date: '2026-04-25' },
  { id: 'TXN-004', type: 'credit', description: 'Order ORD-2024-003 completed', amount: 89.10, status: 'completed', date: '2026-04-25' },
  { id: 'TXN-005', type: 'credit', description: 'Order ORD-2024-004 completed', amount: 44.10, status: 'completed', date: '2026-04-25' },
  { id: 'TXN-006', type: 'debit', description: 'Platform fee', amount: -5.90, status: 'completed', date: '2026-04-24' },
  { id: 'TXN-007', type: 'credit', description: 'Order ORD-2024-008 completed', amount: 53.10, status: 'completed', date: '2026-04-23' },
  { id: 'TXN-008', type: 'debit', description: 'Withdrawal to PayPal', amount: -100.00, status: 'completed', date: '2026-04-22' },
]

const revenueData = [
  { label: 'จ.', value: 120 },
  { label: 'อ.', value: 85 },
  { label: 'พ.', value: 150 },
  { label: 'พฤ.', value: 200 },
  { label: 'ศ.', value: 175 },
  { label: 'ส.', value: 220 },
  { label: 'อา.', value: 190 },
]

const stats = [
  { label: 'ยอดเงินที่ใช้ได้', value: '$1,245.80', icon: Wallet },
  { label: 'รอดำเนินการ', value: '$89.50', icon: ArrowUpRight },
  { label: 'สัปดาห์นี้', value: '$1,340.00', change: '+18%', trend: 'up' as const, icon: TrendingUp },
  { label: 'รวมทั้งหมด', value: '$12,450.00', change: '+23%', trend: 'up' as const, icon: ArrowUpRight },
]

export default function SellerWalletPage() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
    pageCount: Math.ceil(mockTransactions.length / 5),
    total: mockTransactions.length,
  })

  const columns = [
    columnHelper.accessor('id', {
      header: 'รหัสรายการ',
      cell: (info) => <span className="font-medium text-stone-900 dark:text-white">{info.getValue()}</span>,
    }),
    columnHelper.accessor('description', {
      header: 'รายละเอียด',
      cell: (info) => <span className="text-stone-600 dark:text-stone-400">{info.getValue()}</span>,
    }),
    columnHelper.accessor('amount', {
      header: 'จำนวน',
      cell: (info) => {
        const amount = info.getValue()
        const isCredit = amount > 0
        return (
          <span className={cn(
            'font-medium flex items-center gap-1',
            isCredit ? 'text-teal-600 dark:text-teal-400' : 'text-red-500 dark:text-red-400'
          )}>
            {isCredit ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {isCredit ? '+' : ''}${Math.abs(amount).toFixed(2)}
          </span>
        )
      },
    }),
    columnHelper.accessor('status', {
      header: 'สถานะ',
      cell: (info) => {
        const status = info.getValue()
        const config = {
          completed: { label: 'เสร็จสิ้น', className: 'badge-success' },
          pending: { label: 'รอดำเนินการ', className: 'badge-accent' },
          failed: { label: 'ล้มเหลว', className: 'badge-danger' },
        }[status]
        return <Badge className={config.className}>{config.label}</Badge>
      },
    }),
    columnHelper.accessor('date', {
      header: 'วันที่',
      cell: (info) => <span className="text-sm text-stone-500 dark:text-stone-400">{info.getValue()}</span>,
    }),
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">กระเป๋าเงิน</h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
          จัดการรายได้และการถอนเงินของคุณ
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="card p-6 mb-8">
        <SectionHeader
          title="ภาพรวมรายได้"
          subtitle="รายได้ของคุณใน 7 วันที่ผ่านมา"
          action={
            <select className="px-3 py-1.5 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white">
              <option>7 วันล่าสุด</option>
              <option>30 วันล่าสุด</option>
              <option>ปีนี้</option>
            </select>
          }
        />
        <BarChart data={revenueData} height={200} className="mt-4" />
      </div>

      {/* Transactions Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-700">
          <SectionHeader title="รายการล่าสุด" subtitle="รายได้และการถอนเงินล่าสุดของคุณ" />
        </div>
        <DataTable
          columns={columns}
          data={mockTransactions}
          searchKey="description"
          searchPlaceholder="ค้นหารายการ..."
          pagination={pagination}
          onPaginationChange={(p) => setPagination((prev) => ({ ...prev, ...p }))}
          emptyMessage="ไม่พบรายการ"
        />
      </div>

      {/* Withdrawal Methods */}
      <div className="card p-6 mt-8">
        <SectionHeader
          title="วิธีการถอนเงิน"
          subtitle="เลือกวิธีที่คุณต้องการรับเงิน"
        />
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <button className="flex items-center gap-4 p-4 rounded-lg border-2 border-stone-200 dark:border-stone-700 hover:border-teal-500 dark:hover:border-teal-500 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <p className="font-medium text-stone-900 dark:text-white">โอนเงินผ่านธนาคาร</p>
              <p className="text-sm text-stone-500 dark:text-stone-400">1-3 วันทำการ</p>
            </div>
          </button>
          <button className="flex items-center gap-4 p-4 rounded-lg border-2 border-stone-200 dark:border-stone-700 hover:border-teal-500 dark:hover:border-teal-500 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <p className="font-medium text-stone-900 dark:text-white">PayPal</p>
              <p className="text-sm text-stone-500 dark:text-stone-400">โอนทันที</p>
            </div>
          </button>
          <button className="flex items-center gap-4 p-4 rounded-lg border-2 border-stone-200 dark:border-stone-700 hover:border-teal-500 dark:hover:border-teal-500 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Bitcoin className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-left">
              <p className="font-medium text-stone-900 dark:text-white">Crypto</p>
              <p className="text-sm text-stone-500 dark:text-stone-400">ภายใน 24 ชั่วโมง</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
