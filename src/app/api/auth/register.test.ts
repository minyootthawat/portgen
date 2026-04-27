import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock bcryptjs
const { mockBcryptHash } = vi.hoisted(() => ({
  mockBcryptHash: vi.fn().mockResolvedValue('hashed_password'),
}))

vi.mock('bcryptjs', () => ({
  default: {
    hash: (...args: unknown[]) => mockBcryptHash(...args),
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

  it('valid registration returns 200 + user data', async () => {
    mockUsersFindOne.mockResolvedValue(null)
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

    const json = await response.json()
    expect(json.data).not.toBeNull()
    expect(json.data.id).toBe('user-456')
    expect(json.error).toBeNull()
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

    const json = await response.json()
    expect(json.data).toBeNull()
    expect(json.error).toBe('Email already registered')
  })

  it('missing email/password returns 400', async () => {
    const { POST } = await import('@/app/api/auth/register/route')

    // Missing both
    const request1 = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const response1 = await POST(request1)
    expect(response1.status).toBe(400)

    // Missing password only
    const request2 = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    })
    const response2 = await POST(request2)
    expect(response2.status).toBe(400)

    // Missing email only
    const request3 = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'password123' }),
    })
    const response3 = await POST(request3)
    expect(response3.status).toBe(400)
  })

  it('password too short (<6 chars) returns 400', async () => {
    const { POST } = await import('@/app/api/auth/register/route')

    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: '12345' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)

    const json = await response.json()
    expect(json.data).toBeNull()
    expect(json.error).toBe('Password must be at least 6 characters')
  })
})
