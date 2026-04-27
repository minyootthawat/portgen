import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import getCollections from '@/lib/mongodb'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// In-memory set to track processed event IDs (for replay attack prevention)
// In production, use Redis with TTL. TODO (security): Replace with Redis.
const processedEvents = new Set<string>()

type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing'

interface SubscriptionRecord {
  user_id: string
  stripe_subscription_id: string
  stripe_price_id: string
  status: SubscriptionStatus
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
}

// Map Stripe subscription status to our Subscription status type
function mapSubscriptionStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case 'active':
    case 'trialing':
      return 'active'
    case 'canceled':
      return 'canceled'
    case 'past_due':
      return 'past_due'
    default:
      return 'canceled'
  }
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Replay attack prevention: reject events older than 5 minutes
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 300
  if (event.created && event.created < fiveMinutesAgo) {
    console.warn('Webhook event rejected: too old', event.id, event.created)
    return NextResponse.json({ error: 'Event too old' }, { status: 400 })
  }

  // Deduplicate by event ID (in-memory; use Redis in production)
  if (processedEvents.has(event.id)) {
    return NextResponse.json({ received: true })
  }
  processedEvents.add(event.id)
  // Prune old entries to prevent unbounded memory growth
  if (processedEvents.size > 10000) {
    processedEvents.clear()
  }

  const { subscriptions, profiles } = await getCollections()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode !== 'subscription' || !session.subscription) {
          break
        }

        const userId = session.metadata?.userId
        if (!userId) {
          console.error('checkout.session.completed: missing userId in metadata')
          break
        }

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )

        const subscriptionRecord: SubscriptionRecord = {
          user_id: userId,
          stripe_subscription_id: subscription.id,
          stripe_price_id: subscription.items.data[0].price.id,
          status: mapSubscriptionStatus(subscription.status),
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
        }

        const subResult = await subscriptions.insertOne(subscriptionRecord)

        if (!subResult.insertedId) {
          console.error('Failed to insert subscription record')
          throw new Error('Failed to insert subscription record')
        }

        // Update profile plan to pro
        const profileResult = await profiles.updateOne(
          { user_id: userId },
          { $set: { plan: 'pro' } }
        )

        if (profileResult.matchedCount === 0) {
          console.error('Failed to update profile plan: profile not found for userId', userId)
          throw new Error('Failed to update profile plan')
        }

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (!userId) {
          console.error('customer.subscription.updated: missing userId in metadata')
          break
        }

        const newPlan = ['active', 'trialing'].includes(subscription.status) ? 'pro' : 'free'

        const subResult = await subscriptions.updateOne(
          { stripe_subscription_id: subscription.id },
          {
            $set: {
              status: mapSubscriptionStatus(subscription.status),
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
            },
          },
          { upsert: true }
        )

        if (!subResult.acknowledged) {
          console.error('Failed to upsert subscription')
          throw new Error('Failed to upsert subscription')
        }

        const profileResult = await profiles.updateOne(
          { user_id: userId },
          { $set: { plan: newPlan } }
        )

        if (profileResult.matchedCount === 0) {
          console.error('Failed to update profile plan on subscription update: profile not found for userId', userId)
          throw new Error('Failed to update profile plan on subscription update')
        }

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (!userId) {
          console.error('customer.subscription.deleted: missing userId in metadata')
          break
        }

        const subResult = await subscriptions.updateOne(
          { stripe_subscription_id: subscription.id },
          { $set: { status: 'canceled' } }
        )

        if (!subResult.acknowledged) {
          console.error('Failed to cancel subscription')
          throw new Error('Failed to cancel subscription')
        }

        const profileResult = await profiles.updateOne(
          { user_id: userId },
          { $set: { plan: 'free' } }
        )

        if (profileResult.matchedCount === 0) {
          console.error('Failed to update profile plan on subscription deletion: profile not found for userId', userId)
          throw new Error('Failed to update profile plan on subscription deletion')
        }

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string | null

        if (!subscriptionId) {
          break
        }

        const result = await subscriptions.updateOne(
          { stripe_subscription_id: subscriptionId },
          { $set: { status: 'past_due' } }
        )

        if (!result.acknowledged) {
          console.error('Failed to mark subscription as past_due')
          throw new Error('Failed to mark subscription as past_due')
        }

        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string | null

        if (!subscriptionId) {
          break
        }

        // Ensure subscription is active after successful payment
        const result = await subscriptions.updateOne(
          { stripe_subscription_id: subscriptionId, status: 'past_due' },
          { $set: { status: 'active' } }
        )

        if (!result.acknowledged) {
          console.error('Failed to restore subscription status')
          // Don't throw — this is a best-effort recovery
        }

        break
      }

      default:
        // Unhandled event type — not an error
        break
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
