import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe-config';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      // Handle successful checkout - update user subscription in DB
      console.log('Checkout completed:', session.id);
      // In production: Update user's subscription tier in database
      break;
    }

    case 'customer.subscription.created': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription created:', subscription.id);
      // In production: Update user's subscription status
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription updated:', subscription.id);
      // In production: Update user's subscription tier
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription deleted:', subscription.id);
      // In production: Downgrade user to free tier
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('Payment succeeded:', invoice.id);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('Payment failed:', invoice.id);
      // In production: Notify user of failed payment
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}