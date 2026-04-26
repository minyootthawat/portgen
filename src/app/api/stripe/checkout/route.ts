import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

interface CheckoutBody {
  userId: string
  email: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  // TODO (security): Add rate limiting per user: 5 req/min, per IP: 10 req/min
  let body: CheckoutBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { userId, email } = body

  if (!userId || typeof userId !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid userId' }, { status: 400 })
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Missing or invalid email' }, { status: 400 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Verify profile exists
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, stripe_customer_id')
    .eq('id', userId)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  let customerId = profile.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email,
      metadata: { supabase_user_id: userId },
    })
    customerId = customer.id

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', userId)

    if (updateError) {
      console.error('Failed to persist Stripe customer ID:', updateError)
      return NextResponse.json(
        { error: 'Failed to link Stripe customer' },
        { status: 500 }
      )
    }
  }

  const priceId = process.env.STRIPE_PRICE_ID
  if (!priceId) {
    console.error('STRIPE_PRICE_ID is not configured')
    return NextResponse.json(
      { error: 'Payment configuration error' },
      { status: 500 }
    )
  }

  let session
  try {
    session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=cancelled`,
      metadata: { userId },
      subscription_data: {
        metadata: { userId },
      },
    })
  } catch (err: any) {
    console.error('Stripe checkout session creation failed:', err)
    return NextResponse.json(
      { error: err.message ?? 'Failed to create checkout session' },
      { status: 500 }
    )
  }

  return NextResponse.json({ url: session.url })
}
