import { z } from "zod";
import { router, protectedProcedure } from "../lib/trpc";
import Stripe from "stripe";
import { TRPCError } from "@trpc/server";
import {
  getUserById,
  updateUser,
  getSubscriptionByUserId,
  getSubscriptionByStripeId,
  createSubscription,
  updateSubscription,
} from "../database/queries";
import { PLAN_CONFIG, type PlanType } from "../../../stripe-products";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Stripe not configured",
    });
  }
  return new Stripe(key, { apiVersion: "2024-12-18.acacia" });
}

export const subscriptionRouter = router({
  // Get subscription status
  status: protectedProcedure.query(async ({ ctx }) => {
    const sub = await getSubscriptionByUserId(ctx.user.id);

    if (!sub) {
      return {
        plan: "free",
        status: "inactive",
        currentPeriodEnd: null,
        booksPerMonth: 1,
        booksUsedThisMonth: 0,
      };
    }

    return {
      plan: sub.plan,
      status: sub.status,
      currentPeriodEnd: sub.currentPeriodEnd,
      booksPerMonth: sub.booksPerMonth,
      booksUsedThisMonth: sub.currentMonthBooksCreated,
    };
  }),

  // Create Stripe checkout session
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        priceId: z.string(),
        plan: z.enum(["starter", "pro", "enterprise"]),
        successUrl: z.string().url(),
        cancelUrl: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const stripe = getStripe();
      const user = await getUserById(ctx.user.id);
      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "User not found" });
      }

      // Get or create Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: { userId: user.id },
        });
        customerId = customer.id;
        await updateUser(user.id, { stripeCustomerId: customerId });
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [{ price: input.priceId, quantity: 1 }],
        mode: "subscription",
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
        client_reference_id: user.id,
        metadata: { userId: user.id, plan: input.plan },
      });

      return { url: session.url! };
    }),

  // Create Stripe billing portal session
  createPortalSession: protectedProcedure
    .input(z.object({ returnUrl: z.string().url().optional() }).optional())
    .mutation(async ({ ctx, input }) => {
      const stripe = getStripe();
      const user = await getUserById(ctx.user.id);

      if (!user?.stripeCustomerId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No billing account found",
        });
      }

      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:5173";

      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: input?.returnUrl ?? `${baseUrl}/account`,
      });

      return { url: session.url };
    }),

  // Get available plans
  plans: protectedProcedure.query(() => {
    return Object.entries(PLAN_CONFIG).map(([id, plan]) => ({
      id,
      ...plan,
    }));
  }),
});