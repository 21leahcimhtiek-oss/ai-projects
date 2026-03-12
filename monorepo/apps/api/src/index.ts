// ─── API Server Entry Point ───────────────────────────────────────────────────
import "./env"; // Validate env vars first — fail fast before any imports

import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { env } from "./env";
import { initDb } from "./database/connection";
import { appRouter } from "./routers/index";
import { createContext } from "./middleware/context";

// ─── App ──────────────────────────────────────────────────────────────────────

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────

const allowedOrigins = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  }),
);

// ─── Stripe webhook (raw body — must come before json parser) ─────────────────
// TODO: Migrate from my-projects/src/server/api/stripe-webhooks.ts
// import stripeWebhook from "./api/stripe-webhooks";
// app.use("/api/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhook);

// ─── Body parser ──────────────────────────────────────────────────────────────

app.use(express.json({ limit: "10mb" }));

// ─── tRPC ─────────────────────────────────────────────────────────────────────

app.use(
  "/api/trpc",
  createExpressMiddleware({
    router:        appRouter,
    createContext,
    onError: ({ path, error }) => {
      if (error.code === "INTERNAL_SERVER_ERROR") {
        console.error(`[tRPC] Error on ${path ?? "unknown"}:`, error);
      }
    },
  }),
);

// ─── Health check ─────────────────────────────────────────────────────────────

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Start ────────────────────────────────────────────────────────────────────

async function start() {
  await initDb();
  app.listen(env.PORT, () => {
    console.info(`✅ API server running on http://localhost:${env.PORT}`);
    console.info(`   Environment: ${env.NODE_ENV}`);
  });
}

start().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});

export type { AppRouter } from "./routers/index";