import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getSubjects, getBranches } from '../services/api';
import { Search, BookOpen, Layers, ArrowRight, Filter, GraduationCap } from 'lucide-react';
import SemesterPills from '../components/SemesterPills';

export default function SubjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Read filter params from URL or state
  const branchParam = searchParams.get('branchId') || 'br-cse';
  const semesterParam = searchParams.get('semesterNumber') || '';
  const searchParam = searchParams.get('search') || '';

  const [selectedBranch, setSelectedBranch] = useState(branchParam);
  const [selectedSemester, setSelectedSemester] = useState(semesterParam ? Number(semesterParam) : null);
  const [searchQuery, setSearchQuery] = useState(searchParam);

  useEffect(() => {
    async function loadBranches() {
      try {
        const res = await getBranches('course-btech');
        if (res.data.success) setBranches(res.data.data);
      } catch (err) {
        console.error('Error fetching branches:', err);
      }
    }
    loadBranches();
  }, []);

  useEffect(() => {
    async function fetchFilteredSubjects() {
      setLoading(true);
      try {
        const params = {};
        if (selectedBranch) params.branchId = selectedBranch;
        if (selectedSemester) params.semesterNumber = selectedSemester;
        if (searchQuery) params.search = searchQuery;

        const res = await getSubjects(params);
        if (res.data.success) {
          setSubjects(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching subjects:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFilteredSubjects();
  }, [selectedBranch, selectedSemester, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/70 px-3 py-1 text-xs font-bold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 mb-3">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Curriculum Subject Repository</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          B.Tech Core Technical Subjects
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Select your engineering branch and semester to access unit-wise study materials, PYQs, and lab manuals.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by subject name or code (e.g. KCS-301, Operating Systems)..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Branch Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="">All Engineering Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Semester Pills */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Filter by Semester:
        </div>
        <SemesterPills
          selectedSemester={selectedSemester}
          onSelectSemester={(sem) => setSelectedSemester(sem)}
        />
      </div>

      {/* Subjects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-44 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : subjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
          <GraduationCap className="mx-auto h-10 w-10 text-slate-400 mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No subjects match your selected filters
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Try choosing a different branch or semester, or clearing the search query.
          </p>
          <button
            onClick={() => { setSelectedBranch(''); setSelectedSemester(null); setSearchQuery(''); }}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map((sub) => (
            <div
              key={sub.id}
              onClick={() => navigate(`/subjects/${sub.id}`)}
              className="cursor-pointer group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-blue-400 hover:shadow-lg transition-all dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-lg">
                    {sub.code}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    Semester {sub.semesterNumber}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition dark:text-white dark:group-hover:text-blue-400">
                  {sub.name}
                </h3>

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {sub.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[11px]">
                  <span>{sub.pyqCount || 0} PYQs</span>
                  <span>•</span>
                  <span>{sub.noteCount || 0} Notes</span>
                </div>

                <span className="font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition inline-flex items-center gap-1">
                  Access Portal <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
