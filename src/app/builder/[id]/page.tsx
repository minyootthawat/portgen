'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/i18n/context'
import { useBuilderStore } from '@/lib/store'
import { supabase, getSession, getPortfolio, createPortfolio, updatePortfolio, publishPortfolio } from '@/lib/supabase'
import { Eye, Save, Rocket, ChevronLeft, ChevronRight, Code, Check, Loader2, X } from 'lucide-react'
import { BuilderSteps } from '@/components/builder/BuilderSteps'
import { ThemeSelector } from '@/components/builder/ThemeSelector'
import dynamic from 'next/dynamic'

// Lazy-load heavy components that are conditionally rendered
const JSXEditor = dynamic(() => import('@/components/builder/JSXEditor').then((m) => m.JSXEditor), {
  loading: () => <div className="flex items-center justify-center h-full text-stone-400 text-sm">Loading editor...</div>,
})
const PortfolioPreview = dynamic(() => import('@/components/builder/PortfolioPreview').then((m) => m.PortfolioPreview), {
  loading: () => <div className="flex items-center justify-center h-full text-stone-400 text-sm">Loading preview...</div>,
})
import type { Translations } from '@/locales/en'
import type { BuilderStep } from '@/types'

const STEPS: BuilderStep[] = ['info', 'skills', 'projects', 'social', 'theme', 'preview']

