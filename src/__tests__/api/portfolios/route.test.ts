import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock getCollections from @/lib/mongodb
const mockPortfoliosFind = vi.fn()
const mockPortfoliosInsertOne = vi.fn()

vi.mock('@/lib/mongodb', () => ({
  default: async () => ({
    users: { findOne: vi.fn() },
    profiles: { insertOne: vi.fn() },
    portfolios: {
      find: mockPortfoliosFind,
      insertOne: mockPortfoliosInsertOne,
    },
    products: { find: vi.fn() },
    orders: { insertOne: vi.fn() },
    game_accounts: { find: vi.fn() },
    seller_ledger_entries: { find: vi.fn() },
    subscriptions: { findOne: vi.fn() },
  }),
}))

describe('/api/portfolios', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('returns 200 with list of published portfolios', async () => {
      const mockPortfolios = [
        { _id: '1', name: 'Portfolio A', slug: 'a', is_published: true, is_deleted: false },
        { _id: '2', name: 'Portfolio B', slug: 'b', is_published: true, is_deleted: false },
      ]

      // Chain: find(query).sort().limit().toArray()
      mockPortfoliosFind.mockReturnValue({
        sort: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            toArray: vi.fn().mockResolvedValue(mockPortfolios),
          }),
        }),
      })

      const { GET } = await import('@/app/api/portfolios/route')
      const response = await GET(new Request('http://localhost/api/portfolios'))

      expect(response.status).toBe(200)
      const json = await response.json()
      expect(json.data).toHaveLength(2)
      expect(json.error).toBeNull()
    })

    it('returns 500 when database errors', async () => {
      mockPortfoliosFind.mockReturnValue({
        sort: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            toArray: vi.fn().mockRejectedValue(new Error('DB error')),
          }),
        }),
      })

      const { GET } = await import('@/app/api/portfolios/route')
      const response = await GET(new Request('http://localhost/api/portfolios'))

      expect(response.status).toBe(500)
      const json = await response.json()
      expect(json.data).toBeNull()
      expect(json.error).toBe('DB error')
    })
  })

  describe('POST', () => {
    it('returns 201 when portfolio is created', async () => {
      mockPortfoliosInsertOne.mockResolvedValue({ insertedId: { toString: () => 'new-1' } })

      const { POST } = await import('@/app/api/portfolios/route')
      const request = new Request('http://localhost/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer user-1' },
        body: JSON.stringify({
          name: 'My Portfolio',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(201)
      const json = await response.json()
      expect(json.data.name).toBe('My Portfolio')
      expect(json.error).toBeNull()
    })

    it('returns 400 when required fields are missing', async () => {
      const { POST } = await import('@/app/api/portfolios/route')

      const request = new Request('http://localhost/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer user-1' },
        body: JSON.stringify({}), // missing name
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json.data).toBeNull()
      expect(json.error).toContain('required')
    })

    it('returns 500 for invalid JSON (route catches as error)', async () => {
      // The route's catch block returns 500 for any thrown error including invalid JSON
      const { POST } = await import('@/app/api/portfolios/route')

      const request = new Request('http://localhost/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not-json',
      })

      const response = await POST(request)
      // Route catches SyntaxError from JSON.parse and returns 500
      expect(response.status).toBe(500)
    })

    it('returns 500 when insert fails', async () => {
      mockPortfoliosInsertOne.mockRejectedValue(new Error('Insert failed'))

      const { POST } = await import('@/app/api/portfolios/route')
      const request = new Request('http://localhost/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer user-1' },
        body: JSON.stringify({ name: 'Portfolio' }),
      })

      const response = await POST(request)
      expect(response.status).toBe(500)
      const json = await response.json()
      expect(json.error).toBe('Insert failed')
    })
  })
})
