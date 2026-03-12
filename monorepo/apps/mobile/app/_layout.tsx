// ─── Root Layout ──────────────────────────────────────────────────────────────
// TODO: Migrate from my-projects/app/_layout.tsx (if it exists) or
//       my-projects/app/tabs/_layout.tsx

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { trpc, trpcClient } from "../src/lib/trpc";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});

export default function RootLayout() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="tabs" />
        </Stack>
      </QueryClientProvider>
    </trpc.Provider>
  );
}