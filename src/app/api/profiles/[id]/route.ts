import { NextResponse } from 'next/server'
import getCollections from '@/lib/mongodb'

// GET /api/profiles/[id] — get a user profile
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ data: null, error: 'Invalid profile ID' }, { status: 400 })
  }

  try {
    const { profiles } = await getCollections()
    const profile = await profiles.findOne({ user_id: id })

    if (!profile) {
      return NextResponse.json({ data: null, error: 'Profile not found' }, { status: 404 })
    }

    const result = {
      id: profile._id?.toString(),
      user_id: profile.user_id,
      email: profile.email,
      name: profile.name,
      avatar_url: profile.avatar_url,
      provider: profile.provider,
      plan: profile.plan,
      created_at: profile.created_at,
    }

    return NextResponse.json({ data: result, error: null })
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }
}
