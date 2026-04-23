import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// GET /api/portfolios — list all published portfolios
export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('is_published', true)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, error: null })
}

// POST /api/portfolios — create a new portfolio
export async function POST(request: Request) {
  let body: Record<string, unknown>

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ data: null, error: 'Invalid JSON body' }, { status: 400 })
  }

  const { user_id, name, slug, subdomain } = body

  if (!user_id || !name || !slug || !subdomain) {
    return NextResponse.json(
      { data: null, error: 'user_id, name, slug, and subdomain are required' },
      { status: 400 }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data, error } = await supabase
    .from('portfolios')
    .insert({
      user_id,
      name,
      slug,
      subdomain,
      tagline: (body.tagline as string) || '',
      about: (body.about as string) || '',
      skills: (body.skills as unknown[]) || [],
      projects: (body.projects as unknown[]) || [],
      social_links: (body.social_links as unknown[]) || [],
      theme: (body.theme as string) || 'minimal-dark',
      theme_config: (body.theme_config as Record<string, unknown>) || {},
      is_published: false,
      is_deleted: false,
      view_count: 0,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, error: null }, { status: 201 })
}
