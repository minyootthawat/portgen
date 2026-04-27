import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import BuilderPage from '@/app/builder/[id]/page'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  usePathname: () => '/builder/new',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Loader2: () => <div data-testid="icon-loader">Loader2</div>,
  Sparkles: () => <div data-testid="icon-sparkles">Sparkles</div>,
}))

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      loading: 'Loading...',
      publish: 'Publish',
      unpublish: 'Unpublish',
      saving: 'Saving...',
    }
    return translations[key] ?? key
  },
}))

// Mock BuilderEditor component (heavy external component)
vi.mock('@/components/builder/BuilderEditor', () => ({
  BuilderEditor: ({
    portfolioId,
    isNew,
    initialName,
    initialTheme,
    userId,
  }: {
    portfolioId: string
    isNew: boolean
    initialName: string
    initialTheme: string
    userId: string
    onPublishSuccess: () => void
  }) => (
    <div data-testid="builder-editor">
      <span data-testid="portfolio-id">{portfolioId}</span>
      <span data-testid="is-new">{String(isNew)}</span>
      <span data-testid="initial-name">{initialName}</span>
      <span data-testid="initial-theme">{initialTheme}</span>
      <span data-testid="user-id">{userId}</span>
    </div>
  ),
}))

// Mock fetch for API calls
const mockFetch = vi.fn()
global.fetch = mockFetch

const TEST_USER = {
  id: '69ef7ace5ada30fbc73acb52',
  email: 'test@test.com',
  name: 'Test User',
}

const mockSession = {
  user: TEST_USER,
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

function renderBuilderPage(params: { id: string }, session = mockSession) {
  return render(
    <SessionProvider session={session}>
      <BuilderPage params={params} />
    </SessionProvider>
  )
}

describe('Builder Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockReset()
  })

  it('renders loading state initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})) // never resolves (loading)

    const { getByTestId } = renderBuilderPage({ id: 'new' })

    expect(getByTestId('icon-loader')).toBeInTheDocument()
  })

  it('loads BuilderEditor with isNew=true when id is "new"', async () => {
    // For "new", no API fetch needed — it just sets defaults
    renderBuilderPage({ id: 'new' })

    await waitFor(() => {
      expect(document.body.innerHTML).not.toContain('icon-loader')
    })

    expect(document.querySelector('[data-testid="portfolio-id"]')?.textContent).toBe('new')
    expect(document.querySelector('[data-testid="is-new"]')?.textContent).toBe('true')
  })

  it('loads existing portfolio from API when id is not "new"', async () => {
    const mockPortfolio = {
      data: {
        id: 'portfolio-abc',
        user_id: TEST_USER.id,
        name: 'My Existing Portfolio',
        theme: 'minimal-light',
        subdomain: 'my-existing',
        skills: [],
        projects: [],
        social_links: [],
        custom_sections: [],
      },
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPortfolio),
    })

    renderBuilderPage({ id: 'portfolio-abc' })

    await waitFor(() => {
      expect(document.body.innerHTML).not.toContain('icon-loader')
    })

    expect(document.querySelector('[data-testid="portfolio-id"]')?.textContent).toBe('portfolio-abc')
    expect(document.querySelector('[data-testid="is-new"]')?.textContent).toBe('false')
    expect(document.querySelector('[data-testid="initial-name"]')?.textContent).toBe('My Existing Portfolio')
    expect(document.querySelector('[data-testid="initial-theme"]')?.textContent).toBe('minimal-light')
  })

  it('passes correct userId to BuilderEditor', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: { name: 'Test', theme: 'gradient-dark', skills: [], projects: [], social_links: [], custom_sections: [] } }),
    })

    renderBuilderPage({ id: 'portfolio-xyz' })

    await waitFor(() => {
      expect(document.body.innerHTML).not.toContain('icon-loader')
    })

    expect(document.querySelector('[data-testid="user-id"]')?.textContent).toBe(TEST_USER.id)
  })

  it('handles API error gracefully and loads with defaults', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Server error' }),
    })

    renderBuilderPage({ id: 'portfolio-broken' })

    await waitFor(() => {
      expect(document.body.innerHTML).not.toContain('icon-loader')
    })

    // Should still render BuilderEditor with default values
    expect(document.querySelector('[data-testid="builder-editor"]')).toBeInTheDocument()
  })

  it('uses default theme when portfolio has no theme', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: { name: '', theme: null, skills: [], projects: [], social_links: [], custom_sections: [] } }),
    })

    renderBuilderPage({ id: 'no-theme' })

    await waitFor(() => {
      expect(document.body.innerHTML).not.toContain('icon-loader')
    })

    // Default theme is 'gradient-dark'
    expect(document.querySelector('[data-testid="initial-theme"]')?.textContent).toBe('gradient-dark')
  })
})
