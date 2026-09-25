const Train = require('../models/Train');
const Journey = require('../models/Journey');
const User = require('../models/User');

// @desc    Get Admin Dashboard Statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalTrains = await Train.countDocuments();
    const delayedTrains = await Train.countDocuments({
      $or: [{ status: 'Delayed' }, { delayMinutes: { $gt: 0 } }]
    });
    const activeJourneys = await Journey.countDocuments({ status: 'In Progress' });
    const totalUsers = await User.countDocuments({ role: 'user' });

    // Calculate unique stations
    const trains = await Train.find({}, 'stations source destination');
    const stationSet = new Set();
    trains.forEach(t => {
      if (t.source) stationSet.add(t.source.toUpperCase().trim());
      if (t.destination) stationSet.add(t.destination.toUpperCase().trim());
      if (t.stations && Array.isArray(t.stations)) {
        t.stations.forEach(s => {
          if (s.stationName) stationSet.add(s.stationName.toUpperCase().trim());
        });
      }
    });

    // Recent active journeys with user & train info
    const recentJourneys = await Journey.find({})
      .populate('userId', 'name email')
      .populate('trainId', 'trainNumber trainName currentStation nextStation status delayMinutes')
      .sort({ startedAt: -1 })
      .limit(5);

    res.json({
      totalTrains,
      totalStations: stationSet.size,
      activeJourneys,
      delayedTrains,
      totalUsers,
      recentJourneys
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Server error while fetching admin statistics' });
  }
};

module.exports = {
  getAdminStats
};
