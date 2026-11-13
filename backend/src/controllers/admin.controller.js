const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { isCloudinaryConfigured, uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const ResourceModel = require('../models/Resource');
const SubjectModel = require('../models/Subject');

exports.getStats = async (req, res) => {
  const isMongo = mongoose.connection.readyState === 1;

  if (isMongo) {
    try {
      const totalResources = await ResourceModel.countDocuments();
      const totalSubjects = await SubjectModel.countDocuments();
      const resources = await ResourceModel.find().lean();
      
      const totalDownloads = resources.reduce((acc, r) => acc + (r.downloadCount || 0), 0);
      const totalViews = resources.reduce((acc, r) => acc + (r.viewCount || 0), 0);

      const typeCounts = {};
      resources.forEach((r) => {
        typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
      });

      return res.json({
        success: true,
        source: 'MongoDB Atlas',
        data: {
          totalResources,
          totalSubjects,
          totalUniversities: 3,
          totalBranches: 6,
          totalDownloads,
          totalViews,
          typeCounts
        }
      });
    } catch (err) {
      console.warn('MongoDB stats error, falling back to JSON db:', err.message);
    }
  }

  // Fallback to local JSON db
  const resources = db.getCollection('resources');
  const subjects = db.getCollection('subjects');
  const universities = db.getCollection('universities');
  const branches = db.getCollection('branches');
  const database = db.read();

  const totalDownloads = database.stats?.totalDownloads || resources.reduce((acc, r) => acc + (r.downloadCount || 0), 0);
  const totalViews = database.stats?.totalViews || resources.reduce((acc, r) => acc + (r.viewCount || 0), 0);

  const typeCounts = {};
  resources.forEach((r) => {
    typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
  });

  res.json({
    success: true,
    source: 'Local Storage',
    data: {
      totalResources: resources.length,
      totalSubjects: subjects.length,
      totalUniversities: universities.length,
      totalBranches: branches.length,
      totalDownloads,
      totalViews,
      typeCounts
    }
  });
};

exports.createResource = async (req, res) => {
  try {
    const {
      universityId = 'univ-aktu',
      collegeId = '',
      courseId = 'course-btech',
      branchId = 'br-cse',
      semesterNumber = 1,
      subjectId,
      subjectName,
      subjectCode,
      title,
      type = 'PYQ',
      year,
      moduleNumber,
      unitNumber,
      description,
      isSampleData
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Resource title is required.' });
    }

    // Determine or create subject mapping
    let targetSubjectId = subjectId;
    const subjects = db.getCollection('subjects');

    if (!targetSubjectId && subjectCode) {
      const existing = subjects.find(
        (s) => s.code.toLowerCase() === subjectCode.trim().toLowerCase()
      );
      if (existing) {
        targetSubjectId = existing.id;
      } else {
        const newSubj = {
          id: `sub-${uuidv4().substring(0, 8)}`,
          branchId,
          semesterNumber: Number(semesterNumber),
          code: subjectCode.trim().toUpperCase(),
          name: subjectName ? subjectName.trim() : subjectCode.trim().toUpperCase(),
          credits: 4,
          description: `Core academic subject for ${branchId} Semester ${semesterNumber}`,
          createdAt: new Date().toISOString()
        };
        db.insert('subjects', newSubj);
        targetSubjectId = newSubj.id;

        // If MongoDB Atlas connected, also insert into Mongo
        if (mongoose.connection.readyState === 1) {
          try {
            await SubjectModel.create({
              customId: newSubj.id,
              branchId: newSubj.branchId,
              semesterNumber: newSubj.semesterNumber,
              code: newSubj.code,
              name: newSubj.name,
              credits: newSubj.credits,
              description: newSubj.description
            });
          } catch (e) {
            console.warn('Mongo subject insert warning:', e.message);
          }
        }
      }
    } else if (!targetSubjectId && subjects.length > 0) {
      targetSubjectId = subjects[0].id;
    }

    const matchedSubject = db.findById('subjects', targetSubjectId);

    // File handling: Cloudinary CDN vs Local fallback
    let fileUrl = '/uploads/sample_document.pdf';
    let fileSize = '1.0 MB';

    if (req.file) {
      if (isCloudinaryConfigured && req.file.buffer) {
        console.log(`☁️  Uploading PDF "${req.file.originalname}" to Cloudinary permanent CDN...`);
        const cResult = await uploadToCloudinary(req.file.buffer, req.file.originalname, 'eduvault/papers');
        fileUrl = cResult.secure_url;
        const sizeInMb = (cResult.bytes / (1024 * 1024)).toFixed(2);
        fileSize = sizeInMb > 1 ? `${sizeInMb} MB` : `${Math.max(1, Math.round(cResult.bytes / 1024))} KB`;
      } else if (req.file.buffer) {
        // Write to local /uploads directory
        const uploadDir = path.join(__dirname, '..', '..', 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const ext = path.extname(req.file.originalname);
        const base = path.basename(req.file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
        const filename = `${base}-${Date.now()}${ext}`;
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, req.file.buffer);

        fileUrl = `/uploads/${filename}`;
        const sizeInMb = (req.file.size / (1024 * 1024)).toFixed(2);
        fileSize = sizeInMb > 1 ? `${sizeInMb} MB` : `${Math.max(1, Math.round(req.file.size / 1024))} KB`;
      }
    }

    const parsedYear = year ? Number(year) : new Date().getFullYear();
    const parsedModule = moduleNumber ? Number(moduleNumber) : (unitNumber ? Number(unitNumber) : null);

    const newResource = {
      id: `res-${uuidv4().substring(0, 8)}`,
      universityId,
      collegeId: collegeId || null,
      courseId,
      branchId: branchId || matchedSubject?.branchId || 'br-cse',
      semesterNumber: Number(semesterNumber) || matchedSubject?.semesterNumber || 1,
      subjectId: targetSubjectId,
      subjectName: subjectName || matchedSubject?.name || 'Academic Subject',
      subjectCode: subjectCode || matchedSubject?.code || '',
      title: title.trim(),
      type: type.toUpperCase(),
      year: parsedYear,
      moduleNumber: parsedModule,
      unitNumber: parsedModule,
      description: description ? description.trim() : '',
      fileUrl,
      fileSize,
      pageCount: Math.floor(Math.random() * 15) + 4,
      downloadCount: 0,
      viewCount: 0,
      isSampleData: isSampleData === 'true' || isSampleData === true ? true : false,
      uploadedBy: req.user?.fullName || 'Academic Administrator',
      createdAt: new Date().toISOString()
    };

    // Save to local DB
    db.insert('resources', newResource);

    // Save to MongoDB Atlas if connected
    if (mongoose.connection.readyState === 1) {
      try {
        await ResourceModel.create({
          customId: newResource.id,
          ...newResource
        });
      } catch (e) {
        console.warn('MongoDB Resource insert warning:', e.message);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Academic PDF paper successfully uploaded and published live!',
      storage: isCloudinaryConfigured ? 'Cloudinary CDN (Permanent)' : 'Local Storage',
      data: newResource
    });
  } catch (err) {
    console.error('Error creating resource:', err);
    res.status(500).json({ success: false, message: 'Failed to upload academic resource.' });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = db.findById('resources', id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found.' });
    }

    const updates = { ...req.body };

    if (updates.year) updates.year = Number(updates.year);
    if (updates.semesterNumber) updates.semesterNumber = Number(updates.semesterNumber);
    if (updates.moduleNumber) {
      updates.moduleNumber = Number(updates.moduleNumber);
      updates.unitNumber = updates.moduleNumber;
    }
    if (updates.type) updates.type = updates.type.toUpperCase();

    // If a replacement PDF was attached
    if (req.file) {
      if (isCloudinaryConfigured && req.file.buffer) {
        const cResult = await uploadToCloudinary(req.file.buffer, req.file.originalname, 'eduvault/papers');
        updates.fileUrl = cResult.secure_url;
        const sizeInMb = (cResult.bytes / (1024 * 1024)).toFixed(2);
        updates.fileSize = sizeInMb > 1 ? `${sizeInMb} MB` : `${Math.max(1, Math.round(cResult.bytes / 1024))} KB`;
      } else if (req.file.buffer) {
        const uploadDir = path.join(__dirname, '..', '..', 'uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        const ext = path.extname(req.file.originalname);
        const base = path.basename(req.file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
        const filename = `${base}-${Date.now()}${ext}`;
        fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);

        updates.fileUrl = `/uploads/${filename}`;
        const sizeInMb = (req.file.size / (1024 * 1024)).toFixed(2);
        updates.fileSize = sizeInMb > 1 ? `${sizeInMb} MB` : `${Math.max(1, Math.round(req.file.size / 1024))} KB`;
      }
    }

    const updated = db.updateById('resources', id, updates);

    // Update in MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        await ResourceModel.findOneAndUpdate({ customId: id }, updates);
      } catch (e) {
        console.warn('Mongo update error:', e.message);
      }
    }

    res.json({
      success: true,
      message: 'Paper details updated successfully!',
      data: updated
    });
  } catch (err) {
    console.error('Error updating resource:', err);
    res.status(500).json({ success: false, message: 'Failed to update resource.' });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = db.findById('resources', id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found.' });
    }

    // Delete from Cloudinary if stored in cloud
    if (resource.fileUrl && resource.fileUrl.includes('cloudinary.com')) {
      await deleteFromCloudinary(resource.fileUrl);
    } else if (resource.fileUrl && resource.fileUrl.startsWith('/uploads/')) {
      const fileName = path.basename(resource.fileUrl);
      if (!fileName.startsWith('sample_')) {
        const filePath = path.join(__dirname, '..', '..', 'uploads', fileName);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (e) {
            console.warn('Could not remove file from disk:', e.message);
          }
        }
      }
    }

    db.deleteById('resources', id);

    // Delete from MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        await ResourceModel.deleteOne({ customId: id });
      } catch (e) {
        console.warn('Mongo delete warning:', e.message);
      }
    }

    res.json({
      success: true,
      message: 'Academic paper deleted successfully from database and cloud storage.'
    });
  } catch (err) {
    console.error('Error deleting resource:', err);
    res.status(500).json({ success: false, message: 'Failed to delete resource.' });
  }
};

