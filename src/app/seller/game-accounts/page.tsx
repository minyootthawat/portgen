'use client'

import { useState } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { StatCard } from '@/components/ui/StatCard'
import { Gamepad2, Plus, Eye, Edit, Trash2, Server, Users, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GameAccount {
  id: string
  game: string
  accountName: string
  level: number
  price: number
  status: 'available' | 'sold' | 'reserved'
  seller: string
  createdAt: string
}

const columnHelper = createColumnHelper<GameAccount>()

const mockAccounts: GameAccount[] = [
  { id: 'GAME-001', game: 'Genshin Impact', accountName: 'AR60 Main Account', level: 60, price: 450, status: 'available', seller: 'John', createdAt: '2026-04-26' },
  { id: 'GAME-002', game: 'Honkai: Star Rail', accountName: 'Endgame Account', level: 75, price: 320, status: 'available', seller: 'John', createdAt: '2026-04-25' },
  { id: 'GAME-003', game: 'PUBG Mobile', accountName: 'Conquest Rank Account', level: 80, price: 180, status: 'sold', seller: 'John', createdAt: '2026-04-24' },
  { id: 'GAME-004', game: 'Mobile Legends', accountName: 'Mythic Glory', level: 100, price: 95, status: 'available', seller: 'John', createdAt: '2026-04-23' },
  { id: 'GAME-005', game: 'Genshin Impact', accountName: 'Alt AR45', level: 45, price: 120, status: 'reserved', seller: 'John', createdAt: '2026-04-22' },
  { id: 'GAME-006', game: 'Valorant', accountName: 'Diamond Rank', level: 45, price: 250, status: 'available', seller: 'John', createdAt: '2026-04-21' },
  { id: 'GAME-007', game: 'League of Legends', accountName: 'Gold Account', level: 30, price: 75, status: 'sold', seller: 'John', createdAt: '2026-04-20' },
  { id: 'GAME-008', game: 'Apex Legends', accountName: 'Master Season 20', level: 50, price: 380, status: 'available', seller: 'John', createdAt: '2026-04-19' },
]

const gameLogos: Record<string, string> = {
  'Genshin Impact': 'GI',
  'Honkai: Star Rail': 'HSR',
  'PUBG Mobile': 'PUBG',
  'Mobile Legends': 'ML',
  'Valorant': 'VAL',
  'League of Legends': 'LoL',
  'Apex Legends': 'APEX',
}

const statusConfig = {
  available: { label: 'พร้อมขาย', className: 'badge-success' },
  sold: { label: 'ขายแล้ว', className: 'badge-neutral' },
  reserved: { label: 'จองแล้ว', className: 'badge-accent' },
}

const stats = [
  { label: 'บัญชีทั้งหมด', value: '48', change: '+5', trend: 'up' as const, icon: Gamepad2 },
  { label: 'พร้อมขาย', value: '32', icon: Server },
  { label: 'ยอดขายรวม', value: '$4,850', change: '+12%', trend: 'up' as const, icon: TrendingUp },
  { label: 'ผู้ขายที่ใช้งาน', value: '8', icon: Users },
]

function AccountActions() {
  return (
    <div className="flex items-center gap-1">
      <button className="p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition-colors">
        <Eye className="w-4 h-4" />
      </button>
      <button className="p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition-colors">
        <Edit className="w-4 h-4" />
      </button>
      <button className="p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-red-500 dark:text-red-400 transition-colors">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function SellerGameAccountsPage() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
    pageCount: Math.ceil(mockAccounts.length / 5),
    total: mockAccounts.length,
  })

  const columns = [
    columnHelper.accessor('game', {
      header: 'เกม',
      cell: (info) => {
        const game = info.getValue()
        const abbr = gameLogos[game] || game.substring(0, 2).toUpperCase()
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">{abbr}</span>
            </div>
            <span className="font-medium text-stone-900 dark:text-white">{game}</span>
          </div>
        )
      },
    }),
    columnHelper.accessor('accountName', {
      header: 'ชื่อบัญชี',
      cell: (info) => <span className="text-stone-600 dark:text-stone-400">{info.getValue()}</span>,
    }),
    columnHelper.accessor('level', {
      header: 'เลเวล',
      cell: (info) => (
        <div className="flex items-center gap-1">
          <span className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-sm font-semibold text-stone-600 dark:text-stone-400">
            {info.getValue()}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor('price', {
      header: 'ราคา',
      cell: (info) => <span className="font-medium text-teal-600 dark:text-teal-400">${info.getValue()}</span>,
    }),
    columnHelper.accessor('status', {
      header: 'สถานะ',
      cell: (info) => {
        const config = statusConfig[info.getValue() as keyof typeof statusConfig]
        return <Badge className={config.className}>{config.label}</Badge>
      },
    }),
    columnHelper.accessor('createdAt', {
      header: 'ลงขายเมื่อ',
      cell: (info) => <span className="text-sm text-stone-500 dark:text-stone-400">{info.getValue()}</span>,
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: () => <AccountActions />,
    }),
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">บัญชีเกม</h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
            จัดการบัญชีเกมของคุณที่ลงขาย
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          เพิ่มบัญชี
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Accounts Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-700">
          <SectionHeader title="บัญชีเกม" subtitle="ดูบัญชีเกมทั้งหมด" />
        </div>
        <DataTable
          columns={columns}
          data={mockAccounts}
          searchKey="accountName"
          searchPlaceholder="ค้นหาบัญชี..."
          pagination={pagination}
          onPaginationChange={(p) => setPagination((prev) => ({ ...prev, ...p }))}
          emptyMessage="ไม่พบบัญชีเกม"
        />
      </div>
    </div>
  )
}
