'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/i18n/context'
import { useBuilderStore } from '@/lib/store'
import { supabase, getSession, getPortfolio, createPortfolio, updatePortfolio, publishPortfolio } from '@/lib/supabase'
import { Eye, Save, Rocket, ChevronLeft, ChevronRight, Code, Check, Loader2, X, AlertCircle, CheckCircle2, Smartphone, Monitor, Sparkles } from 'lucide-react'
import { BuilderSteps } from '@/components/builder/BuilderSteps'
import { ThemeSelector } from '@/components/builder/ThemeSelector'
import dynamic from 'next/dynamic'

// Lazy-load heavy components that are conditionally rendered
const JSXEditor = dynamic(() => import('@/components/builder/JSXEditor').then((m) => m.JSXEditor), {
  loading: () => <div className="flex items-center justify-center h-full text-stone-400 text-sm">Setting up your editor...</div>,
})
const PortfolioPreview = dynamic(() => import('@/components/builder/PortfolioPreview').then((m) => m.PortfolioPreview), {
  loading: () => <div className="flex items-center justify-center h-full text-stone-400 text-sm">Loading preview...</div>,
})
import type { Translations } from '@/locales/en'
import type { BuilderStep } from '@/types'

const STEPS: BuilderStep[] = ['info', 'skills', 'projects', 'social', 'theme', 'preview']

const SUGGESTED_SKILLS = ['React', 'TypeScript', 'Node.js', 'Python', 'Figma', 'AWS', 'Docker', 'GraphQL', 'PostgreSQL', 'Next.js', 'Vue.js', 'Go', 'Rust', 'MongoDB', 'Redis']

