'use client'

import { useState } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Plus, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: 'active' | 'draft' | 'out_of_stock'
  createdAt: string
  image?: string
}

const columnHelper = createColumnHelper<Product>()

const mockProducts: Product[] = [
  {
    id: 'PRD-001',
    name: 'Premium Portfolio Template',
    category: 'Templates',
    price: 49,
    stock: 156,
    status: 'active',
    createdAt: '2026-04-15',
  },
  {
    id: 'PRD-002',
    name: 'Developer Resume Kit',
    category: 'Templates',
    price: 29,
    stock: 89,
    status: 'active',
    createdAt: '2026-04-10',
  },
  {
    id: 'PRD-003',
    name: 'Minimal CV Theme',
    category: 'Themes',
    price: 19,
    stock: 234,
    status: 'active',
    createdAt: '2026-04-08',
  },
  {
    id: 'PRD-004',
    name: 'Cyberpunk Portfolio',
    category: 'Themes',
    price: 69,
    stock: 0,
    status: 'out_of_stock',
    createdAt: '2026-04-01',
  },
  {
    id: 'PRD-005',
    name: 'Startup Landing Page',
    category: 'Templates',
    price: 39,
    stock: 45,
    status: 'draft',
    createdAt: '2026-03-28',
  },
  {
    id: 'PRD-006',
    name: 'Creative Agency Template',
    category: 'Templates',
    price: 59,
    stock: 67,
    status: 'active',
    createdAt: '2026-03-20',
  },
  {
    id: 'PRD-007',
    name: 'E-commerce Dashboard',
    category: 'Dashboard',
    price: 79,
    stock: 23,
    status: 'active',
    createdAt: '2026-03-15',
  },
  {
    id: 'PRD-008',
    name: 'Blog Theme Collection',
    category: 'Themes',
    price: 35,
    stock: 112,
    status: 'active',
    createdAt: '2026-03-10',
  },
]

const statusConfig = {
  active: { label: 'Active', className: 'badge-success' },
  draft: { label: 'Draft', className: 'badge-neutral' },
  out_of_stock: { label: 'Out of Stock', className: 'badge-danger' },
}

function ProductActions() {
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

export default function SellerProductsPage() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
    pageCount: Math.ceil(mockProducts.length / 5),
    total: mockProducts.length,
  })

  const columns = [
    columnHelper.accessor('name', {
      header: 'Product',
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-stone-500 dark:text-stone-400">
              {info.getValue().charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-stone-900 dark:text-white">{info.getValue()}</p>
            <p className="text-xs text-stone-500 dark:text-stone-400">{info.row.original.id}</p>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: (info) => (
        <span className="text-sm text-stone-600 dark:text-stone-400">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('price', {
      header: 'Price',
      cell: (info) => (
        <span className="font-medium text-stone-900 dark:text-white">${info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('stock', {
      header: 'Stock',
      cell: (info) => {
        const stock = info.getValue()
        const isLow = stock > 0 && stock < 30
        return (
          <span className={cn(
            'text-sm font-medium',
            stock === 0 ? 'text-red-500 dark:text-red-400' : isLow ? 'text-amber-500 dark:text-amber-400' : 'text-stone-600 dark:text-stone-400'
          )}>
            {stock === 0 ? 'Out of stock' : stock}
          </span>
        )
      },
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const config = statusConfig[info.getValue()]
        return <span className={cn('badge', config.className)}>{config.label}</span>
      },
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created',
      cell: (info) => (
        <span className="text-sm text-stone-500 dark:text-stone-400">{info.getValue()}</span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: () => <ProductActions />,
    }),
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Products</h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
            Manage your product inventory and listings
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={mockProducts}
        searchKey="name"
        searchPlaceholder="Search products..."
        pagination={pagination}
        onPaginationChange={(p) => setPagination((prev) => ({ ...prev, ...p }))}
        emptyMessage="No products found"
      />
    </div>
  )
}
