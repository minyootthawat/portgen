import { MongoClient, Db, Collection } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'portgen';

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

interface Portfolio {
  _id?: string;
  userId: string;
  name: string;
  template: string;
  data: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

interface Order {
  _id?: string;
  userId: string;
  portfolioId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  amount: number;
  currency: string;
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  client = new MongoClient(MONGODB_URI!);
  await client.connect();
  db = client.db(MONGODB_DB);

  return db;
}

export function getClient(): MongoClient {
  if (!client) {
    throw new Error('Database not connected. Call connectToDatabase() first.');
  }
  return client;
}

export function getDb(): Db {
  if (!db) {
    throw new Error('Database not connected. Call connectToDatabase() first.');
  }
  return db;
}

export function getPortfoliosCollection(): Collection<Portfolio> {
  return getDb().collection<Portfolio>('portfolios');
}

export function getOrdersCollection(): Collection<Order> {
  return getDb().collection<Order>('orders');
}

export { Portfolio, Order };
