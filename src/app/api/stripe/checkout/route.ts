import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: Request) {
  try {
    const { userId, email } = await request.json()

    if (!userId || !email) {
      return NextResponse.json({ error: 'Missing userId or email' }, { status: 400 })
    }

    // Create or get Stripe customer
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { supabase_user_id: userId },
      })
      customerId = customer.id

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId)
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!, // Create this in Stripe Dashboard: $5/month
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=cancelled`,
      metadata: { userId },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
