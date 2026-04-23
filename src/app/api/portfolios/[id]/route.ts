import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// GET /api/portfolios/[id] — get a single portfolio
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('id', id)
    .eq('is_deleted', false)
    .single()

  if (error || !data) {
    return NextResponse.json({ data: null, error: 'Portfolio not found' }, { status: 404 })
  }

  return NextResponse.json({ data, error: null })
}

// PUT /api/portfolios/[id] — update a portfolio
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  let body: Record<string, unknown>

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ data: null, error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!id) {
    return NextResponse.json({ data: null, error: 'Portfolio ID is required' }, { status: 400 })
  }

  // Build update payload — only include provided fields
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

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

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

  if (!data) {
    return NextResponse.json({ data: null, error: 'Portfolio not found' }, { status: 404 })
  }

  return NextResponse.json({ data, error: null })
}

// DELETE /api/portfolios/[id] — soft-delete a portfolio
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ data: null, error: 'Portfolio ID is required' }, { status: 400 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

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

  if (!data) {
    return NextResponse.json({ data: null, error: 'Portfolio not found' }, { status: 404 })
  }

  return NextResponse.json({ data, error: null })
}
