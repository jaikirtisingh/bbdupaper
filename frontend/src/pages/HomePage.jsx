import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  School,
  GraduationCap,
  BookOpen,
  FileText,
  Download,
  Eye,
  Search,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import {
  getUniversities,
  getColleges,
  getBranches,
  getSubjects,
  getResources,
  recordDownload
} from '../services/api';
import PDFViewerModal from '../components/PDFViewerModal';

export default function HomePage() {
  const navigate = useNavigate();

  // 1. Universities & Colleges (The 2 Main Boxes)
  const [universities, setUniversities] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [selectedUniv, setSelectedUniv] = useState('univ-aktu');
  const [selectedCollege, setSelectedCollege] = useState('col-bbditm');

  // 2. Course, Branch & Semester
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('br-cse');
  const [selectedSemester, setSelectedSemester] = useState(3);

  // 3. Subjects & Papers
  const [subjects, setSubjects] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // PDF Preview Modal
  const [previewResource, setPreviewResource] = useState(null);

  // Load Universities and Branches on mount
  useEffect(() => {
    async function loadInitial() {
      try {
        const [uRes, bRes] = await Promise.all([
          getUniversities(),
          getBranches('course-btech')
        ]);
        if (uRes.data.success) {
          setUniversities(uRes.data.data);
          if (uRes.data.data.length > 0) {
            setSelectedUniv(uRes.data.data[0].id);
          }
        }
        if (bRes.data.success) {
          setBranches(bRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    }
    loadInitial();
  }, []);

  // When University changes, load its colleges
  useEffect(() => {
    if (!selectedUniv) return;
    getColleges(selectedUniv).then((res) => {
      if (res.data.success) {
        setColleges(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedCollege(res.data.data[0].id);
        } else {
          setSelectedCollege('');
        }
      }
    });
  }, [selectedUniv]);

  // When College, Branch, or Semester changes, load matching subjects and papers
  useEffect(() => {
    async function loadSubjectsAndPapers() {
      setLoading(true);
      try {
        const [subRes, resRes] = await Promise.all([
          getSubjects({
            branchId: selectedBranch,
            semesterNumber: selectedSemester
          }),
          getResources({
            branchId: selectedBranch,
            semesterNumber: selectedSemester
          })
        ]);

        if (subRes.data.success) setSubjects(subRes.data.data);
        if (resRes.data.success) setResources(resRes.data.data);
      } catch (err) {
        console.error('Error fetching subjects/resources:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSubjectsAndPapers();
  }, [selectedUniv, selectedCollege, selectedBranch, selectedSemester]);

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

  // Filter subjects by search text
  const filteredSubjects = subjects.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q))
    );
  });

  const selectedUnivObj = universities.find((u) => u.id === selectedUniv);
  const selectedCollegeObj = colleges.find((c) => c.id === selectedCollege);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Title & Tagline */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-bold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>B.Tech Previous Year Papers & Academic Resources Portal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Find Your University & College Papers in{' '}
          <span className="text-blue-600 dark:text-blue-400">2 Simple Steps</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          No registration required. Select your University and College to immediately view and download all semester question papers and notes.
        </p>
      </div>

      {/* ======================================================== */}
      {/* STEP 1: THE 2 MAIN BOXES (UNIVERSITY & COLLEGE)          */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        
        {/* BOX 1: UNIVERSITY */}
        <div className="rounded-3xl border-2 border-blue-500/30 bg-white p-6 shadow-xl dark:border-blue-500/20 dark:bg-slate-900 transition hover:border-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Box 1
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Select Your University
              </h2>
            </div>
          </div>

          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
            Choose University:
          </label>
          <select
            value={selectedUniv}
            onChange={(e) => setSelectedUniv(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 px-4 text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {universities.map((u) => (
              <option key={u.id} value={u.id}>
                {u.shortCode} — {u.name}
              </option>
            ))}
          </select>

          {selectedUnivObj && (
            <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Location: {selectedUnivObj.location || 'Uttar Pradesh'} ({selectedUnivObj.badge || 'University'})</span>
            </div>
          )}
        </div>

        {/* BOX 2: COLLEGE */}
        <div className="rounded-3xl border-2 border-indigo-500/30 bg-white p-6 shadow-xl dark:border-indigo-500/20 dark:bg-slate-900 transition hover:border-indigo-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <School className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Box 2
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Select Your College / Campus
              </h2>
            </div>
          </div>

          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
            Choose College:
          </label>
          <select
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 px-4 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {colleges.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code ? `[${c.code}] ` : ''}{c.name}
              </option>
            ))}
          </select>

          {selectedCollegeObj && (
            <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Campus: {selectedCollegeObj.city || 'Lucknow'}</span>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* STEP 2: COURSE, BRANCH & SEMESTER FILTER                 */}
      {/* ======================================================== */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              <span>B.Tech Engineering Branch & Semester</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select your branch and semester to view all subjects and available previous year papers.
            </p>
          </div>

          {/* Quick Search inside subjects */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subject or code (e.g. KCS-301)..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Branch Pills */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Select Branch:
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {branches.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBranch(b.id)}
                className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition ${
                  selectedBranch === b.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {b.name} ({b.code})
              </button>
            ))}
          </div>
        </div>

        {/* Semester Pills (1 to 8) */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Select Semester:
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                className={`shrink-0 flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                  Number(selectedSemester) === sem
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                <span>Sem {sem}</span>
                <span className={`text-[10px] ${Number(selectedSemester) === sem ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {sem <= 2 ? '1st Yr' : sem <= 4 ? '2nd Yr' : sem <= 6 ? '3rd Yr' : 'Final Yr'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* STEP 3: SUBJECTS & PAPERS DIRECT LIST                    */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Subjects & Question Papers
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing subjects for Semester {selectedSemester} ({selectedCollegeObj?.name || 'College'})
            </p>
          </div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
            {filteredSubjects.length} Subjects Listed
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-44 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center bg-white dark:bg-slate-900">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No subjects listed for this semester yet
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Select a different semester or branch, or upload papers via the Admin Panel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredSubjects.map((sub) => {
              // Papers uploaded for this subject
              const subjectPapers = resources.filter((r) => r.subjectId === sub.id);

              return (
                <div
                  key={sub.id}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-blue-400 dark:border-slate-800 dark:bg-slate-900 transition"
                >
                  <div>
                    {/* Subject Header */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-black bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 px-2.5 py-1 rounded-lg">
                        {sub.code}
                      </span>
                      <span className="text-xs text-slate-400">
                        {sub.credits} Credits • Sem {sub.semesterNumber}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {sub.description}
                    </p>

                    {/* Papers List for this Subject */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Available Papers ({subjectPapers.length})
                      </span>

                      {subjectPapers.length === 0 ? (
                        <div className="text-xs text-slate-400 italic py-2">
                          No papers uploaded yet for this subject.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {subjectPapers.map((paper) => (
                            <div
                              key={paper.id}
                              className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5 border border-slate-100 dark:border-slate-800"
                            >
                              <div className="overflow-hidden">
                                <div className="flex items-center gap-1.5">
                                  <span className="rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 px-1.5 py-0.2 text-[10px] font-black">
                                    {paper.type}
                                  </span>
                                  {paper.year && (
                                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                                      Year {paper.year}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs font-semibold text-slate-900 dark:text-white truncate mt-0.5" title={paper.title}>
                                  {paper.title}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => setPreviewResource(paper)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                                >
                                  <Eye className="h-3 w-3" />
                                  <span>View</span>
                                </button>
                                <button
                                  onClick={() => handleDownload(paper)}
                                  className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-xs"
                                >
                                  <Download className="h-3 w-3" />
                                  <span>PDF</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Subject Detail Page link */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <Link
                      to={`/subjects/${sub.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      <span>Open Complete Subject Hub</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* In-App PDF Viewer Modal */}
      {previewResource && (
        <PDFViewerModal
          resource={previewResource}
          onClose={() => setPreviewResource(null)}
          onDownloadSuccess={() => {}}
        />
      )}
    </div>
  );
}
