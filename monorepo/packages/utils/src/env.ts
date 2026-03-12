// ─── Environment Helpers ──────────────────────────────────────────────────────
// Safe, typed access to environment variables.
// Throws at startup if required vars are missing — fail fast, not at runtime.

/**
 * Get a required environment variable. Throws if missing or empty.
 */
export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
        `Make sure it is set in your .env file or deployment environment.`,
    );
  }
  return value;
}

/**
 * Get an optional environment variable with a fallback default.
 */
export function getEnv(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

/**
 * Get a required environment variable as a number. Throws if missing or NaN.
 */
export function requireEnvNumber(key: string): number {
  const raw = requireEnv(key);
  const value = Number(raw);
  if (isNaN(value)) {
    throw new Error(`Environment variable ${key} must be a number, got: "${raw}"`);
  }
  return value;
}

/**
 * Get an optional environment variable as a boolean.
 * Treats "true", "1", "yes" as true; everything else as false.
 */
export function getEnvBool(key: string, defaultValue = false): boolean {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return ["true", "1", "yes"].includes(value.toLowerCase());
}

/**
 * Returns the current app environment.
 */
export function getAppEnv(): "development" | "staging" | "production" | "test" {
  const env = process.env["NODE_ENV"] ?? "development";
  if (env === "production") return "production";
  if (env === "test") return "test";
  if (env === "staging") return "staging";
  return "development";
}

export const isDev = (): boolean => getAppEnv() === "development";
export const isProd = (): boolean => getAppEnv() === "production";
export const isTest = (): boolean => getAppEnv() === "test";