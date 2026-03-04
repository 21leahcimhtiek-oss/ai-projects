import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ── Users ─────────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id:                   uuid("id").primaryKey().defaultRandom(),
  name:                 text("name").notNull(),
  email:                text("email").unique().notNull(),
  passwordHash:         text("password_hash").notNull(),
  subscriptionStatus:   text("subscription_status").notNull().default("free"),
  stripeCustomerId:     text("stripe_customer_id").unique(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  booksThisMonth:       integer("books_this_month").notNull().default(0),
  monthResetAt:         timestamp("month_reset_at", { withTimezone: true })
                          .notNull()
                          .default(sql`date_trunc('month', NOW())`),
  createdAt:            timestamp("created_at", { withTimezone: true })
                          .notNull()
                          .default(sql`NOW()`),
  updatedAt:            timestamp("updated_at", { withTimezone: true })
                          .notNull()
                          .default(sql`NOW()`),
});

// ── Sessions ──────────────────────────────────────────────────────────────────
export const sessions = pgTable("sessions", {
  id:        uuid("id").primaryKey().defaultRandom(),
  userId:    uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token:     text("token").unique().notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
               .notNull()
               .default(sql`NOW()`),
});

// ── Books ─────────────────────────────────────────────────────────────────────
export const books = pgTable("books", {
  id:        uuid("id").primaryKey().defaultRandom(),
  userId:    uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title:     text("title").notNull(),
  childName: text("child_name").notNull(),
  childAge:  integer("child_age").notNull(),
  theme:     text("theme").notNull().default("adventure"),
  content:   text("content"),
  status:    text("status").notNull().default("generating"),
  createdAt: timestamp("created_at", { withTimezone: true })
               .notNull()
               .default(sql`NOW()`),
  updatedAt: timestamp("updated_at", { withTimezone: true })
               .notNull()
               .default(sql`NOW()`),
});

// ── Characters ────────────────────────────────────────────────────────────────
export const characters = pgTable("characters", {
  id:          uuid("id").primaryKey().defaultRandom(),
  userId:      uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  name:        text("name").notNull(),
  description: text("description"),
  visualNotes: text("visual_notes"),
  personality: text("personality"),
  isDefault:   boolean("is_default").notNull().default(false),
  createdAt:   timestamp("created_at", { withTimezone: true })
                 .notNull()
                 .default(sql`NOW()`),
  updatedAt:   timestamp("updated_at", { withTimezone: true })
                 .notNull()
                 .default(sql`NOW()`),
});

// ── Subscriptions ─────────────────────────────────────────────────────────────
export const subscriptions = pgTable("subscriptions", {
  id:                           uuid("id").primaryKey().defaultRandom(),
  userId:                       uuid("user_id").unique().notNull().references(() => users.id, { onDelete: "cascade" }),
  stripeCustomerId:             text("stripe_customer_id").unique().notNull(),
  stripeSubscriptionId:         text("stripe_subscription_id").unique(),
  plan:                         text("plan").notNull().default("free"),
  status:                       text("status").notNull().default("active"),
  booksPerMonth:                integer("books_per_month").notNull().default(2),
  imagesPerMonth:               integer("images_per_month").notNull().default(0),
  currentMonthBooksCreated:     integer("current_month_books_created").notNull().default(0),
  currentMonthImagesGenerated:  integer("current_month_images_generated").notNull().default(0),
  currentPeriodStart:           timestamp("current_period_start", { withTimezone: true }),
  currentPeriodEnd:             timestamp("current_period_end", { withTimezone: true }),
  canceledAt:                   timestamp("canceled_at", { withTimezone: true }),
  createdAt:                    timestamp("created_at", { withTimezone: true })
                                  .notNull()
                                  .default(sql`NOW()`),
  updatedAt:                    timestamp("updated_at", { withTimezone: true })
                                  .notNull()
                                  .default(sql`NOW()`),
});

// ── Payments ──────────────────────────────────────────────────────────────────
export const payments = pgTable("payments", {
  id:                     uuid("id").primaryKey().defaultRandom(),
  userId:                 uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  stripePaymentIntentId:  text("stripe_payment_intent_id").unique().notNull(),
  amount:                 integer("amount").notNull(),
  currency:               text("currency").notNull().default("usd"),
  status:                 text("status").notNull().default("pending"),
  paymentType:            text("payment_type").notNull().default("subscription"),
  description:            text("description"),
  createdAt:              timestamp("created_at", { withTimezone: true })
                            .notNull()
                            .default(sql`NOW()`),
  updatedAt:              timestamp("updated_at", { withTimezone: true })
                            .notNull()
                            .default(sql`NOW()`),
});

// ── Marketing Content ─────────────────────────────────────────────────────────
export const marketingContent = pgTable("marketing_content", {
  id:        uuid("id").primaryKey().defaultRandom(),
  userId:    uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  bookId:    uuid("book_id").references(() => books.id, { onDelete: "set null" }),
  type:      text("type").notNull().default("social"),
  platform:  text("platform"),
  content:   text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
               .notNull()
               .default(sql`NOW()`),
  updatedAt: timestamp("updated_at", { withTimezone: true })
               .notNull()
               .default(sql`NOW()`),
});

// ── Chat Messages ─────────────────────────────────────────────────────────────
export const chatMessages = pgTable("chat_messages", {
  id:        uuid("id").primaryKey().defaultRandom(),
  userId:    uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role:      text("role").notNull(),
  content:   text("content").notNull(),
  model:     text("model"),
  createdAt: timestamp("created_at", { withTimezone: true })
               .notNull()
               .default(sql`NOW()`),
});

// ── Type exports ──────────────────────────────────────────────────────────────
export type User         = typeof users.$inferSelect;
export type NewUser      = typeof users.$inferInsert;
export type Session      = typeof sessions.$inferSelect;
export type Book         = typeof books.$inferSelect;
export type NewBook      = typeof books.$inferInsert;
export type Character    = typeof characters.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type Payment      = typeof payments.$inferSelect;
export type NewPayment   = typeof payments.$inferInsert;
export type ChatMessage  = typeof chatMessages.$inferSelect;