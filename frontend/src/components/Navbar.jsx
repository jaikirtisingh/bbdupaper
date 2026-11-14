import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Bookmark,
  ShieldCheck,
  Lock,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const { isAdmin, adminLogout, openAdminModal, savedPapers } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Subjects', path: '/subjects' },
    { label: 'All Resources', path: '/resources' },
    { label: 'Saved Papers', path: '/dashboard' }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1a2234] bg-[#070a12]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        
        {/* Clean Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#141b2d] border border-[#232f48] text-white">
            <GraduationCap className="h-5 w-5 text-slate-200" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-white">
              BBDU<span className="text-slate-400 font-medium ml-1">Papers</span>
            </span>
          </div>
        </Link>

        {/* Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                isActive(link.path)
                  ? 'bg-[#151d30] text-white border border-[#232f48]'
                  : 'text-slate-400 hover:text-white hover:bg-[#101626]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {link.label === 'Saved Papers' && <Bookmark className="h-3 w-3" />}
                {link.label}
                {link.label === 'Saved Papers' && savedPapers.length > 0 && (
                  <span className="rounded-full bg-[#1e293b] px-1.5 py-0.2 text-[10px] text-slate-300">
                    {savedPapers.length}
                  </span>
                )}
              </span>
            </Link>
          ))}
        </nav>

        {/* Admin Login Button */}
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <Link
                to="/admin"
                className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-1.5 text-xs font-bold text-black hover:bg-slate-200 transition"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Admin Panel</span>
              </Link>
              <button
                onClick={adminLogout}
                title="Sign out"
                className="rounded-xl border border-[#232f48] p-1.5 text-slate-400 hover:text-red-400 transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAdminModal}
              className="flex items-center gap-1.5 rounded-xl border border-[#232f48] bg-[#0e1424] px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:border-slate-400 hover:text-white transition"
            >
              <Lock className="h-3 w-3 text-slate-400" />
              <span>Admin Login</span>
            </button>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-xl border border-[#232f48] p-1.5 text-slate-400"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#1a2234] bg-[#070a12] px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block rounded-lg px-3 py-2 text-xs font-semibold ${
                isActive(link.path)
                  ? 'bg-[#151d30] text-white'
                  : 'text-slate-400 hover:bg-[#101626] hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
