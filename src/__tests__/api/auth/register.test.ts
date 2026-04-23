import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock createClient from @supabase/supabase-js — the routes use it directly
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}))

describe('/api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('valid register returns 200', async () => {
    const { createClient } = await import('@supabase/supabase-js')
    const mockUser = {
      id: 'user-456',
      email: 'newuser@example.com',
      user_metadata: { name: 'New User' },
    }
    const mockSession = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      user: mockUser,
    }

    ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: {
        signUp: vi.fn().mockResolvedValue({
          data: { session: mockSession, user: mockUser },
          error: null,
        }),
      },
    } as ReturnType<typeof createClient>)

    const { POST } = await import('@/app/api/auth/register/route')

    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'newuser@example.com', password: 'password123', name: 'New User' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
  })

  it('duplicate email returns 400', async () => {
    const { createClient } = await import('@supabase/supabase-js')

    ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: {
        signUp: vi.fn().mockResolvedValue({
          data: { session: null, user: null },
          error: { message: 'User already registered', code: 'user_already_exists' },
        }),
      },
    } as ReturnType<typeof createClient>)

    const { POST } = await import('@/app/api/auth/register/route')

    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'existing@example.com', password: 'password123' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })
})
