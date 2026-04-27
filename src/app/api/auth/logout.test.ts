import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock getCollections from @/lib/mongodb (route doesn't call it, but keep for safety)
vi.mock('@/lib/mongodb', () => ({
  default: async () => ({
    users: { findOne: vi.fn() },
    profiles: { findOne: vi.fn(), updateOne: vi.fn() },
    portfolios: { find: vi.fn(), insertOne: vi.fn() },
    products: { find: vi.fn() },
    orders: { insertOne: vi.fn() },
    game_accounts: { find: vi.fn() },
    seller_ledger_entries: { find: vi.fn() },
    subscriptions: { findOne: vi.fn() },
  }),
}))

describe('/api/auth/logout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('successful logout returns 200', async () => {
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
