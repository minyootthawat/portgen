'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import { BuilderEditor } from '@/components/builder/BuilderEditor'
import { createDefaultSection, type Section } from '@/types/builder'

export default function BuilderPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const isNew = params.id === 'new'

  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [theme, setTheme] = useState('gradient-dark')
  const [sections, setSections] = useState<Section[]>([])
  const [userId, setUserId] = useState('')

  useEffect(() => {
    const bootstrap = async () => {
      if (status === 'unauthenticated') {
        router.push('/login')
        return
      }

      if (status === 'loading') return

      // Demo session check
      const demoSession = typeof window !== 'undefined' ? localStorage.getItem('demo_session') : null
      const effectiveUserId = session?.user ? (session.user as any)?.id || session.user.email : demoSession ? JSON.parse(demoSession).id : null

      if (!effectiveUserId && !demoSession) {
        router.push('/login')
        return
      }

      if (isNew) {
        setName('')
        setTheme('gradient-dark')
        // Initialize with an Info section by default
        setSections([createDefaultSection('info')])
        setUserId(effectiveUserId || demoSession ? JSON.parse(demoSession || '{}').id : '')
        setLoading(false)
        return
      }

      // Fetch existing portfolio
      try {
        const res = await fetch(`/api/portfolios/${params.id}`, {
          headers: {
            Authorization: `Bearer ${effectiveUserId}`,
          },
        })
        const json = await res.json()
        if (json.data) {
          const p = json.data
          setName(p.name || '')
          setTheme(p.theme || 'gradient-dark')
          setUserId(p.user_id || effectiveUserId || '')

          // Migrate custom_sections to new format
          if (p.custom_sections && p.custom_sections.length > 0) {
            // Check if already new format (has 'type' and 'data')
            const first = p.custom_sections[0]
            if ('type' in first && 'data' in first) {
              setSections(p.custom_sections)
            } else {
              // Old format — convert to new
              const migrated: Section[] = p.custom_sections.map((cs: any) => {
                const meta: Record<string, string> = {
                  services: 'บริการ', experience: 'ประสบการณ์',
                  education: 'การศึกษา', testimonials: 'รีวิว', certifications: 'ใบรับรอง'
                }
                return {
                  id: cs.id || `sec_${Date.now()}_${Math.random()}`,
                  type: cs.type as Section['type'],
                  title: cs.title || meta[cs.type] || cs.type,
                  collapsed: false,
                  data: {
                    items: cs.items || [],
                  } as any,
                }
              })
              setSections(migrated)
            }
          } else {
            // Initialize with an Info section
            setSections([createDefaultSection('info')])
          }
        } else {
          setSections([createDefaultSection('info')])
        }
      } catch (err) {
        console.error('Failed to load portfolio:', err)
        setSections([createDefaultSection('info')])
      }

      setLoading(false)
    }

    bootstrap()
  }, [params.id, isNew, status, session, router])

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-teal-500" />
          <p className="text-stone-500 dark:text-stone-400 text-sm">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  return (
    <BuilderEditor
      portfolioId={params.id}
      isNew={isNew}
      initialName={name}
      initialTheme={theme}
      initialSections={sections}
      initialSkills={[]}
      initialProjects={[]}
      initialSocial={[]}
      userId={userId}
      onPublishSuccess={() => router.push('/dashboard')}
    />
  )
}
