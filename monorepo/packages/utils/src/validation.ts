// ─── Shared Zod Validation Schemas ───────────────────────────────────────────
// These are the canonical schemas used by both the API (server-side) and
// the client (form validation). Import from here — never duplicate.

import { z } from "zod";

// ─── Primitives ───────────────────────────────────────────────────────────────

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .toLowerCase()
  .trim();

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be less than 128 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name must be less than 100 characters")
  .trim();

export const uuidSchema = z.string().uuid("Invalid ID format");

// ─── Auth Schemas ─────────────────────────────────────────────────────────────

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

// ─── Book Schemas ─────────────────────────────────────────────────────────────

export const bookThemeSchema = z.enum([
  "adventure",
  "fantasy",
  "science",
  "animals",
  "friendship",
  "mystery",
  "space",
  "ocean",
]);

export const createBookSchema = z.object({
  childName: z
    .string()
    .min(1, "Child's name is required")
    .max(50, "Name must be less than 50 characters")
    .trim(),
  childAge: z
    .number()
    .int("Age must be a whole number")
    .min(2, "Age must be at least 2")
    .max(12, "Age must be 12 or under"),
  theme: bookThemeSchema,
  title: z.string().max(200, "Title must be less than 200 characters").trim().optional(),
});

export const updateBookSchema = z.object({
  id: uuidSchema,
  title: z.string().max(200).trim().optional(),
  content: z.string().optional(),
});

// ─── Pagination Schema ────────────────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;