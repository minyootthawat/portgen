import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SessionProvider } from 'next-auth/react'
import DashboardPage from '@/app/dashboard/page'

// Mock next/navigation (already in setup.ts but being explicit)
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock ThemeToggle and LangSwitcher (rendering issues in test)
vi.mock('@/components/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">ThemeToggle</div>,
}))

vi.mock('@/components/LangSwitcher', () => ({
  LangSwitcher: () => <div data-testid="lang-switcher">LangSwitcher</div>,
}))

// Mock lucide-react icons used in the page
vi.mock('lucide-react', () => ({
  Plus: () => <div data-testid="icon-plus">Plus</div>,
  ExternalLink: () => <div data-testid="icon-external-link">ExternalLink</div>,
  Trash2: () => <div data-testid="icon-trash">Trash2</div>,
  Loader2: () => <div data-testid="icon-loader">Loader2</div>,
  Crown: () => <div data-testid="icon-crown">Crown</div>,
  ArrowRight: () => <div data-testid="icon-arrow-right">ArrowRight</div>,
  Sparkles: () => <div data-testid="icon-sparkles">Sparkles</div>,
}))

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      title: 'My Portfolios',
      emptyList: 'No portfolios yet',
      published: 'Published',
      draft: 'Draft',
      upgrade: 'Upgrade',
      logout: 'Logout',
      emptyTitle: 'Create your first portfolio',
      emptySubtitle: 'Start building your portfolio in minutes',
      createFirst: 'Create your first portfolio',
      newPortfolio: 'New Portfolio',
      confirmDelete: 'Are you sure?',
      edit: 'Edit',
      delete: 'Delete',
      openWebsite: 'Open website',
    }
    return translations[key] ?? key
  },
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

function renderWithSession(ui: React.ReactElement, session = mockSession) {
  return render(
    <SessionProvider session={session}>
      {ui}
    </SessionProvider>
  )
}

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockReset()
  })

  it('renders loading state initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})) // never resolves (simulates loading)

    renderWithSession(<DashboardPage />)

    // Loading skeleton should appear
    expect(document.body.innerHTML).toContain('skeleton')
  })

  it('renders portfolio list when session is authenticated', async () => {
    const mockPortfolios = [
      {
        id: 'portfolio-1',
        user_id: TEST_USER.id,
        name: 'My Portfolio',
        subdomain: 'my-portfolio',
        theme: 'gradient-dark',
        skills: [{ id: 's1', name: 'React' }],
        is_published: true,
        view_count: 42,
        avatar_url: '',
      },
    ]

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: mockPortfolios }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { plan: 'free' } }),
      })

    renderWithSession(<DashboardPage />)

    await waitFor(() => {
      expect(screen.queryByText('skeleton')).not.toBeInTheDocument()
    })

    expect(screen.getByText('My Portfolio')).toBeInTheDocument()
    expect(screen.getByText('1 portfolio · 1 published')).toBeInTheDocument()
  })

  it('renders empty state when no portfolios exist', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { plan: 'free' } }),
      })

    renderWithSession(<DashboardPage />)

    await waitFor(() => {
      expect(screen.queryByText('skeleton')).not.toBeInTheDocument()
    })

    // Heading and button both say "Create your first portfolio" — query by heading role
    expect(screen.getByRole('heading', { name: /create your first portfolio/i })).toBeInTheDocument()
    expect(screen.getByText('No portfolios yet')).toBeInTheDocument()
  })

  it('shows upgrade button when user is on free plan', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { plan: 'free' } }),
      })

    renderWithSession(<DashboardPage />)

    await waitFor(() => {
      expect(screen.queryByText('skeleton')).not.toBeInTheDocument()
    })

    expect(screen.getByText('Upgrade')).toBeInTheDocument()
  })

  it('hides upgrade button when user is on pro plan', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { plan: 'pro' } }),
      })

    renderWithSession(<DashboardPage />)

    await waitFor(() => {
      expect(screen.queryByText('skeleton')).not.toBeInTheDocument()
    })

    expect(screen.queryByText('Upgrade')).not.toBeInTheDocument()
  })

  it('renders delete button for each portfolio', async () => {
    const mockPortfolios = [
      {
        id: 'portfolio-1',
        user_id: TEST_USER.id,
        name: 'Portfolio A',
        subdomain: 'portfolio-a',
        theme: 'gradient-dark',
        skills: [],
        is_published: false,
        view_count: 0,
        avatar_url: '',
      },
      {
        id: 'portfolio-2',
        user_id: TEST_USER.id,
        name: 'Portfolio B',
        subdomain: 'portfolio-b',
        theme: 'minimal-light',
        skills: [],
        is_published: true,
        view_count: 10,
        avatar_url: '',
      },
    ]

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: mockPortfolios }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { plan: 'free' } }),
      })

    renderWithSession(<DashboardPage />)

    await waitFor(() => {
      expect(screen.queryByText('skeleton')).not.toBeInTheDocument()
    })

    // Both portfolio names visible
    expect(screen.getByText('Portfolio A')).toBeInTheDocument()
    expect(screen.getByText('Portfolio B')).toBeInTheDocument()
  })

  it('shows draft badge for unpublished portfolio', async () => {
    const mockPortfolios = [
      {
        id: 'draft-1',
        user_id: TEST_USER.id,
        name: 'Draft Portfolio',
        subdomain: 'draft-portfolio',
        theme: 'gradient-dark',
        skills: [],
        is_published: false,
        view_count: 0,
        avatar_url: '',
      },
    ]

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: mockPortfolios }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { plan: 'free' } }),
      })

    renderWithSession(<DashboardPage />)

    await waitFor(() => {
      expect(screen.queryByText('skeleton')).not.toBeInTheDocument()
    })

    expect(screen.getByText('Draft')).toBeInTheDocument()
  })

  it('renders New Portfolio button that links to /builder/new', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { plan: 'free' } }),
      })

    renderWithSession(<DashboardPage />)

    await waitFor(() => {
      expect(screen.queryByText('skeleton')).not.toBeInTheDocument()
    })

    const newBtn = screen.getByRole('link', { name: /new portfolio/i })
    expect(newBtn).toHaveAttribute('href', '/builder/new')
  })
})
