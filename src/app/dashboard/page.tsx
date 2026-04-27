'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useI18n } from '@/i18n/context'
import { supabase, getSession, getPortfolios, deletePortfolio } from '@/lib/supabase'
import { Plus, ExternalLink, Trash2, Loader2, Crown, Zap, ArrowRight, Sparkles } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import type { Portfolio } from '@/types'

export default function DashboardPage() {
  const router = useRouter()
  const { t } = useI18n()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [isPro, setIsPro] = useState(false)
  const [isDemo, setIsDemo] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const checkUser = async () => {
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
      setIsDemo(false)

      setLoading(false)
    }

    // Check demo mode
    const demoSession = typeof window !== 'undefined' ? localStorage.getItem('demo_session') : null
    if (demoSession) {
      setIsDemo(true)
      setLoading(false)
      return
    }

    checkUser()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleDeletePortfolio = async (id: string) => {
    if (!confirm(t.dashboard.confirmDelete || 'Are you sure you want to delete this portfolio? This cannot be undone.')) {
      return
    }
    setDeletingId(id)
    try {
      await deletePortfolio(id)
      setPortfolios(portfolios.filter((p) => p.id !== id))
    } catch (err: any) {
      alert(err.message)
    }
    setDeletingId(null)
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
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Nav */}
      <nav className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-40">
        <div className="container-lg mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center shadow-sm">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-lg tracking-tight text-stone-900 dark:text-white">PortGen</span>
            </Link>
            {isDemo && (
              <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold">
                Demo Mode
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-stone-500 dark:text-stone-400 hidden sm:block">{user?.email || user?.name}</span>
            <ThemeToggle />
            {!isPro && (
              <Link href="/upgrade" className="btn-secondary text-sm">
                <Crown className="w-3.5 h-3.5" />
                {t.dashboard.upgradeToPro}
              </Link>
            )}
            <button onClick={handleSignOut} className="btn-ghost text-sm">
              {t.dashboard.signOut}
            </button>
          </div>
        </div>
      </nav>

      {/* Demo banner */}
      {isDemo && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-6 py-2.5">
          <div className="container-lg mx-auto flex items-center justify-between gap-4">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <Sparkles className="w-4 h-4 inline mr-1.5" />
              {t.dashboard.demoBanner}
            </p>
            <Link href="/" className="text-sm font-medium text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200 flex items-center gap-1 shrink-0">
              Sign up for real <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container-lg mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-white">{t.dashboard.title}</h1>
            <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
              {portfolios.length === 0
                ? t.dashboard.createFirst
                : `${portfolios.length} portfolio${portfolios.length > 1 ? 's' : ''} · ${portfolios.filter(p => p.is_published).length} live`}
            </p>
          </div>
          <Link href='/builder/new' className="btn-primary card-hover">
            <Plus className="w-4 h-4" />
            {t.dashboard.newPortfolio}
          </Link>
        </div>

        {portfolios.length === 0 ? (
          <div className="card card-hover p-16 text-center max-w-lg mx-auto">
            {/* Illustration placeholder */}
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-teal-100 to-indigo-100 dark:from-teal-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                <svg className="w-12 h-12 text-teal-500 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              {/* Arrow pointing to button */}
              <svg className="absolute -right-8 top-1/2 -translate-y-1/2 w-16 h-8 text-stone-400 dark:text-stone-600" fill="none" viewBox="0 0 64 32" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M0 16H52M44 8l8 8-8 8" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Your first portfolio starts here</h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm mb-8 max-w-xs mx-auto">
              It takes less than 5 minutes. Pick a template, add your info, and share your link.
            </p>
            <Link href="/builder/new" className="btn-primary text-base px-8 py-3 card-hover">
              <Sparkles className="w-4 h-4" />
              Build your first portfolio
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {portfolios.map((portfolio) => (
              <div key={portfolio.id} className="card card-hover overflow-hidden group">
                {/* Preview */}
                <div
                  className={`aspect-[4/3] flex items-center justify-center relative overflow-hidden ${
                    portfolio.theme === 'gradient-dark'
                      ? 'bg-gradient-to-br from-indigo-800 to-stone-900'
                      : portfolio.theme === 'minimal-light'
                      ? 'bg-stone-100 dark:bg-stone-800'
                      : portfolio.theme === 'brutalist'
                      ? 'bg-stone-900'
                      : 'bg-white dark:bg-stone-800'
                  }`}
                >
                  <div className="text-center p-4 w-full">
                    <div
                      className={`w-12 h-12 rounded-full mx-auto mb-2 ${
                        !portfolio.avatar_url
                          ? portfolio.theme === 'brutalist'
                            ? 'bg-white'
                            : portfolio.theme === 'minimal-light'
                            ? 'bg-stone-300 dark:bg-stone-600'
                            : 'bg-white/20'
                          : ''
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
                      className={`h-2 w-20 rounded mx-auto mb-1 ${
                        portfolio.theme === 'brutalist' ? 'bg-white' : portfolio.theme === 'minimal-light' ? 'bg-stone-300 dark:bg-stone-600' : 'bg-white/30'
                      }`}
                    />
                    <div
                      className={`h-1.5 w-24 rounded mx-auto ${
                        portfolio.theme === 'brutalist' ? 'bg-white' : portfolio.theme === 'minimal-light' ? 'bg-stone-200 dark:bg-stone-700' : 'bg-white/20'
                      }`}
                    />
                    {/* Skills strip */}
                    {(portfolio.skills || []).length > 0 && (
                      <div className="flex justify-center gap-1 mt-3 flex-wrap">
                        {(portfolio.skills || []).slice(0, 3).map((skill) => (
                          <div
                            key={skill.id}
                            className={`h-1.5 w-8 rounded-full ${
                              portfolio.theme === 'brutalist' ? 'bg-white/40' : portfolio.theme === 'minimal-light' ? 'bg-stone-300 dark:bg-stone-600' : 'bg-white/20'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Hover overlay with Edit button */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Link
                      href={`/builder/${portfolio.id}`}
                      className="px-5 py-2.5 rounded-xl bg-white text-stone-900 font-semibold text-sm hover:bg-teal-50 transition-colors shadow-lg"
                    >
                      Edit Portfolio
                    </Link>
                  </div>

                  {portfolio.is_published && (
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-teal-500 text-white text-xs font-semibold flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Live
                    </div>
                  )}

                  {portfolio.view_count > 0 && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/40 text-white text-xs flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {portfolio.view_count.toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-stone-900 dark:text-white truncate">{portfolio.name || 'Untitled'}</h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 truncate">{portfolio.subdomain}.portgen.com</p>
                    </div>
                    {portfolio.is_published ? (
                      <span className="px-2 py-1 rounded text-xs bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-medium shrink-0 ml-2">
                        {t.dashboard.live}
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded text-xs bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 font-medium shrink-0 ml-2">
                        {t.dashboard.draft}
                      </span>
                    )}
                  </div>

                  {/* Skills preview */}
                  <div className="flex flex-wrap gap-1 mt-2 mb-3">
                    {(portfolio.skills || []).slice(0, 3).map((skill) => (
                      <span key={skill.id} className="px-2 py-0.5 rounded text-xs bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-medium">
                        {skill.name}
                      </span>
                    ))}
                    {(portfolio.skills?.length ?? 0) > 3 && (
                      <span className="px-2 py-0.5 rounded text-xs bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 font-medium">
                        +{(portfolio.skills?.length ?? 0) - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <Link
                      href={`/builder/${portfolio.id}`}
                      className="flex-1 py-2 px-3 rounded-lg text-sm text-center bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/40 text-teal-700 dark:text-teal-300 font-medium transition"
                    >
                      {t.dashboard.edit}
                    </Link>
                    {portfolio.is_published && (
                      <a
                        href={`https://${portfolio.subdomain}.portgen.com`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition"
                        title="View live site"
                      >
                        <ExternalLink className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                      </a>
                    )}
                    <button
                      onClick={() => handleDeletePortfolio(portfolio.id)}
                      disabled={deletingId === portfolio.id}
                      className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition"
                      title="Delete portfolio"
                    >
                      {deletingId === portfolio.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-stone-400" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                      )}
                    </button>
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