export default function BuilderPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { t } = useI18n()
  const isNew = params.id === 'new'
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showJSXEditor, setShowJSXEditor] = useState(false)

  const { portfolio, setStep, step, updatePortfolio: updateStore, reset } = useBuilderStore()

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

  const stepIndex = STEPS.indexOf(step)

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
    } catch (err: any) {
      alert(err.message)
    }
    setSaving(false)
  }

  const handlePublish = async () => {
    if (!portfolio.name) {
      alert('Please add your name first!')
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
        alert('🎉 Portfolio published! Share your link.')
        router.push('/dashboard')
      }
    } catch (err: any) {
      alert(err.message)
    }
    setPublishing(false)
  }

  const nextStep = () => {
    if (stepIndex < STEPS.length - 1) setStep(STEPS[stepIndex + 1])
  }

  const prevStep = () => {
    if (stepIndex > 0) setStep(STEPS[stepIndex - 1])
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Builder Nav */}
      <nav className="bg-white border-b border-stone-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            {t.builder.dashboard}
          </button>
          <span className="text-zinc-300">|</span>
          <span className="font-medium text-stone-900 text-sm">
            {isNew ? t.builder.new : `${t.builder.editing} ${portfolio.name || t.builder.untitled}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowJSXEditor(!showJSXEditor)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
              showJSXEditor ? 'bg-teal-50 text-teal-600' : 'bg-stone-100 hover:bg-zinc-200 text-zinc-600'
            }`}
          >
            <Code className="w-4 h-4" />
            {t.builder.jsxEditor}
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
              showPreview ? 'bg-teal-50 text-teal-600' : 'bg-stone-100 hover:bg-zinc-200 text-zinc-600'
            }`}
          >
            <Eye className="w-4 h-4" />
            {showPreview ? t.builder.hidePreview : t.builder.previewStep.title}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-100 hover:bg-zinc-200 transition text-sm text-stone-700 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {t.builder.save}
          </button>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition text-sm font-medium text-white disabled:opacity-50"
          >
            {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
            {t.builder.publish}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Builder Panel */}
        <div className={`${showPreview || showJSXEditor ? 'w-1/2' : 'w-full'} border-r border-stone-200 overflow-y-auto bg-white`}>
          {/* Step Indicator */}
          <div className="p-6 border-b border-stone-100">
            <BuilderSteps currentStep={step} onStepClick={(s) => setStep(s)} />
          </div>

          {/* Step Content */}
          <div className="p-6">
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
          <div className="p-6 border-t border-stone-100 flex items-center justify-between bg-white">
            <button
              onClick={prevStep}
              disabled={stepIndex === 0}
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-stone-100 hover:bg-zinc-200 transition text-sm disabled:opacity-30 disabled:cursor-not-allowed text-stone-700"
            >
              <ChevronLeft className="w-4 h-4" />
              {t.builder.previous}
            </button>
            <span className="text-sm text-stone-400">
              {t.builder.stepOf} {stepIndex + 1} {t.builder.of} {STEPS.length}
            </span>
            {stepIndex < STEPS.length - 1 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition text-sm text-white"
              >
                {t.common.next}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handlePublish}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition text-sm text-white"
              >
                <Rocket className="w-4 h-4" />
                {t.builder.previewStep.publishNow}
              </button>
            )}
          </div>
        </div>

        {/* Preview / JSX Editor Panel */}
        {(showPreview || showJSXEditor) && (
          <div className="w-1/2 overflow-y-auto bg-stone-50">
            {showJSXEditor ? (
              <JSXEditor
                portfolio={portfolio}
                onChange={(updated) => updateStore(updated)}
                onClose={() => setShowJSXEditor(false)}
              />
            ) : (
              <PortfolioPreview portfolio={portfolio} />
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
            <h2 className="text-lg font-semibold text-stone-900 mb-1">{t.builder.info.title}</h2>
            <p className="text-sm text-stone-500">{t.builder.info.subtitle}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">{t.builder.info.name} *</label>
            <input
              type="text"
              value={portfolio.name || ''}
              onChange={(e) => updatePortfolio({ name: e.target.value })}
              placeholder={t.builder.info.namePlaceholder}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">{t.builder.info.tagline}</label>
            <input
              type="text"
              value={portfolio.tagline || ''}
              onChange={(e) => updatePortfolio({ tagline: e.target.value })}
              placeholder={t.builder.info.taglinePlaceholder}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">{t.builder.info.about}</label>
            <textarea
              value={portfolio.about || ''}
              onChange={(e) => updatePortfolio({ about: e.target.value })}
              placeholder={t.builder.info.aboutPlaceholder}
              rows={5}
              className="input resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">{t.builder.info.avatarUrl}</label>
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
      return (
        <div className="space-y-5 max-w-xl">
          <div>
            <h2 className="text-lg font-semibold text-stone-900 mb-1">{t.builder.skills.title}</h2>
            <p className="text-sm text-stone-500">{t.builder.skills.subtitle}</p>
          </div>

          <SkillInput onAdd={addSkill} placeholder={t.builder.skills.placeholder} />

          <div className="flex flex-wrap gap-2 mt-4">
            {(portfolio.skills || []).map((skill: any) => (
              <span
                key={skill.id}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 text-sm font-medium"
              >
                {skill.name}
                <button onClick={() => removeSkill(skill.id)} className="hover:text-teal-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {(portfolio.skills || []).length === 0 && (
            <p className="text-stone-400 text-sm">{t.builder.skills.noSkills}</p>
          )}
        </div>
      )

    case 'projects':
      return (
        <div className="space-y-5 max-w-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-stone-900 mb-1">{t.builder.projects.title}</h2>
              <p className="text-sm text-stone-500">{t.builder.projects.subtitle}</p>
            </div>
            <button
              onClick={addProject}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition text-sm text-white font-medium"
            >
              <Check className="w-4 h-4" />
              {t.builder.projects.addProject}
            </button>
          </div>

          {(portfolio.projects || []).length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-stone-500 mb-4">{t.builder.projects.noProjects}</p>
              <button
                onClick={addProject}
                className="px-4 py-2 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 transition text-sm font-medium"
              >
                {t.builder.projects.addFirst}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {(portfolio.projects || []).map((project: any, i: number) => (
                <div key={project.id} className="card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-500 font-medium">{t.builder.projects.projectN} {i + 1}</span>
                    <button
                      onClick={() => removeProject(project.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
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
                    placeholder={t.builder.projects.descPlaceholder}
                    rows={2}
                    className="input resize-none"
                  />
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={project.live_url || ''}
                      onChange={(e) => updateProject(project.id, { live_url: e.target.value })}
                      placeholder={t.builder.projects.liveUrl}
                      className="input"
                    />
                    <input
                      type="url"
                      value={project.repo_url || ''}
                      onChange={(e) => updateProject(project.id, { repo_url: e.target.value })}
                      placeholder={t.builder.projects.repoUrl}
                      className="input"
                    />
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
            <h2 className="text-lg font-semibold text-stone-900 mb-1">{t.builder.social.title}</h2>
            <p className="text-sm text-stone-500">{t.builder.social.subtitle}</p>
          </div>

          <SocialLinkInput onAdd={addSocialLink} placeholder={t.builder.social.placeholder} addLabel={t.builder.social.add} />

          <div className="space-y-2 mt-4">
            {(portfolio.social_links || []).map((link: any) => (
              <div
                key={link.id}
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-stone-50"
              >
                <span className="text-sm font-medium text-stone-700 capitalize">{link.platform}</span>
                <span className="text-sm text-stone-500 truncate max-w-xs">{link.url}</span>
                <button onClick={() => removeSocialLink(link.id)} className="text-red-500 hover:text-red-700">
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
          <h2 className="text-lg font-semibold text-stone-900 mb-1">{t.builder.theme.title}</h2>
          <p className="text-sm text-stone-500 mb-5">{t.builder.theme.subtitle}</p>
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
            <h2 className="text-lg font-semibold text-stone-900 mb-1">{t.builder.previewStep.title}</h2>
            <p className="text-sm text-stone-500">{t.builder.previewStep.subtitle}</p>
          </div>

          <div className="card p-5 space-y-4 max-w-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-500">{t.builder.previewStep.willBeLive}</span>
            </div>
            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 font-mono text-sm text-stone-700">
              {portfolio.subdomain || 'yourname'}.portgen.com
            </div>

            <div className="pt-4 border-t border-stone-200">
              <h3 className="font-medium text-stone-700 mb-2">{t.builder.previewStep.whatsIncluded}</h3>
              <ul className="space-y-1 text-sm text-zinc-600">
                <li>✅ {portfolio.name || 'Your name'}</li>
                <li>✅ {portfolio.tagline || 'Your tagline'}</li>
                <li>✅ {portfolio.skills?.length || 0} {t.builder.steps.skills.toLowerCase()}</li>
                <li>✅ {portfolio.projects?.length || 0} {t.builder.steps.projects.toLowerCase()}</li>
                <li>✅ {portfolio.social_links?.length || 0} {t.builder.steps.social.toLowerCase()}</li>
                <li>✅ {t.builder.steps.theme}: {portfolio.theme}</li>
              </ul>
            </div>
          </div>

          <button
            onClick={onPublish}
            disabled={isPublishing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition font-medium text-white disabled:opacity-50"
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
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className="input"
    />
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
