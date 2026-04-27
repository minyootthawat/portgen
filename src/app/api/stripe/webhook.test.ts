import { describe, it, expect, vi, beforeEach } from 'vitest'

// Hoist mock functions so they're available when vi.mock runs
const { mockConstructEvent, mockSubscriptionsRetrieve } = vi.hoisted(() => ({
  mockConstructEvent: vi.fn(),
  mockSubscriptionsRetrieve: vi.fn(),
}))

vi.mock('stripe', () => ({
  default: function MockStripe() {
    return {
      webhooks: { constructEvent: mockConstructEvent },
      subscriptions: { retrieve: mockSubscriptionsRetrieve },
    }
  },
}))

// Mock getCollections from @/lib/mongodb
const mockProfilesUpdateOne = vi.fn()
const mockProfilesUpsert = vi.fn()
const mockSubscriptionsInsertOne = vi.fn()
const mockSubscriptionsUpdateOne = vi.fn()

vi.mock('@/lib/mongodb', () => ({
  default: async () => ({
    users: { findOne: vi.fn() },
    profiles: {
      updateOne: mockProfilesUpdateOne,
      upsert: mockProfilesUpsert,
      insertOne: vi.fn(),
    },
    portfolios: { find: vi.fn(), insertOne: vi.fn() },
    products: { find: vi.fn() },
    orders: { insertOne: vi.fn() },
    game_accounts: { find: vi.fn() },
    seller_ledger_entries: { find: vi.fn() },
    subscriptions: {
      findOne: vi.fn(),
      insertOne: mockSubscriptionsInsertOne,
      updateOne: mockSubscriptionsUpdateOne,
    },
  }),
}))

describe('POST /api/stripe/webhook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockConstructEvent.mockReset()
    mockSubscriptionsRetrieve.mockReset()
    mockProfilesUpdateOne.mockReset()
    mockSubscriptionsUpdateOne.mockReset()
    mockSubscriptionsInsertOne.mockReset()
    process.env.STRIPE_SECRET_KEY = 'sk_test_mock'
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_mock'
  })

  it('returns 200 with valid signature', async () => {
    mockConstructEvent.mockReturnValue({
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: 'sub_123',
          metadata: { userId: 'user123' },
          status: 'active',
          current_period_start: 1700000000,
          current_period_end: 1702600000,
          cancel_at_period_end: false,
        },
      },
    })
    mockSubscriptionsUpdateOne.mockResolvedValue({ acknowledged: true, matchedCount: 1, modifiedCount: 1 })
    mockProfilesUpdateOne.mockResolvedValue({ acknowledged: true, matchedCount: 1 })

    const { POST } = await import('@/app/api/stripe/webhook/route')

    const mockEvent = { type: 'customer.subscription.updated', data: { object: {} } }
    const request = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'sig_mock',
      },
      body: JSON.stringify(mockEvent),
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
    const json = await response.json()
    expect(json).toHaveProperty('received', true)
  })

  it('returns 400 with missing signature header', async () => {
    const { POST } = await import('@/app/api/stripe/webhook/route')

    const request = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json.error).toContain('signature')
  })

  it('returns 400 when constructEvent throws (invalid signature)', async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error('Invalid signature')
    })

    const { POST } = await import('@/app/api/stripe/webhook/route')

    const request = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'sig_invalid',
      },
      body: '{}',
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json.error).toContain('Invalid')
  })

  it('returns 200 for checkout.session.completed event', async () => {
    const mockSubscription = {
      id: 'sub_123',
      status: 'active',
      items: { data: [{ price: { id: 'price_123' } }] },
      current_period_start: 1700000000,
      current_period_end: 1702600000,
      cancel_at_period_end: false,
    }

    mockConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_123',
          mode: 'subscription',
          subscription: 'sub_123',
          metadata: { userId: 'user123' },
        },
      },
    })
    mockSubscriptionsRetrieve.mockResolvedValue(mockSubscription)
    mockSubscriptionsInsertOne.mockResolvedValue({ insertedId: 'sub_123' })
    mockProfilesUpdateOne.mockResolvedValue({ acknowledged: true, matchedCount: 1 })

    const { POST } = await import('@/app/api/stripe/webhook/route')

    const mockEvent = {
      type: 'checkout.session.completed',
      data: { object: { id: 'cs_123', mode: 'subscription', subscription: 'sub_123', metadata: { userId: 'user123' } } },
    }
    const request = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'sig_mock',
      },
      body: JSON.stringify(mockEvent),
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
    const json = await response.json()
    expect(json).toHaveProperty('received', true)
  })

  it('returns 200 for customer.subscription.deleted event', async () => {
    mockConstructEvent.mockReturnValue({
      type: 'customer.subscription.deleted',
      data: {
        object: {
          id: 'sub_123',
          metadata: { userId: 'user123' },
        },
      },
    })
    mockSubscriptionsUpdateOne.mockResolvedValue({ acknowledged: true, matchedCount: 1 })
    mockProfilesUpdateOne.mockResolvedValue({ acknowledged: true, matchedCount: 1 })

    const { POST } = await import('@/app/api/stripe/webhook/route')

    const mockEvent = {
      type: 'customer.subscription.deleted',
      data: { object: { id: 'sub_123', metadata: { userId: 'user123' } } },
    }
    const request = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'sig_mock',
      },
      body: JSON.stringify(mockEvent),
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
  })
})
