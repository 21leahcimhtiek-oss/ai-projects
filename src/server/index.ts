import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers/index";
import { createContext } from "./middleware/context";
import { securityMiddleware } from "./middleware/security";
import stripeWebhook from "./api/stripe-webhooks";
import { initDb } from "./database/connection";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── Security headers ──────────────────────────────────────────
app.use(securityMiddleware);

// ── CORS ──────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? [process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""]
    : ["http://localhost:5173", "http://localhost:8081"],
  credentials: true,
}));

// ── Stripe webhook (raw body required) ───────────────────────
app.use("/api/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhook);

// ── JSON body parser ──────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));

// ── tRPC ──────────────────────────────────────────────────────
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// ── Health check ──────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Start ─────────────────────────────────────────────────────
async function start() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}

start().catch(console.error);

export type { AppRouter } from "./routers/index";