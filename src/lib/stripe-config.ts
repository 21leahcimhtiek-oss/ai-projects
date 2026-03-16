import Stripe from 'stripe';

// Initialize Stripe with secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-02-25.clover' as Stripe.LatestApiVersion,
});

// Subscription tiers with Stripe price IDs
export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      '5 likes per day',
      'Basic matching',
      'Limited messaging',
      'Basic profile visibility',
    ],
  },
  premium: {
    name: 'Premium',
    price: 29.99,
    priceId: 'price_premium_monthly',
    features: [
      'Unlimited likes',
      'See who liked you',
      'Advanced matching filters',
      'Priority in discovery',
      'Read receipts',
      'Unlimited messaging',
      'Incognito mode',
    ],
  },
  vip: {
    name: 'VIP',
    price: 79.99,
    priceId: 'price_vip_monthly',
    features: [
      'All Premium features',
      'Verified VIP badge',
      'Unlimited super likes',
      'Profile boost monthly',
      'See who viewed your profile',
      'Priority support',
      'Exclusive events access',
      'Advanced privacy controls',
    ],
  },
} as const;

export type PlanType = keyof typeof SUBSCRIPTION_PLANS;

// Create a Stripe customer
export async function createStripeCustomer(email: string, name?: string): Promise<string> {
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      platform: 'velvet',
    },
  });
  return customer.id;
}

// Create a checkout session for subscription
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      platform: 'velvet',
    },
  });
  return session.url || '';
}

// Create a billing portal session
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  return session.url;
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string): Promise<boolean> {
  try {
    await stripe.subscriptions.cancel(subscriptionId);
    return true;
  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    return false;
  }
}

// Get subscription status
export async function getSubscriptionStatus(subscriptionId: string): Promise<{
  status: string;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
}> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return {
    status: subscription.status,
    currentPeriodEnd: (subscription as any).current_period_end,
    cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
  };
}