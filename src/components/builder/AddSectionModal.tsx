'use client'

import { X } from 'lucide-react'
import { SECTION_TYPE_META, type SectionType } from '@/types/builder'

interface Props {
  onClose: () => void
  onAdd: (type: SectionType) => void
}

const GRID_TYPES: SectionType[] = ['info', 'skills', 'projects', 'social', 'services', 'experience', 'education', 'testimonials', 'certifications']

export function AddSectionModal({ onClose, onAdd }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-2xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-white">เพิ่มเซคชัน</h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">เลือกประเภทเซคชันที่ต้องการเพิ่ม</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid */}
        <div className="p-6 grid grid-cols-3 gap-3">
          {GRID_TYPES.map((type) => {
            const meta = SECTION_TYPE_META[type]
            return (
              <button
                key={type}
                onClick={() => onAdd(type)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-teal-400 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all group text-center"
              >
                <span className="text-2xl">{meta.icon}</span>
                <div>
                  <div className="text-sm font-medium text-stone-700 dark:text-stone-200 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                    {meta.label}
                  </div>
                  <div className="text-xs text-stone-400 dark:text-stone-500 mt-0.5 leading-tight">
                    {meta.description}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
