const Journey = require('../models/Journey');
const Train = require('../models/Train');

// @desc    Start a new journey
// @route   POST /api/journeys
// @access  Private
const startJourney = async (req, res) => {
  try {
    const { trainId, source, destination, journeyDate, reminderMinutes } = req.body;

    if (!trainId) {
      return res.status(400).json({ message: 'Train ID is required to start a journey' });
    }

    const train = await Train.findById(trainId);
    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    // Default source and destination from train if not provided
    const journeySource = source || train.source;
    const journeyDest = destination || train.destination;

    const journey = await Journey.create({
      userId: req.user._id,
      trainId,
      source: journeySource,
      destination: journeyDest,
      journeyDate: journeyDate ? new Date(journeyDate) : new Date(),
      status: 'In Progress',
      startedAt: new Date(),
      reminderMinutes: reminderMinutes ? Number(reminderMinutes) : 15
    });

    const populated = await Journey.findById(journey._id).populate('trainId');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Error starting journey:', error);
    res.status(500).json({ message: 'Server error while starting journey', error: error.message });
  }
};

// @desc    Get all journeys for current user
// @route   GET /api/journeys/my
// @access  Private
const getMyJourneys = async (req, res) => {
  try {
    const journeys = await Journey.find({ userId: req.user._id })
      .populate('trainId')
      .sort({ startedAt: -1 });

    res.json(journeys);
  } catch (error) {
    console.error('Error fetching user journeys:', error);
    res.status(500).json({ message: 'Server error while fetching journeys' });
  }
};

// @desc    Get single journey by ID
// @route   GET /api/journeys/:id
// @access  Private
const getJourneyById = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id).populate('trainId');

    if (!journey) {
      return res.status(404).json({ message: 'Journey not found' });
    }

    // Ensure user owns this journey or is admin
    if (journey.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this journey' });
    }

    res.json(journey);
  } catch (error) {
    console.error('Error fetching journey by ID:', error);
    res.status(500).json({ message: 'Server error fetching journey details' });
  }
};

// @desc    Update journey (complete journey or change reminder)
// @route   PUT /api/journeys/:id
// @access  Private
const updateJourney = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id);

    if (!journey) {
      return res.status(404).json({ message: 'Journey not found' });
    }

    if (journey.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this journey' });
    }

    const { status, reminderMinutes, reminderTriggered } = req.body;

    if (status) {
      journey.status = status;
      if (status === 'Completed' && !journey.completedAt) {
        journey.completedAt = new Date();
      }
    }

    if (reminderMinutes !== undefined) {
      journey.reminderMinutes = Number(reminderMinutes);
    }

    if (reminderTriggered !== undefined) {
      journey.reminderTriggered = Boolean(reminderTriggered);
    }

    const updatedJourney = await journey.save();
    const populated = await Journey.findById(updatedJourney._id).populate('trainId');

    res.json(populated);
  } catch (error) {
    console.error('Error updating journey:', error);
    res.status(500).json({ message: 'Server error updating journey' });
  }
};

// @desc    Delete journey
// @route   DELETE /api/journeys/:id
// @access  Private
const deleteJourney = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id);

    if (!journey) {
      return res.status(404).json({ message: 'Journey not found' });
    }

    if (journey.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this journey' });
    }

    await Journey.findByIdAndDelete(req.params.id);
    res.json({ message: 'Journey deleted successfully' });
  } catch (error) {
    console.error('Error deleting journey:', error);
    res.status(500).json({ message: 'Server error deleting journey' });
  }
};

module.exports = {
  startJourney,
  getMyJourneys,
  getJourneyById,
  updateJourney,
  deleteJourney
};
