import { z } from "zod";
import { router, protectedProcedure } from "../lib/trpc";
import { TRPCError } from "@trpc/server";
import { generateStory } from "../lib/ai";

export const booksRouter = router({
  // List all books for current user
  list: protectedProcedure.query(({ ctx }) => {
    const books = ctx.db.prepare(`
      SELECT id, title, child_name as childName, child_age as childAge,
             theme, status, created_at as createdAt
      FROM books WHERE user_id = ? ORDER BY created_at DESC
    `).all(ctx.user.id);
    return books;
  }),

  // Get single book
  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      const book = ctx.db.prepare(`
        SELECT id, title, child_name as childName, child_age as childAge,
               theme, content, status, created_at as createdAt
        FROM books WHERE id = ? AND user_id = ?
      `).get(input.id, ctx.user.id) as any;

      if (!book) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Story not found" });
      }
      return book;
    }),

  // Create new book
  create: protectedProcedure
    .input(z.object({
      childName: z.string().min(1).max(50),
      childAge: z.number().min(2).max(12),
      theme: z.enum(["adventure", "fantasy", "space", "ocean", "dinosaurs", "superheroes", "animals", "magic"]),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check subscription limits
      const user = ctx.db.prepare("SELECT subscription_status FROM users WHERE id = ?").get(ctx.user.id) as any;
      if (user.subscription_status === "free") {
        const thisMonth = new Date();
        thisMonth.setDate(1);
        const count = ctx.db.prepare(`
          SELECT COUNT(*) as count FROM books
          WHERE user_id = ? AND created_at >= ?
        `).get(ctx.user.id, thisMonth.toISOString()) as any;

        if (count.count >= 1) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Free plan allows 1 story per month. Upgrade to create more!",
          });
        }
      }

      const title = `${input.childName}'s ${input.theme.charAt(0).toUpperCase() + input.theme.slice(1)} Adventure`;

      const result = ctx.db.prepare(`
        INSERT INTO books (user_id, title, child_name, child_age, theme, status)
        VALUES (?, ?, ?, ?, ?, 'generating')
      `).run(ctx.user.id, title, input.childName, input.childAge, input.theme);

      const bookId = result.lastInsertRowid as number;

      // Generate story asynchronously
      generateStory({ childName: input.childName, childAge: input.childAge, theme: input.theme })
        .then((content) => {
          ctx.db.prepare(`
            UPDATE books SET content = ?, status = 'complete', updated_at = datetime('now')
            WHERE id = ?
          `).run(content, bookId);
        })
        .catch((err) => {
          console.error("Story generation failed:", err);
          ctx.db.prepare(`
            UPDATE books SET status = 'error', updated_at = datetime('now') WHERE id = ?
          `).run(bookId);
        });

      return { id: bookId, title, status: "generating" };
    }),

  // Delete book
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      const book = ctx.db.prepare("SELECT id FROM books WHERE id = ? AND user_id = ?").get(input.id, ctx.user.id);
      if (!book) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Story not found" });
      }
      ctx.db.prepare("DELETE FROM books WHERE id = ?").run(input.id);
      return { success: true };
    }),
});