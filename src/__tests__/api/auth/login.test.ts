import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock createClient from @supabase/supabase-js — the routes use it directly
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}))

describe('/api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('valid login returns 200', async () => {
    const { createClient } = await import('@supabase/supabase-js')
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      user_metadata: { name: 'Test User' },
    }
    const mockSession = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      user: mockUser,
    }

    ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { session: mockSession, user: mockUser },
          error: null,
        }),
      },
    } as ReturnType<typeof createClient>)

    const { POST } = await import('@/app/api/auth/login/route')

    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
  })

  it('invalid credentials returns 401', async () => {
    const { createClient } = await import('@supabase/supabase-js')

    ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { session: null, user: null },
          error: { message: 'Invalid login credentials', code: 'invalid_credentials' },
        }),
      },
    } as ReturnType<typeof createClient>)

    const { POST } = await import('@/app/api/auth/login/route')

    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'wrong@example.com', password: 'wrongpassword' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(401)
  })
})
