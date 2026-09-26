const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const primaryURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/railtrack';

  try {
    const conn = await mongoose.connect(primaryURI, {
      serverSelectionTimeoutMS: 5000
    });
    cachedConnection = conn;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);

    // In local development, fallback gracefully to local MongoDB if remote Atlas fails
    if (!process.env.VERCEL && primaryURI !== 'mongodb://127.0.0.1:27017/railtrack') {
      try {
        console.log('🔄 Attempting fallback connection to local MongoDB (127.0.0.1:27017)...');
        const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/railtrack', {
          serverSelectionTimeoutMS: 3000
        });
        cachedConnection = localConn;
        console.log(`✅ Connected to local MongoDB: ${localConn.connection.host} / ${localConn.connection.name}`);
        return localConn;
      } catch (localErr) {
        console.error('❌ Local MongoDB fallback failed:', localErr.message);
      }
    }

    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;
