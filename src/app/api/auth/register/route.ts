import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

interface RegisterBody {
  email: string
  password: string
  name?: string
}

function isValidEmail(email: string): boolean {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  // TODO (security): Add rate limiting per IP: 5 req/min, per email: 3 req/hour
  let body: RegisterBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { data: null, error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const { email, password, name } = body

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

  if (name !== undefined && (typeof name !== 'string' || name.length > 100)) {
    return NextResponse.json(
      { data: null, error: 'name must be a string of at most 100 characters' },
      { status: 400 }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: name ? { name } : {},
    },
  })

  if (error) {
    return NextResponse.json(
      { data: null, error: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json({ data, error: null })
}
