import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

interface RegisterBody {
  email: string
  password: string
  name?: string
}

export async function POST(request: Request) {
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

  if (password.length < 6) {
    return NextResponse.json(
      { data: null, error: 'Password must be at least 6 characters' },
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