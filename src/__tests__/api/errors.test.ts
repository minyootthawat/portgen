import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed_password'),
    compare: vi.fn().mockResolvedValue(true),
  },
}))

// Mock getCollections from @/lib/mongodb
const mockUsersFindOne = vi.fn()
const mockUsersInsertOne = vi.fn()
const mockProfilesInsertOne = vi.fn()
const mockPortfoliosFindOne = vi.fn()

vi.mock('@/lib/mongodb', () => ({
  default: async () => ({
    users: {
      findOne: mockUsersFindOne,
      insertOne: mockUsersInsertOne,
    },
    profiles: {
      insertOne: mockProfilesInsertOne,
      findOne: vi.fn(),
      updateOne: vi.fn(),
    },
    portfolios: {
      find: vi.fn(),
      findOne: mockPortfoliosFindOne,
      insertOne: vi.fn(),
      updateOne: vi.fn(),
    },
    products: { find: vi.fn() },
    orders: { insertOne: vi.fn() },
    game_accounts: { find: vi.fn() },
    seller_ledger_entries: { find: vi.fn() },
    subscriptions: { findOne: vi.fn() },
  }),
}))

describe('API error handling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── /api/auth/register error cases ─────────────────────────────────────────

  describe('/api/auth/register', () => {
    it('returns 400 for missing email', async () => {
      const { POST } = await import('@/app/api/auth/register/route')
      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'password123' }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json.error).toContain('required')
    })

    it('returns 400 for missing password', async () => {
      const { POST } = await import('@/app/api/auth/register/route')
      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json.error).toContain('required')
    })

    it('returns 400 for invalid email format', async () => {
      const { POST } = await import('@/app/api/auth/register/route')
      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'not-an-email', password: 'password123' }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json.error).toContain('email')
    })

    it('returns 400 for password shorter than 6 characters', async () => {
      const { POST } = await import('@/app/api/auth/register/route')
      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'valid@example.com', password: '12345' }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json.error).toContain('6 characters')
    })

    it('returns 400 for name exceeding 100 characters', async () => {
      const { POST } = await import('@/app/api/auth/register/route')
      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'valid@example.com',
          password: 'password123',
          name: 'a'.repeat(101),
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json.error).toContain('name')
    })

    it('returns 400 for invalid JSON body', async () => {
      const { POST } = await import('@/app/api/auth/register/route')
      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not-json',
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json.error).toContain('JSON')
    })
  })

  // ── /api/auth/login error cases ──────────────────────────────────────────

  describe('/api/auth/login', () => {
    it('returns 400 for missing email', async () => {
      const { POST } = await import('@/app/api/auth/login/route')
      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'password123' }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json.error).toContain('required')
    })

    it('returns 400 for missing password', async () => {
      const { POST } = await import('@/app/api/auth/login/route')
      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json.error).toContain('required')
    })

    it('returns 400 for invalid email format', async () => {
      const { POST } = await import('@/app/api/auth/login/route')
      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'not-an-email', password: 'password123' }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json.error).toContain('email')
    })

    it('returns 400 for password shorter than 6 characters', async () => {
      const { POST } = await import('@/app/api/auth/login/route')
      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'valid@example.com', password: '12345' }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json.error).toContain('6 characters')
    })

    it('returns 401 for unregistered email', async () => {
      mockUsersFindOne.mockResolvedValue(null)

      const { POST } = await import('@/app/api/auth/login/route')
      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'notfound@example.com', password: 'password123' }),
      })

      const response = await POST(request)
      expect(response.status).toBe(401)
      const json = await response.json()
      expect(json.error).toBe('Invalid credentials')
    })
  })

  // ── /api/portfolios POST error cases ─────────────────────────────────────

  describe('/api/portfolios POST', () => {
    it('returns 401 when no authorization header', async () => {
      const { POST } = await import('@/app/api/portfolios/route')
      const request = new Request('http://localhost/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Portfolio' }),
      })

      const response = await POST(request)
      expect(response.status).toBe(401)
    })

    it('returns 400 when name is missing', async () => {
      const { POST } = await import('@/app/api/portfolios/route')
      const request = new Request('http://localhost/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer user-1' },
        body: JSON.stringify({ tagline: 'Just a tagline' }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json.error).toContain('name')
    })
  })

  // ── /api/portfolios/[id] error cases ────────────────────────────────────

  describe('/api/portfolios/[id]', () => {
    it('returns 400 for invalid portfolio ID format', async () => {
      const { GET } = await import('@/app/api/portfolios/[id]/route')
      const response = await GET(new Request('http://localhost'), {
        params: Promise.resolve({ id: '' }),
      })

      expect(response.status).toBe(400)
    })

    it('returns 401 for unauthenticated PUT request', async () => {
      const { PUT } = await import('@/app/api/portfolios/[id]/route')
      const request = new Request('http://localhost', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Updated' }),
      })

      const response = await PUT(request, {
        params: Promise.resolve({ id: 'portfolio-1' }),
      })

      expect(response.status).toBe(401)
    })

    it('returns 401 for unauthenticated DELETE request', async () => {
      const { DELETE } = await import('@/app/api/portfolios/[id]/route')
      const response = await DELETE(new Request('http://localhost'), {
        params: Promise.resolve({ id: 'portfolio-1' }),
      })

      expect(response.status).toBe(401)
    })
  })
})
