import { describe, it, expect, vi, beforeAll } from 'vitest'

// Set required env vars BEFORE importing the route module.
// The route evaluates Stripe config at module-load time, so env must be set first.
beforeAll(() => {
  process.env.STRIPE_SECRET_KEY = 'sk_test_mock'
  process.env.STRIPE_PRICE_ID = 'price_mock_123'
})

afterAll(() => {
  delete process.env.STRIPE_SECRET_KEY
  delete process.env.STRIPE_PRICE_ID
})

// Mock getCollections from @/lib/mongodb
const mockProfilesFindOne = vi.fn()
const mockProfilesUpdateOne = vi.fn()

vi.mock('@/lib/mongodb', () => ({
  default: async () => ({
    users: { findOne: vi.fn() },
    profiles: {
      findOne: mockProfilesFindOne,
      updateOne: mockProfilesUpdateOne,
      insertOne: vi.fn(),
    },
    portfolios: { find: vi.fn(), insertOne: vi.fn() },
    products: { find: vi.fn() },
    orders: { insertOne: vi.fn() },
    game_accounts: { find: vi.fn() },
    seller_ledger_entries: { find: vi.fn() },
    subscriptions: { findOne: vi.fn() },
  }),
}))

// Mock Stripe — must return a constructor (class) since route does `new Stripe(...)`
const mockStripeCheckoutCreate = vi.fn()
const mockStripeCustomersCreate = vi.fn()

vi.mock('stripe', () => {
  const MockStripe = function() {
    return {
      customers: { create: mockStripeCustomersCreate },
      checkout: { sessions: { create: mockStripeCheckoutCreate } },
    }
  }
  return { default: MockStripe }
})

describe('POST /api/stripe/checkout error handling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 400 when userId is missing', async () => {
    const { POST } = await import('@/app/api/stripe/checkout/route')
    const request = new Request('http://localhost/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json.error).toContain('userId')
  })

  it('returns 400 when userId is not a string', async () => {
    const { POST } = await import('@/app/api/stripe/checkout/route')
    const request = new Request('http://localhost/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 123, email: 'test@test.com' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json.error).toContain('userId')
  })

  it('returns 400 when email is missing', async () => {
    const { POST } = await import('@/app/api/stripe/checkout/route')
    const request = new Request('http://localhost/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user-1' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json.error).toContain('email')
  })

  it('returns 400 when email is invalid format', async () => {
    const { POST } = await import('@/app/api/stripe/checkout/route')
    const request = new Request('http://localhost/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user-1', email: 'not-an-email' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json.error).toContain('email')
  })

  it('returns 400 for invalid JSON body', async () => {
    const { POST } = await import('@/app/api/stripe/checkout/route')
    const request = new Request('http://localhost/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json.error).toContain('JSON')
  })

  it('returns 404 when profile not found', async () => {
    mockProfilesFindOne.mockResolvedValue(null)

    const { POST } = await import('@/app/api/stripe/checkout/route')
    const request = new Request('http://localhost/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'nonexistent-user', email: 'test@test.com' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(404)
    const json = await response.json()
    expect(json.error).toBe('Profile not found')
  })

  it('returns 500 when Stripe customer creation fails', async () => {
    mockProfilesFindOne.mockResolvedValue({
      _id: 'user-1',
      stripe_customer_id: null,
    })
    mockStripeCustomersCreate.mockRejectedValue(new Error('Stripe API error'))

    const { POST } = await import('@/app/api/stripe/checkout/route')
    const request = new Request('http://localhost/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user-1', email: 'test@test.com' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(500)
    const json = await response.json()
    expect(json.error).toContain('Stripe API error')
  })

  it('returns 500 when updateOne fails to persist customer ID', async () => {
    mockProfilesFindOne.mockResolvedValue({
      _id: 'user-1',
      stripe_customer_id: null,
    })
    mockStripeCustomersCreate.mockResolvedValue({ id: 'cus_new-customer' })
    mockProfilesUpdateOne.mockResolvedValue({ modifiedCount: 0 })

    const { POST } = await import('@/app/api/stripe/checkout/route')
    const request = new Request('http://localhost/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user-1', email: 'test@test.com' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(500)
    const json = await response.json()
    expect(json.error).toContain('Stripe customer')
  })

  it('returns 500 when Stripe checkout session creation fails', async () => {
    mockProfilesFindOne.mockResolvedValue({
      _id: 'user-1',
      stripe_customer_id: 'cus_existing',
    })
    mockStripeCheckoutCreate.mockRejectedValue(new Error('Checkout session failed'))

    const { POST } = await import('@/app/api/stripe/checkout/route')
    const request = new Request('http://localhost/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user-1', email: 'test@test.com' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(500)
    const json = await response.json()
    expect(json.error).toContain('Checkout session failed')
  })
})
