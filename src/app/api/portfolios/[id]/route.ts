import { NextResponse } from 'next/server'
import getCollections from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET /api/portfolios/[id] — get a single portfolio
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ data: null, error: 'Invalid portfolio ID' }, { status: 400 })
  }

  try {
    const { portfolios } = await getCollections()

    let portfolio: any
    try {
      portfolio = await portfolios.findOne({ _id: new ObjectId(id), is_deleted: false })
    } catch {
      // Not a valid ObjectId, try as string id
      portfolio = await portfolios.findOne({ id, is_deleted: false })
    }

    if (!portfolio) {
      return NextResponse.json({ data: null, error: 'Portfolio not found' }, { status: 404 })
    }

    // Only expose full details for published portfolios or their owners
    const authHeader = _request.headers.get('authorization')
    let ownerId: string | null = null
    if (authHeader?.startsWith('Bearer ')) {
      ownerId = authHeader.slice(7)
    }

    if (!portfolio.is_published && ownerId !== portfolio.user_id) {
      return NextResponse.json({ data: null, error: 'Portfolio not found' }, { status: 404 })
    }

    // Increment view count for published portfolios
    if (portfolio.is_published && !ownerId) {
      await portfolios.updateOne({ _id: portfolio._id }, { $inc: { view_count: 1 } })
      portfolio.view_count = (portfolio.view_count || 0) + 1
    }

    const result = {
      id: portfolio._id?.toString() || portfolio.id,
      user_id: portfolio.user_id,
      name: portfolio.name,
      slug: portfolio.slug,
      subdomain: portfolio.subdomain,
      tagline: portfolio.tagline,
      avatar_url: portfolio.avatar_url,
      about: portfolio.about,
      skills: portfolio.skills,
      projects: portfolio.projects,
      social_links: portfolio.social_links,
      theme: portfolio.theme,
      theme_config: portfolio.theme_config,
      custom_sections: portfolio.custom_sections,
      is_published: portfolio.is_published,
      published_at: portfolio.published_at,
      view_count: portfolio.view_count,
      created_at: portfolio.created_at,
      updated_at: portfolio.updated_at,
    }

    return NextResponse.json({ data: result, error: null })
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }
}

// PUT /api/portfolios/[id] — update a portfolio (owner only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ data: null, error: 'Invalid portfolio ID' }, { status: 400 })
  }

  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }
  const userId = authHeader.slice(7)

  try {
    const { portfolios } = await getCollections()

    // Find the portfolio
    let existing: any
    try {
      existing = await portfolios.findOne({ _id: new ObjectId(id), is_deleted: false })
    } catch {
      existing = await portfolios.findOne({ id, is_deleted: false })
    }

    if (!existing) {
      return NextResponse.json({ data: null, error: 'Portfolio not found' }, { status: 404 })
    }

    if (existing.user_id !== userId) {
      return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()

    const allowedFields = [
      'name', 'tagline', 'about', 'avatar_url', 'slug', 'subdomain',
      'skills', 'projects', 'social_links', 'theme', 'theme_config',
      'custom_sections', 'is_published',
    ]

    const updateData: Record<string, unknown> = { updated_at: new Date() }
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field]
      }
    }

    if (updateData.is_published && !existing.is_published) {
      updateData.published_at = new Date()
    }

    await portfolios.updateOne({ _id: existing._id }, { $set: updateData })

    const updated: any = { ...existing, ...updateData }
    const result = {
      id: updated._id?.toString() || updated.id,
      ...updateData,
    }

    return NextResponse.json({ data: result, error: null })
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }
}

// DELETE /api/portfolios/[id] — soft-delete a portfolio (owner only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ data: null, error: 'Invalid portfolio ID' }, { status: 400 })
  }

  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }
  const userId = authHeader.slice(7)

  try {
    const { portfolios } = await getCollections()

    // Find the portfolio
    let existing: any
    try {
      existing = await portfolios.findOne({ _id: new ObjectId(id), is_deleted: false })
    } catch {
      existing = await portfolios.findOne({ id, is_deleted: false })
    }

    if (!existing) {
      return NextResponse.json({ data: null, error: 'Portfolio not found' }, { status: 404 })
    }

    if (existing.user_id !== userId) {
      return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 })
    }

    await portfolios.updateOne(
      { _id: existing._id },
      { $set: { is_deleted: true, updated_at: new Date() } }
    )

    return NextResponse.json({ data: { deleted: true }, error: null })
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }
}
