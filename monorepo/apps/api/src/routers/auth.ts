// Auth Router

import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../lib/trpc";

export const authRouter = router({
  // Get current user
  me: publicProcedure.query(async ({ ctx }) => {
    return { user: ctx.user };
  }),

  // Register new user
  register: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(8),
      name: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      // TODO: Implement registration logic
      console.log("Register:", input.email);
      return { success: true, message: "Registration endpoint - implement with bcrypt hashing" };
    }),

  // Login
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      // TODO: Implement login logic
      console.log("Login:", input.email);
      return { success: true, message: "Login endpoint - implement with session creation" };
    }),

  // Logout
  logout: protectedProcedure.mutation(async () => {
    // TODO: Implement logout logic
    return { success: true };
  }),
});