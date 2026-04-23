import { describe, it, expect, vi, beforeEach } from 'vitest'

// Hoist mock functions so they're available when vi.mock runs
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

describe('POST /api/stripe/checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCreate.mockReset()
    mockCustomersCreate.mockReset()
    process.env.STRIPE_SECRET_KEY = 'sk_test_mock'
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-key'
    process.env.STRIPE_PRICE_ID = 'price_mock'
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
  })

  it('returns 200 with url on valid request', async () => {
    const { createClient } = await import('@supabase/supabase-js')

    mockCreate.mockResolvedValue({
      id: 'cs_test',
      url: 'https://checkout.stripe.com/cs_test',
    })
    mockCustomersCreate.mockResolvedValue({ id: 'cus_mock' })

    ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 'user123', stripe_customer_id: null },
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

    const request = new Request('http://localhost/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user123', email: 'test@example.com' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
    const json = await response.json()
    expect(json).toHaveProperty('url')
  })

  it('returns 400 when userId is missing', async () => {
    const { POST } = await import('@/app/api/stripe/checkout/route')

    const request = new Request('http://localhost/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json.error).toContain('userId')
  })

  it('returns 400 when email is missing or invalid', async () => {
    const { POST } = await import('@/app/api/stripe/checkout/route')

    const request = new Request('http://localhost/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user123', email: 'not-an-email' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json.error).toContain('email')
  })

  it('returns 500 when Stripe API throws an error', async () => {
    const { createClient } = await import('@supabase/supabase-js')

    mockCreate.mockRejectedValue(new Error('Stripe API error'))

    ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 'user123', stripe_customer_id: 'cus_existing' },
              error: null,
            }),
          }),
        }),
      }),
    })

    const { POST } = await import('@/app/api/stripe/checkout/route')

    const request = new Request('http://localhost/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user123', email: 'test@example.com' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(500)
    const json = await response.json()
    expect(json.error).toContain('Stripe')
  })

  it('returns 404 when profile not found', async () => {
    const { createClient } = await import('@supabase/supabase-js')

    ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: 'Not found' }),
          }),
        }),
      }),
    })

    const { POST } = await import('@/app/api/stripe/checkout/route')

    const request = new Request('http://localhost/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'nonexistent', email: 'test@example.com' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(404)
    const json = await response.json()
    expect(json.error).toContain('Profile')
  })
})
