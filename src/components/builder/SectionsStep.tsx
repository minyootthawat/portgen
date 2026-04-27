'use client'

import { useState } from 'react'
import { Plus, GripVertical, Trash2, ChevronDown, ChevronUp, Edit2 } from 'lucide-react'
import { SectionSelector } from './SectionSelector'

interface SectionsStepProps {
  sections: any[]
  onAdd: (section: any) => void
  onRemove: (id: string) => void
  onReorder: (sections: any[]) => void
  onUpdate: (section: any) => void
}

export function SectionsStep({ sections, onAdd, onRemove, onReorder, onUpdate }: SectionsStepProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showSelector, setShowSelector] = useState(false)

  const moveUp = (index: number) => {
    if (index === 0) return
    const newSections = [...sections]
    ;[newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]]
    onReorder(newSections)
  }

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return
    const newSections = [...sections]
    ;[newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]]
    onReorder(newSections)
  }

  const handleAddSection = (type: string) => {
    const typeLabels: Record<string, string> = {
      services: 'Services',
      experience: 'Experience',
      education: 'Education',
      testimonials: 'Testimonials',
      certifications: 'Certifications',
    }
    onAdd({
      id: Date.now().toString(),
      type,
      title: typeLabels[type] || type,
      items: [],
    })
    setShowSelector(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-900 dark:text-white">เซคชันเพิ่มเติม</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">เพิ่มเซคชันเพื่อโชว์ผลงานเพิ่มเติม</p>
        </div>
        <button
          onClick={() => setShowSelector(!showSelector)}
          className="btn-primary text-sm"
        >
          <Plus className="w-4 h-4" />
          เพิ่มเซคชัน
        </button>
      </div>

      {showSelector && (
        <div className="card p-4">
          <p className="text-sm text-stone-500 dark:text-stone-400 mb-3">เลือกประเภทเซคชัน:</p>
          <SectionSelector onSelect={handleAddSection} />
        </div>
      )}

      {sections.length === 0 && !showSelector ? (
        <div className="text-center py-12 text-stone-500 dark:text-stone-400">
          <p>ยังไม่มีเซคชัน คลิก &quot;เพิ่มเซคชัน&quot; เพื่อเริ่มต้น</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sections.map((section, index) => (
            <div key={section.id} className="card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-stone-400 cursor-grab" />
                  <span className="font-medium text-stone-900 dark:text-white capitalize">{section.type}</span>
                  <span className="text-sm text-stone-500">{section.items?.length || 0} รายการ</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveUp(index)} disabled={index === 0} className="p-1.5 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 disabled:opacity-30">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => moveDown(index)} disabled={index === sections.length - 1} className="p-1.5 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 disabled:opacity-30">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button onClick={() => setExpandedId(expandedId === section.id ? null : section.id)} className="p-1.5 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onRemove(section.id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {expandedId === section.id && (
                <SectionEditor section={section} onUpdate={onUpdate} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SectionEditor({ section, onUpdate }: { section: any; onUpdate: (s: any) => void }) {
  const addItem = () => {
    const newItem = { id: Date.now().toString(), title: '', description: '' }
    onUpdate({ ...section, items: [...(section.items || []), newItem] })
  }

  const updateItem = (itemId: string, updates: any) => {
    onUpdate({
      ...section,
      items: section.items.map((i: any) => i.id === itemId ? { ...i, ...updates } : i)
    })
  }

  const removeItem = (itemId: string) => {
    onUpdate({ ...section, items: section.items.filter((i: any) => i.id !== itemId) })
  }

  return (
    <div className="mt-4 space-y-3 pt-4 border-t border-stone-200 dark:border-stone-700">
      {section.items?.map((item: any) => (
        <div key={item.id} className="flex gap-2">
          <input
            type="text"
            value={item.title || ''}
            onChange={(e) => updateItem(item.id, { title: e.target.value })}
            placeholder="Title"
            className="input flex-1"
          />
          <input
            type="text"
            value={item.description || ''}
            onChange={(e) => updateItem(item.id, { description: e.target.value })}
            placeholder="Description"
            className="input flex-1"
          />
          <button onClick={() => removeItem(item.id)} className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button onClick={addItem} className="text-sm text-teal-600 dark:text-teal-400 hover:underline">
        + เพิ่มรายการ
      </button>
    </div>
  )
}
