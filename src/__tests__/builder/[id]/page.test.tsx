import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { I18nProvider } from '@/i18n/context'
import type { Portfolio, BuilderStep } from '@/types'

// Mock next/navigation
const mockPush = vi.fn()
const mockReplace = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Eye: vi.fn(({ className }) => <span data-testid="eye-icon" className={className}>Eye</span>),
  Save: vi.fn(({ className }) => <span data-testid="save-icon" className={className}>Save</span>),
  Rocket: vi.fn(({ className }) => <span data-testid="rocket-icon" className={className}>Rocket</span>),
  ChevronLeft: vi.fn(({ className }) => <span data-testid="chevron-left" className={className}>ChevronLeft</span>),
  ChevronRight: vi.fn(({ className }) => <span data-testid="chevron-right" className={className}>ChevronRight</span>),
  Code: vi.fn(({ className }) => <span data-testid="code-icon" className={className}>Code</span>),
  Check: vi.fn(({ className }) => <span data-testid="check-icon" className={className}>Check</span>),
  Loader2: vi.fn(({ className }) => <span data-testid="loader" className={className}>Loader2</span>),
  X: vi.fn(({ className }) => <span data-testid="x-icon" className={className}>X</span>),
}))

// Mock i18n
const mockT = vi.fn((key: string) => {
  const translations: Record<string, any> = {
    builder: {
      dashboard: 'Dashboard',
      new: 'New Portfolio',
      editing: 'Editing',
      untitled: 'Untitled',
      jsxEditor: 'JSX Editor',
      previewStep: {
        title: 'Preview',
        publishNow: 'Publish Now',
        willBeLive: 'Your portfolio will be live at:',
        whatsIncluded: 'What\'s included:',
      },
      hidePreview: 'Hide Preview',
      save: 'Save',
      publish: 'Publish',
      previous: 'Previous',
      next: 'Next',
      stepOf: 'Step',
      of: 'of',
      info: {
        title: 'Basic Info',
        subtitle: 'Tell us about yourself',
        name: 'Name',
        namePlaceholder: 'Your full name',
        tagline: 'Tagline',
        taglinePlaceholder: 'Your tagline',
        about: 'About',
        aboutPlaceholder: 'Tell us about yourself',
        avatarUrl: 'Avatar URL',
        avatarUrlPlaceholder: 'https://example.com/avatar.jpg',
      },
      skills: {
        title: 'Skills',
        subtitle: 'Add your skills',
        placeholder: 'Type a skill and press Enter',
        noSkills: 'No skills added yet',
      },
      projects: {
        title: 'Projects',
        subtitle: 'Showcase your work',
        addProject: 'Add Project',
        noProjects: 'No projects yet',
        addFirst: 'Add your first project',
        projectN: 'Project',
        remove: 'Remove',
        titlePlaceholder: 'Project title',
        descPlaceholder: 'Project description',
        liveUrl: 'Live URL',
        repoUrl: 'Repo URL',
      },
      social: {
        title: 'Social Links',
        subtitle: 'Connect with me',
        placeholder: 'https://...',
        add: 'Add',
      },
      theme: {
        title: 'Choose Theme',
        subtitle: 'Pick a style for your portfolio',
      },
      steps: {
        skills: 'Skills',
        projects: 'Projects',
        social: 'Social Links',
        theme: 'Theme',
      },
    },
    common: {
      next: 'Next',
    },
  }

  const keys = key.split('.')
  let value: any = translations
  for (const k of keys) {
    value = value?.[k]
  }
  return value || key
})

vi.mock('@/i18n/context', () => ({
  useI18n: () => ({ t: mockT }),
  I18nProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock store
const mockSetStep = vi.fn()
const mockStoreUpdatePortfolio = vi.fn()
const mockReset = vi.fn()

vi.mock('@/lib/store', () => ({
  useBuilderStore: vi.fn(() => ({
    portfolio: {
      id: 'test-portfolio-id',
      user_id: 'user-123',
      name: 'Test User',
      tagline: 'Full-Stack Developer',
      about: 'Test about section',
      avatar_url: '',
      skills: [],
      projects: [],
      social_links: [],
      theme: 'gradient-dark',
      theme_config: {},
      is_published: false,
    },
    step: 'info',
    setStep: mockSetStep,
    updatePortfolio: mockStoreUpdatePortfolio,
    reset: mockReset,
  })),
}))

// Mock supabase
const mockGetSession = vi.fn()
const mockGetPortfolio = vi.fn()
const mockCreatePortfolio = vi.fn()
const mockSupabaseUpdatePortfolio = vi.fn()
const mockPublishPortfolio = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getSession: mockGetSession,
    },
  },
  getSession: mockGetSession,
  getPortfolio: mockGetPortfolio,
  createPortfolio: mockCreatePortfolio,
  updatePortfolio: mockSupabaseUpdatePortfolio,
  publishPortfolio: mockPublishPortfolio,
}))

