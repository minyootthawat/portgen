import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// POST /api/auth/logout — sign out the authenticated user
export async function POST(request: Request) {
  // TODO (security): Add rate limiting per IP: 30 req/min
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.slice(7)
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Verify the token is valid before signing out
  const { error: userError } = await supabase.auth.getUser(token)
  if (userError) {
    return NextResponse.json({ data: null, error: 'Invalid token' }, { status: 401 })
  }

  const { error } = await supabase.auth.signOut()

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: { signed_out: true }, error: null })
}
