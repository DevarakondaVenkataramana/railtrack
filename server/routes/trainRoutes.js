const express = require('express');
const router = express.Router();
const {
  getAllTrains,
  searchTrains,
  getTrainById,
  createTrain,
  updateTrain,
  deleteTrain,
  updateTrainStatus,
  getAllStations
} = require('../controllers/trainController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public routes
router.get('/', getAllTrains);
router.get('/search', searchTrains);
router.get('/stations', getAllStations);
router.get('/:id', getTrainById);

// Admin-only routes
router.post('/', protect, adminOnly, createTrain);
router.put('/:id', protect, adminOnly, updateTrain);
router.delete('/:id', protect, adminOnly, deleteTrain);
router.put('/:id/status', protect, adminOnly, updateTrainStatus);

module.exports = router;
