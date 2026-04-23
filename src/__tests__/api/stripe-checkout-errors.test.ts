import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Hoisted mocks — must use function declaration (not arrow) for `new` ──────
const { mockCreate, mockCustomersCreate } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
  mockCustomersCreate: vi.fn(),
}))

vi.mock('stripe', () => ({
  default: function MockStripe() {
    return {
      checkout: { sessions: { create: mockCreate } },
      customers: { create: mockCustomersCreate },
    }
  },
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
  mockCreate.mockReset()
  mockCustomersCreate.mockReset()
  process.env.STRIPE_SECRET_KEY = 'sk_test_mock'
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-key'
  process.env.STRIPE_PRICE_ID = 'price_mock'
  process.env.NEXT_PUBLIC_APP_URL = 'http://localhost'
})

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('POST /api/stripe/checkout error handling', () => {
  it('returns 400 when userId is missing', async () => {
    const { POST } = await import('@/app/api/stripe/checkout/route')

    const res = await POST(
      new Request('http://localhost/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' }),
      })
    )

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe('Missing or invalid userId')
  })

  it('returns 400 when email is invalid', async () => {
    const { POST } = await import('@/app/api/stripe/checkout/route')

    const res = await POST(
      new Request('http://localhost/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user-123', email: 'not-an-email' }),
      })
    )

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe('Missing or invalid email')
  })

  it('returns 500 when STRIPE_PRICE_ID is not configured', async () => {
    delete process.env.STRIPE_PRICE_ID

    const { createClient } = await import('@supabase/supabase-js')
    ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 'user-123', stripe_customer_id: 'cus_mock' },
              error: null,
            }),
          }),
        }),
      }),
    })

    const { POST } = await import('@/app/api/stripe/checkout/route')

    const res = await POST(
      new Request('http://localhost/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user-123', email: 'test@example.com' }),
      })
    )

    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toBe('Payment configuration error')
  })

  it('returns 404 when user profile is not found', async () => {
    const { createClient } = await import('@supabase/supabase-js')
    ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: 'Profile not found' }),
          }),
        }),
      }),
    })

    const { POST } = await import('@/app/api/stripe/checkout/route')

    const res = await POST(
      new Request('http://localhost/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'unknown-user', email: 'test@example.com' }),
      })
    )

    expect(res.status).toBe(404)
    const json = await res.json()
    expect(json.error).toBe('Profile not found')
  })

  it('returns valid JSON error body on Stripe API failure', async () => {
    mockCreate.mockRejectedValue(new Error('Stripe API error'))
    mockCustomersCreate.mockResolvedValue({ id: 'cus_new' })

    const { createClient } = await import('@supabase/supabase-js')
    ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 'user-123', stripe_customer_id: null },
              error: null,
            }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
    })

    const { POST } = await import('@/app/api/stripe/checkout/route')

    const res = await POST(
      new Request('http://localhost/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user-123', email: 'test@example.com' }),
      })
    )

    expect(res.status).toBe(500)
    const json = await res.json()
    expect(typeof json).toBe('object')
    expect(json).toHaveProperty('error')
    expect(json.error).toBeTruthy()
  })
})
