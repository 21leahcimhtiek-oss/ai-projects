// ─── App Root ─────────────────────────────────────────────────────────────────
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { trpc, trpcClient } from "./lib/trpc.ts";
import { AuthProvider, useAuth } from "./providers/AuthProvider.tsx";

// ─── Pages (shells — migrate content from my-projects/src/pages/) ────────────
import Home       from "./pages/Home.tsx";
import Login      from "./pages/Login.tsx";
import Register   from "./pages/Register.tsx";
import Library    from "./pages/Library.tsx";
import BookDetail from "./pages/BookDetail.tsx";
import Pricing    from "./pages/Pricing.tsx";
import Account    from "./pages/Account.tsx";

// ─── Layout ───────────────────────────────────────────────────────────────────
import NavBar from "./components/NavBar.tsx";

// ─── Query client ─────────────────────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      retry: 1,
    },
  },
});

// ─── Protected route guard ────────────────────────────────────────────────────

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// ─── Routes ───────────────────────────────────────────────────────────────────

function AppRoutes() {
  return (
    <BrowserRouter>
      <NavBar />
      <main className="min-h-screen pt-16">
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pricing"  element={<Pricing />} />
          <Route path="/library"  element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/book/:id" element={<ProtectedRoute><BookDetail /></ProtectedRoute>} />
          <Route path="/account"  element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}