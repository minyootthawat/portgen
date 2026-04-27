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

vi.mock('@/lib/mongodb', () => ({
  default: async () => ({
    users: {
      findOne: mockUsersFindOne,
      insertOne: mockUsersInsertOne,
    },
    profiles: {
      insertOne: mockProfilesInsertOne,
    },
    portfolios: { find: vi.fn(), insertOne: vi.fn() },
    products: { find: vi.fn() },
    orders: { insertOne: vi.fn() },
    game_accounts: { find: vi.fn() },
    seller_ledger_entries: { find: vi.fn() },
    subscriptions: { findOne: vi.fn() },
  }),
}))

describe('/api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('valid register returns 200', async () => {
    mockUsersFindOne.mockResolvedValue(null) // no existing user
    mockUsersInsertOne.mockResolvedValue({ insertedId: { toString: () => 'user-456' } })
    mockProfilesInsertOne.mockResolvedValue({ insertedId: { toString: () => 'profile-456' } })

    const { POST } = await import('@/app/api/auth/register/route')

    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'newuser@example.com', password: 'password123', name: 'New User' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
  })

  it('duplicate email returns 400', async () => {
    mockUsersFindOne.mockResolvedValue({ _id: 'existing-id', email: 'existing@example.com' })

    const { POST } = await import('@/app/api/auth/register/route')

    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'existing@example.com', password: 'password123' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })
})
