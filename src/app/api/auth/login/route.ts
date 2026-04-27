import { NextResponse } from 'next/server'
import getCollections from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import { signIn } from 'next-auth/react'

interface LoginBody {
  email: string
  password: string
}

function isValidEmail(email: string): boolean {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  let body: LoginBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ data: null, error: 'Invalid JSON body' }, { status: 400 })
  }

  const { email, password } = body

  if (!email || !password) {
    return NextResponse.json(
      { data: null, error: 'Email and password are required' },
      { status: 400 }
    )
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { data: null, error: 'Invalid email format' },
      { status: 400 }
    )
  }

  if (password.length < 6) {
    return NextResponse.json(
      { data: null, error: 'Password must be at least 6 characters' },
      { status: 400 }
    )
  }

  const { users } = await getCollections()
  const user = await users.findOne({ email })

  if (!user) {
    return NextResponse.json({ data: null, error: 'Invalid credentials' }, { status: 401 })
  }

  const isValid = await bcrypt.compare(password, user.password_hash)
  if (!isValid) {
    return NextResponse.json({ data: null, error: 'Invalid credentials' }, { status: 401 })
  }

  // Use signIn from next-auth/react client-side instead
  // This route returns success and the client calls signIn to set the session cookie
  return NextResponse.json({
    data: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    },
    error: null,
  })
}
