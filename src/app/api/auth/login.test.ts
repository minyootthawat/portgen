import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock bcryptjs
const { mockBcryptCompare } = vi.hoisted(() => ({
  mockBcryptCompare: vi.fn().mockResolvedValue(true),
}))

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed_password'),
    compare: (...args: unknown[]) => mockBcryptCompare(...args),
  },
}))

// Mock getCollections from @/lib/mongodb
const mockUsersFindOne = vi.fn()

vi.mock('@/lib/mongodb', () => ({
  default: async () => ({
    users: {
      findOne: mockUsersFindOne,
      insertOne: vi.fn(),
    },
    profiles: { insertOne: vi.fn() },
    portfolios: { find: vi.fn(), insertOne: vi.fn() },
    products: { find: vi.fn() },
    orders: { insertOne: vi.fn() },
    game_accounts: { find: vi.fn() },
    seller_ledger_entries: { find: vi.fn() },
    subscriptions: { findOne: vi.fn() },
  }),
}))

describe('/api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockBcryptCompare.mockResolvedValue(true)
  })

  it('valid credentials returns 200 + user data', async () => {
    mockUsersFindOne.mockResolvedValue({
      _id: { toString: () => 'user-123' },
      email: 'test@example.com',
      name: 'Test User',
      password_hash: 'hashed_password',
    })

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
    expect(json.data.email).toEqual('test@example.com')
    expect(json.error).toBeNull()
  })

  it('wrong password returns 401', async () => {
    mockBcryptCompare.mockResolvedValue(false)

    mockUsersFindOne.mockResolvedValue({
      _id: { toString: () => 'user-123' },
      email: 'test@example.com',
      password_hash: 'hashed_password',
    })

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
    expect(json.error).toBe('Invalid credentials')
  })

  it('missing email/password returns 400', async () => {
    const { POST } = await import('@/app/api/auth/login/route')

    // Missing both
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
