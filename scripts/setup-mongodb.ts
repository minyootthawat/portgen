/**
 * MongoDB Setup Script
 * Run with: npx ts-node --esm scripts/setup-mongodb.ts
 * Or import in Next.js API route for one-time setup
 */

import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dcs:lSv1eEghdfvHGXvn@dcs.kij1y8e.mongodb.net/portgen?appName=DCS'

async function setup() {
  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  const db = client.db('portgen')

  console.log('Creating indexes...')

  // Users collection
  await db.collection('users').createIndex({ email: 1 }, { unique: true })
  console.log('✓ users.email unique index')

  // Profiles collection
  await db.collection('profiles').createIndex({ user_id: 1 }, { unique: true })
  console.log('✓ profiles.user_id unique index')

  // Portfolios collection
  await db.collection('portfolios').createIndex({ subdomain: 1 }, { unique: true })
  console.log('✓ portfolios.subdomain unique index')

  await db.collection('portfolios').createIndex({ slug: 1 }, { unique: true })
  console.log('✓ portfolios.slug unique index')

  await db.collection('portfolios').createIndex({ user_id: 1 })
  console.log('✓ portfolios.user_id index')

  await db.collection('portfolios').createIndex({ is_published: 1, is_deleted: 1 })
  console.log('✓ portfolios.is_published + is_deleted compound index')

  // Subscriptions
  await db.collection('subscriptions').createIndex({ user_id: 1 })
  await db.collection('subscriptions').createIndex({ stripe_subscription_id: 1 }, { unique: true })
  console.log('✓ subscriptions indexes')

  // Seed demo data
  console.log('\nSeeding demo data...')

  const demoUserId = 'demo-user-001'
  const aliceUserId = 'alice-user-002'
  const bobUserId = 'bob-user-003'

  // Demo portfolio
  const demoPortfolio = {
    user_id: demoUserId,
    name: 'Demo User',
    slug: 'demo',
    subdomain: 'demo',
    tagline: 'Full-Stack Developer | React & Node.js',
    about: 'นักพัฒนาเว็บไซต์ที่หลงใหลในเทคโนโลยีใหม่ๆ มีประสบการณ์ในการสร้างเว็บแอปพลิเคชันที่ทันสมัย',
    avatar_url: '',
    skills: [
      { id: '1', name: 'React' },
      { id: '2', name: 'TypeScript' },
      { id: '3', name: 'Node.js' },
      { id: '4', name: 'Next.js' },
    ],
    projects: [
      {
        id: 'p1',
        title: 'E-Commerce Platform',
        description: 'แพลตฟอร์มซื้อขายออนไลน์ที่รองรับการชำระเงินหลายช่องทาง',
        tags: ['React', 'Node.js', 'Stripe'],
        live_url: 'https://example.com',
        repo_url: 'https://github.com/example',
        order: 0,
      },
    ],
    social_links: [
      { id: 's1', platform: 'github', url: 'https://github.com' },
      { id: 's2', platform: 'linkedin', url: 'https://linkedin.com' },
    ],
    theme: 'gradient-dark',
    theme_config: {},
    custom_sections: [],
    is_published: true,
    is_deleted: false,
    view_count: 42,
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date(),
  }

  // Alice portfolio
  const alicePortfolio = {
    user_id: aliceUserId,
    name: 'Alice Chen',
    slug: 'alice',
    subdomain: 'alice',
    tagline: 'Frontend Engineer | UI/UX Enthusiast',
    about: 'รักในการออกแบบและพัฒนา user interfaces ที่สวยงามและใช้งานง่าย',
    avatar_url: '',
    skills: [
      { id: '1', name: 'Vue.js' },
      { id: '2', name: 'Figma' },
      { id: '3', name: 'CSS' },
    ],
    projects: [],
    social_links: [],
    theme: 'minimal-light',
    theme_config: {},
    custom_sections: [],
    is_published: true,
    is_deleted: false,
    view_count: 128,
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date(),
  }

  // Bob portfolio
  const bobPortfolio = {
    user_id: bobUserId,
    name: 'Bob Kim',
    slug: 'bob',
    subdomain: 'bob',
    tagline: 'Backend Developer | Go & PostgreSQL',
    about: 'เชี่ยวชาญด้านการพัฒนาระบบ backend ที่มีประสิทธิภาพสูงและปลอดภัย',
    avatar_url: '',
    skills: [
      { id: '1', name: 'Go' },
      { id: '2', name: 'PostgreSQL' },
      { id: '3', name: 'Docker' },
    ],
    projects: [],
    social_links: [],
    theme: 'brutalist',
    theme_config: {},
    custom_sections: [],
    is_published: true,
    is_deleted: false,
    view_count: 87,
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date(),
  }

  // Insert demo portfolios (upsert)
  const portfolios = db.collection('portfolios')

  await portfolios.updateOne(
    { subdomain: 'demo' },
    { $setOnInsert: demoPortfolio },
    { upsert: true }
  )
  console.log('✓ Seeded demo portfolio')

  await portfolios.updateOne(
    { subdomain: 'alice' },
    { $setOnInsert: alicePortfolio },
    { upsert: true }
  )
  console.log('✓ Seeded alice portfolio')

  await portfolios.updateOne(
    { subdomain: 'bob' },
    { $setOnInsert: bobPortfolio },
    { upsert: true }
  )
  console.log('✓ Seeded bob portfolio')

  await client.close()
  console.log('\n✅ Setup complete!')
}

setup().catch(console.error)
