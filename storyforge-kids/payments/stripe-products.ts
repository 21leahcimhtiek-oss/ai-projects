/**
 * Stripe Products and Pricing Configuration
 * Define all subscription plans and pricing tiers here
 */

export const STRIPE_PRODUCTS = {
  // Free tier - for testing
  FREE: {
    name: "Free Plan",
    description: "Create up to 2 books per month with basic features",
    booksPerMonth: 2,
    imagesPerMonth: 0, // Unlimited
    features: [
      "Create up to 2 books per month",
      "Basic story generation",
      "Placeholder illustrations",
      "PDF export",
    ],
  },

  // Starter tier
  STARTER: {
    name: "Starter Plan",
    description: "Perfect for parents and educators",
    stripeProductId: "prod_starter_plan", // Set this after creating in Stripe
    stripePriceId: "price_starter_monthly", // Set this after creating in Stripe
    amount: 999, // $9.99 in cents
    currency: "usd",
    interval: "month",
    booksPerMonth: 10,
    imagesPerMonth: 0, // Unlimited
    features: [
      "Create up to 10 books per month",
      "Advanced story generation with AI refinement",
      "Real AI-generated illustrations",
      "High-resolution PDF export with KDP formatting",
      "Audio narration for all books",
      "Batch image generation",
      "Marketing content generator",
    ],
  },

  // Pro tier
  PRO: {
    name: "Pro Plan",
    description: "For serious creators and small publishers",
    stripeProductId: "prod_pro_plan",
    stripePriceId: "price_pro_monthly",
    amount: 2999, // $29.99 in cents
    currency: "usd",
    interval: "month",
    booksPerMonth: 0, // Unlimited
    imagesPerMonth: 0, // Unlimited
    features: [
      "Unlimited book creation",
      "Unlimited AI-generated illustrations",
      "Advanced story refinement and plot improvements",
      "Character dialogue generation",
      "Age-appropriate content variations",
      "Professional PDF export with KDP formatting",
      "Full audio narration with multiple voices",
      "Bulk PDF export for series",
      "Advanced marketing content generator",
      "Social media scheduling",
      "Priority support",
    ],
  },

  // Enterprise tier
  ENTERPRISE: {
    name: "Enterprise Plan",
    description: "For publishers and organizations",
    stripeProductId: "prod_enterprise_plan",
    stripePriceId: "price_enterprise_monthly",
    amount: 9999, // $99.99 in cents
    currency: "usd",
    interval: "month",
    booksPerMonth: 0, // Unlimited
    imagesPerMonth: 0, // Unlimited
    features: [
      "Everything in Pro Plan",
      "Unlimited team members",
      "Advanced analytics and reporting",
      "Custom branding options",
      "API access for integrations",
      "Dedicated account manager",
      "Custom integration support",
      "White-label options",
    ],
  },
};

/**
 * Map plan names to their configuration
 */
export const PLAN_CONFIG = {
  free: STRIPE_PRODUCTS.FREE,
  starter: STRIPE_PRODUCTS.STARTER,
  pro: STRIPE_PRODUCTS.PRO,
  enterprise: STRIPE_PRODUCTS.ENTERPRISE,
} as const;

export type PlanType = keyof typeof PLAN_CONFIG;

/**
 * Get plan configuration by type
 */
export function getPlanConfig(plan: PlanType) {
  return PLAN_CONFIG[plan];
}

/**
 * Get all available plans for display
 */
export function getAllPlans() {
  return [
    { id: "free", ...STRIPE_PRODUCTS.FREE },
    { id: "starter", ...STRIPE_PRODUCTS.STARTER },
    { id: "pro", ...STRIPE_PRODUCTS.PRO },
    { id: "enterprise", ...STRIPE_PRODUCTS.ENTERPRISE },
  ];
}
