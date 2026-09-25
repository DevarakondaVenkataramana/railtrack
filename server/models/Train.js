const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  stationName: {
    type: String,
    required: true,
    trim: true
  },
  stationCode: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  arrivalTime: {
    type: String,
    required: true
  },
  departureTime: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    default: '1'
  },
  stopDuration: {
    type: String,
    default: '2 mins'
  },
  actualArrival: {
    type: String,
    default: ''
  },
  actualDeparture: {
    type: String,
    default: ''
  },
  delayMinutes: {
    type: Number,
    default: 0
  }
}, { _id: true });

const trainSchema = new mongoose.Schema({
  trainNumber: {
    type: String,
    required: [true, 'Please provide train number'],
    unique: true,
    trim: true
  },
  trainName: {
    type: String,
    required: [true, 'Please provide train name'],
    trim: true
  },
  source: {
    type: String,
    required: [true, 'Please provide source station'],
    trim: true
  },
  destination: {
    type: String,
    required: [true, 'Please provide destination station'],
    trim: true
  },
  departureTime: {
    type: String,
    required: true
  },
  arrivalTime: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  runningDays: {
    type: [String],
    default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  stations: [stationSchema],
  currentStation: {
    type: String,
    default: ''
  },
  nextStation: {
    type: String,
    default: ''
  },
  delayMinutes: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['On Time', 'Delayed', 'Arrived', 'Departed', 'Completed'],
    default: 'On Time'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Train', trainSchema);
