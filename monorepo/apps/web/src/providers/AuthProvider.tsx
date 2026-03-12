// ─── Auth Provider ────────────────────────────────────────────────────────────
// Wraps the app and exposes useAuth() hook.
// Reads the current user from trpc.auth.me on mount.
// TODO: Replace `any` casts with typed trpc once AppRouter is wired.

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

import { trpc } from "../lib/trpc.ts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthUser {
  id: string;
  name: string;
  email: string;
  subscriptionStatus: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refetch: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const meQuery = (trpc as any).auth.me.useQuery(undefined, {
    retry: false,
    onSuccess: (data: AuthUser | null) => { if (data) setUser(data); },
    onError: () => { setUser(null); },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loginMutation    = (trpc as any).auth.login.useMutation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const registerMutation = (trpc as any).auth.register.useMutation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const logoutMutation   = (trpc as any).auth.logout.useMutation();

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginMutation.mutateAsync({ email, password });
    setUser(result.user);
  }, [loginMutation]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const result = await registerMutation.mutateAsync({ name, email, password });
    setUser(result.user);
  }, [registerMutation]);

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
    setUser(null);
  }, [logoutMutation]);

  const refetch = useCallback(() => {
    void meQuery.refetch();
  }, [meQuery]);

  return (
    <AuthContext.Provider value={{
      user,
      loading: meQuery.isLoading,
      login,
      register,
      logout,
      refetch,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}