import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock getCollections from @/lib/mongodb
const mockPortfoliosFindOne = vi.fn()
const mockPortfoliosUpdateOne = vi.fn()

vi.mock('@/lib/mongodb', () => ({
  default: async () => ({
    users: { findOne: vi.fn() },
    profiles: { insertOne: vi.fn(), updateOne: vi.fn() },
    portfolios: {
      findOne: mockPortfoliosFindOne,
      updateOne: mockPortfoliosUpdateOne,
      insertOne: vi.fn(),
    },
    products: { find: vi.fn() },
    orders: { insertOne: vi.fn() },
    game_accounts: { find: vi.fn() },
    seller_ledger_entries: { find: vi.fn() },
    subscriptions: { findOne: vi.fn() },
  }),
}))

describe('/api/portfolios/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('returns 200 with portfolio data', async () => {
      mockPortfoliosFindOne.mockResolvedValue({
        _id: { toString: () => 'portfolio-1' },
        user_id: 'user-1',
        name: 'My Portfolio',
        slug: 'my-portfolio',
        is_published: true,
        is_deleted: false,
      })

      const { GET } = await import('@/app/api/portfolios/[id]/route')
      const response = await GET(new Request('http://localhost'), {
        params: Promise.resolve({ id: 'portfolio-1' }),
      })

      expect(response.status).toBe(200)
      const json = await response.json()
      expect(json.data.name).toBe('My Portfolio')
      expect(json.error).toBeNull()
    })

    it('returns 404 when portfolio not found', async () => {
      mockPortfoliosFindOne.mockResolvedValue(null)

      const { GET } = await import('@/app/api/portfolios/[id]/route')
      const response = await GET(new Request('http://localhost'), {
        params: Promise.resolve({ id: 'nonexistent' }),
      })

      expect(response.status).toBe(404)
      const json = await response.json()
      expect(json.data).toBeNull()
    })
  })

  describe('PUT', () => {
    it('returns 200 when portfolio is updated', async () => {
      // First call: findOne (ownership check)
      mockPortfoliosFindOne
        .mockResolvedValueOnce({
          _id: { toString: () => 'portfolio-1' },
          user_id: 'user-1',
          name: 'Old Name',
          slug: 'old-slug',
          is_published: false,
          is_deleted: false,
        })
        // Second call: findOne (re-fetch after update)
        .mockResolvedValueOnce({
          _id: { toString: () => 'portfolio-1' },
          user_id: 'user-1',
          name: 'Updated Name',
          slug: 'updated',
          is_published: false,
          is_deleted: false,
        })

      mockPortfoliosUpdateOne.mockResolvedValue({ modifiedCount: 1 })

      const { PUT } = await import('@/app/api/portfolios/[id]/route')
      const request = new Request('http://localhost', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer user-1' },
        body: JSON.stringify({ name: 'Updated Name' }),
      })

      const response = await PUT(request, {
        params: Promise.resolve({ id: 'portfolio-1' }),
      })

      expect(response.status).toBe(200)
      const json = await response.json()
      expect(json.error).toBeNull()
    })

    it('returns 500 for invalid JSON (route catches as error)', async () => {
      // The route's catch block returns 500 for any thrown error
      const { PUT } = await import('@/app/api/portfolios/[id]/route')
      const request = new Request('http://localhost', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer user-1' },
        body: 'not-json',
      })

      const response = await PUT(request, {
        params: Promise.resolve({ id: 'portfolio-1' }),
      })

      // Route catches SyntaxError from JSON.parse and returns 500
      expect(response.status).toBe(500)
    })

    it('returns 404 when updating nonexistent portfolio', async () => {
      mockPortfoliosFindOne.mockResolvedValue(null)

      const { PUT } = await import('@/app/api/portfolios/[id]/route')
      const request = new Request('http://localhost', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer user-1' },
        body: JSON.stringify({ name: 'Updated' }),
      })

      const response = await PUT(request, {
        params: Promise.resolve({ id: 'nonexistent' }),
      })

      expect(response.status).toBe(404)
    })
  })

  describe('DELETE', () => {
    it('returns 200 when portfolio is soft-deleted', async () => {
      mockPortfoliosFindOne.mockResolvedValue({
        _id: { toString: () => 'portfolio-1' },
        user_id: 'user-1',
        is_deleted: false,
      })
      mockPortfoliosUpdateOne.mockResolvedValue({ modifiedCount: 1 })

      const { DELETE } = await import('@/app/api/portfolios/[id]/route')
      const response = await DELETE(
        new Request('http://localhost', {
          headers: { 'Authorization': 'Bearer user-1' },
        }),
        { params: Promise.resolve({ id: 'portfolio-1' }) }
      )

      expect(response.status).toBe(200)
      const json = await response.json()
      expect(json.data.deleted).toBe(true)
      expect(json.error).toBeNull()
    })

    it('returns 404 when deleting nonexistent portfolio', async () => {
      mockPortfoliosFindOne.mockResolvedValue(null)

      const { DELETE } = await import('@/app/api/portfolios/[id]/route')
      const response = await DELETE(
        new Request('http://localhost', {
          headers: { 'Authorization': 'Bearer user-1' },
        }),
        { params: Promise.resolve({ id: 'nonexistent' }) }
      )

      expect(response.status).toBe(404)
    })
  })
})
