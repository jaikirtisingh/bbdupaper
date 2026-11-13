const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function ensureAdminUser() {
  const currentDb = db.read();

  // 1. Ensure Universities taxonomy exists for selection
  if (!currentDb.universities || currentDb.universities.length === 0) {
    currentDb.universities = [
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
  }

  // 2. Ensure Colleges taxonomy exists
  if (!currentDb.colleges || currentDb.colleges.length === 0) {
    currentDb.colleges = [
      { id: 'col-bbditm', universityId: 'univ-aktu', name: 'Babu Banarasi Das Institute of Technology and Management (BBDITM)', code: '054', city: 'Lucknow' },
      { id: 'col-bbdniit', universityId: 'univ-aktu', name: 'Babu Banarasi Das Northern India Institute of Technology (BBDNIIT)', code: '056', city: 'Lucknow' },
      { id: 'col-iet', universityId: 'univ-aktu', name: 'Institute of Engineering and Technology (IET Lucknow)', code: '052', city: 'Lucknow' },
      { id: 'col-bbdu-soe', universityId: 'univ-bbdu', name: 'BBDU School of Engineering', code: 'BBDU-SOE', city: 'Lucknow' }
    ];
  }

  // 3. Ensure Courses
  if (!currentDb.courses || currentDb.courses.length === 0) {
    currentDb.courses = [
      { id: 'course-btech', name: 'Bachelor of Technology (B.Tech)', code: 'BTECH', durationYears: 4, semestersCount: 8, isPrimary: true },
      { id: 'course-bca', name: 'Bachelor of Computer Applications (BCA)', code: 'BCA', durationYears: 3, semestersCount: 6, isPrimary: false },
      { id: 'course-mca', name: 'Master of Computer Applications (MCA)', code: 'MCA', durationYears: 2, semestersCount: 4, isPrimary: false }
    ];
  }

  // 4. Ensure Engineering Branches
  if (!currentDb.branches || currentDb.branches.length === 0) {
    currentDb.branches = [
      { id: 'br-cse', courseId: 'course-btech', name: 'Computer Science & Engineering', code: 'CSE', icon: 'Code' },
      { id: 'br-aiml', courseId: 'course-btech', name: 'Artificial Intelligence & Machine Learning', code: 'AI-ML', icon: 'Cpu' },
      { id: 'br-it', courseId: 'course-btech', name: 'Information Technology', code: 'IT', icon: 'Terminal' },
      { id: 'br-ece', courseId: 'course-btech', name: 'Electronics & Communication Engineering', code: 'ECE', icon: 'Zap' },
      { id: 'br-me', courseId: 'course-btech', name: 'Mechanical Engineering', code: 'ME', icon: 'Wrench' },
      { id: 'br-ce', courseId: 'course-btech', name: 'Civil Engineering', code: 'CE', icon: 'Building' }
    ];
  }

  // 5. Ensure Admin User exists (and no fake student accounts)
  const users = currentDb.users || [];
  const adminExists = users.some((u) => u.email === 'admin@eduvault.edu');

  if (!adminExists) {
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const adminUser = {
      id: 'usr-admin-01',
      fullName: 'Chief Academic Admin',
      email: 'admin@eduvault.edu',
      passwordHash: adminPassword,
      role: 'ADMIN',
      universityId: 'univ-aktu',
      branchId: 'br-cse',
      semester: 8,
      createdAt: new Date().toISOString()
    };
    currentDb.users = [adminUser];
  } else {
    // Retain only admin users
    currentDb.users = users.filter((u) => u.role === 'ADMIN');
  }

  // 6. Ensure resources array exists without adding any fake sample data
  if (!currentDb.resources) {
    currentDb.resources = [];
  }

  // 7. Ensure stats start strictly at 0
  if (!currentDb.stats) {
    currentDb.stats = { totalDownloads: 0, totalViews: 0 };
  }

  db.write(currentDb);
}

module.exports = ensureAdminUser;

if (require.main === module) {
  ensureAdminUser();
}
