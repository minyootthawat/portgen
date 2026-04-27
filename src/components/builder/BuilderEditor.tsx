'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft, ChevronDown, ChevronRight, ChevronUp,
  Plus, GripVertical, Trash2, Eye, EyeOff, Rocket,
  Loader2, CheckCircle2, AlertCircle, Monitor, Smartphone,
  Save, X, Edit3
} from 'lucide-react'
import { AddSectionModal } from './AddSectionModal'
import {
  type Section, type SectionType, type InfoData, type SkillsData, type ProjectsData,
  type SocialData, type ServicesData, type ExperienceData, type EducationData,
  type TestimonialsData, type CertificationsData, createDefaultSection, SECTION_TYPE_META
} from '@/types/builder'

// Theme dropdown
const THEMES = [
  { id: 'gradient-dark', name: 'Gradient Dark', preview: 'from-indigo-950 to-purple-950' },
  { id: 'minimal-light', name: 'Minimal Light', preview: 'from-slate-100 to-slate-200' },
  { id: 'brutalist', name: 'Brutalist', preview: 'bg-white border-2 border-black' },
  { id: 'cyberpunk', name: 'Cyberpunk', preview: 'from-purple-950 to-cyan-950' },
  { id: 'nordic', name: 'Nordic', preview: 'from-slate-50 to-blue-50' },
  { id: 'sunset', name: 'Sunset', preview: 'from-orange-500 to-purple-500' },
]

const SUGGESTED_SKILLS = ['React', 'TypeScript', 'Node.js', 'Python', 'Figma', 'AWS', 'Docker', 'GraphQL']

interface Props {
  portfolioId: string
  isNew: boolean
  initialName: string
  initialTheme: string
  initialSections: Section[]
  initialSkills: { id: string; name: string }[]
  initialProjects: { id: string; title: string; description: string; tags: string[]; live_url: string; repo_url: string }[]
  initialSocial: { id: string; platform: string; url: string }[]
  userId: string
  onPublishSuccess: () => void
}

// ─── Drag & Drop helpers ──────────────────────────────────────────────────────

function DragHandle({ sectionId }: { sectionId: string }) {
  const [dragging, setDragging] = useState(false)

  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', sectionId)
    e.dataTransfer.effectAllowed = 'move'
    setDragging(true)
  }

  const onDragEnd = () => setDragging(false)

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`cursor-grab active:cursor-grabbing p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 dark:text-stone-500 transition ${dragging ? 'opacity-40' : ''}`}
    >
      <GripVertical className="w-4 h-4" />
    </div>
  )
}

// ─── Section Editors ──────────────────────────────────────────────────────────

function InfoEditor({ data, onChange }: { data: InfoData; onChange: (d: InfoData) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">ชื่อ</label>
        <input className="input text-sm" value={data.name} onChange={e => onChange({ ...data, name: e.target.value })} placeholder="เช่น สมชาย ดีเจริญ" />
      </div>
      <div>
        <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">แท็กไลน์</label>
        <input className="input text-sm" value={data.tagline} onChange={e => onChange({ ...data, tagline: e.target.value })} placeholder="Full-Stack Developer" />
      </div>
      <div>
        <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">เกี่ยวกับคุณ</label>
        <textarea className="input text-sm resize-none" rows={4} value={data.about} onChange={e => onChange({ ...data, about: e.target.value })} placeholder="แนะนำตัวสั้นๆ..." />
      </div>
      <div>
        <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">URL รูปโปรไฟล์</label>
        <input className="input text-sm" type="url" value={data.avatar_url} onChange={e => onChange({ ...data, avatar_url: e.target.value })} placeholder="https://..." />
      </div>
    </div>
  )
}

