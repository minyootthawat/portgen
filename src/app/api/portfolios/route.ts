import { NextResponse } from 'next/server'
import getCollections from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

function generateSubdomain(name: string): string {
  const base = (name || 'portfolio')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 30)
  return `${base}-${Date.now().toString(36)}`
}

// GET /api/portfolios — list published portfolios or user's own portfolios
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('user_id')
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    const { portfolios } = await getCollections()

    let query: any = { is_deleted: false }

    if (userId) {
      // Filter by user_id (dashboard, profile page)
      query.user_id = userId
      if (!token || userId !== token) {
        // Non-authenticated or mismatch: only published
        query.is_published = true
      }
    } else if (!token) {
      // No user_id and no token: public portfolios only
      query.is_published = true
    }

    const results = await portfolios
      .find(query)
      .sort({ created_at: -1 })
      .limit(50)
      .toArray()

    const data = results.map((r: any) => ({
      id: r._id?.toString?.(),
      user_id: r.user_id,
      name: r.name,
      slug: r.slug,
      subdomain: r.subdomain,
      tagline: r.tagline,
      avatar_url: r.avatar_url,
      skills: r.skills,
      theme: r.theme,
      published_at: r.published_at,
      view_count: r.view_count,
      is_published: r.is_published,
      created_at: r.created_at,
    }))

    return NextResponse.json({ data, error: null })
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }
}

// POST /api/portfolios — create a new portfolio (auth required)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.slice(7)
    // Token is the user ID (JWT contains user id)
    const userId = token

    if (!userId) {
      return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
    }

    const { name, tagline, about, avatar_url, skills, projects, social_links, theme, theme_config, custom_sections } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ data: null, error: 'name is required' }, { status: 400 })
    }

    const subdomain = generateSubdomain(name)
    const slug = subdomain

    const { portfolios } = await getCollections()

    const doc = {
      user_id: userId,
      name: name.trim(),
      slug,
      subdomain,
      tagline: typeof tagline === 'string' ? tagline.trim().slice(0, 120) : '',
      about: typeof about === 'string' ? about.slice(0, 2000) : '',
      avatar_url: typeof avatar_url === 'string' ? avatar_url : '',
      skills: Array.isArray(skills) ? skills.slice(0, 50) : [],
      projects: Array.isArray(projects) ? projects.slice(0, 50) : [],
      social_links: Array.isArray(social_links) ? social_links.slice(0, 20) : [],
      theme: typeof theme === 'string' ? theme : 'minimal-dark',
      theme_config: theme_config && typeof theme_config === 'object' ? theme_config : {},
      custom_sections: Array.isArray(custom_sections) ? custom_sections.slice(0, 20) : [],
      is_published: false,
      is_deleted: false,
      view_count: 0,
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = await portfolios.insertOne(doc)

    return NextResponse.json({
      data: { id: result.insertedId.toString(), ...doc },
      error: null,
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }
}
