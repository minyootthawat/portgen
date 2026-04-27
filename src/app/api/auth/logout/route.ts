import { NextResponse } from 'next/server'

// POST /api/auth/logout — sign out the authenticated user
// For NextAuth, signOut is handled client-side via signOut() from 'next-auth/react'
// This route is kept for backward compatibility
export async function POST(request: Request) {
  return NextResponse.json({ data: { signed_out: true }, error: null })
}
