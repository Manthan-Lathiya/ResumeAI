/**
 * Navbar Component
 *
 * The navigation bar shown at the top of every page.
 * Shows different links based on whether the user is logged in.
 */

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FileText,
  BarChart3,
  Upload,
  GitCompare,
  LayoutDashboard,
  LogOut,
  Sparkles,
  Layout,
  Mail,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation links
  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/builder', label: 'Builder', icon: FileText },
    { path: '/analyzer', label: 'Analyzer', icon: BarChart3 },
    { path: '/compare', label: 'JD Match', icon: GitCompare },
    { path: '/cover-letter', label: 'Cover Letter', icon: Mail },
    { path: '/templates', label: 'Templates', icon: Layout },
    { path: '/examples', label: 'Examples', icon: Sparkles },
  ];

  // Publicly accessible pages
  const publicPaths = ['/templates', '/examples'];

  // Check if a nav link is currently active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-gray-800/50 rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl 
                          group-hover:shadow-lg group-hover:shadow-primary-500/30 transition-all duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">ResumeAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {(isAuthenticated ? navLinks : navLinks.filter(l => publicPaths.includes(l.path))).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                  transition-all duration-300
                  ${isActive(link.path)
                    ? 'bg-primary-500/20 text-primary-300 shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                  }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side — User info / Auth buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-400">
                  Hi, <span className="text-gray-200 font-medium">{user?.name}</span>
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 
                           hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">
                  Log In
                </Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-4">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-gray-200 rounded-xl 
                     hover:bg-gray-800 transition-all"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800/50 animate-slide-up">
          <div className="px-4 py-4 space-y-2">
            {isAuthenticated ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                      ${isActive(link.path)
                        ? 'bg-primary-500/20 text-primary-300'
                        : 'text-gray-400 hover:bg-gray-800/50'
                      }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm
                           text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-center btn-secondary text-sm">
                  Log In
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-center btn-primary text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