export default function BuilderPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { t } = useI18n()
  const isNew = params.id === 'new'
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showJSXEditor, setShowJSXEditor] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [autoSaveTime, setAutoSaveTime] = useState<Date | null>(null)
  const [stepKey, setStepKey] = useState(0)
  const [prevStep, setPrevStep] = useState<BuilderStep | null>(null)
  const [celebratingStep, setCelebratingStep] = useState(false)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'phone'>('desktop')

  const { portfolio, setStep, step, updatePortfolio: updateStore, reset } = useBuilderStore()
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const prevStepRef = useRef<BuilderStep | null>(null)

  useEffect(() => {
    prevStepRef.current = step
  })

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await getSession()

      // Demo mode: skip auth, use mock session
      if (!session) {
        const demoSession = typeof window !== 'undefined' ? localStorage.getItem('demo_session') : null
        if (demoSession) {
          const demoUser = JSON.parse(demoSession)
          updateStore({
            user_id: demoUser.id,
            name: demoUser.name,
            tagline: demoUser.tagline,
            about: demoUser.about || '',
            skills: demoUser.skills || [],
            projects: demoUser.projects || [],
            social_links: demoUser.social_links || [],
            theme: 'gradient-dark',
            theme_config: {},
          })
          setLoading(false)
          return
        }
        router.push('/login')
        return
      }

      if (!isNew) {
        const { data } = await getPortfolio(params.id)
        if (data) {
          updateStore(data)
        }
      } else {
        reset()
        updateStore({
          user_id: session.user.id,
          name: '',
          tagline: '',
          about: '',
          skills: [],
          projects: [],
          social_links: [],
          theme: 'gradient-dark',
          theme_config: {},
        })
      }
      setLoading(false)
    }
    load()
  }, [params.id, isNew, router, updateStore, reset])

  // Auto-save
  const triggerAutoSave = useCallback(async () => {
    if (isNew || !portfolio.name) return
    setAutoSaveStatus('saving')
    try {
      const { error } = await updatePortfolio(params.id, portfolio)
      if (error) throw error
      setAutoSaveStatus('saved')
      setAutoSaveTime(new Date())
      setTimeout(() => setAutoSaveStatus('idle'), 3000)
    } catch {
      setAutoSaveStatus('idle')
    }
  }, [isNew, portfolio, params.id])

  // Watch for changes and trigger auto-save
  useEffect(() => {
    if (isNew || !portfolio.name) return
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current)
    autoSaveTimerRef.current = setTimeout(() => {
      triggerAutoSave()
    }, 3000)
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current)
    }
  }, [portfolio.name, portfolio.tagline, portfolio.about, portfolio.skills, portfolio.projects, portfolio.social_links])

  const stepIndex = STEPS.indexOf(step)

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (isNew) {
        const { data, error } = await createPortfolio(portfolio)
        if (error) throw error
        router.replace(`/builder/${data.id}`)
      } else {
        const { error } = await updatePortfolio(params.id, portfolio)
        if (error) throw error
      }
      setAutoSaveStatus('saved')
      setAutoSaveTime(new Date())
      showToast('success', isNew ? t.builder.portfolioSaved : t.builder.changesSaved)
    } catch (err: any) {
      showToast('error', err.message)
    }
    setSaving(false)
  }

  const handlePublish = async () => {
    if (!portfolio.name) {
      showToast('error', t.builder.pleaseAddName)
      setStep('info')
      return
    }
    if (!isNew) {
      await handleSave()
    }
    setPublishing(true)
    try {
      const id = isNew ? (await createPortfolio(portfolio)).data?.id : params.id
      if (id) {
        await publishPortfolio(id)
        showToast('success', t.builder.portfolioPublished)
        router.push('/dashboard')
      }
    } catch (err: any) {
      showToast('error', err.message)
    }
    setPublishing(false)
  }

  const navigateToStep = (newStep: BuilderStep) => {
    const oldStep = step
    setPrevStep(oldStep)
    setStep(newStep)
    setStepKey((k) => k + 1)

    // Trigger celebration on step completion
    if (STEPS.indexOf(newStep) > STEPS.indexOf(oldStep)) {
      setCelebratingStep(true)
      setTimeout(() => setCelebratingStep(false), 1500)
    }
  }

  const nextStep = () => {
    if (stepIndex < STEPS.length - 1) navigateToStep(STEPS[stepIndex + 1])
  }

  const prevStepNav = () => {
    if (stepIndex > 0) navigateToStep(STEPS[stepIndex - 1])
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl skeleton mx-auto mb-4" />
          <div className="space-y-2 w-32 mx-auto">
            <div className="h-3 skeleton rounded" />
            <div className="h-3 skeleton rounded w-3/4 mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col">
      {/* Builder Nav */}
      <nav className="bg-white dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
            {t.builder.dashboard}
          </button>
          <span className="text-stone-300 dark:text-stone-600">|</span>
          <span className="font-medium text-stone-900 dark:text-white text-sm max-w-[200px] truncate">
            {isNew ? t.builder.new : `${t.builder.editing} ${portfolio.name || t.builder.untitled}`}
          </span>

          {/* Auto-save indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            {autoSaveStatus === 'saving' && (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-stone-400" />
                <span className="text-stone-400">Saving...</span>
              </>
            )}
            {autoSaveStatus === 'saved' && (
              <>
                <CheckCircle2 className="w-3 h-3 text-teal-500 animate-checkmark" />
                <span className="text-teal-600 dark:text-teal-400">
                  Saved {autoSaveTime ? `at ${autoSaveTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Preview mode toggle */}
          {(showPreview || showJSXEditor) && (
            <div className="flex items-center gap-1 p-1 rounded-lg bg-stone-100 dark:bg-stone-800 mr-1">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`p-1.5 rounded-md transition ${previewMode === 'desktop' ? 'bg-white dark:bg-stone-700 shadow-sm text-stone-900 dark:text-white' : 'text-stone-400 hover:text-stone-600'}`}
                title="Desktop preview"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewMode('phone')}
                className={`p-1.5 rounded-md transition ${previewMode === 'phone' ? 'bg-white dark:bg-stone-700 shadow-sm text-stone-900 dark:text-white' : 'text-stone-400 hover:text-stone-600'}`}
                title="Phone preview"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={() => setShowJSXEditor(!showJSXEditor)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
              showJSXEditor ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300'
            }`}
          >
            <Code className="w-4 h-4" />
            <span className="hidden sm:inline">{t.builder.jsxEditor}</span>
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
              showPreview ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">{showPreview ? t.builder.hidePreview : 'Preview'}</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-secondary text-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span className="hidden sm:inline">{t.builder.save}</span>
          </button>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="btn-primary text-sm shadow-sm"
          >
            {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
            <span className="hidden sm:inline">{t.builder.publish}</span>
          </button>
        </div>
      </nav>

      {/* Celebration banner */}
      {celebratingStep && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500 text-white text-sm font-semibold shadow-lg">
            <Sparkles className="w-4 h-4" />
            Step complete! Keep going!
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-top-2 duration-200 ${
            toast.type === 'success'
              ? 'bg-teal-50 dark:bg-teal-900/90 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700'
              : 'bg-red-50 dark:bg-red-900/90 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-1 hover:opacity-70">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Builder Panel */}
        <div className={`${showPreview || showJSXEditor ? 'w-1/2' : 'w-full'} border-r border-stone-200 dark:border-stone-800 overflow-y-auto bg-white dark:bg-stone-900`}>
          {/* Step Indicator */}
          <div className="p-6 border-b border-stone-100 dark:border-stone-800">
            <BuilderSteps currentStep={step} onStepClick={(s) => navigateToStep(s)} />
          </div>

          {/* Step Content with animation */}
          <div key={stepKey} className="p-6 animate-fade-in">
            <BuilderStepContent
              step={step}
              portfolio={portfolio}
              updatePortfolio={updateStore}
              t={t}
              onPublish={handlePublish}
              isPublishing={publishing}
            />
          </div>

          {/* Navigation */}
          <div className="p-6 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between bg-white dark:bg-stone-900">
            <button
              onClick={prevStepNav}
              disabled={stepIndex === 0}
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition text-sm disabled:opacity-30 disabled:cursor-not-allowed text-stone-700 dark:text-stone-200"
            >
              <ChevronLeft className="w-4 h-4" />
              {t.builder.previous}
            </button>
            <span className="text-sm text-stone-400 dark:text-stone-500">
              {t.builder.stepOf} {stepIndex + 1} {t.builder.of} {STEPS.length}
            </span>
            {stepIndex < STEPS.length - 1 ? (
              <button
                onClick={nextStep}
                className="btn-primary text-sm"
              >
                {t.common.next}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handlePublish}
                className="btn-primary text-sm"
              >
                <Rocket className="w-4 h-4" />
                {t.builder.previewStep.publishNow}
              </button>
            )}
          </div>
        </div>

        {/* Preview / JSX Editor Panel */}
        {(showPreview || showJSXEditor) && (
          <div className="w-1/2 overflow-y-auto bg-stone-50 dark:bg-stone-950">
            {showJSXEditor ? (
              <JSXEditor
                portfolio={portfolio}
                onChange={(updated) => updateStore(updated)}
                onClose={() => setShowJSXEditor(false)}
              />
            ) : (
              <div className={previewMode === 'phone' ? 'flex items-start justify-center pt-8' : ''}>
                {previewMode === 'phone' ? (
                  <div className="w-64 phone-frame flex-shrink-0">
                    <div className="overflow-hidden rounded-[20px]">
                      <PortfolioPreview portfolio={portfolio} />
                    </div>
                  </div>
                ) : (
                  <PortfolioPreview portfolio={portfolio} />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Step Content Components ────────────────────────────────────────────────

function BuilderStepContent({
  step,
  portfolio,
  updatePortfolio,
  t,
  onPublish,
  isPublishing,
}: {
  step: BuilderStep
  portfolio: any
  updatePortfolio: (u: any) => void
  t: Translations
  onPublish: () => void
  isPublishing: boolean
}) {
  const addSkill = (name: string) => {
    const skill = { id: Date.now().toString(), name }
    updatePortfolio({ skills: [...(portfolio.skills || []), skill] })
  }

  const removeSkill = (id: string) => {
    updatePortfolio({ skills: (portfolio.skills || []).filter((s: any) => s.id !== id) })
  }

  const addProject = () => {
    const project = {
      id: Date.now().toString(),
      title: '',
      description: '',
      tags: [],
      live_url: '',
      repo_url: '',
      order: (portfolio.projects || []).length,
    }
    updatePortfolio({ projects: [...(portfolio.projects || []), project] })
  }

  const updateProject = (id: string, updates: any) => {
    updatePortfolio({
      projects: (portfolio.projects || []).map((p: any) => (p.id === id ? { ...p, ...updates } : p)),
    })
  }

  const removeProject = (id: string) => {
    updatePortfolio({ projects: (portfolio.projects || []).filter((p: any) => p.id !== id) })
  }

  const addSocialLink = (platform: string, url: string) => {
    const link = { id: Date.now().toString(), platform, url }
    updatePortfolio({ social_links: [...(portfolio.social_links || []), link] })
  }

  const removeSocialLink = (id: string) => {
    updatePortfolio({ social_links: (portfolio.social_links || []).filter((l: any) => l.id !== id) })
  }

  switch (step) {
    case 'info':
      return (
        <div className="space-y-5 max-w-xl">
          <div>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-white mb-1">{t.builder.info.title}</h2>
            <p className="text-sm text-stone-500 dark:text-stone-400">{t.builder.info.subtitle}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-200 mb-1.5">{t.builder.info.name} *</label>
            <input
              type="text"
              value={portfolio.name || ''}
              onChange={(e) => updatePortfolio({ name: e.target.value })}
              placeholder={t.builder.info.namePlaceholder}
              className="input"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-200 mb-1.5">{t.builder.info.tagline}</label>
            <input
              type="text"
              value={portfolio.tagline || ''}
              onChange={(e) => updatePortfolio({ tagline: e.target.value })}
              placeholder={t.builder.info.taglinePlaceholder}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-200 mb-1.5">{t.builder.info.about}</label>
            <textarea
              value={portfolio.about || ''}
              onChange={(e) => updatePortfolio({ about: e.target.value })}
              placeholder={t.builder.info.aboutPlaceholder}
              rows={5}
              className="input resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-200 mb-1.5">{t.builder.info.avatarUrl}</label>
            <input
              type="url"
              value={portfolio.avatar_url || ''}
              onChange={(e) => updatePortfolio({ avatar_url: e.target.value })}
              placeholder={t.builder.info.avatarUrlPlaceholder}
              className="input"
            />
          </div>
        </div>
      )

    case 'skills':
      const existingSkillNames = new Set((portfolio.skills || []).map((s: any) => s.name.toLowerCase()))
      const suggestedSkills = SUGGESTED_SKILLS.filter((s) => !existingSkillNames.has(s.toLowerCase())).slice(0, 8)

      return (
        <div className="space-y-5 max-w-xl">
          <div>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-white mb-1">{t.builder.skills.title}</h2>
            <p className="text-sm text-stone-500 dark:text-stone-400">{t.builder.skills.subtitle}</p>
          </div>

          {/* Suggested skills */}
          {suggestedSkills.length > 0 && (
            <div>
              <p className="text-xs text-stone-400 dark:text-stone-500 mb-2 font-medium uppercase tracking-wider">Popular skills — click to add</p>
              <div className="flex flex-wrap gap-2">
                {suggestedSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => addSkill(skill)}
                    className="px-3 py-1.5 rounded-full border border-dashed border-stone-300 dark:border-stone-600 text-xs text-stone-500 dark:text-stone-400 hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all font-medium"
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>
          )}

          <SkillInput onAdd={addSkill} placeholder={t.builder.skills.placeholder} />

          <div className="flex flex-wrap gap-2 mt-4">
            {(portfolio.skills || []).map((skill: any) => (
              <span
                key={skill.id}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm font-medium group-hover:opacity-80"
              >
                {skill.name}
                <button onClick={() => removeSkill(skill.id)} className="hover:text-teal-900 dark:hover:text-teal-200 ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {(portfolio.skills || []).length === 0 && (
            <div className="card p-6 text-center border-dashed">
              <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-stone-500 dark:text-stone-400 text-sm">Type a skill like &apos;React&apos; or &apos;Python&apos; and press Enter</p>
            </div>
          )}
        </div>
      )

    case 'projects':
      return (
        <div className="space-y-5 max-w-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-stone-900 dark:text-white mb-1">{t.builder.projects.title}</h2>
              <p className="text-sm text-stone-500 dark:text-stone-400">{t.builder.projects.subtitle}</p>
            </div>
            <button onClick={addProject} className="btn-primary text-sm">
              <Check className="w-4 h-4" />
              {t.builder.projects.addProject}
            </button>
          </div>

          {(portfolio.projects || []).length === 0 ? (
            <div className="card p-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-stone-500 dark:text-stone-400 mb-5">{t.builder.projects.noProjects}</p>
              <button
                onClick={addProject}
                className="btn-primary text-sm px-6 py-2.5"
              >
                <Check className="w-4 h-4" />
                {t.builder.projects.addFirst}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {(portfolio.projects || []).map((project: any, i: number) => (
                <div key={project.id} className="card card-hover p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-500 dark:text-stone-400 font-medium">{t.builder.projects.projectN} {i + 1}</span>
                    <button
                      onClick={() => removeProject(project.id)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm transition-colors"
                    >
                      {t.builder.projects.remove}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => updateProject(project.id, { title: e.target.value })}
                    placeholder={t.builder.projects.titlePlaceholder}
                    className="input"
                  />
                  <textarea
                    value={project.description}
                    onChange={(e) => updateProject(project.id, { description: e.target.value })}
                    placeholder={t.builder.projects.descPlaceholder + ' — include what you built and the tech stack used'}
                    rows={2}
                    className="input resize-none"
                  />
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="url"
                        value={project.live_url || ''}
                        onChange={(e) => updateProject(project.id, { live_url: e.target.value })}
                        placeholder={t.builder.projects.liveUrl}
                        className="input"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="url"
                        value={project.repo_url || ''}
                        onChange={(e) => updateProject(project.id, { repo_url: e.target.value })}
                        placeholder={t.builder.projects.repoUrl}
                        className="input"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )

    case 'social':
      return (
        <div className="space-y-5 max-w-xl">
          <div>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-white mb-1">{t.builder.social.title}</h2>
            <p className="text-sm text-stone-500 dark:text-stone-400">{t.builder.social.subtitle}</p>
          </div>

          <SocialLinkInput onAdd={addSocialLink} placeholder={t.builder.social.placeholder} addLabel={t.builder.social.add} />

          <div className="space-y-2 mt-4">
            {(portfolio.social_links || []).map((link: any) => (
              <div
                key={link.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-stone-700 flex items-center justify-center text-sm font-bold text-stone-500 dark:text-stone-300 uppercase">
                    {link.platform[0]}
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-stone-700 dark:text-stone-200 capitalize">{link.platform}</span>
                    <span className="text-sm text-stone-400 dark:text-stone-500 block truncate max-w-xs">{link.url}</span>
                  </div>
                </div>
                <button onClick={() => removeSocialLink(link.id)} className="text-stone-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )

    case 'theme':
      return (
        <div>
          <h2 className="text-lg font-semibold text-stone-900 dark:text-white mb-1">{t.builder.theme.title}</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mb-5">{t.builder.theme.subtitle}</p>
          <ThemeSelector
            selected={portfolio.theme || 'gradient-dark'}
            onSelect={(theme) => updatePortfolio({ theme })}
          />
        </div>
      )

    case 'preview':
      return (
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-white mb-1">{t.builder.previewStep.title}</h2>
            <p className="text-sm text-stone-500 dark:text-stone-400">{t.builder.previewStep.subtitle}</p>
          </div>

          <div className="card card-hover p-5 space-y-4 max-w-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-500 dark:text-stone-400">{t.builder.previewStep.willBeLive}</span>
            </div>
            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono text-sm text-stone-700 dark:text-stone-200">
              {portfolio.subdomain || 'yourname'}.portgen.com
            </div>

            <div className="pt-4 border-t border-stone-200 dark:border-stone-700">
              <h3 className="font-medium text-stone-700 dark:text-stone-200 mb-2">{t.builder.previewStep.whatsIncluded}</h3>
              <ul className="space-y-1 text-sm text-stone-600 dark:text-stone-400">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-500 flex-shrink-0" />
                  {portfolio.name || 'Your name'}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-500 flex-shrink-0" />
                  {portfolio.tagline || 'Your tagline'}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-500 flex-shrink-0" />
                  {portfolio.skills?.length || 0} {t.builder.steps.skills.toLowerCase()}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-500 flex-shrink-0" />
                  {portfolio.projects?.length || 0} {t.builder.steps.projects.toLowerCase()}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-500 flex-shrink-0" />
                  {portfolio.social_links?.length || 0} {t.builder.steps.social.toLowerCase()}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-500 flex-shrink-0" />
                  {t.builder.steps.theme}: {portfolio.theme}
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={onPublish}
            disabled={isPublishing}
            className="btn-primary text-base px-8 py-3 shadow-lg"
          >
            {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
            {t.builder.previewStep.publishNow}
          </button>
        </div>
      )

    default:
      return null
  }
}

// ─── Helper Components ───────────────────────────────────────────────────────

function SkillInput({ onAdd, placeholder }: { onAdd: (name: string) => void; placeholder: string }) {
  const [value, setValue] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      onAdd(value.trim())
      setValue('')
    }
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="input pr-12"
      />
      {value.trim() && (
        <button
          type="button"
          onClick={() => { onAdd(value.trim()); setValue('') }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 hover:bg-teal-100 transition"
        >
          <Check className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

function SocialLinkInput({ onAdd, placeholder, addLabel }: { onAdd: (platform: string, url: string) => void; placeholder: string; addLabel: string }) {
  const [platform, setPlatform] = useState('github')
  const [url, setUrl] = useState('')

  const platforms = ['github', 'linkedin', 'twitter', 'email', 'website', 'facebook', 'instagram', 'youtube']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      onAdd(platform, url.trim())
      setUrl('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        className="input w-auto"
      >
        {platforms.map((p) => (
          <option key={p} value={p} className="capitalize">{p}</option>
        ))}
      </select>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder={placeholder}
        className="input flex-1"
      />
      <button
        type="submit"
        className="btn-primary"
      >
        {addLabel}
      </button>
    </form>
  )
}
