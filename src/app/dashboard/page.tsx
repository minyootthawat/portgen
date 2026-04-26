'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useI18n } from '@/i18n/context'
import { supabase, getSession, getPortfolios } from '@/lib/supabase'
import { Plus, ExternalLink, Trash2, Loader2, Crown, Zap } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import type { Portfolio } from '@/types'

export default function DashboardPage() {
  const router = useRouter()
  const { t } = useI18n()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [isPro, setIsPro] = useState(false)

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

      setLoading(false)
    }
    checkUser()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleDeletePortfolio = (id: string) => {
    setPortfolios(portfolios.filter((p) => p.id !== id))
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
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center shadow-sm">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-lg tracking-tight text-stone-900">PortGen</span>
            </Link>

          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-stone-500">{user?.email || user?.name}</span>
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

      {/* Content */}
      <div className="container-lg mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">{t.dashboard.title}</h1>
            <p className="text-stone-500 text-sm mt-1">
              {portfolios.length === 0
                ? t.dashboard.createFirst
                : `${portfolios.length} portfolio${portfolios.length > 1 ? 's' : ''}`}
            </p>
          </div>
          <Link href='/builder/new' className="btn-primary">
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
            <Link href="/builder/new" className="btn-primary">
              <Plus className="w-4 h-4" />
              {t.dashboard.createFirst}
            </Link>
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
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-teal-500 text-white text-xs font-semibold">
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
                      <span className="px-2 py-1 rounded text-xs bg-teal-50 text-teal-600 font-medium">{t.dashboard.live}</span>
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
                    <button
                      onClick={() => handleDeletePortfolio(portfolio.id)}
                      className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 transition"
                    >
                      <Trash2 className="w-4 h-4 text-stone-600" />
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
