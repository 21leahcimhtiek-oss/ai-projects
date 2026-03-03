import { z } from "zod";
import { router, protectedProcedure } from "../lib/trpc";
import Stripe from "stripe";
import { TRPCError } from "@trpc/server";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Stripe not configured" });
  return new Stripe(key, { apiVersion: "2024-12-18.acacia" });
}

export const subscriptionRouter = router({
  // Get subscription status
  status: protectedProcedure.query(({ ctx }) => {
    const user = ctx.db.prepare(`
      SELECT subscription_status, stripe_subscription_id FROM users WHERE id = ?
    `).get(ctx.user.id) as any;

    if (!user?.stripe_subscription_id) {
      return { plan: "free", status: "inactive", currentPeriodEnd: null };
    }

    return {
      plan: user.subscription_status,
      status: user.subscription_status === "active" ? "active" : "inactive",
      currentPeriodEnd: null,
    };
  }),

  // Create Stripe checkout session
  createCheckoutSession: protectedProcedure
    .input(z.object({
      priceId: z.string(),
      successUrl: z.string().url(),
      cancelUrl: z.string().url(),
    }))
    .mutation(async ({ ctx, input }) => {
      const stripe = getStripe();

      const user = ctx.db.prepare("SELECT * FROM users WHERE id = ?").get(ctx.user.id) as any;

      let customerId = user.stripe_customer_id;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: { userId: String(user.id) },
        });
        customerId = customer.id;
        ctx.db.prepare("UPDATE users SET stripe_customer_id = ? WHERE id = ?").run(customerId, user.id);
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [{ price: input.priceId, quantity: 1 }],
        mode: "subscription",
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
        metadata: { userId: String(user.id) },
      });

      return { url: session.url! };
    }),

  // Create Stripe billing portal session
  createPortalSession: protectedProcedure
    .input(z.object({ returnUrl: z.string().url().optional() }).optional())
    .mutation(async ({ ctx, input }) => {
      const stripe = getStripe();
      const user = ctx.db.prepare("SELECT stripe_customer_id FROM users WHERE id = ?").get(ctx.user.id) as any;

      if (!user?.stripe_customer_id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No billing account found" });
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripe_customer_id,
        return_url: input?.returnUrl ?? `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:5173"}/account`,
      });

      return { url: session.url };
    }),
});