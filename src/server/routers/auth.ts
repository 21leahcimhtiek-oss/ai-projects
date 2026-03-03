import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../lib/trpc";
import { hashPassword, verifyPassword, createSession, deleteSession } from "../lib/auth";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  // Get current user
  me: publicProcedure.query(({ ctx }) => {
    return ctx.user ?? null;
  }),

  // Register
  register: publicProcedure
    .input(z.object({
      name: z.string().min(2).max(100),
      email: z.string().email(),
      password: z.string().min(8).max(100),
    }))
    .mutation(async ({ ctx, input }) => {
      const existing = ctx.db.prepare("SELECT id FROM users WHERE email = ?").get(input.email);
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Email already registered" });
      }

      const passwordHash = await hashPassword(input.password);
      const result = ctx.db.prepare(`
        INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)
      `).run(input.name, input.email, passwordHash);

      const userId = result.lastInsertRowid as number;
      const token = await createSession(userId);

      ctx.res.setHeader("Set-Cookie", `session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);

      return {
        user: { id: userId, name: input.name, email: input.email, subscriptionStatus: "free" },
      };
    }),

  // Login
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.db.prepare("SELECT * FROM users WHERE email = ?").get(input.email) as any;
      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
      }

      const valid = await verifyPassword(input.password, user.password_hash);
      if (!valid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
      }

      const token = await createSession(user.id);
      ctx.res.setHeader("Set-Cookie", `session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          subscriptionStatus: user.subscription_status,
        },
      };
    }),

  // Logout
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    const cookieHeader = ctx.req.headers.cookie || "";
    const token = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("session="))
      ?.split("=")[1];

    if (token) await deleteSession(token);

    ctx.res.setHeader("Set-Cookie", "session=; HttpOnly; Path=/; Max-Age=0");
    return { success: true };
  }),
});