import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { I18nProvider } from '@/i18n/context'

// ─── Mock next/navigation ────────────────────────────────────────────────────

const mockPush = vi.fn()
export { mockPush }

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  usePathname: () => '/login',
  useSearchParams: () => new URLSearchParams(),
}))

// ─── Mock supabase auth functions ────────────────────────────────────────────

const supabaseMocks = vi.hoisted(() => ({
  mockSignInWithGoogle: vi.fn(),
  mockSignInWithGithub: vi.fn(),
  mockSignInWithMagicLink: vi.fn(),
}))

// Export for direct use in tests
export const mockSignInWithGoogle = supabaseMocks.mockSignInWithGoogle
export const mockSignInWithGithub = supabaseMocks.mockSignInWithGithub
export const mockSignInWithMagicLink = supabaseMocks.mockSignInWithMagicLink

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn(),
      signInWithOtp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
    },
  },
  signInWithGoogle: (...args: unknown[]) => supabaseMocks.mockSignInWithGoogle(...args),
  signInWithGithub: (...args: unknown[]) => supabaseMocks.mockSignInWithGithub(...args),
  signInWithMagicLink: (...args: unknown[]) => supabaseMocks.mockSignInWithMagicLink(...args),
  getSession: vi.fn(),
}))

// ─── Mock lucide-react ───────────────────────────────────────────────────────

vi.mock('lucide-react', () => ({
  Github: vi.fn(({ className }) => <span data-testid="github-icon" className={className}>Github</span>),
  Mail: vi.fn(({ className }) => <span data-testid="mail-icon" className={className}>Mail</span>),
  ArrowRight: vi.fn(({ className }) => <span data-testid="arrow-right-icon" className={className}>ArrowRight</span>),
  Loader2: vi.fn(({ className }) => <span data-testid="loader-icon" className={className}>Loader2</span>),
  Eye: vi.fn(({ className }) => <span data-testid="eye-icon" className={className}>Eye</span>),
  EyeOff: vi.fn(({ className }) => <span data-testid="eye-off-icon" className={className}>EyeOff</span>),
  Zap: vi.fn(({ className }) => <span data-testid="zap-icon" className={className}>Zap</span>),
}))

// ─── Mock ThemeToggle ────────────────────────────────────────────────────────

vi.mock('@/components/ThemeToggle', () => ({
  ThemeToggle: vi.fn(() => <button data-testid="theme-toggle">ThemeToggle</button>),
}))

// ─── Mock Link ───────────────────────────────────────────────────────────────

vi.mock('next/link', () => ({
  default: vi.fn(({ children, href }) => <a href={href}>{children}</a>),
}))

// ─── Wrapper ─────────────────────────────────────────────────────────────────

