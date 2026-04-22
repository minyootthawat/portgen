'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useI18n } from '@/i18n/context'
import { supabase, getSession, getPortfolios } from '@/lib/supabase'
import { Plus, ExternalLink, Trash2, Loader2, Crown, Zap, ArrowLeft } from 'lucide-react'
import type { Portfolio } from '@/types'

const DEMO_PORTFOLIOS: Portfolio[] = [
  {
    id: 'demo-1',
    user_id: 'demo-user-123',
    slug: 'demo-portfolio',
    subdomain: 'johndoe',
    name: 'John Doe',
    tagline: 'Full-Stack Developer • React & Node.js',
    about: 'Passionate developer with 5 years of experience building web applications.',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    skills: [
      { id: '1', name: 'React', level: 'expert' },
      { id: '2', name: 'TypeScript', level: 'expert' },
      { id: '3', name: 'Node.js', level: 'intermediate' },
      { id: '4', name: 'Next.js', level: 'expert' },
      { id: '5', name: 'Python', level: 'intermediate' },
      { id: '6', name: 'PostgreSQL', level: 'intermediate' },
    ],
    projects: [
      {
        id: 'p1',
        title: 'E-Commerce Platform',
        description: 'A full-stack e-commerce solution with Stripe payments.',
        tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
        live_url: 'https://demo.com',
        repo_url: 'https://github.com/demo',
        order: 0,
      },
      {
        id: 'p2',
        title: 'Task Management App',
        description: 'Collaborative task manager with real-time updates.',
        tags: ['Next.js', 'Supabase', 'Tailwind'],
        live_url: 'https://demo.com',
        repo_url: 'https://github.com/demo',
        order: 1,
      },
    ],
    social_links: [
      { id: 's1', platform: 'github', url: 'https://github.com/johndoe', label: 'GitHub' },
      { id: 's2', platform: 'linkedin', url: 'https://linkedin.com/in/johndoe', label: 'LinkedIn' },
      { id: 's3', platform: 'twitter', url: 'https://twitter.com/johndoe', label: 'Twitter' },
    ],
    theme: 'minimal-light',
    theme_config: {},
    is_published: true,
    is_deleted: false,
    view_count: 1247,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    user_id: 'demo-user-123',
    slug: 'demo-portfolio-2',
    subdomain: 'johndoe-designs',
    name: 'John Doe Designs',
    tagline: 'UI/UX Designer • Creative Developer',
    about: 'Creating beautiful digital experiences with a focus on user-centered design.',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=johndesign',
    skills: [
      { id: '1', name: 'Figma', level: 'expert' },
      { id: '2', name: 'React', level: 'intermediate' },
      { id: '3', name: 'CSS', level: 'expert' },
      { id: '4', name: 'Framer Motion', level: 'intermediate' },
    ],
    projects: [
      {
        id: 'p1',
        title: 'Design System',
        description: 'A comprehensive design system with 50+ components.',
        tags: ['Figma', 'React', 'Storybook'],
        live_url: 'https://demo.com',
        repo_url: 'https://github.com/demo',
        order: 0,
      },
    ],
    social_links: [
      { id: 's1', platform: 'github', url: 'https://github.com/johndoe', label: 'GitHub' },
      { id: 's2', platform: 'website', url: 'https://johndoe.design', label: 'Website' },
    ],
    theme: 'gradient-dark',
    theme_config: {},
    is_published: false,
    is_deleted: false,
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const DEMO_USER = {
  id: 'demo-user-123',
  email: 'demo@portgen.dev',
  name: 'Demo User',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  plan: 'pro' as const,
}

export default function DashboardPage() {
  const router = useRouter()
  const { t } = useI18n()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [isPro, setIsPro] = useState(false)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const demoSession = localStorage.getItem('demo_session')
      if (demoSession === 'true') {
        const demoUserData = localStorage.getItem('demo_user')
        if (demoUserData) {
          setUser(JSON.parse(demoUserData))
          setIsDemo(true)
          setIsPro(true)
          setPortfolios(DEMO_PORTFOLIOS)
          setLoading(false)
          return
        }
      }

      const { data: { session } } = await getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)

      const { data } = await getPortfolios(session.user.id)
      setPortfolios(data || [])

      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', session.user.id)
        .single()
      setIsPro(profile?.plan === 'pro')

      setLoading(false)
    }
    checkUser()
  }, [router])

  const handleSignOut = async () => {
    if (isDemo) {
      localStorage.removeItem('demo_session')
      localStorage.removeItem('demo_user')
      router.push('/')
    } else {
      await supabase.auth.signOut()
      router.push('/')
    }
  }

  const handleDeletePortfolio = (id: string) => {
    if (isDemo) {
      setPortfolios(portfolios.filter((p) => p.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Nav */}
      <nav className="bg-white border-b border-stone-200">
        <div className="container-lg mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-lg tracking-tight text-stone-900">PortGen</span>
            </Link>
            {isDemo && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">
                <Zap className="w-3 h-3" />
                {t.dashboard.demoMode}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-stone-500">{user?.email || user?.name}</span>
            {!isPro && !isDemo && (
              <Link href="/upgrade" className="btn-secondary text-sm">
                <Crown className="w-3.5 h-3.5" />
                {t.dashboard.upgradeToPro}
              </Link>
            )}
            {isDemo && (
              <Link href="/login" className="btn-ghost text-sm">
                <ArrowLeft className="w-3.5 h-3.5" />
                {t.dashboard.exitDemo}
              </Link>
            )}
            <button onClick={handleSignOut} className="btn-ghost text-sm">
              {isDemo ? t.dashboard.exitDemo : t.dashboard.signOut}
            </button>
          </div>
        </div>
      </nav>

      {/* Demo Banner */}
      {isDemo && (
        <div className="bg-indigo-50 border-b border-indigo-100">
          <div className="container-lg mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-600" />
              <span className="text-sm text-indigo-700">
                <strong>{t.dashboard.demoMode}:</strong> {t.dashboard.demoBanner}
              </span>
            </div>
            <Link href="/login" className="text-sm text-indigo-600 hover:text-indigo-800 transition font-medium">
              {t.dashboard.signUpReal}
            </Link>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container-lg mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">{t.dashboard.title}</h1>
            <p className="text-stone-500 text-sm mt-1">
              {portfolios.length === 0
                ? t.dashboard.createFirst
                : `${portfolios.length} portfolio${portfolios.length > 1 ? 's' : ''}`}
              {isDemo && ` (${t.dashboard.demoMode})`}
            </p>
          </div>
          <Link
            href='/builder/new'
            onClick={isDemo ? () => {} : undefined}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            {t.dashboard.newPortfolio}
          </Link>
        </div>

        {portfolios.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-6 h-6 text-stone-400" />
            </div>
            <h2 className="text-lg font-semibold text-stone-900 mb-2">{t.dashboard.noPortfolios}</h2>
            <p className="text-stone-500 text-sm mb-6">{t.dashboard.createAndShare}</p>
            {!isDemo && (
              <Link href="/builder/new" className="btn-primary">
                <Plus className="w-4 h-4" />
                {t.dashboard.createFirst}
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {portfolios.map((portfolio) => (
              <div key={portfolio.id} className="card overflow-hidden">
                {/* Preview */}
                <div
                  className={`aspect-[4/3] flex items-center justify-center relative ${
                    portfolio.theme === 'gradient-dark'
                      ? 'bg-gradient-to-br from-indigo-800 to-stone-900'
                      : portfolio.theme === 'minimal-light'
                      ? 'bg-stone-100'
                      : 'bg-white'
                  }`}
                >
                  <div className="text-center p-4">
                    <div
                      className={`w-12 h-12 rounded-full mx-auto mb-2 ${
                        portfolio.avatar_url
                          ? ''
                          : portfolio.theme === 'brutalist'
                          ? 'bg-stone-900'
                          : portfolio.theme === 'minimal-light'
                          ? 'bg-stone-300'
                          : 'bg-stone-700'
                      }`}
                    >
                      {portfolio.avatar_url && (
                        <img
                          src={portfolio.avatar_url}
                          alt={portfolio.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      )}
                    </div>
                    <div
                      className={`h-2 w-16 rounded mx-auto mb-1 ${
                        portfolio.theme === 'brutalist' ? 'bg-stone-900' : portfolio.theme === 'minimal-light' ? 'bg-stone-300' : 'bg-white/30'
                      }`}
                    />
                    <div
                      className={`h-1.5 w-20 rounded mx-auto ${
                        portfolio.theme === 'brutalist' ? 'bg-stone-900' : portfolio.theme === 'minimal-light' ? 'bg-stone-200' : 'bg-white/20'
                      }`}
                    />
                  </div>

                  {portfolio.is_published && (
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-emerald-500 text-white text-xs font-semibold">
                      {t.dashboard.live}
                    </div>
                  )}

                  {portfolio.view_count > 0 && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/40 text-white text-xs">
                      {portfolio.view_count.toLocaleString()} {t.dashboard.views}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-stone-900">{portfolio.name || 'Untitled'}</h3>
                      <p className="text-xs text-stone-500">{portfolio.subdomain}.portgen.com</p>
                    </div>
                    {portfolio.is_published ? (
                      <span className="px-2 py-1 rounded text-xs bg-emerald-50 text-emerald-600 font-medium">{t.dashboard.live}</span>
                    ) : (
                      <span className="px-2 py-1 rounded text-xs bg-stone-100 text-stone-500 font-medium">{t.dashboard.draft}</span>
                    )}
                  </div>

                  {/* Skills preview */}
                  <div className="flex flex-wrap gap-1 mt-2 mb-3">
                    {(portfolio.skills || []).slice(0, 3).map((skill) => (
                      <span key={skill.id} className="px-2 py-0.5 rounded text-xs bg-stone-100 text-stone-600 font-medium">
                        {skill.name}
                      </span>
                    ))}
                    {(portfolio.skills?.length ?? 0) > 3 && (
                      <span className="px-2 py-0.5 rounded text-xs bg-stone-100 text-stone-500 font-medium">
                        +{(portfolio.skills?.length ?? 0) - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <Link
                      href={`/builder/${portfolio.id}`}
                      className="flex-1 py-2 px-3 rounded-lg text-sm text-center bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition"
                    >
                      {t.dashboard.edit}
                    </Link>
                    {portfolio.is_published && (
                      <a
                        href={`https://${portfolio.subdomain}.portgen.com`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 transition"
                      >
                        <ExternalLink className="w-4 h-4 text-stone-600" />
                      </a>
                    )}
                    {!isDemo && (
                      <button className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 transition">
                        <Trash2 className="w-4 h-4 text-stone-600" />
                      </button>
                    )}
                    {isDemo && (
                      <button
                        onClick={() => handleDeletePortfolio(portfolio.id)}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
