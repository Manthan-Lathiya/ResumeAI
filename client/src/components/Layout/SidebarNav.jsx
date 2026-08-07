import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import BrandLogo from '../common/BrandLogo';
import {
  LayoutDashboard, FileText, Mail, BarChart3, GitCompare,
  Layout, Sparkles, LogOut, Menu, X, ChevronRight, User, Settings,
  MessageSquare, Wand2
} from 'lucide-react';

export default function SidebarNav() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/builder', label: 'Resume Builder', icon: FileText },
    { path: '/tailor', label: '1-Click JD Tailor', icon: Wand2 },
    { path: '/cover-letter', label: 'Cover Letter', icon: Mail },
    { path: '/analyzer', label: 'Resume Analyzer', icon: BarChart3 },
    { path: '/compare', label: 'JD Comparison', icon: GitCompare },
    { path: '/interview-prep', label: 'Interview Prep', icon: MessageSquare },
    { path: '/templates', label: 'Templates Catalog', icon: Layout },
    { path: '/examples', label: 'Resume Examples', icon: Sparkles },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const publicPaths = ['/', '/templates', '/examples'];
  const isActive = (path) => location.pathname === path;

  const activeLinks = isAuthenticated ? navLinks : navLinks.filter(l => publicPaths.includes(l.path));

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden sticky top-0 z-50 glass-card rounded-none border-b border-gray-800/80 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <BrandLogo size="small" showSubtitle={false} />
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-gray-400 hover:text-gray-200 rounded-lg glass-card"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop Fixed Left Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900/95 border-r border-gray-800/80 backdrop-blur-xl 
                       flex flex-col justify-between transition-transform duration-300 ease-in-out
                       ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="p-5 overflow-y-auto">
          {/* Logo */}
          <Link to="/" onClick={() => setMobileOpen(false)} className="block mb-8 px-1">
            <BrandLogo size="medium" />
          </Link>

          {/* Navigation Category Header */}
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3">
            Core Navigation
          </div>

          {/* Nav Links List */}
          <nav className="space-y-1">
            {activeLinks.map((link) => {
              const active = isActive(link.path);
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold
                    transition-all duration-200 group ${
                      active
                        ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/10 text-primary-300 border border-primary-500/30 shadow-md shadow-primary-500/10'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${active ? 'text-primary-400' : 'text-gray-400 group-hover:text-gray-200'}`} />
                    <span>{link.label}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-primary-400" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-gray-800/80 bg-gray-950/40">
          {isAuthenticated ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-primary-500/20 border border-primary-500/40 text-primary-300 flex items-center justify-center font-bold text-xs">
                  {user?.name ? user.name[0].toUpperCase() : <User className="w-4 h-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-gray-200 truncate">{user?.name}</div>
                  <div className="text-[10px] text-gray-400 truncate">{user?.email}</div>
                </div>
              </div>
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-gray-400 
                         hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-gray-800 hover:border-red-500/20"
              >
                <LogOut className="w-3.5 h-3.5" /> Log Out
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-center btn-secondary text-xs py-2 w-full"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="block text-center btn-primary text-xs py-2 w-full"
              >
                Sign Up Free
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}
    </>
  );
}
