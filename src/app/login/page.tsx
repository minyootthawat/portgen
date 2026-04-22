'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/i18n/context'
import { signInWithGoogle, signInWithGithub, signInWithMagicLink } from '@/lib/supabase'
import { Github, Mail, ArrowRight, Loader2, Eye, EyeOff, Zap } from 'lucide-react'
import Link from 'next/link'

const MOCK_USER = {
  id: 'demo-user-123',
  email: 'demo@portgen.dev',
  name: 'Demo User',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  plan: 'pro' as const,
}

export default function LoginPage() {
  const router = useRouter()
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [showDemo, setShowDemo] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    const { error } = await signInWithGoogle()
    if (error) {
      alert(error.message)
      setIsLoading(false)
    }
  }

  const handleGithubSignIn = async () => {
    setIsLoading(true)
    const { error } = await signInWithGithub()
    if (error) {
      alert(error.message)
      setIsLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const { error } = await signInWithMagicLink(email)
    if (error) {
      alert(error.message)
    } else {
      setMagicLinkSent(true)
    }
    setIsLoading(false)
  }

  const handleDemoLogin = () => {
    localStorage.setItem('demo_session', 'true')
    localStorage.setItem('demo_user', JSON.stringify(MOCK_USER))
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-stone-100">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-xl tracking-tight text-stone-900">PortGen</span>
          </Link>
          <h1 className="text-2xl font-bold text-stone-900">{t.login.welcomeBack}</h1>
          <p className="text-stone-500 text-sm mt-1">{t.login.continueToDashboard}</p>
        </div>

        {/* Demo Toggle */}
        <div className="mb-4">
          <button
            onClick={() => setShowDemo(!showDemo)}
            className="w-full p-4 rounded-xl border border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm transition text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-stone-900">{t.login.tryDemo}</p>
                  <p className="text-xs text-stone-500">{t.login.tryDemoDesc}</p>
                </div>
              </div>
              {showDemo ? (
                <EyeOff className="w-5 h-5 text-stone-400" />
              ) : (
                <Eye className="w-5 h-5 text-stone-400" />
              )}
            </div>
          </button>

          {showDemo && (
            <div className="mt-3 p-4 rounded-xl border border-stone-200 bg-white">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={MOCK_USER.avatar_url}
                  alt={MOCK_USER.name}
                  className="w-12 h-12 rounded-full bg-stone-100"
                />
                <div>
                  <p className="font-medium text-stone-900">{MOCK_USER.name}</p>
                  <p className="text-sm text-stone-500">{MOCK_USER.email}</p>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-600 text-white text-xs font-semibold mt-1">
                    Pro Plan
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-sm text-stone-600 mb-4">
                <p>• {t.login.demoFeatures.portfolios} {t.login.demoFeatures.portfoliosPre}</p>
                <p>• {t.login.demoFeatures.customThemes} {t.login.demoFeatures.customThemesUnlock}</p>
                <p>• {t.login.demoFeatures.allFeatures} {t.login.demoFeatures.allFeaturesAvailable}</p>
              </div>

              <button
                onClick={handleDemoLogin}
                className="btn-primary w-full justify-center"
              >
                {t.login.enterDemo}
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-xs text-stone-400 mt-3">
                {t.login.noAccountNeeded}
              </p>
            </div>
          )}
        </div>

        {/* Login Card */}
        <div className="card p-6">
          {magicLinkSent ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold text-stone-900 mb-2">{t.login.checkEmail}</h2>
              <p className="text-stone-500 text-sm">
                {t.login.magicLinkSent} <span className="font-medium text-stone-700">{email}</span>
                <br />
                {t.login.clickToSignIn}
              </p>
            </div>
          ) : (
            <>
              {/* OAuth Buttons */}
              <div className="space-y-2 mb-5">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-lg border border-stone-200 bg-white text-stone-700 font-medium text-sm hover:bg-stone-50 transition flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={handleGithubSignIn}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-lg border border-stone-200 bg-white text-stone-700 font-medium text-sm hover:bg-stone-50 transition flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <Github className="w-5 h-5" />
                  Continue with GitHub
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-stone-400">{t.login.orContinueWith}</span>
                </div>
              </div>

              {/* Magic Link Form */}
              <form onSubmit={handleMagicLink} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="input"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full justify-center"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {t.login.sendMagicLink}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-stone-400 text-xs mt-5 leading-relaxed">
          {t.login.termsNote}
        </p>

        {/* Social proof */}
        <div className="mt-8 flex items-center justify-center gap-3 text-sm text-stone-400">
          <div className="flex -space-x-2">
            {['A', 'B', 'C', 'D'].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-stone-200 border-2 border-white flex items-center justify-center text-xs font-medium text-stone-600"
              >
                {i}
              </div>
            ))}
          </div>
          <span>2,000+ {t.login.developersUsing}</span>
        </div>
      </div>
    </div>
  )
}
