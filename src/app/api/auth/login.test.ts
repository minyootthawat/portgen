import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock createClient from @supabase/supabase-js — the routes use it directly
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}))

describe('/api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('valid credentials returns 200 + user data', async () => {
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

    const json = await response.json()
    expect(json.data).not.toBeNull()
    expect(json.data.user).toEqual(mockUser)
    expect(json.error).toBeNull()
  })

  it('wrong password returns 401', async () => {
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
      body: JSON.stringify({ email: 'test@example.com', password: 'wrongpassword' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(401)

    const json = await response.json()
    expect(json.data).toBeNull()
    expect(json.error).toBe('Invalid login credentials')
  })

  it('missing email/password returns 400', async () => {
    const { createClient } = await import('@supabase/supabase-js')

    ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: {
        signInWithPassword: vi.fn(),
      },
    } as ReturnType<typeof createClient>)

    const { POST } = await import('@/app/api/auth/login/route')

    // Missing both email and password
    const request1 = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    const response1 = await POST(request1)
    expect(response1.status).toBe(400)

    // Missing password only
    const request2 = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    })

    const response2 = await POST(request2)
    expect(response2.status).toBe(400)

    // Missing email only
    const request3 = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'password123' }),
    })

    const response3 = await POST(request3)
    expect(response3.status).toBe(400)
  })
})
