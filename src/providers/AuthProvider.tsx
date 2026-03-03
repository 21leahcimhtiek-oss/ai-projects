import React, { createContext, useContext, useState, useEffect } from "react";
import { trpc } from "../lib/trpc-client";

interface User {
  id: number;
  email: string;
  name: string;
  subscriptionStatus: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    onSuccess: (data) => { if (data) setUser(data); },
    onError: () => { setUser(null); },
    onSettled: () => setLoading(false),
  });

  const loginMutation = trpc.auth.login.useMutation();
  const registerMutation = trpc.auth.register.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();

  const login = async (email: string, password: string) => {
    const result = await loginMutation.mutateAsync({ email, password });
    setUser(result.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const result = await registerMutation.mutateAsync({ name, email, password });
    setUser(result.user);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}