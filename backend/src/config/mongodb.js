const mongoose = require('mongoose');

const connectMongoDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('ℹ️  MONGODB_URI not set. Running with high-speed local db.json storage engine.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`🍃 Connected to MongoDB Atlas Cluster: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.error('❌ MongoDB Atlas connection error:', err.message);
    console.log('ℹ️  Falling back to local db.json storage engine.');
    return false;
  }
};

module.exports = connectMongoDB;
