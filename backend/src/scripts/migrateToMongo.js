const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const University = require('../models/University');
const Branch = require('../models/Branch');
const Subject = require('../models/Subject');
const Resource = require('../models/Resource');
const User = require('../models/User');

const DB_FILE = path.join(__dirname, '..', '..', 'data', 'db.json');

async function migrate() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is required. Please set MONGODB_URI in backend/.env before running migration.');
    process.exit(1);
  }

  console.log('⏳ Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB Atlas successfully.\n');

  if (!fs.existsSync(DB_FILE)) {
    console.error(`❌ db.json not found at ${DB_FILE}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  const data = JSON.parse(raw);

  console.log('🔄 Starting Data Migration from db.json to MongoDB Atlas:');

  // 1. Universities
  if (data.universities && data.universities.length > 0) {
    for (const u of data.universities) {
      await University.findOneAndUpdate(
        { customId: u.id },
        {
          customId: u.id,
          name: u.name,
          shortCode: u.shortCode,
          state: u.state,
          location: u.location,
          badge: u.badge,
          website: u.website
        },
        { upsert: true, new: true }
      );
    }
    console.log(`- Migrated ${data.universities.length} Universities.`);
  }

  // 2. Branches
  if (data.branches && data.branches.length > 0) {
    for (const b of data.branches) {
      await Branch.findOneAndUpdate(
        { customId: b.id },
        {
          customId: b.id,
          courseId: b.courseId || 'course-btech',
          name: b.name,
          code: b.code,
          icon: b.icon || 'Code'
        },
        { upsert: true, new: true }
      );
    }
    console.log(`- Migrated ${data.branches.length} Branches.`);
  }

  // 3. Subjects
  if (data.subjects && data.subjects.length > 0) {
    for (const s of data.subjects) {
      await Subject.findOneAndUpdate(
        { code: s.code },
        {
          customId: s.id,
          branchId: s.branchId,
          semesterNumber: s.semesterNumber,
          code: s.code,
          name: s.name,
          credits: s.credits || 4,
          description: s.description || ''
        },
        { upsert: true, new: true }
      );
    }
    console.log(`- Migrated ${data.subjects.length} Subjects.`);
  }

  // 4. Resources
  if (data.resources && data.resources.length > 0) {
    for (const r of data.resources) {
      await Resource.findOneAndUpdate(
        { customId: r.id },
        {
          customId: r.id,
          universityId: r.universityId || 'univ-aktu',
          collegeId: r.collegeId || null,
          courseId: r.courseId || 'course-btech',
          branchId: r.branchId || 'br-cse',
          semesterNumber: r.semesterNumber || 1,
          subjectId: r.subjectId,
          subjectName: r.subjectName || 'Engineering Subject',
          subjectCode: r.subjectCode || '',
          title: r.title,
          type: r.type,
          year: r.year || 2024,
          moduleNumber: r.moduleNumber || r.unitNumber || null,
          unitNumber: r.unitNumber || r.moduleNumber || null,
          description: r.description || '',
          fileUrl: r.fileUrl,
          fileSize: r.fileSize || '1.2 MB',
          pageCount: r.pageCount || 8,
          downloadCount: r.downloadCount || 0,
          viewCount: r.viewCount || 0,
          isSampleData: r.isSampleData || false,
          uploadedBy: r.uploadedBy || 'Admin'
        },
        { upsert: true, new: true }
      );
    }
    console.log(`- Migrated ${data.resources.length} Academic Papers & Resources.`);
  }

  // 5. Users (Admin)
  if (data.users && data.users.length > 0) {
    for (const u of data.users) {
      await User.findOneAndUpdate(
        { email: u.email },
        {
          customId: u.id,
          fullName: u.fullName,
          email: u.email,
          passwordHash: u.passwordHash,
          role: u.role || 'ADMIN',
          universityId: u.universityId || 'univ-aktu',
          branchId: u.branchId || 'br-cse',
          semester: u.semester || 8
        },
        { upsert: true, new: true }
      );
    }
    console.log(`- Migrated ${data.users.length} Users.`);
  }

  console.log('\n🎉 Complete database migration from db.json to MongoDB Atlas finished successfully!');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
