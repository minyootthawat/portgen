import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { I18nProvider } from '@/i18n/context'
import type { Portfolio } from '@/types'

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

// Mock supabase
const mockGetSession = vi.fn()
const mockGetPortfolios = vi.fn()
const mockSupabaseFrom = vi.fn()
const mockSupabaseSelect = vi.fn()
const mockSupabaseEq = vi.fn()
const mockSupabaseSingle = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: mockSupabaseFrom,
    auth: {
      getSession: mockGetSession,
      signOut: vi.fn(),
    },
  },
  getSession: mockGetSession,
  getPortfolios: mockGetPortfolios,
}))

function Wrapper({ children }: { children: React.ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>
}

const createMockPortfolio = (overrides: Partial<Portfolio> = {}): Portfolio => ({
  id: 'test-id-1',
  user_id: 'user-123',
  slug: 'test-portfolio',
  subdomain: 'testuser',
  name: 'Test User',
  tagline: 'Full-Stack Developer',
  about: 'Test about',
  avatar_url: 'https://example.com/avatar.png',
  skills: [
    { id: '1', name: 'React', level: 'expert' },
    { id: '2', name: 'TypeScript', level: 'intermediate' },
  ],
  projects: [
    {
      id: 'p1',
      title: 'Test Project',
      description: 'A test project',
      tags: ['React'],
      live_url: 'https://example.com',
      repo_url: 'https://github.com/example',
      order: 0,
    },
  ],
  social_links: [{ id: 's1', platform: 'github' as const, url: 'https://github.com/test', label: 'GitHub' }],
  theme: 'minimal-light',
  theme_config: {},
  is_published: true,
  is_deleted: false,
  view_count: 42,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  published_at: new Date().toISOString(),
  ...overrides,
})

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock: authenticated user, empty portfolios
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: { id: 'user-123', email: 'test@example.com', name: 'Test User' },
        },
      },
    })

    mockSupabaseFrom.mockReturnValue({
      select: mockSupabaseSelect.mockReturnValue({
        eq: mockSupabaseEq.mockReturnValue({
          single: mockSupabaseSingle.mockResolvedValue({ data: { plan: 'free' }, error: null }),
        }),
      }),
    })
  })

  describe('Loading State', () => {
    it('shows loading skeleton while fetching portfolios', async () => {
      // Delay the getPortfolios call to keep loading state
      mockGetPortfolios.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 100))
      )

      const DashboardPage = (await import('@/app/dashboard/page')).default

      render(<DashboardPage />, { wrapper: Wrapper })

      // While loading, should show the Loader2 spinner
      await waitFor(() => {
        expect(document.body.innerHTML).toContain('animate-spin')
      })
    })
  })

  describe('Empty State', () => {
    it('shows empty state when no portfolios exist', async () => {
      mockGetPortfolios.mockResolvedValue({ data: [], error: null })

      const DashboardPage = (await import('@/app/dashboard/page')).default

      render(<DashboardPage />, { wrapper: Wrapper })

      await waitFor(() => {
        // Thai: "ยังไม่มีพอร์ตโฟลิโอ" = "No portfolios yet"
        expect(screen.getByText(/ยังไม่มีพอร์ตโฟลิโอ/)).toBeInTheDocument()
      })

      expect(screen.getByText(/สร้างพอร์ตโฟลิโอแรกและแชร์ให้โลกเห็น/)).toBeInTheDocument()
    })

    it('shows correct empty state subtitle when no portfolios', async () => {
      mockGetPortfolios.mockResolvedValue({ data: [], error: null })

      const DashboardPage = (await import('@/app/dashboard/page')).default

      render(<DashboardPage />, { wrapper: Wrapper })

      await waitFor(() => {
        // Text appears in subtitle AND in button, so getAllByText is correct
        const elements = screen.getAllByText(/สร้างพอร์ตโฟลิโอแรกของคุณ/)
        expect(elements.length).toBe(2)
      })
    })
  })

  describe('Portfolio List', () => {
    it('renders portfolio list when portfolios exist', async () => {
      const portfolios = [
        createMockPortfolio({ name: 'First Portfolio' }),
        createMockPortfolio({ id: 'test-id-2', name: 'Second Portfolio', is_published: false }),
      ]

      mockGetPortfolios.mockResolvedValue({ data: portfolios, error: null })

      const DashboardPage = (await import('@/app/dashboard/page')).default

      render(<DashboardPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('First Portfolio')).toBeInTheDocument()
        expect(screen.getByText('Second Portfolio')).toBeInTheDocument()
      })
    })

    it('shows correct portfolio count in subtitle', async () => {
      const portfolios = [
        createMockPortfolio({ id: '1', name: 'Portfolio One' }),
        createMockPortfolio({ id: '2', name: 'Portfolio Two' }),
        createMockPortfolio({ id: '3', name: 'Portfolio Three' }),
      ]

      mockGetPortfolios.mockResolvedValue({ data: portfolios, error: null })

      const DashboardPage = (await import('@/app/dashboard/page')).default

      render(<DashboardPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('3 portfolios')).toBeInTheDocument()
      })
    })

    it('shows Live badge for published portfolios', async () => {
      const portfolio = createMockPortfolio({ is_published: true, view_count: 100 })
      mockGetPortfolios.mockResolvedValue({ data: [portfolio], error: null })

      const DashboardPage = (await import('@/app/dashboard/page')).default

      render(<DashboardPage />, { wrapper: Wrapper })

      await waitFor(() => {
        // Thai: "เผยแพร่แล้ว" = "Live" / "Published"
        const liveBadges = screen.getAllByText(/เผยแพร่แล้ว/)
        expect(liveBadges.length).toBeGreaterThan(0)
      })
    })

    it('shows Draft badge for unpublished portfolios', async () => {
      const portfolio = createMockPortfolio({ is_published: false })
      mockGetPortfolios.mockResolvedValue({ data: [portfolio], error: null })

      const DashboardPage = (await import('@/app/dashboard/page')).default

      render(<DashboardPage />, { wrapper: Wrapper })

      await waitFor(() => {
        // Thai: "ฉบับร่าง" = "Draft"
        expect(screen.getByText(/ฉบับร่าง/)).toBeInTheDocument()
      })
    })

    it('shows view count for published portfolios', async () => {
      const portfolio = createMockPortfolio({ is_published: true, view_count: 1247 })
      mockGetPortfolios.mockResolvedValue({ data: [portfolio], error: null })

      const DashboardPage = (await import('@/app/dashboard/page')).default

      render(<DashboardPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText(/1,247 views/)).toBeInTheDocument()
      })
    })

    it('shows skill tags for each portfolio', async () => {
      const portfolio = createMockPortfolio({
        skills: [
          { id: '1', name: 'React', level: 'expert' },
          { id: '2', name: 'TypeScript', level: 'intermediate' },
          { id: '3', name: 'Node.js', level: 'beginner' },
          { id: '4', name: 'Python', level: 'intermediate' },
        ],
      })
      mockGetPortfolios.mockResolvedValue({ data: [portfolio], error: null })

      const DashboardPage = (await import('@/app/dashboard/page')).default

      render(<DashboardPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument()
        expect(screen.getByText('TypeScript')).toBeInTheDocument()
        expect(screen.getByText('+1')).toBeInTheDocument() // +1 for Python beyond the 3 shown
      })
    })

    it('shows Edit button for each portfolio', async () => {
      const portfolio = createMockPortfolio()
      mockGetPortfolios.mockResolvedValue({ data: [portfolio], error: null })

      const DashboardPage = (await import('@/app/dashboard/page')).default

      render(<DashboardPage />, { wrapper: Wrapper })

      await waitFor(() => {
        // Thai: "แก้ไข" = "Edit"
        const editButtons = screen.getAllByText(/แก้ไข/)
        expect(editButtons.length).toBeGreaterThan(0)
      })
    })

    it('shows subdomain URL for each portfolio', async () => {
      const portfolio = createMockPortfolio({ subdomain: 'johndoe' })
      mockGetPortfolios.mockResolvedValue({ data: [portfolio], error: null })

      const DashboardPage = (await import('@/app/dashboard/page')).default

      render(<DashboardPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('johndoe.portgen.com')).toBeInTheDocument()
      })
    })
  })
})
