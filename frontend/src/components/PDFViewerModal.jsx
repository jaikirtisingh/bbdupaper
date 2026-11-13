import React, { useState } from 'react';
import { X, Download, Bookmark, BookmarkCheck, Maximize2, Minimize2, AlertCircle, FileText, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { recordDownload } from '../services/api';

export default function PDFViewerModal({ resource, onClose, onDownloadSuccess }) {
  const { user, isBookmarked, toggleBookmarkResource } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!resource) return null;

  const bookmarked = isBookmarked(resource.id);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await recordDownload(resource.id);
      if (onDownloadSuccess) onDownloadSuccess(resource.id);

      // Trigger actual download
      const link = document.createElement('a');
      link.href = resource.fileUrl;
      link.download = `${resource.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error during download:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleBookmark = async () => {
    await toggleBookmarkResource(resource.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`relative flex flex-col w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 border border-slate-200 dark:border-slate-800 ${
          isFullscreen ? 'h-[98vh] max-w-[98vw]' : 'h-[88vh] max-w-5xl'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center gap-3 overflow-hidden mr-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="inline-block rounded-md bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                  {resource.type}
                </span>
                {resource.year && (
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Year {resource.year}
                  </span>
                )}
                {resource.isSampleData && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/80 dark:text-amber-400">
                    <AlertCircle className="h-3 w-3" />
                    Sample Preview Data
                  </span>
                )}
              </div>
              <h3 className="truncate text-base font-bold text-slate-900 dark:text-white" title={resource.title}>
                {resource.title}
              </h3>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Bookmark button */}
            <button
              onClick={handleBookmark}
              title={bookmarked ? 'Saved to bookmarks' : 'Save to bookmarks'}
              className={`p-2 rounded-lg border transition ${
                bookmarked
                  ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-400'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </button>

            {/* Direct Download Button */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{downloading ? 'Downloading...' : 'Download PDF'}</span>
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Disclaimer Bar if Sample */}
        {resource.isSampleData && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/50 px-5 py-2 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              This document is clearly labeled as a <strong>Demo / Sample Reference Material</strong> for format demonstration.
            </span>
            <span className="text-[11px] opacity-75">
              Subject: {resource.subjectName || resource.subjectCode}
            </span>
          </div>
        )}

        {/* PDF Viewer Body */}
        <div className="relative flex-1 w-full bg-slate-100 dark:bg-slate-950">
          <iframe
            src={`${resource.fileUrl}#toolbar=1&navpanes=0`}
            className="w-full h-full border-none"
            title={resource.title}
          />
        </div>

        {/* Footer info bar */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <span>Size: <strong>{resource.fileSize || '1.5 MB'}</strong></span>
            <span>Pages: <strong>{resource.pageCount || 10}</strong></span>
            <span>Downloads: <strong>{resource.downloadCount || 0}</strong></span>
            <span>Views: <strong>{resource.viewCount || 0}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span>Uploaded by: <strong>{resource.uploadedBy || 'Admin'}</strong></span>
            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400 ml-2"
            >
              Open in new tab <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
