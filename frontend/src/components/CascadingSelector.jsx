import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUniversities, getColleges, getCourses, getBranches } from '../services/api';
import { Search, Building2, School, GraduationCap, GitBranch, Calendar, ArrowRight } from 'lucide-react';

export default function CascadingSelector() {
  const navigate = useNavigate();

  const [universities, setUniversities] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);

  // Selections
  const [selectedUniv, setSelectedUniv] = useState('univ-aktu');
  const [selectedCollege, setSelectedCollege] = useState('col-bbditm');
  const [selectedCourse, setSelectedCourse] = useState('course-btech');
  const [selectedBranch, setSelectedBranch] = useState('br-cse');
  const [selectedSemester, setSelectedSemester] = useState('3');

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [uRes, cRes, bRes] = await Promise.all([
          getUniversities(),
          getCourses(),
          getBranches('course-btech')
        ]);
        if (uRes.data.success) setUniversities(uRes.data.data);
        if (cRes.data.success) setCourses(cRes.data.data);
        if (bRes.data.success) setBranches(bRes.data.data);
      } catch (err) {
        console.error('Failed to load selector options:', err);
      }
    }
    loadInitialData();
  }, []);

  // When university changes, load colleges
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      universityId: selectedUniv,
      collegeId: selectedCollege,
      courseId: selectedCourse,
      branchId: selectedBranch,
      semesterNumber: selectedSemester
    }).toString();

    navigate(`/subjects?${queryParams}`);
  };

  return (
    <div className="w-full rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            Target Academic Hierarchy Selector
          </span>
        </div>
        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
          Find Your Exact Curriculum
        </span>
      </div>

      <form onSubmit={handleSearchSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* 1. University */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              1. University
            </label>
            <div className="relative">
              <select
                value={selectedUniv}
                onChange={(e) => setSelectedUniv(e.target.value)}
                className="w-full truncate rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.shortCode} - {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. College */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              2. College / Campus
            </label>
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="w-full truncate rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {colleges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code ? `[${c.code}] ` : ''}{c.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Course */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              3. Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full truncate rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {courses.map((cr) => (
                <option key={cr.id} value={cr.id}>
                  {cr.name}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Branch */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              4. Engineering Branch
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full truncate rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>

          {/* 5. Semester */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              5. Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full truncate rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s} ({s <= 2 ? '1st Year' : s <= 4 ? '2nd Year' : s <= 6 ? '3rd Year' : 'Final Year'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Selected: <span className="font-semibold text-slate-800 dark:text-slate-200">B.Tech CSE • Semester {selectedSemester}</span>
          </div>

          <button
            type="submit"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
          >
            <span>Explore Subjects & Resources</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
