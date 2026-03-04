import { z } from "zod";
import { router, protectedProcedure } from "../lib/trpc";
import { TRPCError } from "@trpc/server";
import { generateStory } from "../lib/ai";
import {
  getBooksByUser,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  countBooksThisMonth,
  getUserById,
} from "../database/queries";

const FREE_PLAN_MONTHLY_LIMIT = 1;

export const booksRouter = router({
  // List all books for current user
  list: protectedProcedure.query(async ({ ctx }) => {
    const books = await getBooksByUser(ctx.user.id);
    return books.map((b) => ({
      id: b.id,
      title: b.title,
      childName: b.childName,
      childAge: b.childAge,
      theme: b.theme,
      status: b.status,
      createdAt: b.createdAt,
    }));
  }),

  // Get single book
  get: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const book = await getBookById(input.id, ctx.user.id);
      if (!book) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Story not found" });
      }
      return book;
    }),

  // Create new book
  create: protectedProcedure
    .input(
      z.object({
        childName: z.string().min(1).max(50),
        childAge: z.number().min(2).max(12),
        theme: z.enum([
          "adventure", "fantasy", "space", "ocean",
          "dinosaurs", "superheroes", "animals", "magic",
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check subscription limits for free users
      const user = await getUserById(ctx.user.id);
      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "User not found" });
      }

      if (user.subscriptionStatus === "free") {
        const count = await countBooksThisMonth(ctx.user.id);
        if (count >= FREE_PLAN_MONTHLY_LIMIT) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Free plan allows 1 story per month. Upgrade to create more!",
          });
        }
      }

      const title = `${input.childName}'s ${
        input.theme.charAt(0).toUpperCase() + input.theme.slice(1)
      } Adventure`;

      const book = await createBook({
        userId: ctx.user.id,
        title,
        childName: input.childName,
        childAge: input.childAge,
        theme: input.theme,
        status: "generating",
      });

      // Generate story asynchronously — don't block the response
      generateStory({
        childName: input.childName,
        childAge: input.childAge,
        theme: input.theme,
      })
        .then((content) =>
          updateBook(book.id, { content, status: "complete" })
        )
        .catch((err) => {
          console.error("Story generation failed:", err);
          updateBook(book.id, { status: "error" });
        });

      return { id: book.id, title, status: "generating" };
    }),

  // Delete book
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const deleted = await deleteBook(input.id, ctx.user.id);
      if (!deleted) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Story not found" });
      }
      return { success: true };
    }),
});