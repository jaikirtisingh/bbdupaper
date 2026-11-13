import React from 'react';
import { Eye, Download, Bookmark, BookmarkCheck, FileText, Calendar, HardDrive, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ResourceCard({ resource, onPreview, onDownload }) {
  const { isBookmarked, toggleBookmarkResource } = useAuth();
  const bookmarked = isBookmarked(resource.id);

  // Badge styles based on type
  const getTypeColor = (type) => {
    switch (type) {
      case 'SYLLABUS':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
      case 'NOTE':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
      case 'PYQ':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
      case 'LAB_MANUAL':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800';
      case 'VIVA':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
      case 'IMP_QUESTION':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
      case 'EXAM_PREP':
        return 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const formatTypeName = (type) => {
    switch (type) {
      case 'PYQ': return 'Previous Year Paper';
      case 'LAB_MANUAL': return 'Lab Manual';
      case 'VIVA': return 'Viva Voce Q&A';
      case 'IMP_QUESTION': return 'Important Questions';
      case 'PRACTICAL_FILE': return 'Practical File';
      case 'UNIT_MATERIAL': return 'Unit Material';
      case 'EXAM_PREP': return 'Exam Crunch Pack';
      case 'NOTE': return 'Study Note';
      case 'SYLLABUS': return 'Syllabus';
      case 'ASSIGNMENT': return 'Assignment';
      default: return type;
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div>
        {/* Top bar with category & bookmark */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${getTypeColor(resource.type)}`}>
              {formatTypeName(resource.type)}
            </span>
            {resource.year && (
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <Calendar className="h-3 w-3" />
                {resource.year}
              </span>
            )}
            {resource.isSampleData && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/60 dark:border-amber-900 dark:text-amber-300" title="Clearly labeled demo resource">
                <AlertCircle className="h-3 w-3" />
                Sample
              </span>
            )}
          </div>

          <button
            onClick={() => toggleBookmarkResource(resource.id)}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark resource'}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            {bookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-blue-600 dark:text-blue-400 fill-blue-600/20" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Title */}
        <h3
          onClick={() => onPreview(resource)}
          className="cursor-pointer text-base font-bold text-slate-900 transition hover:text-blue-600 dark:text-white dark:hover:text-blue-400 line-clamp-2"
          title={resource.title}
        >
          {resource.title}
        </h3>

        {/* Subject and code */}
        {(resource.subjectName || resource.subjectCode) && (
          <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            {resource.subjectCode && (
              <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                {resource.subjectCode}
              </span>
            )}
            {resource.subjectName && (
              <span className="truncate">{resource.subjectName}</span>
            )}
          </div>
        )}

        {/* Description snippet */}
        {resource.description && (
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
            {resource.description}
          </p>
        )}
      </div>

      {/* Footer bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <HardDrive className="h-3 w-3" />
            {resource.fileSize || '1.2 MB'}
          </span>
          <span className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            {resource.downloadCount || 0}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPreview(resource)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition"
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </button>
          <button
            onClick={() => onDownload(resource)}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            PDF
          </button>
        </div>
      </div>
    </div>
  );
}
