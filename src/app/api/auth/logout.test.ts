import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock createClient from @supabase/supabase-js — the routes use it directly
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}))

describe('/api/auth/logout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('successful logout returns 200', async () => {
    const { createClient } = await import('@supabase/supabase-js')

    ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-1' } },
          error: null,
        }),
        signOut: vi.fn().mockResolvedValue({
          error: null,
        }),
      },
    } as ReturnType<typeof createClient>)

    const { POST } = await import('@/app/api/auth/logout/route')

    const request = new Request('http://localhost/api/auth/logout', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer valid-token' },
    })

    const response = await POST(request)
    expect(response.status).toBe(200)

    const json = await response.json()
    expect(json.data).not.toBeNull()
    expect(json.data.signed_out).toBe(true)
    expect(json.error).toBeNull()
  })
})
