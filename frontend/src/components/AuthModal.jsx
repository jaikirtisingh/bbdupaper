import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';

export default function AuthModal() {
  const { adminModalOpen, closeAdminModal, adminLogin } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!adminModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminLogin(email, password);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Admin authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = () => {
    setEmail('admin@eduvault.edu');
    setPassword('Admin@123');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-7 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
        
        {/* Close Button */}
        <button
          onClick={closeAdminModal}
          className="absolute top-5 right-5 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand header */}
        <div className="mb-6 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/20 mb-3">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Admin Command Access
          </h2>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
            Students have full public access with no login needed. This secure terminal is for academic administrators only.
          </p>
        </div>

        {/* Instant 1-click admin demo button */}
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50/70 p-3 dark:border-amber-900/40 dark:bg-amber-950/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5" />
              Demo Administrator Credentials
            </span>
            <button
              type="button"
              onClick={fillQuickDemo}
              className="rounded-lg bg-amber-600 px-3 py-1 text-xs font-bold text-white shadow-xs hover:bg-amber-700 transition"
            >
              Autofill Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 dark:bg-red-950/50 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@eduvault.edu"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs font-medium text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Master Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs font-medium text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-lg hover:bg-black dark:bg-amber-600 dark:hover:bg-amber-700 transition disabled:opacity-50"
          >
            {loading ? 'Verifying Secure Token...' : 'Enter Admin Command Center'}
          </button>
        </form>
      </div>
    </div>
  );
}
