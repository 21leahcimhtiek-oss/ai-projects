import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { BookOpen, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMenuOpen(false);
  };

  const isActive = (path: string) =>
    location.pathname === path ? "text-primary-600 font-semibold" : "text-gray-600 hover:text-primary-600";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl text-primary-600">
            <BookOpen className="w-7 h-7" />
            <span>StoryForge Kids</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-sm transition-colors ${isActive("/")}`}>Home</Link>
            <Link to="/pricing" className={`text-sm transition-colors ${isActive("/pricing")}`}>Pricing</Link>
            {user && (
              <Link to="/library" className={`text-sm transition-colors ${isActive("/library")}`}>My Library</Link>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/account" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-primary-600 transition-colors font-medium">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link to="/" className="block text-sm text-gray-700 py-2" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/pricing" className="block text-sm text-gray-700 py-2" onClick={() => setMenuOpen(false)}>Pricing</Link>
          {user ? (
            <>
              <Link to="/library" className="block text-sm text-gray-700 py-2" onClick={() => setMenuOpen(false)}>My Library</Link>
              <Link to="/account" className="block text-sm text-gray-700 py-2" onClick={() => setMenuOpen(false)}>Account</Link>
              <button onClick={handleLogout} className="block text-sm text-red-500 py-2 w-full text-left">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-sm text-gray-700 py-2" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4 w-full text-center" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}