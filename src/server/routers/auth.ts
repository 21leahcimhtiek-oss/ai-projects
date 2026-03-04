import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../lib/trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import {
  getUserByEmail,
  getUserById,
  createUser,
  createSession,
  deleteSessionByToken,
  getSessionByToken,
} from "../database/queries";

// ── Helpers ───────────────────────────────────────────────────────────────────
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function generateToken(): string {
  return randomBytes(48).toString("hex");
}

const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

function setSessionCookie(res: any, token: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}${secure}`
  );
}

function clearSessionCookie(res: any) {
  res.setHeader("Set-Cookie", "session=; HttpOnly; Path=/; Max-Age=0");
}

function getTokenFromRequest(req: any): string | null {
  const cookieHeader = req.headers?.cookie ?? "";
  return (
    cookieHeader
      .split(";")
      .map((c: string) => c.trim())
      .find((c: string) => c.startsWith("session="))
      ?.split("=")[1] ?? null
  );
}

// ── Router ────────────────────────────────────────────────────────────────────
export const authRouter = router({
  // Get current user
  me: publicProcedure.query(({ ctx }) => {
    return ctx.user ?? null;
  }),

  // Register
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2).max(100),
        email: z.string().email(),
        password: z.string().min(8).max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await getUserByEmail(input.email);
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Email already registered" });
      }

      const passwordHash = await hashPassword(input.password);
      const user = await createUser({
        name: input.name,
        email: input.email,
        passwordHash,
      });

      const token = generateToken();
      await createSession({
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + SESSION_MAX_AGE * 1000),
      });

      setSessionCookie(ctx.res, token);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          subscriptionStatus: user.subscriptionStatus,
        },
      };
    }),

  // Login
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getUserByEmail(input.email);
      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
      }

      const valid = await verifyPassword(input.password, user.passwordHash);
      if (!valid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
      }

      const token = generateToken();
      await createSession({
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + SESSION_MAX_AGE * 1000),
      });

      setSessionCookie(ctx.res, token);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          subscriptionStatus: user.subscriptionStatus,
        },
      };
    }),

  // Logout
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    const token = getTokenFromRequest(ctx.req);
    if (token) await deleteSessionByToken(token);
    clearSessionCookie(ctx.res);
    return { success: true };
  }),
});