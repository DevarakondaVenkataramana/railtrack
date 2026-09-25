const Train = require('../models/Train');

// Helper to check if train runs on specific date
const doesTrainRunOnDate = (runningDays, dateString) => {
  if (!dateString || !runningDays || runningDays.length === 0) return true;
  try {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return true;
    const dayName = days[date.getDay()];
    return runningDays.includes(dayName);
  } catch (err) {
    return true;
  }
};

// @desc    Get all trains
// @route   GET /api/trains
// @access  Public
const getAllTrains = async (req, res) => {
  try {
    const trains = await Train.find({}).sort({ trainNumber: 1 });
    res.json(trains);
  } catch (error) {
    console.error('Error fetching trains:', error);
    res.status(500).json({ message: 'Server error while fetching trains' });
  }
};

// @desc    Search trains by source, destination, date
// @route   GET /api/trains/search
// @access  Public
const searchTrains = async (req, res) => {
  try {
    const { from, to, date } = req.query;

    const allTrains = await Train.find({});

    if (!from && !to) {
      return res.json(allTrains);
    }

    const fromTerm = (from || '').trim().toLowerCase();
    const toTerm = (to || '').trim().toLowerCase();

    const matchingTrains = allTrains.filter((train) => {
      // 1. Check running day if date provided
      if (date && !doesTrainRunOnDate(train.runningDays, date)) {
        return false;
      }

      // If only 'from' is provided
      if (fromTerm && !toTerm) {
        const hasSource = train.source.toLowerCase().includes(fromTerm);
        const hasStation = train.stations.some(s => 
          s.stationName.toLowerCase().includes(fromTerm) || 
          s.stationCode.toLowerCase() === fromTerm
        );
        return hasSource || hasStation;
      }

      // If only 'to' is provided
      if (!fromTerm && toTerm) {
        const hasDest = train.destination.toLowerCase().includes(toTerm);
        const hasStation = train.stations.some(s => 
          s.stationName.toLowerCase().includes(toTerm) || 
          s.stationCode.toLowerCase() === toTerm
        );
        return hasDest || hasStation;
      }

      // Both 'from' and 'to' provided:
      // Check full route sequence (station A must come before station B)
      const stationNames = train.stations.map(s => s.stationName.toLowerCase());
      const stationCodes = train.stations.map(s => s.stationCode.toLowerCase());

      let fromIdx = -1;
      let toIdx = -1;

      for (let i = 0; i < train.stations.length; i++) {
        const name = stationNames[i];
        const code = stationCodes[i];

        if (fromIdx === -1 && (name.includes(fromTerm) || code === fromTerm)) {
          fromIdx = i;
        }
        if (name.includes(toTerm) || code === toTerm) {
          toIdx = i;
        }
      }

      // Also check source & destination strings directly
      if (fromIdx === -1 && train.source.toLowerCase().includes(fromTerm)) {
        fromIdx = 0;
      }
      if (toIdx === -1 && train.destination.toLowerCase().includes(toTerm)) {
        toIdx = train.stations.length > 0 ? train.stations.length - 1 : 999;
      }

      return fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx;
    });

    res.json(matchingTrains);
  } catch (error) {
    console.error('Train search error:', error);
    res.status(500).json({ message: 'Server error while searching trains' });
  }
};

// @desc    Get train by ID
// @route   GET /api/trains/:id
// @access  Public
const getTrainById = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);

    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    res.json(train);
  } catch (error) {
    console.error('Error fetching train by ID:', error);
    res.status(500).json({ message: 'Server error while fetching train details' });
  }
};

// @desc    Create new train
// @route   POST /api/trains
// @access  Private/Admin
const createTrain = async (req, res) => {
  try {
    const {
      trainNumber,
      trainName,
      source,
      destination,
      departureTime,
      arrivalTime,
      duration,
      runningDays,
      stations,
      currentStation,
      nextStation,
      delayMinutes,
      status
    } = req.body;

    if (!trainNumber || !trainName || !source || !destination) {
      return res.status(400).json({ message: 'Please provide all required train details' });
    }

    const existingTrain = await Train.findOne({ trainNumber });
    if (existingTrain) {
      return res.status(400).json({ message: `Train #${trainNumber} already exists` });
    }

    // Default current & next station if not specified
    const stationList = Array.isArray(stations) ? stations : [];
    const initialCurrent = currentStation || (stationList.length > 0 ? stationList[0].stationName : source);
    const initialNext = nextStation || (stationList.length > 1 ? stationList[1].stationName : destination);

    const train = await Train.create({
      trainNumber,
      trainName,
      source,
      destination,
      departureTime: departureTime || '06:00 AM',
      arrivalTime: arrivalTime || '12:00 PM',
      duration: duration || '6h 00m',
      runningDays: runningDays && runningDays.length > 0 ? runningDays : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      stations: stationList,
      currentStation: initialCurrent,
      nextStation: initialNext,
      delayMinutes: delayMinutes || 0,
      status: status || 'On Time'
    });

    res.status(201).json(train);
  } catch (error) {
    console.error('Error creating train:', error);
    res.status(500).json({ message: 'Server error while creating train', error: error.message });
  }
};