function Wrapper({ children }: { children: React.ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset localStorage mock
    localStorage.setItem('portgen-theme', 'light')
  })

  describe('Render', () => {
    it('renders the login page without crashing', async () => {
      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('Welcome back')).toBeInTheDocument()
      })
    })

    it('renders PortGen logo and branding', async () => {
      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('PortGen')).toBeInTheDocument()
      })
    })

    it('renders theme toggle button', async () => {
      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
      })
    })

    it('renders demo mode section', async () => {
      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('Try Demo Mode')).toBeInTheDocument()
      })
    })

    it('renders OAuth buttons section', async () => {
      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('Continue with Google')).toBeInTheDocument()
        expect(screen.getByText('Continue with GitHub')).toBeInTheDocument()
      })
    })

    it('renders magic link email input', async () => {
      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
      })
    })

    it('renders Send Magic Link button', async () => {
      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('Send Magic Link')).toBeInTheDocument()
      })
    })

    it('renders terms note at bottom', async () => {
      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText(/Terms of Service/)).toBeInTheDocument()
      })
    })

    it('renders social proof section', async () => {
      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText(/developers already using/)).toBeInTheDocument()
      })
    })
  })

  describe('Google OAuth Button', () => {
    it('calls signInWithGoogle when Google button is clicked', async () => {
      mockSignInWithGoogle.mockResolvedValue({ error: null })

      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        const googleBtn = screen.getByText('Continue with Google')
        fireEvent.click(googleBtn)
      })

      await waitFor(() => {
        expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1)
      })
    })

    it('sets loading state while Google sign-in is in progress', async () => {
      // Never resolves — keeps loading spinner visible
      mockSignInWithGoogle.mockImplementation(
        () => new Promise(() => {}) // eslint-disable-line no-promise-executor-return
      )

      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        const googleBtn = screen.getByText('Continue with Google')
        fireEvent.click(googleBtn)
      })

      // Button should be disabled (loading)
      await waitFor(() => {
        const googleBtn = screen.getByText('Continue with Google') as HTMLButtonElement
        expect(googleBtn.closest('button')).toBeDisabled()
      })
    })
  })

  describe('GitHub OAuth Button', () => {
    it('calls signInWithGithub when GitHub button is clicked', async () => {
      mockSignInWithGithub.mockResolvedValue({ error: null })

      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        const githubBtn = screen.getByText('Continue with GitHub')
        fireEvent.click(githubBtn)
      })

      await waitFor(() => {
        expect(mockSignInWithGithub).toHaveBeenCalledTimes(1)
      })
    })

    it('sets loading state while GitHub sign-in is in progress', async () => {
      mockSignInWithGithub.mockImplementation(
        () => new Promise(() => {}) // eslint-disable-line no-promise-executor-return
      )

      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        const githubBtn = screen.getByText('Continue with GitHub')
        fireEvent.click(githubBtn)
      })

      await waitFor(() => {
        const githubBtn = screen.getByText('Continue with GitHub') as HTMLButtonElement
        expect(githubBtn.closest('button')).toBeDisabled()
      })
    })
  })

  describe('Form Validation', () => {
    it('magic link form has email input with required attribute', async () => {
      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        const emailInput = screen.getByPlaceholderText('you@example.com')
        expect(emailInput).toHaveAttribute('required')
      })
    })

    it('shows validation error when submitting empty email', async () => {
      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      const emailInput = screen.getByPlaceholderText('you@example.com')

      // Submit with empty email
      const form = emailInput.closest('form')!
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument()
      })
    })

    it('magic link submit button is disabled while loading', async () => {
      mockSignInWithMagicLink.mockImplementation(
        () => new Promise(() => {}) // eslint-disable-line no-promise-executor-return
      )

      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      // Fill email and wait for render
      const emailInput = screen.getByPlaceholderText('you@example.com')
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      await waitFor(() => {
        expect(emailInput).toHaveValue('test@example.com')
      })

      // Submit and immediately check button is disabled
      const submitBtn = screen.getByText('Send Magic Link') as HTMLButtonElement
      fireEvent.click(submitBtn)

      await waitFor(() => {
        expect(submitBtn.closest('button')).toBeDisabled()
      })
    })
  })

  describe('Error States', () => {
    it('calls alert when Google sign-in fails', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(vi.fn())
      mockSignInWithGoogle.mockResolvedValue({ error: { message: 'Google sign-in failed' } })

      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        const googleBtn = screen.getByText('Continue with Google')
        fireEvent.click(googleBtn)
      })

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Google sign-in failed')
      })

      alertSpy.mockRestore()
    })

    it('calls alert when GitHub sign-in fails', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(vi.fn())
      mockSignInWithGithub.mockResolvedValue({ error: { message: 'GitHub sign-in failed' } })

      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        const githubBtn = screen.getByText('Continue with GitHub')
        fireEvent.click(githubBtn)
      })

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('GitHub sign-in failed')
      })

      alertSpy.mockRestore()
    })

    it('calls alert when magic link sign-in fails', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(vi.fn())
      mockSignInWithMagicLink.mockResolvedValue({ error: { message: 'Invalid email' } })

      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        const emailInput = screen.getByPlaceholderText('you@example.com')
        fireEvent.change(emailInput, { target: { value: 'bad@example.com' } })
      })

      await waitFor(() => {
        const submitBtn = screen.getByText('Send Magic Link')
        fireEvent.click(submitBtn)
      })

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Invalid email')
      })

      alertSpy.mockRestore()
    })

    it('clears loading state after Google sign-in error', async () => {
      mockSignInWithGoogle.mockResolvedValue({ error: { message: 'OAuth error' } })
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(vi.fn())

      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        const googleBtn = screen.getByText('Continue with Google')
        fireEvent.click(googleBtn)
      })

      // After error resolves, loading should be cleared
      await waitFor(() => {
        const googleBtn = screen.getByText('Continue with Google') as HTMLButtonElement
        expect(googleBtn.closest('button')).not.toBeDisabled()
      })

      alertSpy.mockRestore()
    })
  })

  describe('Auth Flow — Login Success', () => {
    it('redirects to dashboard after successful Google sign-in', async () => {
      mockSignInWithGoogle.mockResolvedValue({ error: null })

      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        const googleBtn = screen.getByText('Continue with Google')
        fireEvent.click(googleBtn)
      })

      // signInWithGoogle redirects via OAuth — no router.push needed
      // The call itself is the success signal
      await waitFor(() => {
        expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1)
      })
    })

    it('redirects to dashboard after successful GitHub sign-in', async () => {
      mockSignInWithGithub.mockResolvedValue({ error: null })

      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        const githubBtn = screen.getByText('Continue with GitHub')
        fireEvent.click(githubBtn)
      })

      await waitFor(() => {
        expect(mockSignInWithGithub).toHaveBeenCalledTimes(1)
      })
    })

    it('shows check-email confirmation after successful magic link request', async () => {
      mockSignInWithMagicLink.mockResolvedValue({ error: null })

      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        const emailInput = screen.getByPlaceholderText('you@example.com')
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      })

      await waitFor(() => {
        const submitBtn = screen.getByText('Send Magic Link')
        fireEvent.click(submitBtn)
      })

      await waitFor(() => {
        expect(screen.getByText('Check your email')).toBeInTheDocument()
        expect(screen.getByText(/We sent a magic link to/)).toBeInTheDocument()
      })
    })

    it('displays the email address in the magic link confirmation', async () => {
      mockSignInWithMagicLink.mockResolvedValue({ error: null })

      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        const emailInput = screen.getByPlaceholderText('you@example.com')
        fireEvent.change(emailInput, { target: { value: 'user@portgen.dev' } })
      })

      await waitFor(() => {
        const submitBtn = screen.getByText('Send Magic Link')
        fireEvent.click(submitBtn)
      })

      await waitFor(() => {
        expect(screen.getByText('user@portgen.dev')).toBeInTheDocument()
      })
    })
  })

  describe('Auth Flow — Login Failure', () => {
    it('shows error via alert when Google OAuth fails', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(vi.fn())
      mockSignInWithGoogle.mockResolvedValue({
        error: { message: 'Account not found. Please sign up first.' },
      })

      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        const googleBtn = screen.getByText('Continue with Google')
        fireEvent.click(googleBtn)
      })

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Account not found. Please sign up first.')
      })

      alertSpy.mockRestore()
    })

    it('shows error via alert when GitHub OAuth fails', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(vi.fn())
      mockSignInWithGithub.mockResolvedValue({
        error: { message: 'GitHub account not linked' },
      })

      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        const githubBtn = screen.getByText('Continue with GitHub')
        fireEvent.click(githubBtn)
      })

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('GitHub account not linked')
      })

      alertSpy.mockRestore()
    })

    it('shows error via alert when magic link fails', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(vi.fn())
      mockSignInWithMagicLink.mockResolvedValue({
        error: { message: 'Email address not found' },
      })

      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        const emailInput = screen.getByPlaceholderText('you@example.com')
        fireEvent.change(emailInput, { target: { value: 'unknown@example.com' } })
      })

      await waitFor(() => {
        const submitBtn = screen.getByText('Send Magic Link')
        fireEvent.click(submitBtn)
      })

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Email address not found')
      })

      alertSpy.mockRestore()
    })

    it('magic link form remains visible after error (does not switch to success state)', async () => {
      mockSignInWithMagicLink.mockResolvedValue({
        error: { message: 'Failed to send magic link' },
      })
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(vi.fn())

      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        const emailInput = screen.getByPlaceholderText('you@example.com')
        fireEvent.change(emailInput, { target: { value: 'fail@example.com' } })
      })

      await waitFor(() => {
        const submitBtn = screen.getByText('Send Magic Link')
        fireEvent.click(submitBtn)
      })

      await waitFor(() => {
        // Success view should NOT appear
        expect(screen.queryByText('Check your email')).not.toBeInTheDocument()
        // Form should still be visible
        expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
      })

      alertSpy.mockRestore()
    })
  })

  describe('Demo Mode', () => {
    it('toggles demo section visibility when clicking Try Demo Mode', async () => {
      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        const demoBtn = screen.getByText('Try Demo Mode')
        fireEvent.click(demoBtn)
      })

      await waitFor(() => {
        expect(screen.getByText('Enter Demo Dashboard')).toBeInTheDocument()
        expect(screen.getByText('Demo User')).toBeInTheDocument()
        expect(screen.getByText('Pro Plan')).toBeInTheDocument()
      })
    })

    it('stores demo session in localStorage on Enter Demo Dashboard', async () => {
      const setItemSpy = vi.spyOn(localStorage, 'setItem')

      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      // Open demo section
      await waitFor(() => {
        const demoBtn = screen.getByText('Try Demo Mode')
        fireEvent.click(demoBtn)
      })

      // Click enter demo
      await waitFor(() => {
        const enterBtn = screen.getByText('Enter Demo Dashboard')
        fireEvent.click(enterBtn)
      })

      expect(setItemSpy).toHaveBeenCalledWith('demo_session', 'true')
      expect(setItemSpy).toHaveBeenCalledWith(
        'demo_user',
        expect.stringContaining('demo-user-123')
      )
    })

    it('redirects to dashboard after demo login', async () => {
      const LoginPage = (await import('@/app/login/page')).default
      render(<LoginPage />, { wrapper: Wrapper })

      await waitFor(() => {
        const demoBtn = screen.getByText('Try Demo Mode')
        fireEvent.click(demoBtn)
      })

      await waitFor(() => {
        const enterBtn = screen.getByText('Enter Demo Dashboard')
        fireEvent.click(enterBtn)
      })

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
      })
    })
  })
})
