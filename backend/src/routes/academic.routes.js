const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academic.controller');

router.get('/universities', academicController.getUniversities);
router.get('/universities/:universityId/colleges', academicController.getCollegesByUniversity);
router.get('/courses', academicController.getCourses);
router.get('/branches', academicController.getBranches);
router.get('/subjects', academicController.getSubjects);
router.get('/subjects/:id', academicController.getSubjectById);
router.get('/announcements', academicController.getAnnouncements);

module.exports = router;
