import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

async function getAuthUser(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  return user
}

// GET /api/portfolios/[id] — get a single portfolio
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // TODO (security): Add rate limiting per IP: 120 req/min
  const { id } = await params

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ data: null, error: 'Invalid portfolio ID' }, { status: 400 })
  }

  const supabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const { data, error } = await supabase
    .from('portfolios')
    .select('id, user_id, name, slug, subdomain, tagline, avatar_url, about, skills, projects, social_links, theme, theme_config, is_published, published_at, view_count, created_at, updated_at')
    .eq('id', id)
    .eq('is_deleted', false)
    .single()

  if (error || !data) {
    return NextResponse.json({ data: null, error: 'Portfolio not found' }, { status: 404 })
  }

  // Only expose full details for published portfolios or their owners
  const authHeader = _request.headers.get('authorization')
  let ownerId: string | null = null
  if (authHeader?.startsWith('Bearer ')) {
    const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const { data: { user } } = await supabaseAdmin.auth.getUser(authHeader.slice(7))
    ownerId = user?.id ?? null
  }

  if (!data.is_published && ownerId !== data.user_id) {
    return NextResponse.json({ data: null, error: 'Portfolio not found' }, { status: 404 })
  }

  return NextResponse.json({ data, error: null })
}

// PUT /api/portfolios/[id] — update a portfolio (owner only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // TODO (security): Add rate limiting per user: 30 req/min
  const { id } = await params

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ data: null, error: 'Invalid portfolio ID' }, { status: 400 })
  }

  const user = await getAuthUser(request)
  if (!user) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ data: null, error: 'Invalid JSON body' }, { status: 400 })
  }

  const allowedFields = [
    'name', 'tagline', 'about', 'avatar_url', 'slug', 'subdomain', 'custom_domain',
    'skills', 'projects', 'social_links', 'theme', 'theme_config',
    'is_published',
  ]

  const updateData: Record<string, unknown> = {}
  for (const field of allowedFields) {
    if (field in body) {
      updateData[field] = body[field]
    }
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ data: null, error: 'No valid fields to update' }, { status: 400 })
  }

  // Validate field types
  if (updateData.name !== undefined && (typeof updateData.name !== 'string' || updateData.name.trim().length === 0)) {
    return NextResponse.json({ data: null, error: 'name must be a non-empty string' }, { status: 400 })
  }
  if (updateData.slug !== undefined && typeof updateData.slug !== 'string') {
    return NextResponse.json({ data: null, error: 'slug must be a string' }, { status: 400 })
  }
  if (updateData.subdomain !== undefined && typeof updateData.subdomain !== 'string') {
    return NextResponse.json({ data: null, error: 'subdomain must be a string' }, { status: 400 })
  }
  if (updateData.is_published !== undefined && typeof updateData.is_published !== 'boolean') {
    return NextResponse.json({ data: null, error: 'is_published must be a boolean' }, { status: 400 })
  }

  const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  // Ownership check
  const { data: existing } = await supabase
    .from('portfolios')
    .select('user_id')
    .eq('id', id)
    .eq('is_deleted', false)
    .single()

  if (!existing) {
    return NextResponse.json({ data: null, error: 'Portfolio not found' }, { status: 404 })
  }
  if (existing.user_id !== user.id) {
    return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('portfolios')
    .update({ ...updateData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('is_deleted', false)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, error: null })
}

// DELETE /api/portfolios/[id] — soft-delete a portfolio (owner only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // TODO (security): Add rate limiting per user: 20 req/min
  const { id } = await params

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ data: null, error: 'Invalid portfolio ID' }, { status: 400 })
  }

  const user = await getAuthUser(request)
  if (!user) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  // Ownership check
  const { data: existing } = await supabase
    .from('portfolios')
    .select('user_id')
    .eq('id', id)
    .eq('is_deleted', false)
    .single()

  if (!existing) {
    return NextResponse.json({ data: null, error: 'Portfolio not found' }, { status: 404 })
  }
  if (existing.user_id !== user.id) {
    return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('portfolios')
    .update({ is_deleted: true, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('is_deleted', false)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: { deleted: true }, error: null })
}
