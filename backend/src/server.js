const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const db = require('./config/db');
const connectMongoDB = require('./config/mongodb');
const ensureAdminUser = require('./seeds/ensureAdmin');

const authRoutes = require('./routes/auth.routes');
const academicRoutes = require('./routes/academic.routes');
const resourceRoutes = require('./routes/resource.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database Connections
connectMongoDB();

// Ensure master admin exists without adding any sample resources
ensureAdminUser();

// Enable CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploads directory (Local file storage for authentic admin uploads)
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'EduVault Public Academic Portal',
    database: process.env.MONGODB_URI ? 'MongoDB Atlas (Connected)' : 'Local JSON Storage',
    storage: (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) ? 'Cloudinary CDN' : 'Local Storage'
  });
});

// Serve compiled React production frontend if hosted together
const clientDistDir = path.join(__dirname, '..', '..', 'frontend', 'dist');
if (fs.existsSync(clientDistDir)) {
  app.use(express.static(clientDistDir));

  // SPA fallback for client-side routing
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      return res.sendFile(path.join(clientDistDir, 'index.html'));
    }
    next();
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 EduVault Backend active on http://0.0.0.0:${PORT}`);
});
