import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// GET /api/portfolios — list all published portfolios (public, RLS-protected)
export async function GET() {
  // TODO (security): Add rate limiting per IP: 60 req/min
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const { data, error } = await supabase
    .from('portfolios')
    .select('id, name, slug, subdomain, tagline, avatar_url, skills, theme, published_at, view_count, created_at')
    .eq('is_published', true)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, error: null })
}

// POST /api/portfolios — create a new portfolio (auth required)
export async function POST(request: Request) {
  // TODO (security): Add rate limiting per user: 10 req/min
  let body: Record<string, unknown>

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ data: null, error: 'Invalid JSON body' }, { status: 400 })
  }

  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.slice(7)
  const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
  if (authError || !user) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const { name, slug, subdomain } = body

  // Input validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ data: null, error: 'name is required' }, { status: 400 })
  }
  if (!slug || typeof slug !== 'string' || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ data: null, error: 'slug must be a non-empty lowercase alphanumeric string with dashes' }, { status: 400 })
  }
  if (!subdomain || typeof subdomain !== 'string' || !/^[a-z0-9-]+$/.test(subdomain)) {
    return NextResponse.json({ data: null, error: 'subdomain must be a non-empty lowercase alphanumeric string with dashes' }, { status: 400 })
  }

  const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const { data, error } = await supabase
    .from('portfolios')
    .insert({
      user_id: user.id,
      name: name.trim(),
      slug: slug.trim(),
      subdomain: subdomain.trim(),
      tagline: typeof body.tagline === 'string' ? body.tagline.trim().slice(0, 120) : '',
      about: typeof body.about === 'string' ? body.about.slice(0, 2000) : '',
      skills: Array.isArray(body.skills) ? body.skills.slice(0, 50) : [],
      projects: Array.isArray(body.projects) ? body.projects.slice(0, 50) : [],
      social_links: Array.isArray(body.social_links) ? body.social_links.slice(0, 20) : [],
      theme: typeof body.theme === 'string' ? body.theme : 'minimal-dark',
      theme_config: body.theme_config && typeof body.theme_config === 'object' ? body.theme_config : {},
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
