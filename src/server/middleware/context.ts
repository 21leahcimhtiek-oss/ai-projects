import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { db } from "../database/connection";
import { verifySession } from "../lib/auth";

export async function createContext({ req, res }: CreateExpressContextOptions) {
  let user = null;

  const cookieHeader = req.headers.cookie || "";
  const sessionToken = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("session="))
    ?.split("=")[1];

  if (sessionToken) {
    try {
      user = await verifySession(sessionToken);
    } catch {
      // Invalid session — continue as unauthenticated
    }
  }

  return { req, res, db, user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;