import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  School,
  Search,
  Download,
  Eye,
  ArrowRight,
  BookOpen,
  CheckCircle2
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
        console.error('Error loading initial data:', err);
      }
    }
    loadInitial();
  }, []);

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
        console.error('Error fetching data:', err);
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

  const filteredSubjects = subjects.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 space-y-8 bg-[#070a12] text-white min-h-screen">
      
      {/* Clean Minimal Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
          B.Tech Question Papers & Syllabus
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Select your University & College below to view and download semester papers.
        </p>
      </div>

      {/* ======================================================== */}
      {/* 2 MAIN BOXES: UNIVERSITY & COLLEGE                       */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* BOX 1: UNIVERSITY */}
        <div className="rounded-2xl border border-[#1b253b] bg-[#0d1322] p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#151e33] border border-[#232f4c] text-white">
              <Building2 className="h-5 w-5 text-slate-200" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                1. Select University
              </span>
              <h2 className="text-sm font-bold text-white">
                University
              </h2>
            </div>
          </div>

          <select
            value={selectedUniv}
            onChange={(e) => setSelectedUniv(e.target.value)}
            className="w-full rounded-xl border border-[#232f4c] bg-[#070a12] py-2.5 px-3 text-xs font-semibold text-white focus:border-slate-300 focus:outline-hidden"
          >
            {universities.map((u) => (
              <option key={u.id} value={u.id}>
                {u.shortCode} — {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* BOX 2: COLLEGE */}
        <div className="rounded-2xl border border-[#1b253b] bg-[#0d1322] p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#151e33] border border-[#232f4c] text-white">
              <School className="h-5 w-5 text-slate-200" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                2. Select College
              </span>
              <h2 className="text-sm font-bold text-white">
                College / Campus
              </h2>
            </div>
          </div>

          <select
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            className="w-full rounded-xl border border-[#232f4c] bg-[#070a12] py-2.5 px-3 text-xs font-semibold text-white focus:border-slate-300 focus:outline-hidden"
          >
            {colleges.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code ? `[${c.code}] ` : ''}{c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CLEAN BRANCH & SEMESTER ROW                              */}
      {/* ======================================================== */}
      <div className="rounded-2xl border border-[#1b253b] bg-[#0d1322] p-5 space-y-4">
        
        {/* Branch selection */}
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Engineering Branch:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {branches.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBranch(b.id)}
                className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                  selectedBranch === b.id
                    ? 'bg-white text-black font-bold'
                    : 'bg-[#151e33] text-slate-300 border border-[#232f4c] hover:border-slate-400'
                }`}
              >
                {b.code} — {b.name}
              </button>
            ))}
          </div>
        </div>

        {/* Semester selection */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-[#1a2338]">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0">Semester:</span>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                  Number(selectedSemester) === sem
                    ? 'bg-white text-black'
                    : 'bg-[#151e33] text-slate-300 border border-[#232f4c] hover:border-slate-400'
                }`}
              >
                Sem {sem}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subject code or name..."
              className="w-full rounded-xl border border-[#232f4c] bg-[#070a12] py-1.5 pl-8 pr-3 text-xs text-white placeholder:text-slate-500 focus:border-slate-300 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUBJECTS & PAPERS LIST                                   */}
      {/* ======================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Subjects for Semester {selectedSemester}</span>
          <span>{filteredSubjects.length} Subjects</span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-28 rounded-2xl bg-[#0d1322] animate-pulse" />
            ))}
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="rounded-2xl border border-[#1b253b] bg-[#0d1322] p-10 text-center text-slate-400 text-xs">
            No subjects listed for this semester.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSubjects.map((sub) => {
              const subjectPapers = resources.filter((r) => r.subjectId === sub.id);

              return (
                <div
                  key={sub.id}
                  className="rounded-2xl border border-[#1b253b] bg-[#0d1322] p-4 transition hover:border-[#2b3a5c]"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-[#151e33] border border-[#232f4c] text-slate-200 px-2 py-0.5 rounded-md">
                        {sub.code}
                      </span>
                      <h3 className="text-sm font-bold text-white">
                        {sub.name}
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Sem {sub.semesterNumber} • {sub.credits} Credits
                    </span>
                  </div>

                  {/* Papers list */}
                  {subjectPapers.length === 0 ? (
                    <div className="text-[11px] text-slate-500 py-1">
                      No question papers uploaded yet for this subject.
                    </div>
                  ) : (
                    <div className="space-y-2 pt-2 border-t border-[#172033]">
                      {subjectPapers.map((paper) => (
                        <div
                          key={paper.id}
                          className="flex items-center justify-between gap-2 rounded-xl bg-[#070a12] p-2.5 border border-[#1a2338]"
                        >
                          <div className="overflow-hidden">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="rounded bg-[#172138] border border-[#243354] px-1.5 py-0.2 text-[10px] font-bold text-slate-300">
                                {paper.type}
                              </span>
                              {paper.year && (
                                <span className="text-[11px] font-semibold text-slate-400">
                                  {paper.year}
                                </span>
                              )}
                              <span className="font-medium text-white truncate max-w-xs sm:max-w-md">
                                {paper.title}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => setPreviewResource(paper)}
                              className="rounded-lg border border-[#232f4c] bg-[#0e1424] px-2.5 py-1 text-xs font-semibold text-slate-200 hover:border-slate-300 transition"
                            >
                              <Eye className="h-3.5 w-3.5 inline mr-1" />
                              View
                            </button>
                            <button
                              onClick={() => handleDownload(paper)}
                              className="rounded-lg bg-white px-3 py-1 text-xs font-bold text-black hover:bg-slate-200 transition"
                            >
                              <Download className="h-3.5 w-3.5 inline mr-1" />
                              PDF
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PDF Viewer Modal */}
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
