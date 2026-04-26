import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}))

describe('/api/portfolios/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('returns 200 with portfolio data', async () => {
      const { createClient } = await import('@supabase/supabase-js')
      const mockPortfolio = {
        id: 'portfolio-1',
        user_id: 'user-1',
        name: 'My Portfolio',
        slug: 'my-portfolio',
        is_published: true,
        is_deleted: false,
      }

      ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: mockPortfolio, error: null }),
              }),
            }),
          }),
        }),
      } as ReturnType<typeof createClient>)

      const { GET } = await import('@/app/api/portfolios/[id]/route')
      const response = await GET(new Request('http://localhost'), {
        params: Promise.resolve({ id: 'portfolio-1' }),
      })

      expect(response.status).toBe(200)
      const json = await response.json()
      expect(json.data.name).toBe('My Portfolio')
      expect(json.error).toBeNull()
    })

    it('returns 404 when portfolio not found', async () => {
      const { createClient } = await import('@supabase/supabase-js')

      ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
              }),
            }),
          }),
        }),
      } as ReturnType<typeof createClient>)

      const { GET } = await import('@/app/api/portfolios/[id]/route')
      const response = await GET(new Request('http://localhost'), {
        params: Promise.resolve({ id: 'nonexistent' }),
      })

      expect(response.status).toBe(404)
      const json = await response.json()
      expect(json.data).toBeNull()
    })
  })

  describe('PUT', () => {
    it('returns 200 when portfolio is updated', async () => {
      const { createClient } = await import('@supabase/supabase-js')
      const updated = { id: 'portfolio-1', name: 'Updated Name', slug: 'updated', is_deleted: false }

      ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: updated, error: null }),
                }),
              }),
            }),
          }),
        }),
      } as ReturnType<typeof createClient>)

      const mockClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: { user_id: 'user-1' }, error: null }),
              }),
            }),
          }),
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: updated, error: null }),
                }),
              }),
            }),
          }),
        }),
      }
      ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue(mockClient)

      const { PUT } = await import('@/app/api/portfolios/[id]/route')
      const request = new Request('http://localhost', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer valid-token' },
        body: JSON.stringify({ name: 'Updated Name' }),
      })

      const response = await PUT(request, {
        params: Promise.resolve({ id: 'portfolio-1' }),
      })

      expect(response.status).toBe(200)
      const json = await response.json()
      expect(json.data.name).toBe('Updated Name')
      expect(json.error).toBeNull()
    })

    it('returns 400 when no valid fields provided', async () => {
      const { createClient } = await import('@supabase/supabase-js')
      const mockClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: { user_id: 'user-1' }, error: null }),
              }),
            }),
          }),
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: null, error: null }),
                }),
              }),
            }),
          }),
        }),
      }
      ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue(mockClient)

      const { PUT } = await import('@/app/api/portfolios/[id]/route')
      const request = new Request('http://localhost', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer valid-token' },
        body: JSON.stringify({ unknown_field: 'value' }),
      })

      const response = await PUT(request, {
        params: Promise.resolve({ id: 'portfolio-1' }),
      })

      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json.error).toContain('No valid fields')
    })

    it('returns 400 for invalid JSON', async () => {
      const { createClient } = await import('@supabase/supabase-js')
      const mockClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: { user_id: 'user-1' }, error: null }),
              }),
            }),
          }),
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: null, error: null }),
                }),
              }),
            }),
          }),
        }),
      }
      ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue(mockClient)

      const { PUT } = await import('@/app/api/portfolios/[id]/route')
      const request = new Request('http://localhost', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer valid-token' },
        body: 'not-json',
      })

      const response = await PUT(request, {
        params: Promise.resolve({ id: 'portfolio-1' }),
      })

      expect(response.status).toBe(400)
    })

    it('returns 404 when updating nonexistent portfolio', async () => {
      const { createClient } = await import('@supabase/supabase-js')
      const mockClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: null, error: null }),
              }),
            }),
          }),
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: null, error: null }),
                }),
              }),
            }),
          }),
        }),
      }
      ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue(mockClient)

      const { PUT } = await import('@/app/api/portfolios/[id]/route')
      const request = new Request('http://localhost', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer valid-token' },
        body: JSON.stringify({ name: 'Updated' }),
      })

      const response = await PUT(request, {
        params: Promise.resolve({ id: 'nonexistent' }),
      })

      expect(response.status).toBe(404)
    })
  })

  describe('DELETE', () => {
    it('returns 200 when portfolio is soft-deleted', async () => {
      const { createClient } = await import('@supabase/supabase-js')
      const deleted = { id: 'portfolio-1', is_deleted: true }

      ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: deleted, error: null }),
                }),
              }),
            }),
          }),
        }),
      } as ReturnType<typeof createClient>)

      const mockClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: { user_id: 'user-1' }, error: null }),
              }),
            }),
          }),
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: deleted, error: null }),
                }),
              }),
            }),
          }),
        }),
      }
      ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue(mockClient)

      const { DELETE } = await import('@/app/api/portfolios/[id]/route')
      const response = await DELETE(new Request('http://localhost', {
        headers: { 'Authorization': 'Bearer valid-token' },
      }), {
        params: Promise.resolve({ id: 'portfolio-1' }),
      })

      expect(response.status).toBe(200)
      const json = await response.json()
      expect(json.data.deleted).toBe(true)
      expect(json.error).toBeNull()
    })

    it('returns 404 when deleting nonexistent portfolio', async () => {
      const { createClient } = await import('@supabase/supabase-js')
      const mockClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: null, error: null }),
              }),
            }),
          }),
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: null, error: null }),
                }),
              }),
            }),
          }),
        }),
      }
      ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue(mockClient)

      const { DELETE } = await import('@/app/api/portfolios/[id]/route')
      const response = await DELETE(new Request('http://localhost', {
        headers: { 'Authorization': 'Bearer valid-token' },
      }), {
        params: Promise.resolve({ id: 'nonexistent' }),
      })

      expect(response.status).toBe(404)
    })
  })
})
