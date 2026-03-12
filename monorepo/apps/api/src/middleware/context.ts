// ─── tRPC Request Context ─────────────────────────────────────────────────────
// TODO: Migrate from my-projects/src/server/middleware/context.ts

import type { Request, Response } from "express";

import { db } from "../database/connection.ts";
import { getSessionByToken } from "../database/queries.ts";
import { getUserById } from "../database/queries.ts";

export interface Context {
  req:  Request;
  res:  Response;
  db:   typeof db;
  user: {
    id:                 string;
    name:               string;
    email:              string;
    subscriptionStatus: string;
  } | null;
}

function getTokenFromRequest(req: Request): string | null {
  // 1. Cookie-based session
  const fromCookie = req.headers.cookie
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("session="))
    ?.split("=")[1];
  if (fromCookie) return fromCookie;

  // 2. Bearer token fallback (mobile clients)
  const authHeader = req.headers.authorization ?? "";
  if (authHeader.startsWith("Bearer ")) return authHeader.slice(7).trim();

  return null;
}

export async function createContext({ req, res }: { req: Request; res: Response }): Promise<Context> {
  const token = getTokenFromRequest(req);
  if (!token) return { req, res, db, user: null };

  try {
    const session = await getSessionByToken(token);
    if (!session) return { req, res, db, user: null };

    const user = await getUserById(session.userId);
    if (!user) return { req, res, db, user: null };

    return {
      req, res, db,
      user: {
        id:                 user.id,
        name:               user.name,
        email:              user.email,
        subscriptionStatus: user.subscriptionStatus,
      },
    };
  } catch (err) {
    console.error("[Context] Session lookup failed:", err);
    return { req, res, db, user: null };
  }
}