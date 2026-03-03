import type { Request, Response } from "express";
import Stripe from "stripe";
import { db } from "../database/connection";

export default async function stripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !sig) {
    return res.status(400).json({ error: "Missing webhook secret or signature" });
  }

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-12-18.acacia" });
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (userId && session.subscription) {
          db.prepare(`
            UPDATE users
            SET subscription_status = 'active',
                stripe_subscription_id = ?,
                updated_at = datetime('now')
            WHERE id = ?
          `).run(session.subscription as string, parseInt(userId));
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customer = sub.customer as string;
        const user = db.prepare("SELECT id FROM users WHERE stripe_customer_id = ?").get(customer) as any;
        if (user) {
          const status = sub.status === "active" ? "active" : "inactive";
          db.prepare(`
            UPDATE users SET subscription_status = ?, updated_at = datetime('now') WHERE id = ?
          `).run(status, user.id);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customer = sub.customer as string;
        const user = db.prepare("SELECT id FROM users WHERE stripe_customer_id = ?").get(customer) as any;
        if (user) {
          db.prepare(`
            UPDATE users
            SET subscription_status = 'free',
                stripe_subscription_id = NULL,
                updated_at = datetime('now')
            WHERE id = ?
          `).run(user.id);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return res.status(500).json({ error: "Webhook handler failed" });
  }

  res.json({ received: true });
}