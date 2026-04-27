/**
 * Supabase → MongoDB Migration Script
 * 
 * Migrates data from Supabase (PostgreSQL) to MongoDB.
 * Run with: npx ts-node --esm scripts/migrate-supabase-to-mongodb.ts
 * 
 * Prerequisites:
 * - Set MONGODB_URI env var (or it will use the configured default)
 * - Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY env vars to read from Supabase
 * - Ensure MongoDB collections exist (run scripts/setup-mongodb.ts first)
 */

import { MongoClient, ObjectId } from 'mongodb'

// ─── Configuration ─────────────────────────────────────────────────────────

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dcs:***@dcs.kij1y8e.mongodb.net/portgen?appName=DCS'
const MONGODB_DB = 'portgen'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// ─── Types ──────────────────────────────────────────────────────────────────

interface SupabaseProfile {
  id: string
  email: string
  name: string
  avatar_url: string | null
  provider: string | null
  plan: 'free' | 'pro'
  stripe_customer_id: string | null
  created_at: string
  updated_at: string
}

interface SupabasePortfolio {
  id: string
  user_id: string
  name: string
  slug: string
  subdomain: string
  tagline: string | null
  about: string | null
  avatar_url: string | null
  skills: unknown[]
  projects: unknown[]
  social_links: unknown[]
  theme: string
  theme_config: unknown
  custom_sections: unknown[]
  is_published: boolean
  is_deleted: boolean
  view_count: number
  created_at: string
  updated_at: string
  published_at: string | null
}

interface SupabaseSubscription {
  id: number
  user_id: string
  stripe_subscription_id: string
  stripe_price_id: string
  status: string
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
}

// ─── Supabase Fetcher ──────────────────────────────────────────────────────

async function supabaseFetch<T>(table: string, params: string = ''): Promise<T[]> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set')
  }

  const url = `${SUPABASE_URL}/rest/v1/${table}?${params}`
  const response = await fetch(url, {
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'count=exact',
    },
  })

  if (!response.ok) {
    throw new Error(`Supabase fetch failed for ${table}: ${response.status} ${response.statusText}`)
  }

  const count = parseInt(response.headers.get('content-range')?.split('/')[1] ?? '0', 10)
  const data = await response.json() as T[]

  // If more than 1000 items, paginate
  if (count > 1000) {
    const allData: T[] = data
    const totalPages = Math.ceil(count / 1000)
    for (let page = 2; page <= totalPages; page++) {
      const pageResponse = await fetch(`${url}&page=${page}`, {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
      })
      if (pageResponse.ok) {
        allData.push(...(await pageResponse.json() as T[]))
      }
    }
    return allData
  }

  return data
}

// ─── Migration ──────────────────────────────────────────────────────────────

async function migrateProfiles(profiles: Awaited<ReturnType<typeof getCollections>>['profiles']) {
  console.log('\n📦 Migrating profiles...')

  const supabaseProfiles = await supabaseFetch<SupabaseProfile>(
    'profiles',
    'select=*'
  )

  console.log(`   Found ${supabaseProfiles.length} profiles in Supabase`)

  let migrated = 0
  let skipped = 0

  for (const profile of supabaseProfiles) {
    const doc = {
      _id: profile.id,
      user_id: profile.id,
      email: profile.email,
      name: profile.name ?? '',
      avatar_url: profile.avatar_url ?? '',
      provider: profile.provider ?? 'credentials',
      plan: profile.plan ?? 'free',
      stripe_customer_id: profile.stripe_customer_id ?? null,
      created_at: profile.created_at ? new Date(profile.created_at) : new Date(),
      updated_at: profile.updated_at ? new Date(profile.updated_at) : new Date(),
    }

    try {
      await (profiles as any).updateOne(
        { _id: profile.id },
        { $setOnInsert: doc },
        { upsert: true }
      )
      migrated++
    } catch (err) {
      console.error(`   ❌ Failed to migrate profile ${profile.id}:`, err)
      skipped++
    }
  }

  console.log(`   ✅ Migrated ${migrated} profiles, skipped ${skipped}`)
}

