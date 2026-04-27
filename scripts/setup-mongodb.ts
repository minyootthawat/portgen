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

  await client.close()
  console.log('\n✅ Setup complete!')
}

setup().catch(console.error)
