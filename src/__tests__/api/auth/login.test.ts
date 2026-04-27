import { describe, it, expect, vi, beforeEach } from 'vitest'

// Use vi.hoisted so mockBcryptCompare is available when vi.mock runs (hoisted together)
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

  it('valid login returns 200', async () => {
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
  })

  it('invalid credentials returns 401', async () => {
    mockBcryptCompare.mockResolvedValue(false)

    mockUsersFindOne.mockResolvedValue({
      _id: { toString: () => 'user-123' },
      email: 'wrong@example.com',
      password_hash: 'hashed_password',
    })

    const { POST } = await import('@/app/api/auth/login/route')

    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'wrong@example.com', password: 'wrongpassword' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(401)
  })
})
