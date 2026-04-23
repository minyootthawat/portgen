import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}))

describe('/api/portfolios', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('returns 200 with list of published portfolios', async () => {
      const { createClient } = await import('@supabase/supabase-js')
      const mockPortfolios = [
        { id: '1', name: 'Portfolio A', slug: 'a', is_published: true, is_deleted: false },
        { id: '2', name: 'Portfolio B', slug: 'b', is_published: true, is_deleted: false },
      ]

      ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue({ data: mockPortfolios, error: null }),
                }),
              }),
            }),
          }),
        }),
      } as ReturnType<typeof createClient>)

      const { GET } = await import('@/app/api/portfolios/route')
      const response = await GET()

      expect(response.status).toBe(200)
      const json = await response.json()
      expect(json.data).toHaveLength(2)
      expect(json.error).toBeNull()
    })

    it('returns 500 when database errors', async () => {
      const { createClient } = await import('@supabase/supabase-js')

      ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
                }),
              }),
            }),
          }),
        }),
      } as ReturnType<typeof createClient>)

      const { GET } = await import('@/app/api/portfolios/route')
      const response = await GET()

      expect(response.status).toBe(500)
      const json = await response.json()
      expect(json.data).toBeNull()
      expect(json.error).toBe('DB error')
    })
  })

  describe('POST', () => {
    it('returns 201 when portfolio is created', async () => {
      const { createClient } = await import('@supabase/supabase-js')
      const newPortfolio = {
        id: 'new-1',
        user_id: 'user-1',
        name: 'My Portfolio',
        slug: 'my-portfolio',
        subdomain: 'my-portfolio',
        tagline: '',
        about: '',
        skills: [],
        projects: [],
        social_links: [],
        theme: 'minimal-dark',
        theme_config: {},
        is_published: false,
        is_deleted: false,
        view_count: 0,
      }

      ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: newPortfolio, error: null }),
            }),
          }),
        }),
      } as ReturnType<typeof createClient>)

      const { POST } = await import('@/app/api/portfolios/route')
      const request = new Request('http://localhost/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'user-1',
          name: 'My Portfolio',
          slug: 'my-portfolio',
          subdomain: 'my-portfolio',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(201)
      const json = await response.json()
      expect(json.data.name).toBe('My Portfolio')
      expect(json.error).toBeNull()
    })

    it('returns 400 when required fields are missing', async () => {
      const { POST } = await import('@/app/api/portfolios/route')

      const request = new Request('http://localhost/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'user-1' }), // missing name, slug, subdomain
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json.data).toBeNull()
      expect(json.error).toContain('required')
    })

    it('returns 400 for invalid JSON', async () => {
      const { POST } = await import('@/app/api/portfolios/route')

      const request = new Request('http://localhost/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not-json',
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json.error).toBe('Invalid JSON body')
    })

    it('returns 500 when insert fails', async () => {
      const { createClient } = await import('@supabase/supabase-js')

      ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Insert failed' } }),
            }),
          }),
        }),
      } as ReturnType<typeof createClient>)

      const { POST } = await import('@/app/api/portfolios/route')
      const request = new Request('http://localhost/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'user-1',
          name: 'Portfolio',
          slug: 'portfolio',
          subdomain: 'portfolio',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(500)
      const json = await response.json()
      expect(json.error).toBe('Insert failed')
    })
  })
})