async function migratePortfolios(portfolios: Awaited<ReturnType<typeof getCollections>>['portfolios']) {
  console.log('\n📦 Migrating portfolios...')

  const supabasePortfolios = await supabaseFetch<SupabasePortfolio>(
    'portfolios',
    'select=*&is_deleted=eq.false'
  )

  console.log(`   Found ${supabasePortfolios.length} portfolios in Supabase`)

  let migrated = 0
  let skipped = 0

  for (const portfolio of supabasePortfolios) {
    const doc = {
      _id: portfolio.id,
      user_id: portfolio.user_id,
      name: portfolio.name,
      slug: portfolio.slug,
      subdomain: portfolio.subdomain,
      tagline: portfolio.tagline ?? '',
      about: portfolio.about ?? '',
      avatar_url: portfolio.avatar_url ?? '',
      skills: portfolio.skills ?? [],
      projects: portfolio.projects ?? [],
      social_links: portfolio.social_links ?? [],
      theme: portfolio.theme ?? 'gradient-dark',
      theme_config: portfolio.theme_config ?? {},
      custom_sections: portfolio.custom_sections ?? [],
      is_published: portfolio.is_published ?? false,
      is_deleted: portfolio.is_deleted ?? false,
      view_count: portfolio.view_count ?? 0,
      published_at: portfolio.published_at ? new Date(portfolio.published_at) : null,
      created_at: portfolio.created_at ? new Date(portfolio.created_at) : new Date(),
      updated_at: portfolio.updated_at ? new Date(portfolio.updated_at) : new Date(),
    }

    try {
      await (portfolios as any).updateOne(
        { _id: portfolio.id },
        { $setOnInsert: doc },
        { upsert: true }
      )
      migrated++
    } catch (err) {
      console.error(`   ❌ Failed to migrate portfolio ${portfolio.id}:`, err)
      skipped++
    }
  }

  console.log(`   ✅ Migrated ${migrated} portfolios, skipped ${skipped}`)
}

async function migrateSubscriptions(subscriptions: Awaited<ReturnType<typeof getCollections>>['subscriptions']) {
  console.log('\n📦 Migrating subscriptions...')

  const supabaseSubscriptions = await supabaseFetch<SupabaseSubscription>(
    'subscriptions',
    'select=*'
  )

  console.log(`   Found ${supabaseSubscriptions.length} subscriptions in Supabase`)

  let migrated = 0
  let skipped = 0

  for (const sub of supabaseSubscriptions) {
    const doc = {
      _id: new ObjectId(),
      user_id: sub.user_id,
      stripe_subscription_id: sub.stripe_subscription_id,
      stripe_price_id: sub.stripe_price_id,
      status: sub.status,
      current_period_start: sub.current_period_start,
      current_period_end: sub.current_period_end,
      cancel_at_period_end: sub.cancel_at_period_end,
    }

    try {
      await subscriptions.updateOne(
        { stripe_subscription_id: sub.stripe_subscription_id },
        { $setOnInsert: doc },
        { upsert: true }
      )
      migrated++
    } catch (err) {
      console.error(`   ❌ Failed to migrate subscription ${sub.id}:`, err)
      skipped++
    }
  }

  console.log(`   ✅ Migrated ${migrated} subscriptions, skipped ${skipped}`)
}

async function migrateUsers(users: Awaited<ReturnType<typeof getCollections>>['users']) {
  console.log('\n📦 Migrating users (from profiles.email as key)...')

  // Users are derived from profiles in this schema
  // We migrate distinct user records needed for auth
  const supabaseProfiles = await supabaseFetch<SupabaseProfile>(
    'profiles',
    'select=id,email,name,created_at'
  )

  let migrated = 0
  let skipped = 0

  for (const profile of supabaseProfiles) {
    const doc = {
      _id: profile.id,
      email: profile.email,
      name: profile.name ?? '',
      created_at: profile.created_at ? new Date(profile.created_at) : new Date(),
    }

    try {
      await (users as any).updateOne(
        { _id: profile.id },
        { $setOnInsert: doc },
        { upsert: true }
      )
      migrated++
    } catch (err) {
      console.error(`   ❌ Failed to migrate user ${profile.id}:`, err)
      skipped++
    }
  }

  console.log(`   ✅ Migrated ${migrated} users, skipped ${skipped}`)
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function getCollections(db: Awaited<ReturnType<MongoClient['db']>>) {
  return {
    users: db.collection('users'),
    profiles: db.collection('profiles'),
    portfolios: db.collection('portfolios'),
    subscriptions: db.collection('subscriptions'),
  }
}

async function main() {
  console.log('🚀 Supabase → MongoDB Migration')
  console.log('='.repeat(50))

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.warn('\n⚠️  Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set.')
    console.warn('   Only MongoDB-only data will be available after this migration.')
    console.warn('   Set these env vars to migrate from an existing Supabase instance.')
  }

  // Connect to MongoDB
  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  console.log('✅ Connected to MongoDB')

  const db = client.db(MONGODB_DB)
  const collections = await getCollections(db)

  // Run migrations
  await migrateUsers(collections.users)
  await migrateProfiles(collections.profiles)
  await migratePortfolios(collections.portfolios)
  await migrateSubscriptions(collections.subscriptions)

  await client.close()

  console.log('\n' + '='.repeat(50))
  console.log('✅ Migration complete!')
  console.log('\n📝 Next steps:')
  console.log('   1. Verify data in MongoDB')
  console.log('   2. Remove @supabase/supabase-js from package.json')
  console.log('   3. Delete src/lib/supabase.ts')
  console.log('   4. Run npm run build to verify no errors')
}

main().catch((err) => {
  console.error('\n❌ Migration failed:', err)
  process.exit(1)
})
