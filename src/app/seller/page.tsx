'use client'

import { useI18n } from '@/i18n/context'
import { Package, ShoppingCart, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'

const stats = [
  {
    label: 'Total Products',
    value: '124',
    change: '+12%',
    trend: 'up',
    icon: Package,
  },
  {
    label: 'Total Orders',
    value: '1,284',
    change: '+8%',
    trend: 'up',
    icon: ShoppingCart,
  },
  {
    label: 'Revenue',
    value: '$12,450',
    change: '+23%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    label: 'Conversion Rate',
    value: '3.2%',
    change: '-2%',
    trend: 'down',
    icon: TrendingUp,
  },
]

const recentOrders = [
  { id: 'ORD-001', customer: 'Sarah Miller', product: 'Premium Template', amount: '$49', status: 'completed', date: '2026-04-26' },
  { id: 'ORD-002', customer: 'James Chen', product: 'Basic Package', amount: '$19', status: 'pending', date: '2026-04-26' },
  { id: 'ORD-003', customer: 'Emma Wilson', product: 'Pro Bundle', amount: '$99', status: 'completed', date: '2026-04-25' },
  { id: 'ORD-004', customer: 'Michael Brown', product: 'Premium Template', amount: '$49', status: 'completed', date: '2026-04-25' },
  { id: 'ORD-005', customer: 'Lisa Park', product: 'Basic Package', amount: '$19', status: 'refunded', date: '2026-04-24' },
]

const statusStyles = {
  completed: 'badge-success',
  pending: 'badge-accent',
  refunded: 'badge-danger',
}

export default function SellerDashboardPage() {
  const { t } = useI18n()

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Dashboard</h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-stone-600 dark:text-stone-400" />
                </div>
                <span
                  className={`flex items-center gap-1 text-xs font-semibold ${
                    stat.trend === 'up' ? 'text-teal-600 dark:text-teal-400' : 'text-red-500 dark:text-red-400'
                  }`}
                >
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-stone-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-sm text-stone-500 dark:text-stone-400">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Recent Orders */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-700">
          <h2 className="font-semibold text-stone-900 dark:text-white">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-800/50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-stone-900 dark:text-white">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-stone-600 dark:text-stone-400">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-stone-600 dark:text-stone-400">{order.product}</td>
                  <td className="px-6 py-4 text-sm font-medium text-stone-900 dark:text-white">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${statusStyles[order.status as keyof typeof statusStyles]}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-500 dark:text-stone-400">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
