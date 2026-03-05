// ─── Book Domain Types ────────────────────────────────────────────────────────

export type BookStatus = "generating" | "complete" | "failed";

export type BookTheme =
  | "adventure"
  | "fantasy"
  | "science"
  | "animals"
  | "friendship"
  | "mystery"
  | "space"
  | "ocean";

export interface Book {
  id: string;
  userId: string;
  title: string;
  childName: string;
  childAge: number;
  theme: BookTheme;
  content: string | null;
  status: BookStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Character {
  id: string;
  bookId: string;
  name: string;
  role: string;
  description: string | null;
  createdAt: Date;
}

// ─── Book Payloads ────────────────────────────────────────────────────────────

export interface CreateBookPayload {
  childName: string;
  childAge: number;
  theme: BookTheme;
  title?: string;
}

export interface UpdateBookPayload {
  id: string;
  title?: string;
  content?: string;
  status?: BookStatus;
}

// ─── Book Limits ──────────────────────────────────────────────────────────────

export const BOOK_LIMITS = {
  free: 1,
  active: 10,
  trialing: 10,
  canceled: 0,
  past_due: 0,
} as const satisfies Record<import("./user").SubscriptionStatus, number>;