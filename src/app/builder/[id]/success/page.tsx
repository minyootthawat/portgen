'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Loader2, CheckCircle2, Link2, Twitter, Facebook, Linkedin, ExternalLink, Home, Plus, Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'
import Link from 'next/link'

// ─── Mini Preview ──────────────────────────────────────────────────────────────
function MiniPreview({ portfolio }: { portfolio: any }) {
  const theme = portfolio.theme || 'gradient-dark'
  const infoSection = portfolio.custom_sections?.find((s: any) => s.type === 'info')?.data
  const name = infoSection?.name || portfolio.name || 'Your Name'
  const tagline = infoSection?.tagline || portfolio.tagline || 'Your tagline'
  const avatarUrl = infoSection?.avatar_url || portfolio.avatar_url
  const skills = portfolio.custom_sections?.find((s: any) => s.type === 'skills')?.data?.items || []
  const projects = portfolio.custom_sections?.find((s: any) => s.type === 'projects')?.data?.items || []

  const themeBg: Record<string, { from: string; via?: string; to: string }> = {
    'gradient-dark': { from: 'slate-900', via: 'slate-800', to: 'slate-900' },
    'minimal-light': { from: 'white', to: 'slate-100' },
    'brutalist': { from: 'yellow-50', to: 'yellow-50' },
    'cyberpunk': { from: 'slate-950', via: 'slate-900', to: 'cyan-950' },
    'nordic': { from: 'slate-50', to: 'blue-50' },
    'sunset': { from: 'orange-500', via: 'pink-500', to: 'purple-500' },
  }

  const t = themeBg[theme] || themeBg['gradient-dark']
  const bgClass = t.via ? `from-${t.from} via-${t.via} to-${t.to}` : `from-${t.from} to-${t.to}`
  const isDark = theme !== 'minimal-light' && theme !== 'brutalist'

  return (
    <div className={`w-full max-w-sm mx-auto rounded-2xl overflow-hidden bg-gradient-to-br ${bgClass} border border-slate-700 shadow-2xl shadow-teal-500/10`}>
      {/* Browser chrome */}
      <div className="px-4 py-2.5 bg-slate-800/30 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
        <div className="flex-1 mx-4">
          <div className="bg-white/10 rounded px-3 py-0.5 text-xs text-white/60 text-center font-mono truncate">
            portgen.com/p/{portfolio.subdomain}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 min-h-[240px] flex flex-col items-center">
        {/* Avatar */}
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-14 h-14 rounded-full mb-3 object-cover border-2 border-white/20" />
        ) : (
          <div className="w-14 h-14 rounded-full mb-3 bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-xl font-bold text-white border-2 border-white/20">
            {name.charAt(0) || 'A'}
          </div>
        )}

        <h2 className={`text-base font-bold mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {name}
        </h2>
        <p className={`text-xs mb-4 ${isDark ? 'text-white/70' : 'text-slate-500'}`}>
          {tagline}
        </p>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 mb-4">
            {skills.slice(0, 4).map((skill: any) => (
              <span key={skill.id} className={`px-2.5 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-teal-500/20 text-white border border-teal-400/30' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                {skill.name}
              </span>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="w-full space-y-2">
            {projects.slice(0, 2).map((proj: any) => (
              <div key={proj.id} className={`p-3 rounded-lg text-left ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-slate-200'}`}>
                <div className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{proj.title || 'Project'}</div>
                <div className={`text-xs mt-0.5 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>{proj.description?.slice(0, 55) || ''}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`px-6 py-3 text-center border-t ${isDark ? 'border-white/10 bg-slate-800/20' : 'border-slate-200 bg-slate-50'}`}>
        <span className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-400'}`}>Built with PortGen ✨</span>
      </div>
    </div>
  )
}

// ─── Success Page ────────────────────────────────────────────────────────────
export default function SuccessPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session, status } = useSession()
  const id = params.id as string

  const [portfolio, setPortfolio] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState('')

  // Fire confetti on mount
  useEffect(() => {
    const fire = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#14b8a6', '#0d9488', '#0f766e'],
      })
    }
    fire()
    const t = setTimeout(fire, 300)
    return () => clearTimeout(t)
  }, [])

  // Auth check + fetch portfolio
  useEffect(() => {
    const bootstrap = async () => {
      if (status === 'unauthenticated') {
        router.push('/login')
        return
      }
      if (status === 'loading') return

      const userId = (session?.user as any)?.id || session?.user?.email
      if (!userId) {
        router.push('/login')
        return
      }

      try {
        const res = await fetch(`/api/portfolios/${id}`, {
          headers: { Authorization: `Bearer ${userId}` },
        })
        const json = await res.json()
        if (json.error) throw new Error(json.error)
        if (!json.data) throw new Error('Portfolio not found')
        setPortfolio(json.data)
      } catch (err: any) {
        setError(err.message || 'เกิดข้อผิดพลาด')
      }
      setLoading(false)
    }

    bootstrap()
  }, [id, status, session, router])

  const portfolioUrl = portfolio ? `/p/${portfolio.subdomain}` : ''
  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${portfolioUrl}` : portfolioUrl

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true)
      setToast('คุณคัดลอกลิงก์แล้ว!')
      setTimeout(() => { setCopied(false); setToast('') }, 2500)
    })
  }

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`ดู portfolio ของผมได้เลย! ${fullUrl}`)}`, '_blank', 'noopener,noreferrer')
  }

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`, '_blank', 'noopener,noreferrer')
  }

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`, '_blank', 'noopener,noreferrer')
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-teal-500" />
          <p className="text-sm text-stone-500 dark:text-stone-400">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 px-4">
        <div className="text-center max-w-sm mx-auto space-y-4">
          <div className="text-5xl">😕</div>
          <h1 className="text-xl font-bold text-stone-900 dark:text-white">เกิดข้อผิดพลาด</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">{error}</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-medium text-sm hover:bg-stone-700 dark:hover:bg-stone-100 transition-all">
            <Home className="w-4 h-4" />
            ไป Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center py-16 px-4">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium bg-teal-500 text-white animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* ── Main content ── */}
      <div className="w-full max-w-sm mx-auto space-y-8">

        {/* Success badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-teal-500 text-white shadow-lg shadow-teal-500/30">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">สำเร็จ!</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">พอร์ตโฟลิโอของคุณพร้อมแล้ว</p>
        </div>

        {/* Preview */}
        {portfolio && <MiniPreview portfolio={portfolio} />}

        {/* Action card */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
          {/* URL + copy */}
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 shrink-0">
              <Link2 className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-stone-400 dark:text-stone-500 mb-0.5">ลิงก์ของคุณ</p>
              <p className="text-sm font-mono text-stone-700 dark:text-stone-200 truncate">{portfolioUrl}</p>
            </div>
            <button
              onClick={handleCopy}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${copied ? 'bg-teal-500 text-white shadow-sm' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-teal-400 dark:hover:border-teal-600'}`}
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
              {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-stone-100 dark:bg-stone-800 mx-5" />

          {/* Stats row */}
          <div className="flex items-center gap-2 px-5 py-3 bg-stone-50/50 dark:bg-stone-900/50">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            <span className="text-xs text-stone-500 dark:text-stone-400">วิวทั้งหมด:</span>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400">{portfolio?.view_count ?? 0}</span>
          </div>

          {/* Divider */}
          <div className="h-px bg-stone-100 dark:bg-stone-800 mx-5" />

          {/* Share buttons */}
          <div className="flex items-center justify-center gap-1.5 px-4 py-4">
            <button onClick={shareTwitter} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-sky-400 dark:hover:border-sky-600 hover:shadow-sm transition-all duration-200" title="Twitter">
              <Twitter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Twitter</span>
            </button>
            <button onClick={shareFacebook} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-sm transition-all duration-200" title="Facebook">
              <Facebook className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Facebook</span>
            </button>
            <button onClick={shareLinkedIn} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-blue-700 dark:hover:border-blue-500 hover:shadow-sm transition-all duration-200" title="LinkedIn">
              <Linkedin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">LinkedIn</span>
            </button>
            <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-teal-400 dark:hover:border-teal-600 hover:shadow-sm transition-all duration-200" title="เปิดดู">
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">เปิดดู</span>
            </a>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Link href="/dashboard" className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-sm font-medium hover:bg-stone-700 dark:hover:bg-stone-100 transition-all">
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
          <Link href="/builder/new" className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium transition-all shadow-sm shadow-teal-500/20">
            <Plus className="w-4 h-4" />
            สร้างอีกอัน
          </Link>
        </div>

      </div>
    </div>
  )
}