// Mock builder components
vi.mock('@/components/builder/BuilderSteps', () => ({
  BuilderSteps: vi.fn(({ currentStep, onStepClick }) => (
    <div data-testid="builder-steps" data-current={currentStep}>
      BuilderSteps Component
    </div>
  )),
}))

vi.mock('@/components/builder/ThemeSelector', () => ({
  ThemeSelector: vi.fn(({ selected, onSelect }) => (
    <div data-testid="theme-selector" data-selected={selected}>
      ThemeSelector Component
    </div>
  )),
}))

vi.mock('@/components/builder/JSXEditor', () => ({
  JSXEditor: vi.fn(({ portfolio, onChange, onClose }) => (
    <div data-testid="jsx-editor">
      JSXEditor Component
    </div>
  )),
}))

vi.mock('@/components/builder/PortfolioPreview', () => ({
  PortfolioPreview: vi.fn(({ portfolio }) => (
    <div data-testid="portfolio-preview">
      PortfolioPreview Component
    </div>
  )),
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
  theme: 'gradient-dark',
  theme_config: {},
  is_published: true,
  is_deleted: false,
  view_count: 42,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  published_at: new Date().toISOString(),
  ...overrides,
})

describe('Builder Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: { id: 'user-123', email: 'test@example.com', name: 'Test User' },
        },
      },
    })
  })

  describe('Loading State', () => {
    it('shows loading spinner while fetching data', async () => {
      mockGetSession.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({
          data: {
            session: {
              user: { id: 'user-123', email: 'test@example.com', name: 'Test User' },
            },
          },
        }), 100))
      )

      const BuilderPage = (await import('@/app/builder/[id]/page')).default

      render(<BuilderPage params={{ id: 'test-id' }} />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(document.body.innerHTML).toContain('animate-spin')
      })
    })
  })

  describe('Authenticated User', () => {
    it('renders builder page with navigation', async () => {
      mockGetPortfolio.mockResolvedValue({
        data: createMockPortfolio(),
        error: null,
      })

      const BuilderPage = (await import('@/app/builder/[id]/page')).default

      render(<BuilderPage params={{ id: 'test-id' }} />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
      })
    })

    it('shows JSX Editor and Preview buttons', async () => {
      mockGetPortfolio.mockResolvedValue({
        data: createMockPortfolio(),
        error: null,
      })

      const BuilderPage = (await import('@/app/builder/[id]/page')).default

      render(<BuilderPage params={{ id: 'test-id' }} />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('JSX Editor')).toBeInTheDocument()
        expect(screen.getByText('Preview')).toBeInTheDocument()
        expect(screen.getByText('Save')).toBeInTheDocument()
        expect(screen.getByText('Publish')).toBeInTheDocument()
      })
    })

    it('renders BuilderSteps component', async () => {
      mockGetPortfolio.mockResolvedValue({
        data: createMockPortfolio(),
        error: null,
      })

      const BuilderPage = (await import('@/app/builder/[id]/page')).default

      render(<BuilderPage params={{ id: 'test-id' }} />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByTestId('builder-steps')).toBeInTheDocument()
      })
    })

    it('renders ThemeSelector component when on theme step', async () => {
      // Re-mock store with theme step
      vi.doMock('@/lib/store', () => ({
        useBuilderStore: vi.fn(() => ({
          portfolio: createMockPortfolio(),
          step: 'theme',
          setStep: mockSetStep,
          updatePortfolio: mockStoreUpdatePortfolio,
          reset: mockReset,
        })),
      }))

      const BuilderPage = (await import('@/app/builder/[id]/page')).default

      render(<BuilderPage params={{ id: 'test-id' }} />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByTestId('theme-selector')).toBeInTheDocument()
      })
    })

    it('shows JSXEditor when JSX Editor button is clicked', async () => {
      mockGetPortfolio.mockResolvedValue({
        data: createMockPortfolio(),
        error: null,
      })

      const BuilderPage = (await import('@/app/builder/[id]/page')).default

      render(<BuilderPage params={{ id: 'test-id' }} />, { wrapper: Wrapper })

      await waitFor(() => {
        const jsxEditorBtn = screen.getByText('JSX Editor')
        fireEvent.click(jsxEditorBtn)
      })

      await waitFor(() => {
        expect(screen.getByTestId('jsx-editor')).toBeInTheDocument()
      })
    })

    it('shows PortfolioPreview when Preview button is clicked', async () => {
      mockGetPortfolio.mockResolvedValue({
        data: createMockPortfolio(),
        error: null,
      })

      const BuilderPage = (await import('@/app/builder/[id]/page')).default

      render(<BuilderPage params={{ id: 'test-id' }} />, { wrapper: Wrapper })

      await waitFor(() => {
        const previewBtn = screen.getByText('Preview')
        fireEvent.click(previewBtn)
      })

      await waitFor(() => {
        expect(screen.getByTestId('portfolio-preview')).toBeInTheDocument()
      })
    })

    it('calls updatePortfolio when saving', async () => {
      mockGetPortfolio.mockResolvedValue({
        data: createMockPortfolio(),
        error: null,
      })
      mockStoreUpdatePortfolio.mockResolvedValue({ error: null })

      const BuilderPage = (await import('@/app/builder/[id]/page')).default

      render(<BuilderPage params={{ id: 'test-id' }} />, { wrapper: Wrapper })

      await waitFor(() => {
        const saveBtn = screen.getByText('Save')
        fireEvent.click(saveBtn)
      })

      await waitFor(() => {
        expect(mockStoreUpdatePortfolio).toHaveBeenCalled()
      })
    })
  })

  describe('New Portfolio Mode', () => {
    it('shows "New Portfolio" title when id is "new"', async () => {
      mockGetSession.mockResolvedValue({
        data: {
          session: {
            user: { id: 'user-123', email: 'test@example.com', name: 'Test User' },
          },
        },
      })

      const BuilderPage = (await import('@/app/builder/[id]/page')).default

      render(<BuilderPage params={{ id: 'new' }} />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('New Portfolio')).toBeInTheDocument()
      })
    })
  })

  describe('Navigation', () => {
    it('renders step navigation buttons', async () => {
      mockGetPortfolio.mockResolvedValue({
        data: createMockPortfolio(),
        error: null,
      })

      const BuilderPage = (await import('@/app/builder/[id]/page')).default

      render(<BuilderPage params={{ id: 'test-id' }} />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('Previous')).toBeInTheDocument()
        expect(screen.getByText('Next')).toBeInTheDocument()
      })
    })

    it('navigates to dashboard when clicking dashboard link', async () => {
      mockGetPortfolio.mockResolvedValue({
        data: createMockPortfolio(),
        error: null,
      })

      const BuilderPage = (await import('@/app/builder/[id]/page')).default

      render(<BuilderPage params={{ id: 'test-id' }} />, { wrapper: Wrapper })

      await waitFor(() => {
        const dashboardBtn = screen.getByText('Dashboard')
        fireEvent.click(dashboardBtn)
      })

      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  describe('Step Content', () => {
    it('renders info step fields', async () => {
      mockGetPortfolio.mockResolvedValue({
        data: createMockPortfolio(),
        error: null,
      })

      const BuilderPage = (await import('@/app/builder/[id]/page')).default

      render(<BuilderPage params={{ id: 'test-id' }} />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('Basic Info')).toBeInTheDocument()
        expect(screen.getByText('Name')).toBeInTheDocument()
        expect(screen.getByText('Tagline')).toBeInTheDocument()
        expect(screen.getByText('About')).toBeInTheDocument()
      })
    })

    it('renders skills step with add skill input', async () => {
      // Re-mock store with skills step
      vi.doMock('@/lib/store', () => ({
        useBuilderStore: vi.fn(() => ({
          portfolio: createMockPortfolio(),
          step: 'skills',
          setStep: mockSetStep,
          updatePortfolio: mockStoreUpdatePortfolio,
          reset: mockReset,
        })),
      }))

      const BuilderPage = (await import('@/app/builder/[id]/page')).default

      render(<BuilderPage params={{ id: 'test-id' }} />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('Skills')).toBeInTheDocument()
      })
    })

    it('renders projects step', async () => {
      // Re-mock store with projects step
      vi.doMock('@/lib/store', () => ({
        useBuilderStore: vi.fn(() => ({
          portfolio: createMockPortfolio(),
          step: 'projects',
          setStep: mockSetStep,
          updatePortfolio: mockStoreUpdatePortfolio,
          reset: mockReset,
        })),
      }))

      const BuilderPage = (await import('@/app/builder/[id]/page')).default

      render(<BuilderPage params={{ id: 'test-id' }} />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('Projects')).toBeInTheDocument()
      })
    })

    it('renders social step', async () => {
      // Re-mock store with social step
      vi.doMock('@/lib/store', () => ({
        useBuilderStore: vi.fn(() => ({
          portfolio: createMockPortfolio(),
          step: 'social',
          setStep: mockSetStep,
          updatePortfolio: mockStoreUpdatePortfolio,
          reset: mockReset,
        })),
      }))

      const BuilderPage = (await import('@/app/builder/[id]/page')).default

      render(<BuilderPage params={{ id: 'test-id' }} />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('Social Links')).toBeInTheDocument()
      })
    })

    it('renders preview step with publish button', async () => {
      // Re-mock store with preview step
      vi.doMock('@/lib/store', () => ({
        useBuilderStore: vi.fn(() => ({
          portfolio: createMockPortfolio(),
          step: 'preview',
          setStep: mockSetStep,
          updatePortfolio: mockStoreUpdatePortfolio,
          reset: mockReset,
        })),
      }))

      const BuilderPage = (await import('@/app/builder/[id]/page')).default

      render(<BuilderPage params={{ id: 'test-id' }} />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('Preview')).toBeInTheDocument()
        expect(screen.getByText('Publish Now')).toBeInTheDocument()
      })
    })
  })
})