exports.createSubject = async (req, res) => {
  const { branchId, semesterNumber, code, name, credits, description } = req.body;

  if (!branchId || !semesterNumber || !code || !name) {
    return res.status(400).json({ success: false, message: 'branchId, semesterNumber, code, and name are required.' });
  }

  const newSubject = {
    id: `sub-${uuidv4().substring(0, 8)}`,
    branchId,
    semesterNumber: Number(semesterNumber),
    code: code.trim().toUpperCase(),
    name: name.trim(),
    credits: Number(credits) || 4,
    description: description || '',
    createdAt: new Date().toISOString()
  };

  db.insert('subjects', newSubject);

  if (mongoose.connection.readyState === 1) {
    try {
      await SubjectModel.create({
        customId: newSubject.id,
        ...newSubject
      });
    } catch (e) {
      console.warn('Mongo subject create warning:', e.message);
    }
  }

  res.status(201).json({
    success: true,
    message: 'Subject enrolled successfully.',
    data: newSubject
  });
};

exports.deleteSubject = async (req, res) => {
  const { id } = req.params;
  const deleted = db.deleteById('subjects', id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Subject not found.' });
  }

  const resources = db.getCollection('resources');
  const remaining = resources.filter((r) => r.subjectId !== id);
  db.setCollection('resources', remaining);

  if (mongoose.connection.readyState === 1) {
    try {
      await SubjectModel.deleteOne({ customId: id });
      await ResourceModel.deleteMany({ subjectId: id });
    } catch (e) {
      console.warn('Mongo subject delete warning:', e.message);
    }
  }

  res.json({ success: true, message: 'Subject and associated papers removed.' });
};
