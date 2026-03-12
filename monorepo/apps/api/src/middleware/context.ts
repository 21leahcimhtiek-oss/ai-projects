// tRPC Request Context

import type { Request, Response } from "express";

import { db } from "../database/connection";
import { getSessionByToken, getUserById } from "../database/queries";

// User type for context
export interface ContextUser {
  id: string;
  name: string;
  email: string;
  subscriptionStatus: string;
}

export interface Context {
  req: Request;
  res: Response;
  db: typeof db;
  user: ContextUser | null;
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
    // TODO: Implement actual session/user lookup with Drizzle
    // For now, return null user (placeholder implementation)
    const session = await getSessionByToken(token);
    if (!session) return { req, res, db, user: null };

    // Type assertion for placeholder until Drizzle is implemented
    const sessionData = session as { userId: string } | null;
    if (!sessionData) return { req, res, db, user: null };

    const user = await getUserById(sessionData.userId);
    if (!user) return { req, res, db, user: null };

    // Type assertion for placeholder until Drizzle is implemented
    const userData = user as ContextUser;
    
    return {
      req, res, db,
      user: userData,
    };
  } catch (err) {
    console.error("[Context] Session lookup failed:", err);
    return { req, res, db, user: null };
  }
}