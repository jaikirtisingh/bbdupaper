import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSubjectById, getResources, recordDownload } from '../services/api';
import ResourceCard from '../components/ResourceCard';
import PDFViewerModal from '../components/PDFViewerModal';
import {
  BookOpen,
  FileText,
  Calendar,
  FlaskConical,
  HelpCircle,
  Award,
  Layers,
  Sparkles,
  ArrowLeft,
  Filter,
  Download,
  AlertCircle
} from 'lucide-react';

export default function SubjectDetailPage() {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('');
  const [previewResource, setPreviewResource] = useState(null);

  useEffect(() => {
    async function loadSubjectData() {
      setLoading(true);
      try {
        const [subRes, resRes] = await Promise.all([
          getSubjectById(id),
          getResources({ subjectId: id })
        ]);
        if (subRes.data.success) setSubject(subRes.data.data);
        if (resRes.data.success) setResources(resRes.data.data);
      } catch (err) {
        console.error('Error fetching subject details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSubjectData();
  }, [id]);

  const tabs = [
    { key: 'ALL', label: 'All Resources' },
    { key: 'SYLLABUS', label: 'Syllabus' },
    { key: 'NOTE', label: 'Notes' },
    { key: 'PYQ', label: 'PYQ Papers' },
    { key: 'IMP_QUESTION', label: 'Imp Questions' },
    { key: 'LAB_MANUAL', label: 'Lab Manuals' },
    { key: 'VIVA', label: 'Viva Q&A' },
    { key: 'PRACTICAL_FILE', label: 'Practical Files' },
    { key: 'ASSIGNMENT', label: 'Assignments' },
    { key: 'UNIT_MATERIAL', label: 'Unit Materials' },
    { key: 'EXAM_PREP', label: 'Exam Prep' }
  ];

  // Filter resources based on activeTab and selectedYear
  const filteredResources = resources.filter((r) => {
    const matchesTab = activeTab === 'ALL' || r.type === activeTab;
    const matchesYear = !selectedYear || Number(r.year) === Number(selectedYear);
    return matchesTab && matchesYear;
  });

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

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-40 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Subject Not Found</h2>
        <Link to="/subjects" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
          <ArrowLeft className="h-4 w-4" /> Back to Subjects Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button */}
      <div>
        <Link
          to="/subjects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Subjects Catalog
        </Link>
      </div>

      {/* Subject Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-xs font-black bg-blue-500/30 border border-blue-400/40 text-blue-200 px-3 py-1 rounded-lg">
                {subject.code}
              </span>
              <span className="text-xs bg-white/10 px-2.5 py-1 rounded-lg">
                Semester {subject.semesterNumber}
              </span>
              <span className="text-xs bg-white/10 px-2.5 py-1 rounded-lg">
                {subject.credits} University Credits
              </span>
              {subject.branch && (
                <span className="text-xs bg-white/10 px-2.5 py-1 rounded-lg">
                  {subject.branch.name}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{subject.name}</h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {subject.description}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/10 text-center shrink-0 w-full sm:w-auto">
            <div className="text-2xl font-black">{resources.length}</div>
            <div className="text-xs text-blue-200">Study Materials Available</div>
          </div>
        </div>
      </div>

      {/* 10 Category Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => {
          const count = tab.key === 'ALL'
            ? resources.length
            : resources.filter((r) => r.type === tab.key).length;

          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSelectedYear(''); }}
              className={`shrink-0 flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] rounded-full px-1.5 py-0.2 ${
                activeTab === tab.key ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Year Filter for PYQs */}
      {activeTab === 'PYQ' && (
        <div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-950/30 p-3 rounded-2xl border border-purple-100 dark:border-purple-900/40">
          <span className="text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Filter by Exam Year:
          </span>
          <div className="flex items-center gap-1.5">
            {['', '2024', '2023', '2022', '2021'].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  selectedYear === yr
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-purple-100 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                {yr ? yr : 'All Years'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resource Cards Grid */}
      {filteredResources.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-slate-400 mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No resources currently under this section
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Switch tabs or request university study notes via our contact and feedback portal.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((res) => (
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
