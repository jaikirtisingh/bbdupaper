import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Heart, Sparkles, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 text-sm transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Edu<span className="text-blue-600 dark:text-blue-400">Vault</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed max-w-sm text-slate-500 dark:text-slate-400">
              The premier all-in-one academic operating system for engineering undergraduates. Access syllabi, handwritten notes, previous year question papers (PYQs), lab manuals, and viva answers in one centralized portal.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>100% Academic Integrity • Verified Sample Data Badges</span>
            </div>
          </div>

          {/* Quick Semesters */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              B.Tech Semesters
            </h4>
            <ul className="space-y-2 text-xs">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <li key={sem}>
                  <Link
                    to={`/resources?semesterNumber=${sem}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition"
                  >
                    Semester {sem} Materials
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 10 Study Hubs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Study Hubs
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/resources?type=SYLLABUS" className="hover:text-blue-600 dark:hover:text-blue-400">Official Syllabus</Link></li>
              <li><Link to="/resources?type=NOTE" className="hover:text-blue-600 dark:hover:text-blue-400">Handwritten Notes</Link></li>
              <li><Link to="/resources?type=PYQ" className="hover:text-blue-600 dark:hover:text-blue-400">Previous Year Papers</Link></li>
              <li><Link to="/resources?type=LAB_MANUAL" className="hover:text-blue-600 dark:hover:text-blue-400">Lab Manuals & Code</Link></li>
              <li><Link to="/resources?type=VIVA" className="hover:text-blue-600 dark:hover:text-blue-400">Viva Voce Q&A</Link></li>
              <li><Link to="/resources?type=IMP_QUESTION" className="hover:text-blue-600 dark:hover:text-blue-400">Important Questions</Link></li>
              <li><Link to="/resources?type=EXAM_PREP" className="hover:text-blue-600 dark:hover:text-blue-400">Exam Crunch Sheets</Link></li>
            </ul>
          </div>

          {/* Universities & Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Platform & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400">About EduVault</Link></li>
              <li><Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400">Submit Feedback</Link></li>
              <li><span className="text-slate-400">AKTU (Dr. APJAKTU)</span></li>
              <li><span className="text-slate-400">BBDU (Babu Banarasi Das)</span></li>
              <li><span className="text-slate-400">GGSIPU (Delhi)</span></li>
              <li>
                <Link to="/admin" className="text-amber-600 dark:text-amber-400 hover:underline">
                  Admin Portal Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} EduVault Academic. Built for B.Tech students with precision and care.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> for Academic Excellence
          </p>
        </div>
      </div>
    </footer>
  );
}