// @desc    Update train
// @route   PUT /api/trains/:id
// @access  Private/Admin
const updateTrain = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);

    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    const {
      trainNumber,
      trainName,
      source,
      destination,
      departureTime,
      arrivalTime,
      duration,
      runningDays,
      stations,
      currentStation,
      nextStation,
      delayMinutes,
      status
    } = req.body;

    train.trainNumber = trainNumber || train.trainNumber;
    train.trainName = trainName || train.trainName;
    train.source = source || train.source;
    train.destination = destination || train.destination;
    train.departureTime = departureTime || train.departureTime;
    train.arrivalTime = arrivalTime || train.arrivalTime;
    train.duration = duration || train.duration;
    if (runningDays) train.runningDays = runningDays;
    if (stations) train.stations = stations;
    if (currentStation !== undefined) train.currentStation = currentStation;
    if (nextStation !== undefined) train.nextStation = nextStation;
    if (delayMinutes !== undefined) train.delayMinutes = Number(delayMinutes);
    if (status) train.status = status;

    const updatedTrain = await train.save();
    res.json(updatedTrain);
  } catch (error) {
    console.error('Error updating train:', error);
    res.status(500).json({ message: 'Server error while updating train' });
  }
};

// @desc    Delete train
// @route   DELETE /api/trains/:id
// @access  Private/Admin
const deleteTrain = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);

    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    await Train.findByIdAndDelete(req.params.id);
    res.json({ message: 'Train removed successfully' });
  } catch (error) {
    console.error('Error deleting train:', error);
    res.status(500).json({ message: 'Server error while deleting train' });
  }
};

// @desc    Update train live status (station, next, delay, status)
// @route   PUT /api/trains/:id/status
// @access  Private/Admin
const updateTrainStatus = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);

    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    const { currentStation, nextStation, delayMinutes, status } = req.body;

    if (currentStation !== undefined) train.currentStation = currentStation;
    if (nextStation !== undefined) train.nextStation = nextStation;
    if (delayMinutes !== undefined) train.delayMinutes = Number(delayMinutes);
    if (status !== undefined) train.status = status;

    const updatedTrain = await train.save();
    res.json(updatedTrain);
  } catch (error) {
    console.error('Error updating train status:', error);
    res.status(500).json({ message: 'Server error while updating train status' });
  }
};

// @desc    Get all unique stations from all trains (for quick search select)
// @route   GET /api/trains/stations
// @access  Public
const getAllStations = async (req, res) => {
  try {
    const trains = await Train.find({}, 'stations source destination');
    const stationSet = new Map();

    trains.forEach(t => {
      if (t.source) stationSet.set(t.source.toUpperCase(), { name: t.source, code: t.source.substring(0, 4).toUpperCase() });
      if (t.destination) stationSet.set(t.destination.toUpperCase(), { name: t.destination, code: t.destination.substring(0, 4).toUpperCase() });
      if (t.stations && Array.isArray(t.stations)) {
        t.stations.forEach(s => {
          stationSet.set(s.stationName.toUpperCase(), { name: s.stationName, code: s.stationCode });
        });
      }
    });

    const stationsList = Array.from(stationSet.values()).sort((a, b) => a.name.localeCompare(b.name));
    res.json(stationsList);
  } catch (error) {
    console.error('Error fetching stations list:', error);
    res.status(500).json({ message: 'Server error fetching stations' });
  }
};

module.exports = {
  getAllTrains,
  searchTrains,
  getTrainById,
  createTrain,
  updateTrain,
  deleteTrain,
  updateTrainStatus,
  getAllStations
};
