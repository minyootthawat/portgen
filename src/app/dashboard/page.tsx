'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { Plus, ExternalLink, Trash2, Loader2, Crown, ArrowRight, Sparkles } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import type { Portfolio } from '@/types'

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [isPro, setIsPro] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'loading') return

    const checkUser = async () => {
      if (!session?.user) {
        router.push('/login')
        return
      }

      // Fetch portfolios from API
      try {
        const userId = (session.user as any)?.id
        const res = await fetch(`/api/portfolios?user_id=${userId}`, {
          headers: {
            Authorization: `Bearer ${userId || ''}`,
          },
        })
        const json = await res.json()
        setPortfolios(json.data || [])
      } catch (err) {
        console.error('Failed to fetch portfolios:', err)
      }

      // Check profile for plan
      try {
        const profileRes = await fetch(`/api/profiles/${(session.user as any)?.id}`, {
          headers: {
            Authorization: `Bearer ${(session.user as any)?.id || ''}`,
          },
        })
        if (profileRes.ok) {
          const profileJson = await profileRes.json()
          setIsPro(profileJson.data?.plan === 'pro')
        }
      } catch {
        // ignore
      }

      setLoading(false)
    }

    checkUser()
  }, [status, session, router])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const handleDeletePortfolio = async (id: string) => {
    if (!confirm('ลบพอร์ตโฟลิโอนี้หรือไม่? การดำเนินการนี้ไม่สามารถเลิกทำได้')) {
      return
    }
    setDeletingId(id)
    try {
      const res = await fetch(`/api/portfolios/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${(session?.user as any)?.id || ''}`,
        },
      })
      if (res.ok) {
        setPortfolios(portfolios.filter((p) => p.id !== id))
      }
    } catch (err: any) {
      alert(err.message)
    }
    setDeletingId(null)
  }

  if (loading || status === 'loading') {
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
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-lg tracking-tight text-stone-900 dark:text-white">PortGen</span>
            </Link>

          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {!isPro && (
              <Link href="/upgrade" className="btn-secondary text-sm hidden sm:inline-flex">
                <Crown className="w-3.5 h-3.5" />
                อัพเกรด
              </Link>
            )}
            <button onClick={handleSignOut} className="btn-ghost text-sm">
              ออก
            </button>
          </div>
        </div>
      </nav>


      {/* Content */}
      <div className="container-lg mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Portfolio ของคุณ</h1>
            <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
              {portfolios.length === 0
                ? 'สร้างพอร์ตโฟลิโอแรกของคุณ'
                : `${portfolios.length} portfolio${portfolios.length > 1 ? 's' : ''} · ${portfolios.filter(p => p.is_published).length} เผยแพร่แล้ว`}
            </p>
          </div>
          <Link href='/builder/new' className="btn-primary card-hover">
            <Plus className="w-4 h-4" />
            พอร์ตโฟลิโอใหม่
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
            <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-2">พอร์ตโฟลิโอแรกของคุณเริ่มต้นที่นี่</h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm mb-8 max-w-xs mx-auto">
              ใช้เวลาไม่ถึง 5 นาที เลือกเทมเพลต เพิ่มข้อมูล แชร์ลิงก์
            </p>
            <Link href="/builder/new" className="btn-primary text-base px-8 py-3 card-hover">
              <Sparkles className="w-4 h-4" />
              สร้างพอร์ตโฟลิโอแรก
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
                      ? 'bg-stone-950'
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

                  {portfolio.is_published && (
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-teal-500 text-white text-xs font-semibold flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      Live
                    </div>
                  )}

                  {portfolio.view_count > 0 && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-stone-900/60 text-white text-xs flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {portfolio.view_count.toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-stone-900 dark:text-white truncate pr-2">{portfolio.name || 'Untitled'}</h3>
                      <p className="text-xs text-stone-400 dark:text-stone-500 truncate mt-0.5">{portfolio.subdomain}.portgen.com</p>
                    </div>
                    {portfolio.is_published ? (
                      <a
                        href={`https://${portfolio.subdomain}.portgen.com`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 px-2 py-1 rounded text-xs bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
                        title="เปิดดูเว็บไซต์"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Live
                      </a>
                    ) : (
                      <span className="shrink-0 px-2 py-1 rounded text-xs bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 font-medium">
                        ฉบับร่าง
                      </span>
                    )}
                  </div>

                  {/* Skills preview */}
                  {/* Skills preview */}
                  <div className="flex flex-wrap gap-1 mb-4">
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

                  {/* Footer actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/builder/${portfolio.id}`}
                      className="flex-1 py-2 px-3 rounded-lg text-sm text-center bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/40 text-teal-700 dark:text-teal-300 font-medium transition"
                    >
                      แก้ไข
                    </Link>
                    <button
                      onClick={() => handleDeletePortfolio(portfolio.id)}
                      disabled={deletingId === portfolio.id}
                      className="p-2 rounded-lg text-stone-400 dark:text-stone-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition"
                      title="ลบพอร์ตโฟลิโอ"
                    >
                      {deletingId === portfolio.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
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
