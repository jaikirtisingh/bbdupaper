const db = require('../config/db');

exports.getUniversities = (req, res) => {
  const universities = db.getCollection('universities');
  res.json({ success: true, count: universities.length, data: universities });
};

exports.getCollegesByUniversity = (req, res) => {
  const { universityId } = req.params;
  const colleges = db.getCollection('colleges');
  const filtered = universityId 
    ? colleges.filter((c) => c.universityId === universityId)
    : colleges;
  res.json({ success: true, count: filtered.length, data: filtered });
};

exports.getCourses = (req, res) => {
  const courses = db.getCollection('courses');
  res.json({ success: true, count: courses.length, data: courses });
};

exports.getBranches = (req, res) => {
  const { courseId } = req.query;
  const branches = db.getCollection('branches');
  const filtered = courseId 
    ? branches.filter((b) => b.courseId === courseId)
    : branches;
  res.json({ success: true, count: filtered.length, data: filtered });
};

exports.getSubjects = (req, res) => {
  const { branchId, semesterNumber, search } = req.query;
  let subjects = db.getCollection('subjects');

  if (branchId) {
    subjects = subjects.filter((s) => s.branchId === branchId);
  }

  if (semesterNumber) {
    subjects = subjects.filter((s) => Number(s.semesterNumber) === Number(semesterNumber));
  }

  if (search) {
    const q = search.toLowerCase();
    subjects = subjects.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q))
    );
  }

  // Count resources for each subject
  const resources = db.getCollection('resources');
  const subjectsWithCounts = subjects.map((subj) => {
    const subjResources = resources.filter((r) => r.subjectId === subj.id);
    return {
      ...subj,
      resourceCount: subjResources.length,
      pyqCount: subjResources.filter((r) => r.type === 'PYQ').length,
      noteCount: subjResources.filter((r) => r.type === 'NOTE').length
    };
  });

  res.json({ success: true, count: subjectsWithCounts.length, data: subjectsWithCounts });
};

exports.getSubjectById = (req, res) => {
  const { id } = req.params;
  const subject = db.findById('subjects', id);
  if (!subject) {
    return res.status(404).json({ success: false, message: 'Subject not found.' });
  }

  const branches = db.getCollection('branches');
  const branch = branches.find((b) => b.id === subject.branchId);

  res.json({
    success: true,
    data: {
      ...subject,
      branch
    }
  });
};

exports.getAnnouncements = (req, res) => {
  const announcements = db.getCollection('announcements');
  res.json({ success: true, count: announcements.length, data: announcements });
};
