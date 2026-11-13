const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resource.controller');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/auth.middleware');
const db = require('../config/db');

// Optional auth helper to record user download history if logged in
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = db.findById('users', decoded.id);
    } catch (e) {
      // Ignore invalid token in optional auth
    }
  }
  next();
};

router.get('/', resourceController.getResources);
router.get('/:id', resourceController.getResourceById);
router.post('/:id/view', resourceController.recordView);
router.post('/:id/download', optionalAuth, resourceController.recordDownload);

module.exports = router;
