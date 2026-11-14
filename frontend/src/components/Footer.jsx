import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#1a2234] bg-[#070a12] text-slate-400 text-xs py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#141b2d] border border-[#232f48] text-white">
            <GraduationCap className="h-4 w-4 text-slate-200" />
          </div>
          <span className="font-bold text-white">BBDU Papers</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">All-in-One B.Tech Academic Resources Portal</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/subjects" className="hover:text-white transition">Subjects</Link>
          <Link to="/resources" className="hover:text-white transition">Resources</Link>
          <Link to="/admin" className="text-slate-300 hover:text-white transition">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
