import React from 'react';
import { GraduationCap, ShieldCheck, BookOpen, Layers, Award, Sparkles, CheckCircle2, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutUsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Our Academic Vision</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Empowering Engineering Students with Unified Academic Clarity
        </h1>
        <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          EduVault was engineered from the ground up to eliminate the constant chaos of scattered WhatsApp groups, broken Drive links, and missing exam papers.
        </p>
      </div>

      {/* 3 Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 mb-4">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Curated Syllabus Mapping</h3>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Every technical subject is indexed to its official university syllabus (AKTU, BBDU, GGSIPU), so you study exactly what is tested.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 mb-4">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Academic Integrity Guarantee</h3>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            We uphold strict academic authenticity. Mock or format demonstration papers are prominently badged as sample data, preventing any confusion.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400 mb-4">
            <Layers className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">10 Specialized Study Pillars</h3>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            From previous year question papers (PYQs) and lab manuals to rapid viva voce guides and exam crunch packs, all 10 bases are covered.
          </p>
        </div>
      </div>

      {/* University & Branch Coverage */}
      <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900/60">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Supported Engineering Disciplines
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Computer Science & Engineering (CSE)
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            AI & Machine Learning (AI-ML)
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Information Technology (IT)
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Electronics & Communication (ECE)
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Mechanical Engineering (ME)
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Civil Engineering (CE)
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          to="/subjects"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition"
        >
          Explore Your Semester Curriculum
        </Link>
      </div>
    </div>
  );
}
