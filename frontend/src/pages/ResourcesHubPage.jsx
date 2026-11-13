import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getResources, getSubjects, getBranches, recordDownload } from '../services/api';
import ResourceCard from '../components/ResourceCard';
import PDFViewerModal from '../components/PDFViewerModal';
import SemesterPills from '../components/SemesterPills';
import { Search, Filter, SlidersHorizontal, BookOpen, RotateCcw } from 'lucide-react';

export default function ResourcesHubPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const typeParam = searchParams.get('type') || '';
  const searchParam = searchParams.get('search') || '';
  const semParam = searchParams.get('semesterNumber') || '';
  const branchParam = searchParams.get('branchId') || '';
  const subjectParam = searchParams.get('subjectId') || '';

  const [resources, setResources] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedType, setSelectedType] = useState(typeParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [selectedSemester, setSelectedSemester] = useState(semParam ? Number(semParam) : null);
  const [selectedBranch, setSelectedBranch] = useState(branchParam);
  const [selectedSubject, setSelectedSubject] = useState(subjectParam);
  const [selectedSort, setSelectedSort] = useState('newest');

  const [previewResource, setPreviewResource] = useState(null);

  useEffect(() => {
    async function loadMeta() {
      try {
        const [subRes, brRes] = await Promise.all([
          getSubjects({}),
          getBranches('course-btech')
        ]);
        if (subRes.data.success) setSubjects(subRes.data.data);
        if (brRes.data.success) setBranches(brRes.data.data);
      } catch (err) {
        console.error('Error fetching filter metadata:', err);
      }
    }
    loadMeta();
  }, []);

  useEffect(() => {
    async function fetchResources() {
      setLoading(true);
      try {
        const params = {
          sortBy: selectedSort
        };
        if (selectedType && selectedType !== 'ALL') params.type = selectedType;
        if (searchQuery) params.search = searchQuery;
        if (selectedSemester) params.semesterNumber = selectedSemester;
        if (selectedBranch) params.branchId = selectedBranch;
        if (selectedSubject) params.subjectId = selectedSubject;

        const res = await getResources(params);
        if (res.data.success) {
          setResources(res.data.data);
        }
      } catch (err) {
        console.error('Error loading resources:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchResources();
  }, [selectedType, searchQuery, selectedSemester, selectedBranch, selectedSubject, selectedSort]);

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

  const handleResetFilters = () => {
    setSelectedType('');
    setSearchQuery('');
    setSelectedSemester(null);
    setSelectedBranch('');
    setSelectedSubject('');
    setSelectedSort('newest');
  };

  const typesList = [
    { key: '', label: 'All Categories' },
    { key: 'SYLLABUS', label: 'Syllabus' },
    { key: 'NOTE', label: 'Notes' },
    { key: 'PYQ', label: 'PYQ Papers' },
    { key: 'IMP_QUESTION', label: 'Important Questions' },
    { key: 'LAB_MANUAL', label: 'Lab Manuals' },
    { key: 'VIVA', label: 'Viva Voce Q&A' },
    { key: 'PRACTICAL_FILE', label: 'Practical Files' },
    { key: 'ASSIGNMENT', label: 'Assignments' },
    { key: 'UNIT_MATERIAL', label: 'Unit Materials' },
    { key: 'EXAM_PREP', label: 'Exam Prep' }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/70 px-3 py-1 text-xs font-bold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 mb-3">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Universal Resource Hub</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Explore All B.Tech Academic Resources
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Search across all engineering branches, semesters, subject codes, and examination years.
        </p>
      </div>

      {/* Main Filter Bar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        
        {/* Search bar row */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources by title, subject name, or code (e.g. Trees, KCS-301, 2023)..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Dropdown filters grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Category Type */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Resource Category
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {typesList.map((t) => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Branch */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Engineering Branch
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="">All Branches</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Specific Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>[{s.code}] {s.name}</option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Sort By
            </label>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="newest">Recently Uploaded</option>
              <option value="popular">Most Downloaded</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>

        {/* Reset button bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Showing <strong>{resources.length}</strong> verified academic materials
          </span>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Semester Quick Filter */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Filter by Semester:
        </div>
        <SemesterPills
          selectedSemester={selectedSemester}
          onSelectSemester={(sem) => setSelectedSemester(sem)}
        />
      </div>

      {/* Resources Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-48 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-slate-400 mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No matching resources found
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Try adjusting your search criteria or resetting the filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((res) => (
            <ResourceCard
              key={res.id}
              resource={res}
              onPreview={(r) => setPreviewResource(r)}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}

      {/* PDF Viewer Modal */}
      {previewResource && (
        <PDFViewerModal
          resource={previewResource}
          onClose={() => setPreviewResource(null)}
          onDownloadSuccess={(id) => {
            setResources((prev) =>
              prev.map((r) => (r.id === id ? { ...r, downloadCount: (r.downloadCount || 0) + 1 } : r))
            );
          }}
        />
      )}
    </div>
  );
}
