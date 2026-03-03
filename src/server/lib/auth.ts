import bcrypt from "bcryptjs";
import { db } from "../database/connection";
import crypto from "crypto";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(userId: number): Promise<string> {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

  db.prepare(`
    INSERT INTO sessions (user_id, token, expires_at)
    VALUES (?, ?, ?)
  `).run(userId, token, expiresAt);

  return token;
}

export async function verifySession(token: string): Promise<any> {
  const session = db.prepare(`
    SELECT s.*, u.id as user_id, u.name, u.email, u.subscription_status
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token = ? AND s.expires_at > datetime('now')
  `).get(token) as any;

  if (!session) return null;

  return {
    id: session.user_id,
    name: session.name,
    email: session.email,
    subscriptionStatus: session.subscription_status,
  };
}

export async function deleteSession(token: string): Promise<void> {
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}