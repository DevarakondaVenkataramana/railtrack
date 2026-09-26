const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const path = require('path');

// Load environment variables from server directory
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to Database for standalone servers
if (!process.env.VERCEL) {
  connectDB();
}

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check endpoints (accessible without blocking on DB)
app.get('/', (req, res) => {
  res.json({
    project: 'RAILTRACK – SMART TRAIN JOURNEY TRACKER',
    status: 'Server is running',
    version: '1.0.0',
    timestamp: new Date(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    disclaimer: 'Note: All train tracking data is for demonstration and academic evaluation only.'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Ensure DB connection for data API routes
app.use('/api', async (req, res, next) => {
  if (req.path === '/health') return next();
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({
      message: 'Database connection unavailable',
      error: err.message
    });
  }
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trains', require('./routes/trainRoutes'));
app.use('/api/journeys', require('./routes/journeyRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 404 Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `API route not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
});

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚆 Railtrack Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
