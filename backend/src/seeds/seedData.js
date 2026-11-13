const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

async function seedDatabase() {
  console.log('🌱 Starting EduVault Academic Seed Process...');

  // Default Admin & Demo Student
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const studentPassword = await bcrypt.hash('Student@123', 10);

  const users = [
    {
      id: 'usr-admin-01',
      fullName: 'Chief Academic Admin',
      email: 'admin@eduvault.edu',
      passwordHash: adminPassword,
      role: 'ADMIN',
      universityId: 'univ-aktu',
      branchId: 'br-cse',
      semester: 8,
      bookmarks: [],
      downloadHistory: [],
      createdAt: new Date().toISOString()
    },
    {
      id: 'usr-student-01',
      fullName: 'Jai Singh',
      email: 'student@eduvault.edu',
      passwordHash: studentPassword,
      role: 'STUDENT',
      universityId: 'univ-aktu',
      collegeId: 'col-bbditm',
      branchId: 'br-cse',
      semester: 5,
      bookmarks: ['res-dsa-notes-1', 'res-dbms-pyq-2023'],
      downloadHistory: [
        { resourceId: 'res-dsa-notes-1', downloadedAt: new Date().toISOString() }
      ],
      createdAt: new Date().toISOString()
    }
  ];

  // Universities
  const universities = [
    {
      id: 'univ-aktu',
      name: 'Dr. A.P.J. Abdul Kalam Technical University',
      shortCode: 'AKTU',
      state: 'Uttar Pradesh',
      location: 'Lucknow',
      badge: 'State Technical University',
      website: 'https://aktu.ac.in'
    },
    {
      id: 'univ-bbdu',
      name: 'Babu Banarasi Das University',
      shortCode: 'BBDU',
      state: 'Uttar Pradesh',
      location: 'Lucknow',
      badge: 'Private University',
      website: 'https://bbdu.ac.in'
    },
    {
      id: 'univ-ipu',
      name: 'Guru Gobind Singh Indraprastha University',
      shortCode: 'GGSIPU',
      state: 'Delhi NCR',
      location: 'New Delhi',
      badge: 'State University',
      website: 'http://www.ipu.ac.in'
    }
  ];

  // Colleges under universities
  const colleges = [
    {
      id: 'col-bbditm',
      universityId: 'univ-aktu',
      name: 'Babu Banarasi Das Institute of Technology and Management (BBDITM)',
      code: '054',
      city: 'Lucknow'
    },
    {
      id: 'col-bbdniit',
      universityId: 'univ-aktu',
      name: 'Babu Banarasi Das Northern India Institute of Technology (BBDNIIT)',
      code: '056',
      city: 'Lucknow'
    },
    {
      id: 'col-iet',
      universityId: 'univ-aktu',
      name: 'Institute of Engineering and Technology (IET Lucknow)',
      code: '052',
      city: 'Lucknow'
    },
    {
      id: 'col-bbdu-soe',
      universityId: 'univ-bbdu',
      name: 'BBDU School of Engineering',
      code: 'BBDU-SOE',
      city: 'Lucknow'
    }
  ];

  // Courses
  const courses = [
    { id: 'course-btech', name: 'Bachelor of Technology (B.Tech)', code: 'BTECH', durationYears: 4, semestersCount: 8, isPrimary: true },
    { id: 'course-bca', name: 'Bachelor of Computer Applications (BCA)', code: 'BCA', durationYears: 3, semestersCount: 6, isPrimary: false },
    { id: 'course-mca', name: 'Master of Computer Applications (MCA)', code: 'MCA', durationYears: 2, semestersCount: 4, isPrimary: false }
  ];

  // Branches
  const branches = [
    { id: 'br-cse', courseId: 'course-btech', name: 'Computer Science & Engineering', code: 'CSE', icon: 'Code' },
    { id: 'br-aiml', courseId: 'course-btech', name: 'Artificial Intelligence & Machine Learning', code: 'AI-ML', icon: 'Cpu' },
    { id: 'br-it', courseId: 'course-btech', name: 'Information Technology', code: 'IT', icon: 'Terminal' },
    { id: 'br-ece', courseId: 'course-btech', name: 'Electronics & Communication Engineering', code: 'ECE', icon: 'Zap' },
    { id: 'br-me', courseId: 'course-btech', name: 'Mechanical Engineering', code: 'ME', icon: 'Wrench' },
    { id: 'br-ce', courseId: 'course-btech', name: 'Civil Engineering', code: 'CE', icon: 'Building' }
  ];

  // Key Subjects across semesters
  const subjects = [
    // 1st Year (Common Foundation)
    {
      id: 'sub-em1',
      branchId: 'br-cse',
      semesterNumber: 1,
      code: 'BAS-103',
      name: 'Engineering Mathematics - I',
      credits: 4,
      description: 'Differential Calculus, Matrices, Multiple Integrals, Vector Calculus.'
    },
    {
      id: 'sub-pps',
      branchId: 'br-cse',
      semesterNumber: 1,
      code: 'BCS-101',
      name: 'Programming for Problem Solving (C Language)',
      credits: 4,
      description: 'Fundamentals of C, Control structures, Arrays, Pointers, Structures, File Handling.'
    },
    // Semester 3 (CSE)
    {
      id: 'sub-dsa',
      branchId: 'br-cse',
      semesterNumber: 3,
      code: 'KCS-301',
      name: 'Data Structures & Algorithms',
      credits: 4,
      description: 'Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Sorting & Searching, Complexity Analysis.'
    },
    {
      id: 'sub-coaid',
      branchId: 'br-cse',
      semesterNumber: 3,
      code: 'KCS-302',
      name: 'Computer Organization & Architecture',
      credits: 4,
      description: 'Functional units, Instruction sets, ALU, Control unit, Memory hierarchy, Pipelining.'
    },
    {
      id: 'sub-dsmath',
      branchId: 'br-cse',
      semesterNumber: 3,
      code: 'KCS-303',
      name: 'Discrete Structures & Graph Theory',
      credits: 3,
      description: 'Set theory, Relations, Propositional logic, Combinatorics, Graph theory and Trees.'
    },
    // Semester 4 (CSE)
    {
      id: 'sub-os',
      branchId: 'br-cse',
      semesterNumber: 4,
      code: 'KCS-401',
      name: 'Operating Systems',
      credits: 4,
      description: 'Processes, Threads, CPU Scheduling, Synchronization, Deadlocks, Memory Management, File Systems.'
    },
    {
      id: 'sub-tafl',
      branchId: 'br-cse',
      semesterNumber: 4,
      code: 'KCS-402',
      name: 'Theory of Automata & Formal Languages',
      credits: 4,
      description: 'Finite Automata, Regular Grammars, Pushdown Automata, Context-Free Grammars, Turing Machines.'
    },
    // Semester 5 (CSE)
    {
      id: 'sub-dbms',
      branchId: 'br-cse',
      semesterNumber: 5,
      code: 'KCS-501',
      name: 'Database Management Systems',
      credits: 4,
      description: 'ER Model, Relational Algebra, SQL, Normalization (1NF to BCNF), Transaction Processing, Concurrency Control.'
    },
    {
      id: 'sub-cn',
      branchId: 'br-cse',
      semesterNumber: 5,
      code: 'KCS-503',
      name: 'Computer Networks',
      credits: 4,
      description: 'OSI & TCP/IP Reference Models, Physical Layer, Data Link Layer, Network Layer (Routing), Transport Layer.'
    },
    // Semester 6 (CSE / AI-ML)
    {
      id: 'sub-ai',
      branchId: 'br-aiml',
      semesterNumber: 6,
      code: 'KAI-601',
      name: 'Artificial Intelligence & Neural Networks',
      credits: 4,
      description: 'Informed/Uninformed Search, Knowledge Representation, Propositional Logic, Perceptrons, Backpropagation.'
    },
    {
      id: 'sub-cd',
      branchId: 'br-cse',
      semesterNumber: 6,
      code: 'KCS-601',
      name: 'Compiler Design',
      credits: 4,
      description: 'Lexical Analysis, Syntax Analysis (LL/LR parsers), Intermediate Code Generation, Code Optimization.'
    },
    // Semester 7
    {
      id: 'sub-cc',
      branchId: 'br-cse',
      semesterNumber: 7,
      code: 'KCS-071',
      name: 'Cloud Computing & Distributed Systems',
      credits: 3,
      description: 'Cloud deployment models, Virtualization, AWS/GCP architecture, MapReduce, Containerization (Docker).'
    },
    // Semester 8
    {
      id: 'sub-proj',
      branchId: 'br-cse',
      semesterNumber: 8,
      code: 'KCS-851',
      name: 'Major Capstone Project & Technical Seminar',
      credits: 10,
      description: 'Comprehensive software development life cycle, system architecture, research paper drafting, viva defense.'
    }
  ];

  // Resources (Rich sample verified study materials across 10 categories with clear disclaimer)
  const resources = [
    // 1. Syllabus
    {
      id: 'res-dsa-syl',
      subjectId: 'sub-dsa',
      title: 'AKTU Official Curriculum & Unit-wise Syllabus',
      type: 'SYLLABUS',
      year: 2024,
      unitNumber: null,
      fileSize: '420 KB',
      pageCount: 6,
      fileUrl: '/uploads/sample_dsa_syllabus.pdf',
      downloadCount: 342,
      viewCount: 1280,
      isSampleData: true,
      description: 'Detailed unit-wise breakdown (Units 1-5), course outcomes, credit distribution, and recommended textbooks.',
      uploadedBy: 'Chief Academic Admin',
      createdAt: '2026-09-01T10:00:00.000Z'
    },
    // 2. Notes
    {
      id: 'res-dsa-notes-1',
      subjectId: 'sub-dsa',
      title: 'Complete Handwritten Lecture Notes (Trees, Graphs & Dynamic Programming)',
      type: 'NOTE',
      year: 2024,
      unitNumber: 3,
      fileSize: '2.4 MB',
      pageCount: 38,
      fileUrl: '/uploads/sample_dsa_trees_notes.pdf',
      downloadCount: 890,
      viewCount: 3410,
      isSampleData: true,
      description: 'Crisp explanations of AVL Trees, B-Trees, BFS/DFS traversal algorithms, and shortest path graph algorithms.',
      uploadedBy: 'Faculty Contributor',
      createdAt: '2026-09-15T14:30:00.000Z'
    },
    // 3. PYQs
    {
      id: 'res-dsa-pyq-2023',
      subjectId: 'sub-dsa',
      title: 'AKTU Semester End Examination Question Paper (Odd Sem 2023-24)',
      type: 'PYQ',
      year: 2023,
      unitNumber: null,
      fileSize: '650 KB',
      pageCount: 4,
      fileUrl: '/uploads/sample_dsa_pyq_2023.pdf',
      downloadCount: 1420,
      viewCount: 5120,
      isSampleData: true,
      description: 'Section A, B, and C with full question breakdown, marks distribution, and solved hints.',
      uploadedBy: 'Chief Academic Admin',
      createdAt: '2026-01-10T09:15:00.000Z'
    },
    {
      id: 'res-dsa-pyq-2022',
      subjectId: 'sub-dsa',
      title: 'AKTU Semester End Examination Question Paper (Odd Sem 2022-23)',
      type: 'PYQ',
      year: 2022,
      unitNumber: null,
      fileSize: '590 KB',
      pageCount: 4,
      fileUrl: '/uploads/sample_dsa_pyq_2022.pdf',
      downloadCount: 960,
      viewCount: 3890,
      isSampleData: true,
      description: 'Original previous year question paper with marking scheme annotations.',
      uploadedBy: 'Chief Academic Admin',
      createdAt: '2026-01-12T11:00:00.000Z'
    },
    // 4. Lab Manual
    {
      id: 'res-dsa-lab',
      subjectId: 'sub-dsa',
      title: 'Data Structures Lab Manual & Experiment List with C Code',
      type: 'LAB_MANUAL',
      year: 2024,
      unitNumber: null,
      fileSize: '1.8 MB',
      pageCount: 24,
      fileUrl: '/uploads/sample_dsa_lab_manual.pdf',
      downloadCount: 650,
      viewCount: 2190,
      isSampleData: true,
      description: 'Standard 12 experiments covering Stack using Array, Infix to Postfix conversion, BST Insertion, and Dijkstra.',
      uploadedBy: 'Lab Incharge',
      createdAt: '2026-08-20T16:00:00.000Z'
    },
    // 5. Viva Voce
    {
      id: 'res-dsa-viva',
      subjectId: 'sub-dsa',
      title: 'Top 50 Most Frequently Asked DSA Viva Voce Questions & Answers',
      type: 'VIVA',
      year: 2024,
      unitNumber: null,
      fileSize: '510 KB',
      pageCount: 8,
      fileUrl: '/uploads/sample_dsa_viva_prep.pdf',
      downloadCount: 1120,
      viewCount: 4300,
      isSampleData: true,
      description: 'Rapid-fire practical exam questions: Time complexities, Linked List vs Array trade-offs, Tree rotations, and Hash collisions.',
      uploadedBy: 'Faculty Contributor',
      createdAt: '2026-10-05T12:00:00.000Z'
    },
    // 6. Important Questions
    {
      id: 'res-dsa-imp',
      subjectId: 'sub-dsa',
      title: 'High-Probability 10-Mark Exam Questions with Model Answers',
      type: 'IMP_QUESTION',
      year: 2024,
      unitNumber: null,
      fileSize: '1.2 MB',
      pageCount: 16,
      fileUrl: '/uploads/sample_dsa_important_questions.pdf',
      downloadCount: 1840,
      viewCount: 6200,
      isSampleData: true,
      description: 'Curated list of repeated university questions covering Prim’s vs Kruskal’s, AVL rebalancing, and QuickSort worst case.',
      uploadedBy: 'Chief Academic Admin',
      createdAt: '2026-10-18T18:00:00.000Z'
    },
    // 7. Practical Files
    {
      id: 'res-dsa-practical',
      subjectId: 'sub-dsa',
      title: 'Complete Certified Practical File with Outputs & Graphs',
      type: 'PRACTICAL_FILE',
      year: 2024,
      unitNumber: null,
      fileSize: '3.1 MB',
      pageCount: 42,
      fileUrl: '/uploads/sample_dsa_practical_record.pdf',
      downloadCount: 780,
      viewCount: 2900,
      isSampleData: true,
      description: 'Ready-to-reference student practical journal with verified output screenshots and execution logs.',
      uploadedBy: 'Student Contributor',
      createdAt: '2026-10-22T15:20:00.000Z'
    },
    // 8. Assignments
    {
      id: 'res-dsa-assign',
      subjectId: 'sub-dsa',
      title: 'Mid-Term Tutorial Assignment 1 & 2 with Solutions',
      type: 'ASSIGNMENT',
      year: 2024,
      unitNumber: 2,
      fileSize: '740 KB',
      pageCount: 10,
      fileUrl: '/uploads/sample_dsa_assignments.pdf',
      downloadCount: 430,
      viewCount: 1640,
      isSampleData: true,
      description: 'Practice problem sets on Circular Queues, Doubly Linked Lists, and Recursion trees.',
      uploadedBy: 'Faculty Contributor',
      createdAt: '2026-09-25T11:45:00.000Z'
    },
    // 9. Unit-wise Study Material
    {
      id: 'res-dsa-unit1',
      subjectId: 'sub-dsa',
      title: 'Unit 1 Comprehensive Pack: Asymptotic Notations & Linear Data Structures',
      type: 'UNIT_MATERIAL',
      year: 2024,
      unitNumber: 1,
      fileSize: '1.5 MB',
      pageCount: 22,
      fileUrl: '/uploads/sample_dsa_unit1_pack.pdf',
      downloadCount: 910,
      viewCount: 3100,
      isSampleData: true,
      description: 'Big-O, Omega, Theta analysis, Stack evaluation, and Queue applications.',
      uploadedBy: 'Faculty Contributor',
      createdAt: '2026-09-08T09:00:00.000Z'
    },
    // 10. Exam Preparation Crunch Pack
    {
      id: 'res-dsa-crunch',
      subjectId: 'sub-dsa',
      title: 'Night Before Exam Formula Sheet & Quick Revision Mind-Maps',
      type: 'EXAM_PREP',
      year: 2024,
      unitNumber: null,
      fileSize: '890 KB',
      pageCount: 12,
      fileUrl: '/uploads/sample_dsa_revision_pack.pdf',
      downloadCount: 2150,
      viewCount: 8400,
      isSampleData: true,
      description: 'Time & Space complexity cheat sheet, traversal orders, master theorem formulas, and quick code templates.',
      uploadedBy: 'Chief Academic Admin',
      createdAt: '2026-11-01T20:00:00.000Z'
    },
    // DBMS sample resources
    {
      id: 'res-dbms-notes-1',
      subjectId: 'sub-dbms',
      title: 'Complete DBMS Unit 1 to 5 Master Notes (ER to BCNF & SQL)',
      type: 'NOTE',
      year: 2024,
      unitNumber: null,
      fileSize: '3.6 MB',
      pageCount: 52,
      fileUrl: '/uploads/sample_dbms_master_notes.pdf',
      downloadCount: 1320,
      viewCount: 4800,
      isSampleData: true,
      description: 'Relational algebra, SQL queries, Functional dependencies, 1NF/2NF/3NF/BCNF normalization, and ACID properties.',
      uploadedBy: 'Faculty Contributor',
      createdAt: '2026-09-10T11:00:00.000Z'
    },
    {
      id: 'res-dbms-pyq-2023',
      subjectId: 'sub-dbms',
      title: 'AKTU End Semester DBMS Question Paper (2023-24)',
      type: 'PYQ',
      year: 2023,
      unitNumber: null,
      fileSize: '620 KB',
      pageCount: 4,
      fileUrl: '/uploads/sample_dbms_pyq_2023.pdf',
      downloadCount: 1540,
      viewCount: 5600,
      isSampleData: true,
      description: 'Complete university question paper with answer keys and query examples.',
      uploadedBy: 'Chief Academic Admin',
      createdAt: '2026-01-20T14:00:00.000Z'
    },
    // OS sample resources
    {
      id: 'res-os-notes-1',
      subjectId: 'sub-os',
      title: 'Operating Systems Revision Notes: Process Scheduling & Deadlocks',
      type: 'NOTE',
      year: 2024,
      unitNumber: 2,
      fileSize: '1.9 MB',
      pageCount: 28,
      fileUrl: '/uploads/sample_os_scheduling_notes.pdf',
      downloadCount: 990,
      viewCount: 3750,
      isSampleData: true,
      description: 'FCFS, SJF, Round Robin scheduling numericals with Banker’s Deadlock avoidance algorithm.',
      uploadedBy: 'Faculty Contributor',
      createdAt: '2026-09-18T10:30:00.000Z'
    }
  ];

  // University Announcements / Exam Updates
  const announcements = [
    {
      id: 'ann-01',
      universityId: 'univ-aktu',
      title: 'AKTU Odd Semester Examination Schedule (2026-27 Announced)',
      category: 'EXAM_DATE',
      date: '2026-11-10',
      description: 'The tentative timetable for B.Tech 3rd, 5th, and 7th semester examinations has been released on the official portal.',
      link: 'https://erp.aktu.ac.in',
      isPinned: true
    },
    {
      id: 'ann-02',
      universityId: 'univ-bbdu',
      title: 'BBDU Mid-Term Examination & Practical Lab Viva Submission Guidelines',
      category: 'ACADEMIC',
      date: '2026-11-05',
      description: 'All 3rd and 5th-semester engineering students must submit their certified practical records by next Friday.',
      link: 'https://bbdu.ac.in',
      isPinned: true
    },
    {
      id: 'ann-03',
      universityId: 'univ-aktu',
      title: 'Updated Syllabus Revision for Artificial Intelligence & Data Science Electives',
      category: 'SYLLABUS_UPDATE',
      date: '2026-10-28',
      description: 'Revised unit weightage for KAI-601 and Cloud Computing KCS-071 effective from the upcoming session.',
      link: 'https://aktu.ac.in/syllabus.html',
      isPinned: false
    }
  ];

  // Write all collections to DB
  db.write({
    universities,
    colleges,
    courses,
    branches,
    subjects,
    resources,
    users,
    announcements,
    stats: {
      totalDownloads: resources.reduce((acc, r) => acc + (r.downloadCount || 0), 0),
      totalViews: resources.reduce((acc, r) => acc + (r.viewCount || 0), 0)
    }
  });

  console.log('✅ Seed completed successfully:');
  console.log(`- ${universities.length} Universities`);
  console.log(`- ${colleges.length} Colleges`);
  console.log(`- ${branches.length} Engineering Branches`);
  console.log(`- ${subjects.length} Core Subjects`);
  console.log(`- ${resources.length} Verified Study Resources across 10 Categories`);
  console.log(`- ${users.length} Pre-configured Users (Admin & Student)`);
}

module.exports = seedDatabase;

if (require.main === module) {
  seedDatabase();
}
