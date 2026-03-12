// tRPC client for apps/mobile
// Uses AsyncStorage to persist the session token across app restarts.

import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import the actual AppRouter type from the API
import type { AppRouter } from "@storyforge/api/routers";

export const trpc = createTRPCReact<AppRouter>();

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${API_URL}/api/trpc`,
      async headers() {
        const token = await AsyncStorage.getItem("session_token");
        return token ? { Authorization: `Bearer ${token}` } : {};
      },
    }),
  ],
});

// Token helpers

export const SESSION_KEY = "session_token";

export async function saveSessionToken(token: string): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, token);
}

export async function clearSessionToken(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function getSessionToken(): Promise<string | null> {
  return AsyncStorage.getItem(SESSION_KEY);
}