const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const adminController = require('../controllers/admin.controller');
const { authenticateToken, requireRole } = require('../middlewares/auth.middleware');

// Memory storage allows streaming directly to Cloudinary or writing to local disk
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.docx', '.doc', '.ppt', '.pptx', '.zip', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only document files (PDF, DOCX, PPT, ZIP) are allowed!'), false);
    }
  }
});

// Admin-only protection
router.use(authenticateToken);
router.use(requireRole('ADMIN'));

router.get('/stats', adminController.getStats);
router.post('/resources', upload.single('file'), adminController.createResource);
router.put('/resources/:id', upload.single('file'), adminController.updateResource);
router.delete('/resources/:id', adminController.deleteResource);

router.post('/subjects', adminController.createSubject);
router.delete('/subjects/:id', adminController.deleteSubject);

module.exports = router;
