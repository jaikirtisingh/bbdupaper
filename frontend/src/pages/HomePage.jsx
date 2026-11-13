import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  BookOpen,
  FileText,
  FileCheck2,
  HelpCircle,
  FlaskConical,
  GraduationCap,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Download,
  ShieldCheck,
  Calendar,
  Layers,
  Award,
  BellRing,
  ExternalLink
} from 'lucide-react';
import CascadingSelector from '../components/CascadingSelector';
import SemesterPills from '../components/SemesterPills';
import ResourceCard from '../components/ResourceCard';
import PDFViewerModal from '../components/PDFViewerModal';
import { getSubjects, getResources, getAnnouncements, recordDownload } from '../services/api';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [popularSubjects, setPopularSubjects] = useState([]);
  const [recentResources, setRecentResources] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [previewResource, setPreviewResource] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [subRes, recRes, annRes] = await Promise.all([
          getSubjects({ branchId: 'br-cse', limit: 6 }),
          getResources({ limit: 6, sortBy: 'newest' }),
          getAnnouncements()
        ]);
        if (subRes.data.success) setPopularSubjects(subRes.data.data.slice(0, 6));
        if (recRes.data.success) setRecentResources(recRes.data.data.slice(0, 6));
        if (annRes.data.success) setAnnouncements(annRes.data.data);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      }
    }
    loadData();
  }, []);

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/resources?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleDownload = async (resource) => {
    try {
      await recordDownload(resource.id);
      const link = document.createElement('a');
      link.href = resource.fileUrl;
      link.download = `${resource.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  // 10 Resource Category cards
  const categories = [
    { type: 'SYLLABUS', name: 'Curriculum & Syllabus', icon: BookOpen, desc: 'Official unit-wise marks distribution', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400' },
    { type: 'NOTE', name: 'Handwritten Notes', icon: FileText, desc: 'Detailed faculty & topper lecture notes', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400' },
    { type: 'PYQ', name: 'Previous Year Papers', icon: Calendar, desc: 'Semester-end papers with solutions', color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400' },
    { type: 'IMP_QUESTION', name: 'Important Questions', icon: Award, desc: 'Repeated high-weightage 10-markers', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400' },
    { type: 'LAB_MANUAL', name: 'Lab Manuals & Code', icon: FlaskConical, desc: 'Step-by-step practical experiment sets', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400' },
    { type: 'VIVA', name: 'Viva Voce Q&A', icon: HelpCircle, desc: 'Rapid-fire practical board exam Q&As', color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400' },
    { type: 'PRACTICAL_FILE', name: 'Practical Files', icon: Layers, desc: 'Certified lab files with output logs', color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60 dark:text-cyan-400' },
    { type: 'ASSIGNMENT', name: 'Tutorial Assignments', icon: FileCheck2, desc: 'Problem sheets and reference keys', color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/60 dark:text-violet-400' },
    { type: 'UNIT_MATERIAL', name: 'Unit-wise Handouts', icon: Sparkles, desc: 'Focused study materials for Units 1-5', color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/60 dark:text-teal-400' },
    { type: 'EXAM_PREP', name: 'Exam Crunch Packs', icon: TrendingUp, desc: 'Formula cheat sheets & mind-maps', color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/60 dark:text-orange-400' }
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* Notice Board Ticker */}
      {announcements.length > 0 && (
        <div className="bg-blue-600 text-white text-xs font-semibold py-2.5 px-4 shadow-inner">
          <div className="mx-auto max-w-7xl flex items-center justify-between gap-4 overflow-hidden">
            <div className="flex items-center gap-2 shrink-0">
              <span className="flex h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
              <span className="uppercase tracking-wider text-[11px] font-black bg-blue-700 px-2 py-0.5 rounded-sm">
                Exam Alert
              </span>
            </div>
            <div className="truncate text-blue-10">
              {announcements[0].title} — <span className="text-blue-200">{announcements[0].description}</span>
            </div>
            <a
              href={announcements[0].link}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1 hover:underline text-[11px] font-bold"
            >
              Official Portal <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 sm:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/70 px-4 py-1.5 text-xs font-bold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 mb-6 shadow-xs">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <span>The Engineer's Academic Operating System</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            All Your B.Tech Academic Resources in{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
              One Unified Orbit.
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Instant, verified access to semester syllabi, subject notes, previous year question papers (PYQs), lab manuals, and viva prep for engineering students.
          </p>

          {/* Global Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <form onSubmit={handleGlobalSearch} className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search subject (e.g. Data Structures, KCS-301, Operating Systems, PYQ 2023)..."
                className="w-full rounded-2xl border border-slate-300 bg-white py-4 pl-12 pr-32 text-sm text-slate-900 shadow-xl placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="absolute right-2.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
              >
                Search Hub
              </button>
            </form>
          </div>

          {/* Cascading Selector Card */}
          <div className="mt-10">
            <CascadingSelector />
          </div>
        </div>
      </section>

      {/* Quick Semester Selector */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Quick Access by Semester
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Jump straight to curriculum, notes, and question papers for any engineering semester
            </p>
          </div>
          <Link
            to="/subjects"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <span>View All Subjects</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <SemesterPills
          selectedSemester={selectedSemester}
          onSelectSemester={(sem) => {
            setSelectedSemester(sem);
            if (sem) {
              navigate(`/resources?semesterNumber=${sem}`);
            }
          }}
        />
      </section>

      {/* 10 Study Material Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            10-Pillar Academic Architecture
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Everything structured by subject, module, and examination weightage
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.type}
                to={`/resources?type=${cat.type}`}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover:-translate-y-1 hover:shadow-md transition dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${cat.color} mb-3 group-hover:scale-105 transition`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                  <span>Explore</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular Subjects */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Featured Core Subjects
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AKTU & BBDU standard curriculum core technical subjects
            </p>
          </div>
          <Link
            to="/subjects"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <span>See All Subjects</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularSubjects.map((sub) => (
            <div
              key={sub.id}
              onClick={() => navigate(`/subjects/${sub.id}`)}
              className="cursor-pointer group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                    {sub.code}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    Semester {sub.semesterNumber} • {sub.credits} Credits
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition dark:text-white dark:group-hover:text-blue-400">
                  {sub.name}
                </h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {sub.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{sub.resourceCount || 0} Materials Available</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition inline-flex items-center gap-1">
                  Open Hub <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Uploaded Resources */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Recently Uploaded Academic Materials
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fresh lecture notes, previous year papers, and practical files
            </p>
          </div>
          <Link
            to="/resources"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <span>Browse All Resources</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentResources.map((res) => (
            <ResourceCard
              key={res.id}
              resource={res}
              onPreview={(r) => setPreviewResource(r)}
              onDownload={handleDownload}
            />
          ))}
        </div>
      </section>

      {/* PDF Viewer Modal */}
      {previewResource && (
        <PDFViewerModal
          resource={previewResource}
          onClose={() => setPreviewResource(null)}
          onDownloadSuccess={(id) => {
            setRecentResources((prev) =>
              prev.map((r) => (r.id === id ? { ...r, downloadCount: (r.downloadCount || 0) + 1 } : r))
            );
          }}
        />
      )}
    </div>
  );
}
