// ─── User Domain Types ────────────────────────────────────────────────────────

export type SubscriptionStatus = "free" | "active" | "canceled" | "past_due" | "trialing";

export interface User {
  id: string;
  name: string;
  email: string;
  subscriptionStatus: SubscriptionStatus;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  booksThisMonth: number;
  monthResetAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/** Safe user shape — never includes passwordHash */
export type PublicUser = Omit<User, "stripeCustomerId" | "stripeSubscriptionId">;

/** Shape returned from auth endpoints */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  subscriptionStatus: SubscriptionStatus;
  booksThisMonth: number;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

// ─── Auth Payloads ────────────────────────────────────────────────────────────

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}