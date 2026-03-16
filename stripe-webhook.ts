import Stripe from "stripe";
import { Request, Response } from "express";
import * as db from "./db";
import { PLAN_CONFIG, PlanType } from "./stripe-products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

/**
 * Handle Stripe webhook events
 * This function should be called from the /api/stripe/webhook endpoint
 */
export async function handleStripeWebhook(
  event: Stripe.Event,
  req: Request,
  res: Response
) {
  // Test event handling - CRITICAL for webhook verification
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({
      verified: true,
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("[Webhook] Error processing event:", error);
    res.status(400).json({ error: String(error) });
  }
}

/**
 * Handle checkout.session.completed event
 * Triggered when a customer completes a checkout session
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log("[Webhook] Checkout session completed:", session.id);

  const userId = parseInt(session.client_reference_id || "0");
  const stripeCustomerId = session.customer as string;

  if (!userId || !stripeCustomerId) {
    console.error("[Webhook] Missing userId or stripeCustomerId in session");
    return;
  }

  // Check if subscription already exists
  let subscription = await db.getSubscriptionByStripeId(stripeCustomerId);

  if (!subscription) {
    // Create new subscription
    const plan = (session.metadata?.plan || "starter") as PlanType;
    const planConfig = PLAN_CONFIG[plan];

    await db.createSubscription({
      userId,
      stripeCustomerId,
      plan,
      status: "active",
      booksPerMonth: planConfig.booksPerMonth,
      imagesPerMonth: planConfig.imagesPerMonth,
      currentMonthBooksCreated: 0,
      currentMonthImagesGenerated: 0,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });
  }
}

/**
 * Handle customer.subscription.created event
 * Triggered when a subscription is created
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log("[Webhook] Subscription created:", subscription.id);

  const stripeCustomerId = subscription.customer as string;
  const plan = (subscription.metadata?.plan || "starter") as PlanType;
  const planConfig = PLAN_CONFIG[plan];

  // Check if subscription already exists
  let existingSubscription = await db.getSubscriptionByStripeId(stripeCustomerId);

  if (!existingSubscription) {
    // Get user by stripe customer ID - this requires a lookup
    // For now, we'll handle this in the checkout.session.completed event
    console.log("[Webhook] Subscription created but user not found, waiting for checkout completion");
  } else {
    // Update existing subscription
    await db.updateSubscription(existingSubscription.userId, {
      stripeSubscriptionId: subscription.id,
      status: subscription.status as any,
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    });
  }
}

/**
 * Handle customer.subscription.updated event
 * Triggered when a subscription is updated
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("[Webhook] Subscription updated:", subscription.id);

  const stripeCustomerId = subscription.customer as string;
  const existingSubscription = await db.getSubscriptionByStripeId(stripeCustomerId);

  if (existingSubscription) {
    const plan = (subscription.metadata?.plan || existingSubscription.plan) as PlanType;
    const planConfig = PLAN_CONFIG[plan];

    await db.updateSubscription(existingSubscription.userId, {
      plan,
      status: subscription.status as any,
      booksPerMonth: planConfig.booksPerMonth,
      imagesPerMonth: planConfig.imagesPerMonth,
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    });
  }
}

/**
 * Handle customer.subscription.deleted event
 * Triggered when a subscription is canceled
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("[Webhook] Subscription deleted:", subscription.id);

  const stripeCustomerId = subscription.customer as string;
  const existingSubscription = await db.getSubscriptionByStripeId(stripeCustomerId);

  if (existingSubscription) {
    await db.updateSubscription(existingSubscription.userId, {
      status: "canceled",
      canceledAt: new Date(),
    });
  }
}

/**
 * Handle invoice.paid event
 * Triggered when an invoice is paid
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log("[Webhook] Invoice paid:", invoice.id);

  const stripeCustomerId = invoice.customer as string;
  const existingSubscription = await db.getSubscriptionByStripeId(stripeCustomerId);

  const paymentIntentId = (invoice as any).payment_intent;
  if (existingSubscription && paymentIntentId) {
    const intentId = typeof paymentIntentId === "string" 
      ? paymentIntentId 
      : paymentIntentId.id;

    // Update or create payment record
    let payment = await db.getPaymentByStripeId(intentId);

    if (!payment) {
      await db.createPayment({
        userId: existingSubscription.userId,
        stripePaymentIntentId: intentId,
        amount: invoice.amount_paid || 0,
        currency: invoice.currency || "usd",
        status: "succeeded",
        paymentType: "subscription" as const,
        description: `Invoice ${invoice.number}`,
      });
    }
  }
}

/**
 * Handle invoice.payment_failed event
 * Triggered when an invoice payment fails
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log("[Webhook] Invoice payment failed:", invoice.id);

  const stripeCustomerId = invoice.customer as string;
  const existingSubscription = await db.getSubscriptionByStripeId(stripeCustomerId);

  if (existingSubscription) {
    await db.updateSubscription(existingSubscription.userId, {
      status: "past_due",
    });
  }
}

/**
 * Handle payment_intent.succeeded event
 * Triggered when a payment intent succeeds
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log("[Webhook] Payment intent succeeded:", paymentIntent.id);

  if (paymentIntent.metadata?.user_id) {
    const userId = parseInt(paymentIntent.metadata.user_id);

    // Update or create payment record
    let payment = await db.getPaymentByStripeId(paymentIntent.id);

    if (!payment) {
      await db.createPayment({
        userId,
        stripePaymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: "succeeded",
        paymentType: (paymentIntent.metadata?.payment_type || "one_time") as "subscription" | "one_time" | "book_purchase",
        description: paymentIntent.description || undefined,
      });
    }
  }
}

/**
 * Handle payment_intent.payment_failed event
 * Triggered when a payment intent fails
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log("[Webhook] Payment intent failed:", paymentIntent.id);

  if (paymentIntent.metadata?.user_id) {
    const userId = parseInt(paymentIntent.metadata.user_id);

    // Update or create payment record
    let payment = await db.getPaymentByStripeId(paymentIntent.id);

    if (!payment) {
      await db.createPayment({
        userId,
        stripePaymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: "failed",
        paymentType: (paymentIntent.metadata?.payment_type || "one_time") as "subscription" | "one_time" | "book_purchase",
        description: paymentIntent.description || undefined,
      });
    }
  }
}
