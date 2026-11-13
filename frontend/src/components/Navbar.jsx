import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  GraduationCap,
  Sun,
  Moon,
  Search,
  ShieldCheck,
  Bookmark,
  LogOut,
  Menu,
  X,
  Lock
} from 'lucide-react';

export default function Navbar() {
  const { adminUser, isAdmin, adminLogout, openAdminModal, savedPapers } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Subjects', path: '/subjects' },
    { label: 'All Resources', path: '/resources' },
    { label: 'Saved Papers', path: '/dashboard' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Edu<span className="text-blue-600 dark:text-blue-400">Vault</span>
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                100% Free & Open
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 hidden sm:block">
              Public B.Tech Academic Resources Portal
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`rounded-lg px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                isActive(link.path)
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              {link.label === 'Saved Papers' && (
                <Bookmark className="h-3.5 w-3.5 text-blue-500" />
              )}
              <span>{link.label}</span>
              {link.label === 'Saved Papers' && savedPapers.length > 0 && (
                <span className="rounded-full bg-blue-100 px-1.5 py-0.2 text-[10px] font-black text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                  {savedPapers.length}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Shortcut */}
          <button
            onClick={() => navigate('/resources')}
            className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:border-slate-700 transition"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search subjects or codes...</span>
            <kbd className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              /
            </kbd>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>

          {/* Admin Access Control */}
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <Link
                to="/admin"
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-amber-500/20 hover:bg-amber-600 transition"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Admin Panel</span>
              </Link>
              <button
                onClick={adminLogout}
                title="Sign out of admin"
                className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:border-slate-800 dark:hover:bg-red-950/40 transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAdminModal}
              title="Academic Admin Portal"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50/50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-amber-500 dark:hover:text-amber-400 transition"
            >
              <Lock className="h-3.5 w-3.5 text-amber-500" />
              <span>Admin Login</span>
            </button>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 dark:border-slate-800 dark:bg-slate-900 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block rounded-lg px-3 py-2 text-sm font-semibold ${
                isActive(link.path)
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            {isAdmin ? (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
              >
                Admin Command Center
              </Link>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAdminModal();
                }}
                className="flex items-center gap-2 w-full text-left rounded-lg px-3 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
              >
                <Lock className="h-4 w-4" />
                Admin Portal Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
