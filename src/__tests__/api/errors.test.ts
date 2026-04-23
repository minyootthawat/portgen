import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Stripe must be mocked at top level (hoisted before module imports) ────────
vi.mock('stripe', () => ({
  default: vi.fn().mockImplementation(() => ({
    customers: {
      create: vi.fn().mockResolvedValue({ id: 'cus_new' }),
    },
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({ url: 'https://checkout.stripe.com/mock' }),
      },
    },
  })),
}))

// ─── Supabase mock ────────────────────────────────────────────────────────────
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}))

// ─── Env setup ────────────────────────────────────────────────────────────────
beforeEach(() => {
  vi.clearAllMocks()
  process.env.STRIPE_SECRET_KEY = 'sk_test_mock'
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-key'
  process.env.STRIPE_PRICE_ID = 'price_mock'
  process.env.NEXT_PUBLIC_APP_URL = 'http://localhost'
})

// ─── /api/auth/login error cases ──────────────────────────────────────────────

describe('POST /api/auth/login error handling', () => {
  it('returns 400 when JSON body is malformed', async () => {
    const { POST } = await import('@/app/api/auth/login/route')

    const res = await POST(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not-valid-json{',
      })
    )

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBeDefined()
  })

  it('returns 400 when email or password is missing', async () => {
    const { POST } = await import('@/app/api/auth/login/route')

    const res = await POST(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' }),
      })
    )

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe('Email and password are required')
  })

  it('returns 401 when credentials are invalid', async () => {
    const { createClient } = await import('@supabase/supabase-js')
    ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { session: null, user: null },
          error: { message: 'Invalid login credentials' },
        }),
      },
    })

    const { POST } = await import('@/app/api/auth/login/route')

    const res = await POST(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'wrong@example.com', password: 'wrongpass' }),
      })
    )

    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.error).toBe('Invalid login credentials')
  })

  it('returns valid JSON error body on auth failure', async () => {
    const { createClient } = await import('@supabase/supabase-js')
    ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { session: null, user: null },
          error: { message: 'Invalid login credentials' },
        }),
      },
    })

    const { POST } = await import('@/app/api/auth/login/route')

    const res = await POST(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'bad@example.com', password: 'badpass' }),
      })
    )

    const json = await res.json()
    expect(typeof json).toBe('object')
    expect(json).toHaveProperty('error')
    expect(json).toHaveProperty('data')
    expect(json.data).toBeNull()
  })
})

// ─── /api/auth/register error cases ──────────────────────────────────────────

describe('POST /api/auth/register error handling', () => {
  it('returns 400 when JSON body is malformed', async () => {
    const { POST } = await import('@/app/api/auth/register/route')

    const res = await POST(
      new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json{',
      })
    )

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe('Invalid JSON body')
    expect(json.data).toBeNull()
  })

  it('returns 400 when email or password is missing', async () => {
    const { POST } = await import('@/app/api/auth/register/route')

    const res = await POST(
      new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' }),
      })
    )

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe('Email and password are required')
  })

  it('returns 400 when password is too short', async () => {
    const { POST } = await import('@/app/api/auth/register/route')

    const res = await POST(
      new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: '12345' }),
      })
    )

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe('Password must be at least 6 characters')
  })

  it('returns 400 with valid JSON error body on registration failure', async () => {
    const { createClient } = await import('@supabase/supabase-js')
    ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: {
        signUp: vi.fn().mockResolvedValue({
          data: { user: null, session: null },
          error: { message: 'User already registered' },
        }),
      },
    })

    const { POST } = await import('@/app/api/auth/register/route')

    const res = await POST(
      new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'existing@example.com', password: 'password123' }),
      })
    )

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.data).toBeNull()
    expect(json.error).toBe('User already registered')
  })
})


