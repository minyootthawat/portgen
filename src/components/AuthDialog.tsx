'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { signIn } from 'next-auth/react'
import { Github, Mail, ArrowRight, Loader2, X, Zap, Check } from 'lucide-react'
import { Dialog, DialogBody } from '@/components/ui/Dialog'

interface AuthDialogProps {
  open: boolean
  onClose: () => void
  onTryDemo?: () => void
  defaultMode?: 'login' | 'register'
}

export function AuthDialog({ open, onClose, onTryDemo, defaultMode = 'login' }: AuthDialogProps) {
  const t = useTranslations('auth')
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [authError, setAuthError] = useState('')

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError('')
    setAuthError('')

    if (!email) {
      setEmailError(t('errors.emailRequired'))
      return
    }
    if (!password) {
      setAuthError(t('errors.passwordRequired'))
      return
    }

    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/dashboard',
      })

      if (result?.error) {
        setAuthError(t('errors.invalidCredentials'))
        setIsLoading(false)
      } else if (result?.url) {
        window.location.href = result.url
      }
    } catch {
      setAuthError(t('errors.genericError'))
      setIsLoading(false)
    }
  }

  const handleCredentialsRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError('')
    setAuthError('')

    if (!name.trim()) {
      setAuthError(t('errors.nameRequired'))
      return
    }
    if (!email) {
      setEmailError(t('errors.emailRequired'))
      return
    }
    if (!password || password.length < 6) {
      setAuthError(t('errors.passwordMinLength'))
      return
    }
    if (password !== confirmPassword) {
      setAuthError(t('errors.passwordMismatch'))
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })

      const json = await res.json()

      if (json.error) {
        setAuthError(json.error)
        setIsLoading(false)
        return
      }

      // Auto sign-in after registration
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/dashboard',
      })

      if (result?.error) {
        setAuthError(t('errors.registeredButLoginFailed'))
        setIsLoading(false)
      } else if (result?.url) {
        window.location.href = result.url
      }
    } catch {
      setAuthError(t('errors.genericError'))
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setTimeout(() => {
      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setEmailError('')
      setAuthError('')
    }, 200)
    onClose()
  }

  const handleSwitchMode = (newMode: 'login' | 'register') => {
    setName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setEmailError('')
    setAuthError('')
    setMode(newMode)
  }

  const isRegister = mode === 'register'

  return (
    <Dialog open={open} onClose={handleClose}>
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Logo */}
      <div className="text-center my-6 px-6">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center shadow-sm">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-xl tracking-tight text-stone-900 dark:text-white">PortGen</span>
        </div>
        <h2 className="text-2xl font-bold text-stone-900 dark:text-white">
          {isRegister ? t('registerTitle') : t('loginTitle')}
        </h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
          {isRegister ? t('registerSubtitle') : t('loginSubtitle')}
        </p>
      </div>

      <DialogBody className="px-6 pb-6">
        {/* Email/Password Form */}
        <form onSubmit={isRegister ? handleCredentialsRegister : handleCredentialsLogin} className="space-y-3">
          {/* Name field - only shown in register mode */}
          {isRegister && (
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('namePlaceholder')}
                className="input"
                autoFocus
              />
            </div>
          )}

          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
              placeholder="you@example.com"
              className={`input${emailError ? ' border-red-500' : ''}`}
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setAuthError('') }}
              placeholder={t('passwordPlaceholder')}
              className="input"
            />
          </div>

          {/* Confirm password field - only shown in register mode */}
          {isRegister && (
            <div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setAuthError('') }}
                placeholder={t('confirmPasswordPlaceholder')}
                className="input"
              />
            </div>
          )}

          {authError && (
            <p className="text-red-500 text-sm">{authError}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {isRegister ? t('registerButton') : t('loginButton')}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider - only shown in login mode */}
        {!isRegister && (
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200 dark:border-stone-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white dark:bg-stone-900 text-stone-400 dark:text-stone-500">{t('orRegister')}</span>
            </div>
          </div>
        )}

        {/* Mode switch link */}
        <p className="text-center text-stone-500 dark:text-stone-400 text-sm">
          {isRegister ? (
            <>
              {t('hasAccount')}{' '}
              <button
                type="button"
                onClick={() => handleSwitchMode('login')}
                className="text-teal-600 dark:text-teal-400 font-medium hover:underline"
              >
                {t('loginLink')}
              </button>
            </>
          ) : (
            <>
              {t('noAccount')}{' '}
              <button
                type="button"
                onClick={() => handleSwitchMode('register')}
                className="text-teal-600 dark:text-teal-400 font-medium hover:underline"
              >
                {t('registerLink')}
              </button>
            </>
          )}
        </p>

        <p className="text-center text-stone-400 dark:text-stone-500 text-xs mt-5 leading-relaxed">
          {isRegister
            ? t('termsRegister')
            : t('termsLogin')}
        </p>

        {/* Try Demo */}
        {onTryDemo && (
          <div className="mt-5 pt-5 border-t border-stone-200 dark:border-stone-700">
            <button
              onClick={onTryDemo}
              className="w-full py-2.5 px-4 rounded-lg border-2 border-dashed border-stone-300 dark:border-stone-600 text-stone-500 dark:text-stone-400 font-medium text-sm hover:border-teal-400 dark:hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              {t('tryDemo')}
            </button>
          </div>
        )}

        {/* Social proof */}
        <div className="mt-5 flex items-center justify-center gap-3 text-sm text-stone-400 dark:text-stone-500">
          <div className="flex -space-x-2">
            {['A', 'B', 'C', 'D'].map((i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full bg-stone-200 dark:bg-stone-700 border-2 border-white dark:border-stone-900 flex items-center justify-center text-xs font-medium text-stone-600 dark:text-stone-300"
              >
                {i}
              </div>
            ))}
          </div>
          <span>{t('usersUsing')}</span>
        </div>
      </DialogBody>
    </Dialog>
  )
}
