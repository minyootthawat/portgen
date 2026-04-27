import { NextResponse } from 'next/server'
import getCollections from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

interface RegisterBody {
  email: string
  password: string
  name?: string
}

function isValidEmail(email: string): boolean {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  let body: RegisterBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ data: null, error: 'Invalid JSON body' }, { status: 400 })
  }

  const { email, password, name } = body

  if (!email || !password) {
    return NextResponse.json({ data: null, error: 'Email and password are required' }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ data: null, error: 'Invalid email format' }, { status: 400 })
  }

  if (password.length < 6) {
    return NextResponse.json({ data: null, error: 'Password must be at least 6 characters' }, { status: 400 })
  }

  if (name !== undefined && (typeof name !== 'string' || name.length > 100)) {
    return NextResponse.json({ data: null, error: 'name must be a string of at most 100 characters' }, { status: 400 })
  }

  const { users, profiles } = await getCollections()

  const existing = await users.findOne({ email })
  if (existing) {
    return NextResponse.json({ data: null, error: 'Email already registered' }, { status: 400 })
  }

  const password_hash = await bcrypt.hash(password, 12)

  const result = await users.insertOne({
    email,
    password_hash,
    name: name || '',
    created_at: new Date(),
  })

  // Create profile
  await profiles.insertOne({
    user_id: result.insertedId.toString(),
    email,
    name: name || '',
    avatar_url: '',
    provider: 'credentials',
    plan: 'free',
    created_at: new Date(),
  })

  return NextResponse.json({ data: { id: result.insertedId.toString() }, error: null })
}
