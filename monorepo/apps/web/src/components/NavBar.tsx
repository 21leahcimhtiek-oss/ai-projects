// ─── NavBar ───────────────────────────────────────────────────────────────────
// TODO: Migrate full implementation from my-projects/src/components/NavBar.tsx

import { Link } from "react-router-dom";

import { useAuth } from "../providers/AuthProvider.tsx";

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          📖 StoryForge
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/pricing" className="text-sm text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
          {user ? (
            <>
              <Link to="/library" className="text-sm text-gray-600 hover:text-gray-900">
                My Stories
              </Link>
              <Link to="/account" className="text-sm text-gray-600 hover:text-gray-900">
                Account
              </Link>
              <button
                onClick={() => void logout()}
                className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}