import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getAdminStats,
  uploadResource,
  updateResource,
  deleteResource,
  getSubjects,
  getBranches,
  getUniversities,
  getResources
} from '../services/api';
import PDFViewerModal from '../components/PDFViewerModal';
import {
  ShieldCheck,
  Upload,
  Edit,
  Trash2,
  FileText,
  Search,
  Filter,
  Eye,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  Calendar,
  Building2,
  GraduationCap,
  Layers,
  RotateCcw,
  Sparkles,
  Lock
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { isAdmin, openAdminModal } = useAuth();

  const [stats, setStats] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active view tab: 'upload' | 'manage'
  const [activeTab, setActiveTab] = useState('upload');

  // --- UPLOAD FORM STATE ---
  const [univId, setUnivId] = useState('univ-aktu');
  const [courseId, setCourseId] = useState('course-btech');
  const [branchId, setBranchId] = useState('br-cse');
  const [semesterNumber, setSemesterNumber] = useState(3);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [customSubjectCode, setCustomSubjectCode] = useState('');
  const [customSubjectName, setCustomSubjectName] = useState('');
  const [resourceType, setResourceType] = useState('PYQ');
  const [paperTitle, setPaperTitle] = useState('');
  const [examYear, setExamYear] = useState(2024);
  const [moduleNumber, setModuleNumber] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState({ text: '', type: '' });

  // --- MANAGE / SEARCH & FILTER STATE ---
  const [filterSearch, setFilterSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [filterYear, setFilterYear] = useState('');

  // --- EDIT MODAL STATE ---
  const [editingResource, setEditingResource] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState('PYQ');
  const [editYear, setEditYear] = useState(2024);
  const [editModule, setEditModule] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editSubjectCode, setEditSubjectCode] = useState('');
  const [editSubjectName, setEditSubjectName] = useState('');
  const [editFile, setEditFile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editFeedback, setEditFeedback] = useState({ text: '', type: '' });

  // Preview Modal
  const [previewResource, setPreviewResource] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      loadInitialData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [stRes, uRes, bRes, sRes, rRes] = await Promise.all([
        getAdminStats(),
        getUniversities(),
        getBranches('course-btech'),
        getSubjects({}),
        getResources({ sortBy: 'newest', limit: 100 })
      ]);

      if (stRes.data.success) setStats(stRes.data.data);
      if (uRes.data.success) setUniversities(uRes.data.data);
      if (bRes.data.success) setBranches(bRes.data.data);
      if (sRes.data.success) setSubjects(sRes.data.data);
      if (rRes.data.success) setResources(rRes.data.data);
    } catch (err) {
      console.error('Failed to load initial admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter available subjects based on current selected branch & semester in upload form
  const availableSubjects = subjects.filter(
    (s) =>
      (!branchId || s.branchId === branchId) &&
      (!semesterNumber || Number(s.semesterNumber) === Number(semesterNumber))
  );

  // When branch or semester changes, auto-select first matching subject
  useEffect(() => {
    if (availableSubjects.length > 0) {
      setSelectedSubjectId(availableSubjects[0].id);
      setCustomSubjectCode(availableSubjects[0].code);
      setCustomSubjectName(availableSubjects[0].name);
    } else {
      setSelectedSubjectId('custom');
      setCustomSubjectCode('');
      setCustomSubjectName('');
    }
  }, [branchId, semesterNumber, subjects]);

  const handleSubjectSelectChange = (e) => {
    const val = e.target.value;
    setSelectedSubjectId(val);
    if (val !== 'custom') {
      const matched = subjects.find((s) => s.id === val);
      if (matched) {
        setCustomSubjectCode(matched.code);
        setCustomSubjectName(matched.name);
      }
    } else {
      setCustomSubjectCode('');
      setCustomSubjectName('');
    }
  };

  // Upload handler
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadFeedback({ text: '', type: '' });

    try {
      const formData = new FormData();
      formData.append('universityId', univId);
      formData.append('courseId', courseId);
      formData.append('branchId', branchId);
      formData.append('semesterNumber', semesterNumber);

      if (selectedSubjectId && selectedSubjectId !== 'custom') {
        formData.append('subjectId', selectedSubjectId);
      }
      formData.append('subjectCode', customSubjectCode.trim().toUpperCase());
      formData.append('subjectName', customSubjectName.trim());

      formData.append('title', paperTitle.trim());
      formData.append('type', resourceType);
      formData.append('year', examYear);
      if (moduleNumber) formData.append('moduleNumber', moduleNumber);
      formData.append('description', description.trim());
      formData.append('isSampleData', false); // Actual authentic uploaded paper!

      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const res = await uploadResource(formData);

      if (res.data.success) {
        setUploadFeedback({
          text: `Paper "${paperTitle}" successfully uploaded and published live to public student portal!`,
          type: 'success'
        });

        // Reset form
        setPaperTitle('');
        setDescription('');
        setSelectedFile(null);
        setModuleNumber('');

        // Refresh list
        loadInitialData();
      }
    } catch (err) {
      setUploadFeedback({
        text: err.response?.data?.message || 'Failed to upload paper. Please check all fields.',
        type: 'error'
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (resource) => {
    setEditingResource(resource);
    setEditTitle(resource.title || '');
    setEditType(resource.type || 'PYQ');
    setEditYear(resource.year || 2024);
    setEditModule(resource.moduleNumber || resource.unitNumber || '');
    setEditDesc(resource.description || '');
    setEditSubjectCode(resource.subjectCode || '');
    setEditSubjectName(resource.subjectName || '');
    setEditFile(null);
    setEditFeedback({ text: '', type: '' });
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingResource) return;
    setIsUpdating(true);
    setEditFeedback({ text: '', type: '' });

    try {
      const formData = new FormData();
      formData.append('title', editTitle.trim());
      formData.append('type', editType);
      formData.append('year', editYear);
      if (editModule) formData.append('moduleNumber', editModule);
      formData.append('description', editDesc.trim());
      formData.append('subjectCode', editSubjectCode.trim().toUpperCase());
      formData.append('subjectName', editSubjectName.trim());
      if (editFile) formData.append('file', editFile);

      const res = await updateResource(editingResource.id, formData);
      if (res.data.success) {
        setEditFeedback({ text: 'Paper updated successfully!', type: 'success' });
        setTimeout(() => {
          setEditingResource(null);
          loadInitialData();
        }, 800);
      }
    } catch (err) {
      setEditFeedback({ text: err.response?.data?.message || 'Failed to update paper.', type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete Resource Handler
  const handleDeleteResource = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? It will be removed from the public website immediately.`)) {
      return;
    }

    try {
      const res = await deleteResource(id);
      if (res.data.success) {
        setResources((prev) => prev.filter((r) => r.id !== id));
        loadInitialData();
      }
    } catch (err) {
      alert('Failed to delete resource. Please try again.');
    }
  };

  // Filtered resources for the management table
  const filteredResources = resources.filter((r) => {
    const q = filterSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      (r.subjectName && r.subjectName.toLowerCase().includes(q)) ||
      (r.subjectCode && r.subjectCode.toLowerCase().includes(q)) ||
      (r.year && String(r.year).includes(q));

    const matchesType = !filterType || r.type === filterType;
    const matchesBranch = !filterBranch || r.branchId === filterBranch;
    const matchesSemester = !filterSemester || Number(r.semesterNumber) === Number(filterSemester);
    const matchesYear = !filterYear || Number(r.year) === Number(filterYear);

    return matchesSearch && matchesType && matchesBranch && matchesSemester && matchesYear;
  });

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg px-4 py-28 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400 mb-5 shadow-inner">
          <Lock className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Admin Portal Authentication Required
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
          Students do not need an account and can browse freely. This terminal is strictly for academic administrators to upload and manage papers.
        </p>
        <button
          onClick={openAdminModal}
          className="mt-6 rounded-xl bg-amber-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-amber-500/25 hover:bg-amber-700 transition"
        >
          Sign In to Admin Terminal
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300 mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>EduVault Master Administration Panel</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Academic Papers & Resource Management Console
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Upload previous year question papers, syllabi, lecture notes, assignments, and practical files with instant live publication.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{stats.totalResources}</div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Total Papers & Files</div>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{stats.totalSubjects}</div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Cataloged Subjects</div>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.totalDownloads}</div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Student PDF Downloads</div>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{stats.totalViews}</div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Online PDF Reads</div>
          </div>
        </div>
      )}

      {/* Main Tab Controls */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition ${
            activeTab === 'upload'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <Upload className="h-4 w-4" />
          <span>Upload Academic Paper (PDF)</span>
        </button>

        <button
          onClick={() => setActiveTab('manage')}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition ${
            activeTab === 'manage'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Search, Edit & Delete Papers ({resources.length})</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: UPLOAD ACADEMIC RESOURCES (PDF)              */}
      {/* ======================================================== */}
      {activeTab === 'upload' && (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 max-w-4xl">
          <div className="mb-6">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Upload Previous Year Papers, Notes & Syllabi
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select the university hierarchy, enter subject details, exam year, module, and attach the PDF file.
            </p>
          </div>

          {uploadFeedback.text && (
            <div
              className={`mb-6 rounded-2xl p-4 text-xs font-semibold flex items-center gap-2.5 ${
                uploadFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900'
                  : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-900'
              }`}
            >
              {uploadFeedback.type === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
              <span>{uploadFeedback.text}</span>
            </div>
          )}

          <form onSubmit={handleUploadSubmit} className="space-y-6">
            
            {/* 1. Academic Hierarchy (University, Course, Branch, Semester) */}
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-4 border border-slate-100 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-blue-500" />
                Step 1: Academic Hierarchy & Target Semester
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* University */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    University *
                  </label>
                  <select
                    value={univId}
                    onChange={(e) => setUnivId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {universities.map((u) => (
                      <option key={u.id} value={u.id}>{u.shortCode} - {u.name}</option>
                    ))}
                  </select>
                </div>

                {/* Course */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Course *
                  </label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="course-btech">B.Tech (Bachelor of Technology)</option>
                    <option value="course-bca">BCA</option>
                    <option value="course-mca">MCA</option>
                  </select>
                </div>

                {/* Branch */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Engineering Branch *
                  </label>
                  <select
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                    ))}
                  </select>
                </div>

                {/* Semester */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Semester (1 to 8) *
                  </label>
                  <select
                    value={semesterNumber}
                    onChange={(e) => setSemesterNumber(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Subject Details */}
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-4 border border-slate-100 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-blue-500" />
                Step 2: Subject Mapping & Codes
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Select Existing Subject */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Subject or Custom
                  </label>
                  <select
                    value={selectedSubjectId}
                    onChange={handleSubjectSelectChange}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {availableSubjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        [{s.code}] {s.name}
                      </option>
                    ))}
                    <option value="custom">+ Enter New Subject Code & Name</option>
                  </select>
                </div>

                {/* Subject Code */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subject Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={customSubjectCode}
                    onChange={(e) => setCustomSubjectCode(e.target.value)}
                    placeholder="e.g. KCS-301"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-mono font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* Subject Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customSubjectName}
                    onChange={(e) => setCustomSubjectName(e.target.value)}
                    placeholder="e.g. Data Structures & Algorithms"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* 3. Paper Metadata (Category, Title, Exam Year, Module) */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Resource Category *
                  </label>
                  <select
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="PYQ">Previous Year Question Paper (PYQ)</option>
                    <option value="SYLLABUS">Semester-wise Official Syllabus</option>
                    <option value="NOTE">Subject-wise Handwritten Notes</option>
                    <option value="ASSIGNMENT">Semester Assignment & Solutions</option>
                    <option value="PRACTICAL_FILE">Certified Practical File</option>
                    <option value="LAB_MANUAL">Lab Manual & Code Files</option>
                    <option value="VIVA">Viva Voce Q&A Preparation</option>
                    <option value="IMP_QUESTION">High-Weightage Important Questions</option>
                    <option value="EXAM_PREP">Exam Crunch Pack & Formula Sheet</option>
                  </select>
                </div>

                {/* Exam Year */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Exam / Session Year *
                  </label>
                  <input
                    type="number"
                    required
                    value={examYear}
                    onChange={(e) => setExamYear(e.target.value)}
                    placeholder="2024"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* Module / Unit Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Module / Unit Number (Optional)
                  </label>
                  <input
                    type="number"
                    value={moduleNumber}
                    onChange={(e) => setModuleNumber(e.target.value)}
                    placeholder="e.g. 1, 2, 3 (Leave empty if full paper)"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  PDF Paper Title *
                </label>
                <input
                  type="text"
                  required
                  value={paperTitle}
                  onChange={(e) => setPaperTitle(e.target.value)}
                  placeholder="e.g. AKTU Odd Semester End Term Examination Paper (2023-24)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description & Topic Coverage
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Section A (2 marks), Section B (7 marks), Section C numerical coverage..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* PDF File Input */}
              <div className="rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                <label className="cursor-pointer font-bold text-xs text-blue-600 hover:underline dark:text-blue-400">
                  <span>Click to select PDF document</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.zip"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
                <p className="mt-1 text-[11px] text-slate-400">
                  {selectedFile ? `Selected: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)` : 'Accepts PDF files up to 100 MB'}
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={isUploading}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50 transition"
              >
                <Upload className="h-4 w-4" />
                <span>{isUploading ? 'Uploading and Publishing...' : 'Upload & Publish Academic Paper'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: SEARCH, FILTER, PREVIEW, EDIT & DELETE PAPERS */}
      {/* ======================================================== */}
      {activeTab === 'manage' && (
        <div className="space-y-6">
          
          {/* Filter Bar */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            
            {/* Search row */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                placeholder="Search uploaded papers by title, subject name, or code (e.g. KCS-301, Operating Systems)..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Filter pills & dropdowns */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Category</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="">All Categories</option>
                  <option value="PYQ">Previous Year Papers</option>
                  <option value="SYLLABUS">Syllabus</option>
                  <option value="NOTE">Notes</option>
                  <option value="ASSIGNMENT">Assignments</option>
                  <option value="PRACTICAL_FILE">Practical Files</option>
                  <option value="LAB_MANUAL">Lab Manuals</option>
                  <option value="VIVA">Viva Q&A</option>
                  <option value="IMP_QUESTION">Imp Questions</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Branch</label>
                <select
                  value={filterBranch}
                  onChange={(e) => setFilterBranch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="">All Branches</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.code} - {b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Semester</label>
                <select
                  value={filterSemester}
                  onChange={(e) => setFilterSemester(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Exam Year</label>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="">All Years</option>
                  {['2024', '2023', '2022', '2021'].map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter status */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Matching <strong>{filteredResources.length}</strong> academic files</span>
              <button
                onClick={() => {
                  setFilterSearch('');
                  setFilterType('');
                  setFilterBranch('');
                  setFilterSemester('');
                  setFilterYear('');
                }}
                className="flex items-center gap-1 font-semibold text-slate-500 hover:text-blue-600 transition"
              >
                <RotateCcw className="h-3 w-3" /> Reset Filter
              </button>
            </div>
          </div>

          {/* Table of Resources */}
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Paper Title & Subject</th>
                    <th className="py-3.5 px-4 font-bold">Category</th>
                    <th className="py-3.5 px-4 font-bold">Branch & Sem</th>
                    <th className="py-3.5 px-4 font-bold">Exam Year</th>
                    <th className="py-3.5 px-4 font-bold">Downloads / Views</th>
                    <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredResources.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No papers match your filters. Upload a new paper or adjust your search.
                      </td>
                    </tr>
                  ) : (
                    filteredResources.map((res) => (
                      <tr key={res.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4 max-w-sm">
                          <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                            {res.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                            {res.subjectCode && (
                              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                                [{res.subjectCode}]
                              </span>
                            )}
                            <span className="truncate">{res.subjectName}</span>
                            {res.moduleNumber && (
                              <span className="text-amber-600 dark:text-amber-400">
                                • Module {res.moduleNumber}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            {res.type}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                          {res.branchCode || res.branchId?.replace('br-', '').toUpperCase()} • Sem {res.semesterNumber || 1}
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          {res.year || '—'}
                        </td>

                        <td className="py-3.5 px-4 text-slate-500">
                          {res.downloadCount || 0} dl • {res.viewCount || 0} views
                        </td>

                        <td className="py-3.5 px-4 text-right space-x-1.5 shrink-0">
                          {/* Preview Online */}
                          <button
                            onClick={() => setPreviewResource(res)}
                            title="Preview PDF Online"
                            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 transition"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {/* Direct Download */}
                          <a
                            href={res.fileUrl}
                            download={`${res.title}.pdf`}
                            title="Direct Download PDF"
                            className="inline-block rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 hover:text-emerald-600 dark:text-slate-400 dark:hover:bg-slate-800 transition"
                          >
                            <Download className="h-4 w-4" />
                          </a>

                          {/* Edit Paper */}
                          <button
                            onClick={() => openEditModal(res)}
                            title="Edit Paper Details"
                            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 hover:text-amber-600 dark:text-slate-400 dark:hover:bg-slate-800 transition"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          {/* Delete Paper */}
                          <button
                            onClick={() => handleDeleteResource(res.id, res.title)}
                            title="Delete Paper"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT RESOURCE MODAL                                      */}
      {/* ======================================================== */}
      {editingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
            <button
              onClick={() => setEditingResource(null)}
              className="absolute top-5 right-5 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
              Edit Academic Paper Metadata
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Modify title, subject codes, exam year, or attach a replacement PDF.
            </p>

            {editFeedback.text && (
              <div
                className={`mb-4 rounded-xl p-3 text-xs font-semibold flex items-center gap-2 ${
                  editFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                }`}
              >
                {editFeedback.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                {editFeedback.text}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Paper Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    value={editSubjectCode}
                    onChange={(e) => setEditSubjectCode(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-mono font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    value={editSubjectName}
                    onChange={(e) => setEditSubjectName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="PYQ">PYQ</option>
                    <option value="SYLLABUS">Syllabus</option>
                    <option value="NOTE">Notes</option>
                    <option value="ASSIGNMENT">Assignment</option>
                    <option value="PRACTICAL_FILE">Practical File</option>
                    <option value="LAB_MANUAL">Lab Manual</option>
                    <option value="VIVA">Viva Q&A</option>
                    <option value="IMP_QUESTION">Imp Questions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Exam Year
                  </label>
                  <input
                    type="number"
                    value={editYear}
                    onChange={(e) => setEditYear(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Module / Unit
                  </label>
                  <input
                    type="number"
                    value={editModule}
                    onChange={(e) => setEditModule(e.target.value)}
                    placeholder="e.g. 1, 2"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Replace PDF Document (Optional)
                </label>
                <input
                  type="file"
                  accept=".pdf,.docx,.zip"
                  onChange={(e) => setEditFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingResource(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isUpdating ? 'Saving Changes...' : 'Save Paper Changes'}
                </button>
              </div>
            </form>
          </div>
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
