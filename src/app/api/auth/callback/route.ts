import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ALLOWED_REDIRECT_PATHS = ['/dashboard', '/settings', '/profile', '/']

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  // Prevent open-redirect: only allow relative paths from the allowlist
  if (!ALLOWED_REDIRECT_PATHS.includes(next) && !next.startsWith('/dashboard') && !next.startsWith('/settings')) {
    return NextResponse.redirect(`${origin}/login?error=invalid_redirect`)
  }

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
