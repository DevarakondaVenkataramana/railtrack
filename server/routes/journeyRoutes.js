const express = require('express');
const router = express.Router();
const {
  startJourney,
  getMyJourneys,
  getJourneyById,
  updateJourney,
  deleteJourney
} = require('../controllers/journeyController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All journey routes require authentication

router.post('/', startJourney);
router.get('/my', getMyJourneys);
router.get('/:id', getJourneyById);
router.put('/:id', updateJourney);
router.delete('/:id', deleteJourney);

module.exports = router;
