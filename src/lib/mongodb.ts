import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI!
const options = {}

let client: MongoClient | null = null
let db: Db | null = null

export async function connectDB(): Promise<Db> {
  if (db) return db

  client = new MongoClient(uri, options)
  await client.connect()
  db = client.db()
  console.log('[MongoDB] Connected to', db.databaseName)
  return db
}

export function getDB(): Db {
  if (!db) throw new Error('DB not initialized. Call connectDB() first.')
  return db
}

export default async function getCollections() {
  const database = await connectDB()
  return {
    users: database.collection('users'),
    profiles: database.collection('profiles'),
    portfolios: database.collection('portfolios'),
    products: database.collection('products'),
    orders: database.collection('orders'),
    game_accounts: database.collection('game_accounts'),
    seller_ledger_entries: database.collection('seller_ledger_entries'),
    subscriptions: database.collection('subscriptions'),
  }
}
