import { eq, and, gte, desc, sql } from "drizzle-orm";
import { db } from "./connection";
import {
  users, sessions, books, subscriptions, payments, characters, chatMessages, marketingContent,
  type User, type NewUser, type Session, type Book, type NewBook,
  type Subscription, type Payment, type NewPayment, type ChatMessage,
} from "./schema";

// ══════════════════════════════════════════════════════════════════════════════
// USERS
// ══════════════════════════════════════════════════════════════════════════════

export async function getUserById(id: string): Promise<User | null> {
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return rows[0] ?? null;
}

export async function createUser(data: NewUser): Promise<User> {
  const rows = await db.insert(users).values(data).returning();
  return rows[0];
}

export async function updateUser(id: string, data: Partial<NewUser>): Promise<User | null> {
  const rows = await db.update(users).set(data).where(eq(users.id, id)).returning();
  return rows[0] ?? null;
}

// ══════════════════════════════════════════════════════════════════════════════
// SESSIONS
// ══════════════════════════════════════════════════════════════════════════════

export async function createSession(data: { userId: string; token: string; expiresAt: Date }): Promise<Session> {
  const rows = await db.insert(sessions).values(data).returning();
  return rows[0];
}

export async function getSessionByToken(token: string): Promise<Session | null> {
  const rows = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.token, token), gte(sessions.expiresAt, new Date())))
    .limit(1);
  return rows[0] ?? null;
}

export async function deleteSessionByToken(token: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.token, token));
}

export async function deleteExpiredSessions(): Promise<void> {
  await db.delete(sessions).where(sql`${sessions.expiresAt} < NOW()`);
}

// ══════════════════════════════════════════════════════════════════════════════
// BOOKS
// ══════════════════════════════════════════════════════════════════════════════

export async function getBooksByUser(userId: string): Promise<Book[]> {
  return db
    .select()
    .from(books)
    .where(eq(books.userId, userId))
    .orderBy(desc(books.createdAt));
}

export async function getBookById(id: string, userId: string): Promise<Book | null> {
  const rows = await db
    .select()
    .from(books)
    .where(and(eq(books.id, id), eq(books.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}

export async function createBook(data: NewBook): Promise<Book> {
  const rows = await db.insert(books).values(data).returning();
  return rows[0];
}

export async function updateBook(id: string, data: Partial<NewBook>): Promise<Book | null> {
  const rows = await db.update(books).set(data).where(eq(books.id, id)).returning();
  return rows[0] ?? null;
}

export async function deleteBook(id: string, userId: string): Promise<boolean> {
  const result = await db
    .delete(books)
    .where(and(eq(books.id, id), eq(books.userId, userId)))
    .returning({ id: books.id });
  return result.length > 0;
}

export async function countBooksThisMonth(userId: string): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const rows = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(books)
    .where(and(eq(books.userId, userId), gte(books.createdAt, startOfMonth)));
  return Number(rows[0]?.count ?? 0);
}

// ══════════════════════════════════════════════════════════════════════════════
// SUBSCRIPTIONS
// ══════════════════════════════════════════════════════════════════════════════

export async function getSubscriptionByUserId(userId: string): Promise<Subscription | null> {
  const rows = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);
  return rows[0] ?? null;
}

export async function getSubscriptionByStripeId(stripeCustomerId: string): Promise<Subscription | null> {
  const rows = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeCustomerId, stripeCustomerId))
    .limit(1);
  return rows[0] ?? null;
}

export async function createSubscription(data: Omit<Subscription, "id" | "createdAt" | "updatedAt">): Promise<Subscription> {
  const rows = await db.insert(subscriptions).values(data as any).returning();
  return rows[0];
}

export async function updateSubscription(userId: string, data: Partial<Subscription>): Promise<Subscription | null> {
  const rows = await db
    .update(subscriptions)
    .set(data as any)
    .where(eq(subscriptions.userId, userId))
    .returning();
  return rows[0] ?? null;
}

// ══════════════════════════════════════════════════════════════════════════════
// PAYMENTS
// ══════════════════════════════════════════════════════════════════════════════

export async function getPaymentByStripeId(stripePaymentIntentId: string): Promise<Payment | null> {
  const rows = await db
    .select()
    .from(payments)
    .where(eq(payments.stripePaymentIntentId, stripePaymentIntentId))
    .limit(1);
  return rows[0] ?? null;
}

export async function createPayment(data: NewPayment): Promise<Payment> {
  const rows = await db.insert(payments).values(data).returning();
  return rows[0];
}

export async function getPaymentsByUser(userId: string): Promise<Payment[]> {
  return db
    .select()
    .from(payments)
    .where(eq(payments.userId, userId))
    .orderBy(desc(payments.createdAt));
}

// ══════════════════════════════════════════════════════════════════════════════
// CHARACTERS
// ══════════════════════════════════════════════════════════════════════════════

export async function getCharacters(userId?: string) {
  if (userId) {
    return db
      .select()
      .from(characters)
      .where(sql`${characters.userId} = ${userId} OR ${characters.isDefault} = TRUE`)
      .orderBy(desc(characters.isDefault));
  }
  return db.select().from(characters).where(eq(characters.isDefault, true));
}

// ══════════════════════════════════════════════════════════════════════════════
// CHAT MESSAGES
// ══════════════════════════════════════════════════════════════════════════════

export async function getChatHistory(userId: string, limit = 100): Promise<ChatMessage[]> {
  return db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.userId, userId))
    .orderBy(desc(chatMessages.createdAt))
    .limit(limit);
}

export async function saveChatMessage(data: Omit<ChatMessage, "id" | "createdAt">): Promise<ChatMessage> {
  const rows = await db.insert(chatMessages).values(data as any).returning();
  return rows[0];
}

export async function clearChatHistory(userId: string): Promise<void> {
  await db.delete(chatMessages).where(eq(chatMessages.userId, userId));
}