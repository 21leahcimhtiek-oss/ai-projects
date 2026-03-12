// ─── tRPC React Query Provider + Hooks ───────────────────────────────────────
// Drop this provider at the root of both the web app and the React Native app.

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";

import type { AppRouter } from "./router-type";

// ─── tRPC React instance ──────────────────────────────────────────────────────

export const trpc = createTRPCReact<AppRouter>();

// ─── Provider factory ─────────────────────────────────────────────────────────

export interface TRPCProviderProps {
  children: React.ReactNode;
  baseUrl: string;
  getToken: () => string | null | Promise<string | null>;
}

export function TRPCProvider({ children, baseUrl, getToken }: TRPCProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: (failureCount, error) => {
              // Don't retry on 4xx errors
              if (
                error instanceof Error &&
                "data" in error &&
                typeof (error as { data?: { httpStatus?: number } }).data?.httpStatus === "number"
              ) {
                const status = (error as { data: { httpStatus: number } }).data.httpStatus;
                if (status >= 400 && status < 500) return false;
              }
              return failureCount < 2;
            },
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env["NODE_ENV"] === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${baseUrl}/api/trpc`,
          async headers() {
            const token = await getToken();
            return token ? { Authorization: `Bearer ${token}` } : {};
          },
          fetch(url, options) {
            return fetch(url, { ...options, credentials: "include" });
          },
        }),
      ],
    }),
  );

  return (
    trpc.Provider({ client: trpcClient, queryClient,
      children: QueryClientProvider({ client: queryClient, children })
    })
  );
}

// ─── Re-export for convenience ────────────────────────────────────────────────

export { QueryClient, QueryClientProvider };
export type { AppRouter };