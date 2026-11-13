const db = require('../config/db');

exports.getResources = (req, res) => {
  const {
    universityId,
    courseId,
    branchId,
    semesterNumber,
    subjectId,
    subjectCode,
    type,
    year,
    moduleNumber,
    unitNumber,
    search,
    limit,
    sortBy = 'newest'
  } = req.query;

  let resources = db.getCollection('resources');
  const subjects = db.getCollection('subjects');
  const universities = db.getCollection('universities');
  const branches = db.getCollection('branches');

  // Enrich resources with subject, branch, and university info
  let enriched = resources.map((r) => {
    const subj = subjects.find((s) => s.id === r.subjectId);
    const branch = branches.find((b) => b.id === (r.branchId || subj?.branchId));
    const univ = universities.find((u) => u.id === (r.universityId || subj?.universityId));

    return {
      ...r,
      subjectName: r.subjectName || (subj ? subj.name : 'Unknown Subject'),
      subjectCode: r.subjectCode || (subj ? subj.code : ''),
      branchId: r.branchId || (subj ? subj.branchId : ''),
      branchName: branch ? branch.name : '',
      branchCode: branch ? branch.code : '',
      semesterNumber: r.semesterNumber || (subj ? subj.semesterNumber : 1),
      universityId: r.universityId || 'univ-aktu',
      universityName: univ ? univ.name : 'AKTU Technical University',
      moduleNumber: r.moduleNumber || r.unitNumber || null
    };
  });

  if (universityId) {
    enriched = enriched.filter((r) => r.universityId === universityId);
  }

  if (branchId) {
    enriched = enriched.filter((r) => r.branchId === branchId);
  }

  if (semesterNumber) {
    enriched = enriched.filter((r) => Number(r.semesterNumber) === Number(semesterNumber));
  }

  if (subjectId) {
    enriched = enriched.filter((r) => r.subjectId === subjectId);
  }

  if (subjectCode) {
    const sc = subjectCode.toLowerCase();
    enriched = enriched.filter((r) => r.subjectCode.toLowerCase() === sc);
  }

  if (type && type !== 'ALL') {
    enriched = enriched.filter((r) => r.type.toUpperCase() === type.toUpperCase());
  }

  if (year) {
    enriched = enriched.filter((r) => Number(r.year) === Number(year));
  }

  if (moduleNumber || unitNumber) {
    const targetModule = Number(moduleNumber || unitNumber);
    enriched = enriched.filter((r) => Number(r.moduleNumber) === targetModule || Number(r.unitNumber) === targetModule);
  }

  if (search) {
    const q = search.toLowerCase().trim();
    enriched = enriched.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.subjectName.toLowerCase().includes(q) ||
        r.subjectCode.toLowerCase().includes(q) ||
        (r.year && String(r.year).includes(q)) ||
        (r.description && r.description.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (sortBy === 'popular') {
    enriched.sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0));
  } else if (sortBy === 'views') {
    enriched.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
  } else {
    // Newest default
    enriched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  if (limit) {
    enriched = enriched.slice(0, Number(limit));
  }

  res.json({
    success: true,
    count: enriched.length,
    data: enriched
  });
};

exports.getResourceById = (req, res) => {
  const { id } = req.params;
  const resource = db.findById('resources', id);
  if (!resource) {
    return res.status(404).json({ success: false, message: 'Resource not found.' });
  }

  const subject = db.findById('subjects', resource.subjectId);
  res.json({
    success: true,
    data: {
      ...resource,
      subject
    }
  });
};

exports.recordView = (req, res) => {
  const { id } = req.params;
  const resource = db.findById('resources', id);
  if (!resource) {
    return res.status(404).json({ success: false, message: 'Resource not found.' });
  }

  const updatedViewCount = (resource.viewCount || 0) + 1;
  db.updateById('resources', id, { viewCount: updatedViewCount });

  // Update global stats
  const database = db.read();
  database.stats.totalViews = (database.stats.totalViews || 0) + 1;
  db.write(database);

  res.json({ success: true, viewCount: updatedViewCount });
};

exports.recordDownload = (req, res) => {
  const { id } = req.params;
  const resource = db.findById('resources', id);
  if (!resource) {
    return res.status(404).json({ success: false, message: 'Resource not found.' });
  }

  const updatedDownloadCount = (resource.downloadCount || 0) + 1;
  db.updateById('resources', id, { downloadCount: updatedDownloadCount });

  // Update global stats
  const database = db.read();
  database.stats.totalDownloads = (database.stats.totalDownloads || 0) + 1;
  db.write(database);

  res.json({
    success: true,
    downloadCount: updatedDownloadCount,
    downloadUrl: resource.fileUrl
  });
};
