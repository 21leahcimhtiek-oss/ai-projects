// ─── Validated Environment ────────────────────────────────────────────────────
// All env vars are validated at startup. The server will refuse to start
// if any required variable is missing — fail fast, not at runtime.

import { z } from "zod";
import { config } from "dotenv";

config();

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(["development", "staging", "production", "test"]).default("development"),
  PORT:     z.coerce.number().default(3000),

  // Database
  DATABASE_URL:              z.string().min(1, "DATABASE_URL is required"),
  SUPABASE_URL:              z.string().url("SUPABASE_URL must be a valid URL"),
  SUPABASE_ANON_KEY:         z.string().min(1, "SUPABASE_ANON_KEY is required"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),

  // Auth
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),

  // Stripe
  STRIPE_SECRET_KEY:       z.string().startsWith("sk_", "STRIPE_SECRET_KEY must start with sk_"),
  STRIPE_WEBHOOK_SECRET:   z.string().startsWith("whsec_", "STRIPE_WEBHOOK_SECRET must start with whsec_"),
  STRIPE_PRICE_ID_MONTHLY: z.string().min(1, "STRIPE_PRICE_ID_MONTHLY is required"),
  STRIPE_PRICE_ID_YEARLY:  z.string().min(1, "STRIPE_PRICE_ID_YEARLY is required"),

  // AI
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),

  // CORS — comma-separated list of allowed origins
  ALLOWED_ORIGINS: z.string().default("http://localhost:5173,http://localhost:8081"),

  // Vercel (optional — injected automatically on Vercel)
  VERCEL_URL: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:\n");
  parsed.error.issues.forEach((issue) => {
    console.error(`  ${issue.path.join(".")}: ${issue.message}`);
  });
  console.error("\nCheck your .env file against .env.example");
  process.exit(1);
}

export const env = parsed.data;