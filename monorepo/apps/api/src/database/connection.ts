// ─── Database Connection ──────────────────────────────────────────────────────
// TODO: Migrate full implementation from my-projects/src/server/database/connection.ts

import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import { env } from "../env.ts";
import * as schema from "./schema.ts";

// ─── Supabase client (auth helpers / storage / realtime) ─────────────────────

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// ─── Postgres / Drizzle client (used by tRPC routers) ────────────────────────

const queryClient = postgres(env.DATABASE_URL, {
  max:             10,
  idle_timeout:    20,
  connect_timeout: 10,
  ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(queryClient, { schema });

// ─── Health check (called on server start) ────────────────────────────────────

export async function initDb(): Promise<void> {
  try {
    await queryClient`SELECT 1`;
    console.info("✅ Supabase/Postgres connected");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    throw err;
  }
}