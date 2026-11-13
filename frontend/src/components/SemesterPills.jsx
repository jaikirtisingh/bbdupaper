import React from 'react';

export default function SemesterPills({ selectedSemester, onSelectSemester }) {
  const semesters = [
    { num: 1, label: 'Sem 1', subtitle: 'First Year' },
    { num: 2, label: 'Sem 2', subtitle: 'First Year' },
    { num: 3, label: 'Sem 3', subtitle: 'Second Year' },
    { num: 4, label: 'Sem 4', subtitle: 'Second Year' },
    { num: 5, label: 'Sem 5', subtitle: 'Third Year' },
    { num: 6, label: 'Sem 6', subtitle: 'Third Year' },
    { num: 7, label: 'Sem 7', subtitle: 'Final Year' },
    { num: 8, label: 'Sem 8', subtitle: 'Final Year' }
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelectSemester(null)}
        className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition ${
          selectedSemester === null
            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
        }`}
      >
        All Semesters
      </button>

      {semesters.map((sem) => (
        <button
          key={sem.num}
          onClick={() => onSelectSemester(sem.num)}
          className={`shrink-0 flex flex-col items-center rounded-xl px-3.5 py-1.5 transition ${
            Number(selectedSemester) === sem.num
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          <span className="text-xs font-bold">{sem.label}</span>
          <span className={`text-[10px] ${Number(selectedSemester) === sem.num ? 'text-blue-100' : 'text-slate-400'}`}>
            {sem.subtitle}
          </span>
        </button>
      ))}
    </div>
  );
}
