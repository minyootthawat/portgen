import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// In-memory set to track processed event IDs (for replay attack prevention)
// In production, use Redis with TTL. TODO (security): Replace with Redis.
const processedEvents = new Set<string>()

type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing'

interface SubscriptionRecord {
  id?: number
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

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

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

        const subscriptionRecord: Omit<SubscriptionRecord, 'id'> = {
          user_id: userId,
          stripe_subscription_id: subscription.id,
          stripe_price_id: subscription.items.data[0].price.id,
          status: mapSubscriptionStatus(subscription.status),
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
        }

        const { error: subError } = await supabase
          .from('subscriptions')
          .insert(subscriptionRecord)

        if (subError) {
          console.error('Failed to insert subscription record:', subError)
          throw subError
        }

        // Update profile plan to pro
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ plan: 'pro' })
          .eq('id', userId)

        if (profileError) {
          console.error('Failed to update profile plan:', profileError)
          throw profileError
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

        const { error: subError } = await supabase
          .from('subscriptions')
          .upsert(
            {
              stripe_subscription_id: subscription.id,
              status: mapSubscriptionStatus(subscription.status),
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
            },
            {
              onConflict: 'stripe_subscription_id',
              ignoreDuplicates: false,
            }
          )

        if (subError) {
          console.error('Failed to upsert subscription:', subError)
          throw subError
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .update({ plan: newPlan })
          .eq('id', userId)

        if (profileError) {
          console.error('Failed to update profile plan on subscription update:', profileError)
          throw profileError
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

        const { error: subError } = await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscription.id)

        if (subError) {
          console.error('Failed to cancel subscription:', subError)
          throw subError
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .update({ plan: 'free' })
          .eq('id', userId)

        if (profileError) {
          console.error('Failed to update profile plan on subscription deletion:', profileError)
          throw profileError
        }

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string | null

        if (!subscriptionId) {
          break
        }

        const { error } = await supabase
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('stripe_subscription_id', subscriptionId)

        if (error) {
          console.error('Failed to mark subscription as past_due:', error)
          throw error
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
        const { error } = await supabase
          .from('subscriptions')
          .update({ status: 'active' })
          .eq('stripe_subscription_id', subscriptionId)
          .eq('status', 'past_due')

        if (error) {
          console.error('Failed to restore subscription status:', error)
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
