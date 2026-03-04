import { Request, Response } from "express";
import Stripe from "stripe";
import {
  getUserById,
  updateUser,
  getSubscriptionByStripeId,
  createSubscription,
  updateSubscription,
  getPaymentByStripeId,
  createPayment,
} from "../database/queries";
import { PLAN_CONFIG, type PlanType } from "../../../stripe-products";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  return new Stripe(key, { apiVersion: "2024-12-18.acacia" });
}

// ── Webhook entry point ───────────────────────────────────────────────────────
export async function handleStripeWebhook(req: Request, res: Response) {
  const stripe = getStripe();
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !sig) {
    return res.status(400).json({ error: "Missing webhook secret or signature" });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("[Webhook] Signature verification failed:", err);
    return res.status(400).json({ error: "Invalid signature" });
  }

  // Test event passthrough
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event received:", event.type);
    return res.json({ verified: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await onCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.created":
        await onSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.updated":
        await onSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await onSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case "invoice.paid":
        await onInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case "invoice.payment_failed":
        await onInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case "payment_intent.succeeded":
        await onPaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case "payment_intent.payment_failed":
        await onPaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        console.log(`[Webhook] Unhandled event: ${event.type}`);
    }
    res.json({ received: true });
  } catch (err) {
    console.error("[Webhook] Handler error:", err);
    res.status(500).json({ error: String(err) });
  }
}

// ── Handlers ──────────────────────────────────────────────────────────────────

async function onCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.client_reference_id;
  const stripeCustomerId = session.customer as string;
  if (!userId || !stripeCustomerId) return;

  const plan = (session.metadata?.plan ?? "starter") as PlanType;
  const planConfig = PLAN_CONFIG[plan];

  // Update user stripe customer id
  await updateUser(userId, {
    stripeCustomerId,
    subscriptionStatus: "active",
  });

  // Upsert subscription row
  const existing = await getSubscriptionByStripeId(stripeCustomerId);
  if (!existing) {
    await createSubscription({
      userId,
      stripeCustomerId,
      plan,
      status: "active",
      booksPerMonth: planConfig.booksPerMonth,
      imagesPerMonth: planConfig.imagesPerMonth,
      currentMonthBooksCreated: 0,
      currentMonthImagesGenerated: 0,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      canceledAt: null,
    });
  }
}

async function onSubscriptionCreated(subscription: Stripe.Subscription) {
  const stripeCustomerId = subscription.customer as string;
  const plan = (subscription.metadata?.plan ?? "starter") as PlanType;
  const planConfig = PLAN_CONFIG[plan];

  const existing = await getSubscriptionByStripeId(stripeCustomerId);
  if (existing) {
    await updateSubscription(existing.userId, {
      stripeSubscriptionId: subscription.id,
      status: subscription.status as any,
      plan,
      booksPerMonth: planConfig.booksPerMonth,
      imagesPerMonth: planConfig.imagesPerMonth,
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    });
  }
}

async function onSubscriptionUpdated(subscription: Stripe.Subscription) {
  const stripeCustomerId = subscription.customer as string;
  const existing = await getSubscriptionByStripeId(stripeCustomerId);
  if (!existing) return;

  const plan = (subscription.metadata?.plan ?? existing.plan) as PlanType;
  const planConfig = PLAN_CONFIG[plan];

  await updateSubscription(existing.userId, {
    plan,
    status: subscription.status as any,
    booksPerMonth: planConfig.booksPerMonth,
    imagesPerMonth: planConfig.imagesPerMonth,
    currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
  });

  // Sync subscription_status on users table
  await updateUser(existing.userId, { subscriptionStatus: subscription.status });
}

async function onSubscriptionDeleted(subscription: Stripe.Subscription) {
  const stripeCustomerId = subscription.customer as string;
  const existing = await getSubscriptionByStripeId(stripeCustomerId);
  if (!existing) return;

  await updateSubscription(existing.userId, {
    status: "canceled",
    canceledAt: new Date(),
  });
  await updateUser(existing.userId, { subscriptionStatus: "free" });
}

async function onInvoicePaid(invoice: Stripe.Invoice) {
  const stripeCustomerId = invoice.customer as string;
  const existing = await getSubscriptionByStripeId(stripeCustomerId);
  const paymentIntentId =
    typeof (invoice as any).payment_intent === "string"
      ? (invoice as any).payment_intent
      : (invoice as any).payment_intent?.id;

  if (existing && paymentIntentId) {
    const payment = await getPaymentByStripeId(paymentIntentId);
    if (!payment) {
      await createPayment({
        userId: existing.userId,
        stripePaymentIntentId: paymentIntentId,
        amount: invoice.amount_paid ?? 0,
        currency: invoice.currency ?? "usd",
        status: "succeeded",
        paymentType: "subscription",
        description: `Invoice ${invoice.number ?? invoice.id}`,
      });
    }
  }
}

async function onInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const stripeCustomerId = invoice.customer as string;
  const existing = await getSubscriptionByStripeId(stripeCustomerId);
  if (existing) {
    await updateSubscription(existing.userId, { status: "past_due" });
    await updateUser(existing.userId, { subscriptionStatus: "past_due" });
  }
}

async function onPaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const userId = paymentIntent.metadata?.user_id;
  if (!userId) return;

  const payment = await getPaymentByStripeId(paymentIntent.id);
  if (!payment) {
    await createPayment({
      userId,
      stripePaymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: "succeeded",
      paymentType: (paymentIntent.metadata?.payment_type ?? "one_time") as any,
      description: paymentIntent.description ?? undefined,
    });
  }
}

async function onPaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const userId = paymentIntent.metadata?.user_id;
  if (!userId) return;

  const payment = await getPaymentByStripeId(paymentIntent.id);
  if (!payment) {
    await createPayment({
      userId,
      stripePaymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: "failed",
      paymentType: (paymentIntent.metadata?.payment_type ?? "one_time") as any,
      description: paymentIntent.description ?? undefined,
    });
  }
}