function SkillsEditor({ data, onChange }: { data: SkillsData; onChange: (d: SkillsData) => void }) {
  const [inputVal, setInputVal] = useState('')

  const addSkill = (name: string) => {
    if (!name.trim()) return
    if (data.items.find(i => i.name.toLowerCase() === name.trim().toLowerCase())) return
    onChange({ items: [...data.items, { id: `sk_${Date.now()}`, name: name.trim() }] })
  }

  const removeSkill = (id: string) => {
    onChange({ items: data.items.filter(i => i.id !== id) })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill(inputVal)
      setInputVal('')
    }
  }

  const existingNames = new Set(data.items.map(i => i.name.toLowerCase()))
  const suggestions = SUGGESTED_SKILLS.filter(s => !existingNames.has(s.toLowerCase())).slice(0, 6)

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          className="input text-sm flex-1"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="พิมพ์ทักษะแล้วกด Enter"
        />
        {inputVal.trim() && (
          <button onClick={() => { addSkill(inputVal); setInputVal('') }} className="btn-secondary text-sm shrink-0">
            เพิ่ม
          </button>
        )}
      </div>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map(s => (
            <button key={s} onClick={() => addSkill(s)} className="px-2.5 py-1 rounded-full border border-dashed border-stone-300 dark:border-stone-600 text-xs text-stone-500 dark:text-stone-400 hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-400 transition">
              + {s}
            </button>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {data.items.map(item => (
          <span key={item.id} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm">
            {item.name}
            <button onClick={() => removeSkill(item.id)} className="hover:text-teal-900 dark:hover:text-teal-200">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      {data.items.length === 0 && (
        <p className="text-sm text-stone-400 dark:text-stone-500 py-2">ยังไม่มีทักษะ — พิมพ์ด้านบนเพื่อเพิ่ม</p>
      )}
    </div>
  )
}

function ProjectsEditor({ data, onChange }: { data: ProjectsData; onChange: (d: ProjectsData) => void }) {
  const addProject = () => {
    onChange({ items: [...data.items, { id: `proj_${Date.now()}`, title: '', description: '', tags: [], live_url: '', repo_url: '' }] })
  }

  const updateItem = (id: string, updates: Partial<ProjectsData['items'][0]>) => {
    onChange({ items: data.items.map(i => i.id === id ? { ...i, ...updates } : i) })
  }

  const removeItem = (id: string) => {
    onChange({ items: data.items.filter(i => i.id !== id) })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={addProject} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> เพิ่มโปรเจกต์
        </button>
      </div>
      {data.items.map((item, i) => (
        <div key={item.id} className="card p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">โปรเจกต์ {i + 1}</span>
            <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 text-xs transition">ลบ</button>
          </div>
          <input className="input text-sm" value={item.title} onChange={e => updateItem(item.id, { title: e.target.value })} placeholder="ชื่อโปรเจกต์" />
          <textarea className="input text-sm resize-none" rows={2} value={item.description} onChange={e => updateItem(item.id, { description: e.target.value })} placeholder="คำอธิบายโปรเจกต์" />
          <input className="input text-sm" value={item.live_url} onChange={e => updateItem(item.id, { live_url: e.target.value })} placeholder="URL เว็บไซต์" />
          <input className="input text-sm" value={item.repo_url} onChange={e => updateItem(item.id, { repo_url: e.target.value })} placeholder="GitHub URL" />
        </div>
      ))}
      {data.items.length === 0 && (
        <div className="text-center py-8 text-stone-400 dark:text-stone-500">
          <p className="text-sm">ยังไม่มีโปรเจกต์ — คลิก &quot;เพิ่มโปรเจกต์&quot; เพื่อเริ่มต้น</p>
        </div>
      )}
    </div>
  )
}

function SocialEditor({ data, onChange }: { data: SocialData; onChange: (d: SocialData) => void }) {
  const [platform, setPlatform] = useState('github')
  const [url, setUrl] = useState('')
  const platforms = ['github', 'linkedin', 'twitter', 'email', 'website', 'facebook', 'instagram', 'youtube', 'tiktok']

  const addLink = () => {
    if (!url.trim()) return
    onChange({ items: [...data.items, { id: `soc_${Date.now()}`, platform, url: url.trim() }] })
    setUrl('')
  }

  const removeItem = (id: string) => onChange({ items: data.items.filter(i => i.id !== id) })

  return (
    <div className="space-y-3">
      <form onSubmit={e => { e.preventDefault(); addLink() }} className="flex gap-2">
        <select value={platform} onChange={e => setPlatform(e.target.value)} className="input text-sm w-auto">
          {platforms.map(p => <option key={p} value={p} className="capitalize">{p}</option>)}
        </select>
        <input className="input text-sm flex-1" type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
        <button type="submit" className="btn-primary text-sm">เพิ่ม</button>
      </form>
      <div className="space-y-2">
        {data.items.map(link => (
          <div key={link.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 group">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-white dark:bg-stone-700 flex items-center justify-center text-xs font-bold text-stone-500 dark:text-stone-300 uppercase">{link.platform[0]}</span>
              <div className="min-w-0">
                <span className="text-sm font-medium text-stone-700 dark:text-stone-200 capitalize">{link.platform}</span>
                <span className="text-xs text-stone-400 dark:text-stone-500 block truncate max-w-xs">{link.url}</span>
              </div>
            </div>
            <button onClick={() => removeItem(link.id)} className="text-stone-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function ServicesEditor({ data, onChange }: { data: ServicesData; onChange: (d: ServicesData) => void }) {
  const addItem = () => {
    onChange({ items: [...data.items, { id: `svc_${Date.now()}`, title: '', description: '', icon: '' }] })
  }
  const updateItem = (id: string, updates: Partial<ServicesData['items'][0]>) => {
    onChange({ items: data.items.map(i => i.id === id ? { ...i, ...updates } : i) })
  }
  const removeItem = (id: string) => onChange({ items: data.items.filter(i => i.id !== id) })

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={addItem} className="btn-primary text-sm"><Plus className="w-4 h-4" /> เพิ่มบริการ</button>
      </div>
      {data.items.map(item => (
        <div key={item.id} className="card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <input className="input text-sm flex-1" value={item.title} onChange={e => updateItem(item.id, { title: e.target.value })} placeholder="ชื่อบริการ" />
            <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 ml-2"><Trash2 className="w-4 h-4" /></button>
          </div>
          <textarea className="input text-sm resize-none" rows={2} value={item.description} onChange={e => updateItem(item.id, { description: e.target.value })} placeholder="คำอธิบายบริการ" />
          <input className="input text-sm" value={item.icon} onChange={e => updateItem(item.id, { icon: e.target.value })} placeholder="ไอคอน (emoji หรือชื่อ)" />
        </div>
      ))}
      {data.items.length === 0 && <p className="text-sm text-stone-400 dark:text-stone-500 text-center py-4">ยังไม่มีบริการ</p>}
    </div>
  )
}

function ExperienceEditor({ data, onChange }: { data: ExperienceData; onChange: (d: ExperienceData) => void }) {
  const addItem = () => {
    onChange({ items: [...data.items, { id: `exp_${Date.now()}`, company: '', role: '', period: '', description: '', current: false }] })
  }
  const updateItem = (id: string, updates: Partial<ExperienceData['items'][0]>) => {
    onChange({ items: data.items.map(i => i.id === id ? { ...i, ...updates } : i) })
  }
  const removeItem = (id: string) => onChange({ items: data.items.filter(i => i.id !== id) })

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={addItem} className="btn-primary text-sm"><Plus className="w-4 h-4" /> เพิ่มประสบการณ์</button>
      </div>
      {data.items.map(item => (
        <div key={item.id} className="card p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-stone-700 dark:text-stone-200">{item.company || 'ประสบการณ์ใหม่'}</span>
            <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className="input text-sm" value={item.company} onChange={e => updateItem(item.id, { company: e.target.value })} placeholder="บริษัท" />
            <input className="input text-sm" value={item.role} onChange={e => updateItem(item.id, { role: e.target.value })} placeholder="ตำแหน่ง" />
          </div>
          <input className="input text-sm" value={item.period} onChange={e => updateItem(item.id, { period: e.target.value })} placeholder="ระยะเวลา เช่น ม.ค. 2020 - ปัจจุบัน" />
          <textarea className="input text-sm resize-none" rows={2} value={item.description} onChange={e => updateItem(item.id, { description: e.target.value })} placeholder="รายละเอียดงาน" />
          <label className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400 cursor-pointer">
            <input type="checkbox" checked={item.current} onChange={e => updateItem(item.id, { current: e.target.checked })} className="rounded" />
            ทำงานอยู่ปัจจุบัน
          </label>
        </div>
      ))}
      {data.items.length === 0 && <p className="text-sm text-stone-400 dark:text-stone-500 text-center py-4">ยังไม่มีประสบการณ์</p>}
    </div>
  )
}

function EducationEditor({ data, onChange }: { data: EducationData; onChange: (d: EducationData) => void }) {
  const addItem = () => {
    onChange({ items: [...data.items, { id: `edu_${Date.now()}`, school: '', degree: '', period: '', description: '' }] })
  }
  const updateItem = (id: string, updates: Partial<EducationData['items'][0]>) => {
    onChange({ items: data.items.map(i => i.id === id ? { ...i, ...updates } : i) })
  }
  const removeItem = (id: string) => onChange({ items: data.items.filter(i => i.id !== id) })

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={addItem} className="btn-primary text-sm"><Plus className="w-4 h-4" /> เพิ่มการศึกษา</button>
      </div>
      {data.items.map(item => (
        <div key={item.id} className="card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-stone-700 dark:text-stone-200">{item.school || 'การศึกษาใหม่'}</span>
            <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
          </div>
          <input className="input text-sm" value={item.school} onChange={e => updateItem(item.id, { school: e.target.value })} placeholder="สถานศึกษา" />
          <input className="input text-sm" value={item.degree} onChange={e => updateItem(item.id, { degree: e.target.value })} placeholder="วุฒิ / สาขา" />
          <input className="input text-sm" value={item.period} onChange={e => updateItem(item.id, { period: e.target.value })} placeholder="ระยะเวลา" />
          <textarea className="input text-sm resize-none" rows={2} value={item.description} onChange={e => updateItem(item.id, { description: e.target.value })} placeholder="รายละเอียดเพิ่มเติม" />
        </div>
      ))}
      {data.items.length === 0 && <p className="text-sm text-stone-400 dark:text-stone-500 text-center py-4">ยังไม่มีการศึกษา</p>}
    </div>
  )
}

function TestimonialsEditor({ data, onChange }: { data: TestimonialsData; onChange: (d: TestimonialsData) => void }) {
  const addItem = () => {
    onChange({ items: [...data.items, { id: `test_${Date.now()}`, quote: '', author: '', authorRole: '', authorCompany: '' }] })
  }
  const updateItem = (id: string, updates: Partial<TestimonialsData['items'][0]>) => {
    onChange({ items: data.items.map(i => i.id === id ? { ...i, ...updates } : i) })
  }
  const removeItem = (id: string) => onChange({ items: data.items.filter(i => i.id !== id) })

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={addItem} className="btn-primary text-sm"><Plus className="w-4 h-4" /> เพิ่มรีวิว</button>
      </div>
      {data.items.map(item => (
        <div key={item.id} className="card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-500 dark:text-stone-400">รีวิว {item.author || 'ใหม่'}</span>
            <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
          </div>
          <textarea className="input text-sm resize-none" rows={3} value={item.quote} onChange={e => updateItem(item.id, { quote: e.target.value })} placeholder="&quot;คำรีวิว...&quot;" />
          <input className="input text-sm" value={item.author} onChange={e => updateItem(item.id, { author: e.target.value })} placeholder="ชื่อผู้รีวิว" />
          <div className="grid grid-cols-2 gap-2">
            <input className="input text-sm" value={item.authorRole} onChange={e => updateItem(item.id, { authorRole: e.target.value })} placeholder="ตำแหน่ง" />
            <input className="input text-sm" value={item.authorCompany} onChange={e => updateItem(item.id, { authorCompany: e.target.value })} placeholder="บริษัท" />
          </div>
        </div>
      ))}
      {data.items.length === 0 && <p className="text-sm text-stone-400 dark:text-stone-500 text-center py-4">ยังไม่มีรีวิว</p>}
    </div>
  )
}

function CertificationsEditor({ data, onChange }: { data: CertificationsData; onChange: (d: CertificationsData) => void }) {
  const addItem = () => {
    onChange({ items: [...data.items, { id: `cert_${Date.now()}`, name: '', issuer: '', year: '', url: '' }] })
  }
  const updateItem = (id: string, updates: Partial<CertificationsData['items'][0]>) => {
    onChange({ items: data.items.map(i => i.id === id ? { ...i, ...updates } : i) })
  }
  const removeItem = (id: string) => onChange({ items: data.items.filter(i => i.id !== id) })

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={addItem} className="btn-primary text-sm"><Plus className="w-4 h-4" /> เพิ่มใบรับรอง</button>
      </div>
      {data.items.map(item => (
        <div key={item.id} className="card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-stone-700 dark:text-stone-200">{item.name || 'ใบรับรองใหม่'}</span>
            <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
          </div>
          <input className="input text-sm" value={item.name} onChange={e => updateItem(item.id, { name: e.target.value })} placeholder="ชื่อใบรับรอง" />
          <div className="grid grid-cols-2 gap-2">
            <input className="input text-sm" value={item.issuer} onChange={e => updateItem(item.id, { issuer: e.target.value })} placeholder="ผู้ออก" />
            <input className="input text-sm" value={item.year} onChange={e => updateItem(item.id, { year: e.target.value })} placeholder="ปี" />
          </div>
          <input className="input text-sm" value={item.url} onChange={e => updateItem(item.id, { url: e.target.value })} placeholder="URL (ถ้ามี)" />
        </div>
      ))}
      {data.items.length === 0 && <p className="text-sm text-stone-400 dark:text-stone-500 text-center py-4">ยังไม่มีใบรับรอง</p>}
    </div>
  )
}

function SectionEditorRenderer({ section, onUpdate }: { section: Section; onUpdate: (s: Section) => void }) {
  const updateData = (data: Section['data']) => onUpdate({ ...section, data })

  switch (section.type) {
    case 'info': return <InfoEditor data={section.data as InfoData} onChange={updateData} />
    case 'skills': return <SkillsEditor data={section.data as SkillsData} onChange={updateData} />
    case 'projects': return <ProjectsEditor data={section.data as ProjectsData} onChange={updateData} />
    case 'social': return <SocialEditor data={section.data as SocialData} onChange={updateData} />
    case 'services': return <ServicesEditor data={section.data as ServicesData} onChange={updateData} />
    case 'experience': return <ExperienceEditor data={section.data as ExperienceData} onChange={updateData} />
    case 'education': return <EducationEditor data={section.data as EducationData} onChange={updateData} />
    case 'testimonials': return <TestimonialsEditor data={section.data as TestimonialsData} onChange={updateData} />
    case 'certifications': return <CertificationsEditor data={section.data as CertificationsData} onChange={updateData} />
    default: return null
  }
}

// ─── Portfolio Preview (inline mini) ─────────────────────────────────────────

function MiniPreview({ sections, theme }: { sections: Section[]; theme: string }) {
  const infoSection = sections.find(s => s.type === 'info')?.data as InfoData | undefined
  const skillsSection = sections.find(s => s.type === 'skills')?.data as SkillsData | undefined
  const projectsSection = sections.find(s => s.type === 'projects')?.data as ProjectsData | undefined
  const socialSection = sections.find(s => s.type === 'social')?.data as SocialData | undefined
  const name = infoSection?.name || 'Your Name'
  const tagline = infoSection?.tagline || 'Your tagline'

  return (
    <div className="h-full flex flex-col bg-stone-100 dark:bg-slate-900">
      <div className="px-4 py-3 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between">
        <span className="text-sm text-stone-500 dark:text-slate-400">Live Preview</span>
        <span className="text-xs text-stone-400 dark:text-slate-500 font-mono">portgen.com</span>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-xl mx-auto">
          <div className={`rounded-xl overflow-hidden border border-slate-700 ${theme === 'gradient-dark' ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950' : theme === 'minimal-light' ? 'bg-gradient-to-br from-slate-100 to-slate-200' : theme === 'brutalist' ? 'bg-white border-2 border-black' : theme === 'cyberpunk' ? 'bg-gradient-to-br from-purple-950 via-slate-950 to-cyan-950' : theme === 'nordic' ? 'bg-gradient-to-br from-slate-50 to-blue-50' : theme === 'sunset' ? 'bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500' : 'bg-slate-900'} shadow-2xl`}>
            <div className="px-4 py-2 bg-slate-800/50 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-slate-700/50 rounded px-3 py-0.5 text-xs text-slate-400 text-center">portgen.com</div>
              </div>
            </div>
            <div className="p-8 min-h-[400px]">
              <div className="text-center mb-6">
                {infoSection?.avatar_url ? (
                  <img src={infoSection.avatar_url} alt={name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-white/20" />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-3xl font-bold text-white">
                    {name.charAt(0) || 'A'}
                  </div>
                )}
                <h1 className="text-2xl font-bold text-white mb-1">{name}</h1>
                <p className="text-slate-400 text-sm">{tagline}</p>
              </div>
              {infoSection?.about && (
                <div className="text-center mb-6 px-4">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {infoSection.about.length > 100 ? infoSection.about.slice(0, 100) + '...' : infoSection.about}
                  </p>
                </div>
              )}
              {skillsSection && skillsSection.items.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap justify-center gap-2">
                    {skillsSection.items.slice(0, 6).map(skill => (
                      <span key={skill.id} className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 text-xs border border-sky-500/30">{skill.name}</span>
                    ))}
                  </div>
                </div>
              )}
              {projectsSection && projectsSection.items.length > 0 && (
                <div className="space-y-3 mb-6">
                  <div className="text-center text-xs text-slate-500 uppercase tracking-wider mb-3">Projects</div>
                  {projectsSection.items.slice(0, 2).map(proj => (
                    <div key={proj.id} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                      <h3 className="text-sm font-medium text-white mb-1">{proj.title || 'Project'}</h3>
                      <p className="text-xs text-slate-400">{proj.description?.slice(0, 80) || 'Description'}</p>
                    </div>
                  ))}
                </div>
              )}
              {socialSection && socialSection.items.length > 0 && (
                <div className="flex justify-center gap-2 flex-wrap">
                  {socialSection.items.slice(0, 4).map(link => (
                    <span key={link.id} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs capitalize border border-slate-700">{link.platform}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="px-8 py-4 bg-slate-800/30 text-center">
              <span className="text-xs text-slate-600">Built with PortGen</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main BuilderEditor ───────────────────────────────────────────────────────

export function BuilderEditor({
  portfolioId, isNew, initialName, initialTheme, initialSections,
  initialSkills, initialProjects, initialSocial, userId, onPublishSuccess
}: Props) {
  const [name, setName] = useState(initialName)
  const [editingName, setEditingName] = useState(false)
  const [theme, setTheme] = useState(initialTheme)
  const [sections, setSections] = useState<Section[]>(initialSections)
  const [showPreview, setShowPreview] = useState(true)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'phone'>('desktop')
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [publishing, setPublishing] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  // ─── Section Management ──────────────────────────────────────────────────

  const addSection = (type: SectionType) => {
    const newSection = createDefaultSection(type)
    setSections(prev => [...prev, newSection])
    setShowAddModal(false)
  }

  const updateSection = useCallback((updated: Section) => {
    setSections(prev => prev.map(s => s.id === updated.id ? updated : s))
  }, [])

  const removeSection = (id: string) => {
    setSections(prev => prev.filter(s => s.id !== id))
  }

  const toggleCollapse = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, collapsed: !s.collapsed } : s))
  }

  // ─── Drag & Drop Reorder ─────────────────────────────────────────────────

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    const sourceId = e.dataTransfer.getData('text/plain')
    if (!sourceId || sourceId === targetId) return

    setSections(prev => {
      const next = [...prev]
      const srcIdx = next.findIndex(s => s.id === sourceId)
      const tgtIdx = next.findIndex(s => s.id === targetId)
      if (srcIdx === -1 || tgtIdx === -1) return prev
      const [removed] = next.splice(srcIdx, 1)
      next.splice(tgtIdx, 0, removed)
      return next
    })
    setDraggedId(null)
  }

  // ─── Auto-save ────────────────────────────────────────────────────────────

  const triggerAutoSave = useCallback(async () => {
    if (isNew || !name.trim()) return
    setAutoSaveStatus('saving')
    try {
      const payload: Record<string, unknown> = { name, theme, custom_sections: sections }
      const res = await fetch(`/api/portfolios/${portfolioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userId}` },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setAutoSaveStatus('saved')
      setTimeout(() => setAutoSaveStatus('idle'), 2000)
    } catch {
      setAutoSaveStatus('idle')
    }
  }, [isNew, name, theme, sections, portfolioId, userId])

  useEffect(() => {
    if (isNew || !name.trim()) return
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(triggerAutoSave, 300)
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current) }
  }, [name, theme, sections])

  // ─── Publish ──────────────────────────────────────────────────────────────

  const handlePublish = async () => {
    if (!name.trim()) {
      showToast('error', 'กรุณาเพิ่มชื่อของคุณก่อน!')
      return
    }
    setPublishing(true)
    try {
      let id = portfolioId
      if (isNew) {
        const payload = { name, theme, custom_sections: sections }
        const res = await fetch('/api/portfolios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userId}` },
          body: JSON.stringify(payload),
        })
        const json = await res.json()
        if (json.error) throw new Error(json.error)
        id = json.data?.id
        // Update URL without reload
        window.history.replaceState(null, '', `/builder/${id}`)
      }
      if (id) {
        await fetch(`/api/portfolios/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userId}` },
          body: JSON.stringify({ is_published: true }),
        })
        showToast('success', 'พอร์ตโฟลิโอเผยแพร่แล้ว!')
        setTimeout(() => router.push(`/builder/${id}/success`), 1500)
      }
    } catch (err: any) {
      showToast('error', err.message)
    }
    setPublishing(false)
  }

  // ─── Theme ────────────────────────────────────────────────────────────────

  const themeOptions = THEMES.map(t => ({ value: t.id, label: t.name }))

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
      {/* Nav Bar */}
      <nav className="bg-white dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="flex items-center gap-1 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
            แดชบอร์ด
          </button>
          <span className="text-stone-300 dark:text-stone-600 hidden sm:block">|</span>
          {editingName ? (
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={e => e.key === 'Enter' && setEditingName(false)}
              className="input text-sm py-1 px-2 max-w-[200px]"
            />
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="flex items-center gap-1 text-sm font-medium text-stone-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition max-w-[200px] truncate"
            >
              {name || 'พอร์ตโฟลิโอใหม่'}
              <Edit3 className="w-3 h-3 text-stone-400 shrink-0" />
            </button>
          )}
          {/* Auto-save */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            {autoSaveStatus === 'saving' && (
              <><Loader2 className="w-3 h-3 animate-spin text-stone-400" /><span className="text-stone-400">กำลังบันทึก...</span></>
            )}
            {autoSaveStatus === 'saved' && (
              <><CheckCircle2 className="w-3 h-3 text-teal-500 animate-checkmark" /><span className="text-teal-600 dark:text-teal-400">✓ บันทึกแล้ว</span></>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Preview mode toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-stone-100 dark:bg-stone-800 mr-1">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`p-1.5 rounded-md transition ${previewMode === 'desktop' ? 'bg-white dark:bg-stone-700 shadow-sm text-stone-900 dark:text-white' : 'text-stone-400 hover:text-stone-600'}`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('phone')}
              className={`p-1.5 rounded-md transition ${previewMode === 'phone' ? 'bg-white dark:bg-stone-700 shadow-sm text-stone-900 dark:text-white' : 'text-stone-400 hover:text-stone-600'}`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowPreview(v => !v)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
              showPreview ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300'
            }`}
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden sm:inline">{showPreview ? 'ซ่อน' : 'ตัวอย่าง'}</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={publishing}
            className="btn-primary text-sm shadow-sm"
          >
            {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
            <span className="hidden sm:inline">เผยแพร่</span>
          </button>
        </div>
      </nav>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-top-2 ${
          toast.type === 'success' ? 'bg-teal-50 dark:bg-teal-900/90 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700' : 'bg-red-50 dark:bg-red-900/90 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-1 hover:opacity-70"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* Add Section Modal */}
      {showAddModal && <AddSectionModal onClose={() => setShowAddModal(false)} onAdd={addSection} />}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── Left: Editor Panel ── */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col overflow-hidden border-r border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900`}>
          {/* Editor Header: Theme Selector */}
          <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <span className="text-sm font-medium text-stone-700 dark:text-stone-200">ธีม</span>
            <select
              value={theme}
              onChange={e => setTheme(e.target.value)}
              className="input text-sm py-1.5 w-auto"
            >
              {themeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Section List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {sections.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <p className="text-stone-500 dark:text-stone-400 mb-1">ยังไม่มีเซคชัน</p>
                <p className="text-sm text-stone-400 dark:text-stone-500">คลิกปุ่มด้านล่างเพื่อเพิ่มเซคชันแรก</p>
              </div>
            ) : (
              sections.map((section, index) => (
                <div
                  key={section.id}
                  onDragOver={handleDragOver}
                  onDrop={e => handleDrop(e, section.id)}
                  className={`card overflow-hidden transition-all ${draggedId === section.id ? 'opacity-40' : ''}`}
                >
                  {/* Section Header */}
                  <div className="flex items-center gap-2 px-4 py-3">
                    <DragHandle sectionId={section.id} />
                    <span className="text-lg">{SECTION_TYPE_META[section.type].icon}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-stone-700 dark:text-stone-200">{section.title}</span>
                      <span className="text-xs text-stone-400 dark:text-stone-500 ml-2">
                        {section.type === 'info' && `${((section.data as InfoData).name || 'ไม่มีชื่อ').substring(0, 20)}`}
                        {section.type === 'skills' && `${(section.data as SkillsData).items.length} ทักษะ`}
                        {section.type === 'projects' && `${(section.data as ProjectsData).items.length} โปรเจกต์`}
                        {section.type === 'social' && `${(section.data as SocialData).items.length} ลิงก์`}
                        {!['info', 'skills', 'projects', 'social'].includes(section.type) && `${SECTION_TYPE_META[section.type].description}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleCollapse(section.id)}
                        className="p-1.5 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 transition"
                      >
                        {section.collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => removeSection(section.id)}
                        className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Section Editor */}
                  {!section.collapsed && (
                    <div className="px-4 pb-4 border-t border-stone-100 dark:border-stone-800 pt-3">
                      <SectionEditorRenderer section={section} onUpdate={updateSection} />
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Add Section Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-600 text-stone-500 dark:text-stone-400 hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/10 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">เพิ่มเซคชัน</span>
            </button>
          </div>
        </div>

        {/* ── Right: Preview Panel ── */}
        {showPreview && (
          <div className="w-1/2 overflow-hidden bg-stone-50 dark:bg-stone-950">
            {previewMode === 'phone' ? (
              <div className="flex items-start justify-center pt-8">
                <div className="w-64 phone-frame flex-shrink-0">
                  <div className="overflow-hidden rounded-[20px]">
                    <MiniPreview sections={sections} theme={theme} />
                  </div>
                </div>
              </div>
            ) : (
              <MiniPreview sections={sections} theme={theme} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
