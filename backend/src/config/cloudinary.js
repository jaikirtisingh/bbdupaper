const cloudinary = require('cloudinary').v2;
const streamifier = require('stream');

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
  console.log('☁️  Cloudinary storage initialized successfully.');
} else {
  console.log('ℹ️  Cloudinary credentials not detected. Operating with local filesystem storage fallback.');
}

/**
 * Upload a file buffer directly to Cloudinary CDN
 * @param {Buffer} buffer - File buffer from Multer memory storage
 * @param {string} filename - Original filename
 * @param {string} folder - Target folder on Cloudinary
 * @returns {Promise<{ secure_url: string, public_id: string, bytes: number }>}
 */
const uploadToCloudinary = (buffer, filename, folder = 'eduvault/papers') => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured) {
      return reject(new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in environment variables.'));
    }

    const cleanName = filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto', // Handles PDF and documents smoothly
        public_id: `${cleanName}_${Date.now()}`
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Delete a file from Cloudinary CDN by public_id or URL
 */
const deleteFromCloudinary = async (fileUrl) => {
  if (!isCloudinaryConfigured || !fileUrl || !fileUrl.includes('cloudinary.com')) {
    return false;
  }

  try {
    // Extract public_id from Cloudinary URL
    const parts = fileUrl.split('/');
    const fileWithExt = parts.slice(parts.indexOf('upload') + 2).join('/');
    const publicId = fileWithExt.replace(/\.[^/.]+$/, '');
    
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    return true;
  } catch (err) {
    console.warn('Could not delete file from Cloudinary:', err.message);
    return false;
  }
};

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadToCloudinary,
  deleteFromCloudinary
};
