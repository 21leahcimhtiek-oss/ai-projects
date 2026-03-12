// Subscription Router
// TODO: Add full implementation with Stripe integration

import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../lib/trpc";

export const subscriptionRouter = router({
  // Get subscription plans (public)
  plans: publicProcedure.query(async () => {
    return {
      plans: [
        { id: "monthly", name: "Monthly", price: 9.99, interval: "month" },
        { id: "yearly", name: "Yearly", price: 99.99, interval: "year" },
      ],
    };
  }),

  // Get current subscription status
  status: protectedProcedure.query(async () => {
    // TODO: Implement with Stripe
    return { status: "free", booksRemaining: 1 };
  }),

  // Create checkout session
  createCheckoutSession: protectedProcedure
    .input(z.object({ priceId: z.string() }))
    .mutation(async () => {
      // TODO: Implement with Stripe Checkout
      return { checkoutUrl: "https://checkout.stripe.com/placeholder" };
    }),

  // Create billing portal session
  createPortalSession: protectedProcedure.mutation(async () => {
    // TODO: Implement with Stripe Billing Portal
    return { portalUrl: "https://billing.stripe.com/placeholder" };
  }),
});