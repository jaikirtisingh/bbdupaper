import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getResources, recordDownload } from '../services/api';
import ResourceCard from '../components/ResourceCard';
import PDFViewerModal from '../components/PDFViewerModal';
import {
  Bookmark,
  Download,
  GraduationCap,
  Sparkles,
  ArrowRight,
  BookOpen,
  Search,
  CheckCircle2
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { savedPapers, toggleBookmarkResource } = useAuth();
  const [allResources, setAllResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewResource, setPreviewResource] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getResources({ limit: 100 });
        if (res.data.success) {
          setAllResources(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load resources for saved papers view:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const bookmarkedItems = allResources.filter((r) => savedPapers.includes(r.id));

  const filteredBookmarks = bookmarkedItems.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      r.title.toLowerCase().includes(q) ||
      (r.subjectName && r.subjectName.toLowerCase().includes(q)) ||
      (r.subjectCode && r.subjectCode.toLowerCase().includes(q)) ||
      (r.year && String(r.year).includes(q))
    );
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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-200/80 bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white mb-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
              <span>Public Student Study Space • No Login Required</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Your Bookmarked Academic Papers
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-blue-100 max-w-xl">
              Saved papers and notes are automatically preserved in your browser for instant, one-click offline review and download.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/20 text-center shrink-0 min-w-[120px]">
            <div className="text-3xl font-black">{bookmarkedItems.length}</div>
            <div className="text-xs text-blue-100">Saved Materials</div>
          </div>
        </div>
      </div>

      {/* Search inside saved papers */}
      {bookmarkedItems.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved papers by subject code, title, or year..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-white shadow-xs"
          />
        </div>
      )}

      {/* Grid of Saved Resources */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center bg-white dark:bg-slate-900">
          <Bookmark className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {bookmarkedItems.length === 0 ? 'No Saved Papers Yet' : 'No matching saved papers found'}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Browse through any subject or resource card and click the bookmark ribbon icon to save papers here for rapid exam revision.
          </p>
          <Link
            to="/resources"
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition"
          >
            <BookOpen className="h-4 w-4" />
            <span>Browse All Question Papers & Notes</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBookmarks.map((res) => (
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
          onDownloadSuccess={() => {}}
        />
      )}
    </div>
  );
}
