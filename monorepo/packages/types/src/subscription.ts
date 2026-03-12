// ─── Subscription Domain Types ────────────────────────────────────────────────

export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";

export interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  status: import("./user").SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  userId: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: Date;
}

// ─── Stripe Plan Config ───────────────────────────────────────────────────────

export interface PlanConfig {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  stripePriceIdMonthly: string;
  stripePriceIdYearly: string;
  booksPerMonth: number;
  features: string[];
}

export type BillingInterval = "month" | "year";

export interface CreateCheckoutPayload {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface SubscriptionStatusResponse {
  status: import("./user").SubscriptionStatus;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  booksThisMonth: number;
  booksLimit: number;
}