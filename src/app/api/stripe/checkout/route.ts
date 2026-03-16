import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, createStripeCustomer } from '@/lib/stripe-config';

export async function POST(req: NextRequest) {
  try {
    const { email, plan, name } = await req.json();

    if (!email || !plan) {
      return NextResponse.json(
        { error: 'Email and plan are required' },
        { status: 400 }
      );
    }

    // Create or retrieve Stripe customer
    const customerId = await createStripeCustomer(email, name);

    // Get price ID for plan
    const plans = {
      premium: {
        priceId: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium_monthly',
        amount: 2999,
      },
      vip: {
        priceId: process.env.STRIPE_VIP_PRICE_ID || 'price_vip_monthly',
        amount: 7999,
      },
    };

    const selectedPlan = plans[plan as keyof typeof plans];
    
    if (!selectedPlan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Create checkout session
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const checkoutUrl = await createCheckoutSession(
      customerId,
      selectedPlan.priceId,
      `${origin}/settings?session_id={CHECKOUT_SESSION_ID}&success=true`,
      `${origin}/settings?canceled=true`
    );

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}