const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Train = require('../models/Train');
const Journey = require('../models/Journey');

const path = require('path');

// Load environment variables from server directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/railtrack';

const seedDatabase = async () => {
  try {
    console.log(`Connecting to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB. Clearing existing demo data...');

    // Clear existing collections
    await User.deleteMany({});
    await Train.deleteMany({});
    await Journey.deleteMany({});

    console.log('Inserting demo users...');

    // 1. Create Demo Users (Passwords will be hashed by User pre-save hook)
    const adminUser = await User.create({
      name: 'Railway Admin Controller',
      email: 'admin@railtrack.com',
      password: 'admin123',
      role: 'admin'
    });

    const standardUser = await User.create({
      name: 'Rahul Sharma',
      email: 'user@railtrack.com',
      password: 'user123',
      role: 'user'
    });

    console.log(`Users seeded:
    Admin: admin@railtrack.com / admin123
    User:  user@railtrack.com / user123`);

    console.log('Inserting 5 demo trains with full station timelines...');

    // 2. Demo Trains with 6-8 stations each
    const trains = [
      {
        trainNumber: '12701',
        trainName: 'Circar Demo Express',
        source: 'Vijayawada',
        destination: 'Chennai Central',
        departureTime: '06:00 AM',
        arrivalTime: '01:00 PM',
        duration: '7h 00m',
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        currentStation: 'Ongole',
        nextStation: 'Nellore',
        delayMinutes: 18,
        status: 'Delayed',
        stations: [
          {
            stationName: 'Vijayawada',
            stationCode: 'BZA',
            arrivalTime: 'Source',
            departureTime: '06:00 AM',
            platform: '1',
            stopDuration: 'Source',
            actualArrival: 'Source',
            actualDeparture: '06:02 AM',
            delayMinutes: 2
          },
          {
            stationName: 'Tenali',
            stationCode: 'TEL',
            arrivalTime: '06:35 AM',
            departureTime: '06:40 AM',
            platform: '2',
            stopDuration: '5 mins',
            actualArrival: '06:38 AM',
            actualDeparture: '06:44 AM',
            delayMinutes: 4
          },
          {
            stationName: 'Bapatla',
            stationCode: 'BPP',
            arrivalTime: '07:10 AM',
            departureTime: '07:12 AM',
            platform: '1',
            stopDuration: '2 mins',
            actualArrival: '07:15 AM',
            actualDeparture: '07:17 AM',
            delayMinutes: 5
          },
          {
            stationName: 'Chirala',
            stationCode: 'CLX',
            arrivalTime: '07:35 AM',
            departureTime: '07:37 AM',
            platform: '2',
            stopDuration: '2 mins',
            actualArrival: '07:44 AM',
            actualDeparture: '07:46 AM',
            delayMinutes: 9
          },
          {
            stationName: 'Ongole',
            stationCode: 'OGL',
            arrivalTime: '08:30 AM',
            departureTime: '08:35 AM',
            platform: '3',
            stopDuration: '5 mins',
            actualArrival: '08:48 AM',
            actualDeparture: '08:53 AM',
            delayMinutes: 18
          },
          {
            stationName: 'Nellore',
            stationCode: 'NLR',
            arrivalTime: '10:00 AM',
            departureTime: '10:05 AM',
            platform: '1',
            stopDuration: '5 mins',
            actualArrival: '10:18 AM',
            actualDeparture: '10:23 AM',
            delayMinutes: 18
          },
          {
            stationName: 'Gudur',
            stationCode: 'GDR',
            arrivalTime: '11:15 AM',
            departureTime: '11:20 AM',
            platform: '2',
            stopDuration: '5 mins',
            actualArrival: '11:33 AM',
            actualDeparture: '11:38 AM',
            delayMinutes: 18
          },
          {
            stationName: 'Chennai Central',
            stationCode: 'MAS',
            arrivalTime: '01:00 PM',
            departureTime: 'Destination',
            platform: '5',
            stopDuration: 'Destination',
            actualArrival: '01:18 PM',
            actualDeparture: 'Destination',
            delayMinutes: 18
          }
        ]
      },
      {
        trainNumber: '12805',
        trainName: 'Vande Bharat Demo Express',
        source: 'Visakhapatnam',
        destination: 'Secunderabad',
        departureTime: '05:45 AM',
        arrivalTime: '02:15 PM',
        duration: '8h 30m',
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        currentStation: 'Vijayawada',
        nextStation: 'Khammam',
        delayMinutes: 0,
        status: 'On Time',
        stations: [
          {
            stationName: 'Visakhapatnam',
            stationCode: 'VSKP',
            arrivalTime: 'Source',
            departureTime: '05:45 AM',
            platform: '8',
            stopDuration: 'Source',
            actualArrival: 'Source',
            actualDeparture: '05:45 AM',
            delayMinutes: 0
          },
          {
            stationName: 'Samalkot',
            stationCode: 'SLO',
            arrivalTime: '07:13 AM',
            departureTime: '07:15 AM',
            platform: '3',
            stopDuration: '2 mins',
            actualArrival: '07:13 AM',
            actualDeparture: '07:15 AM',
            delayMinutes: 0
          },
          {
            stationName: 'Rajahmundry',
            stationCode: 'RJY',
            arrivalTime: '07:53 AM',
            departureTime: '07:55 AM',
            platform: '1',
            stopDuration: '2 mins',
            actualArrival: '07:53 AM',
            actualDeparture: '07:55 AM',
            delayMinutes: 0
          },
          {
            stationName: 'Eluru',
            stationCode: 'EE',
            arrivalTime: '09:03 AM',
            departureTime: '09:05 AM',
            platform: '3',
            stopDuration: '2 mins',
            actualArrival: '09:03 AM',
            actualDeparture: '09:05 AM',
            delayMinutes: 0
          },
          {
            stationName: 'Vijayawada',
            stationCode: 'BZA',
            arrivalTime: '09:55 AM',
            departureTime: '10:00 AM',
            platform: '6',
            stopDuration: '5 mins',
            actualArrival: '09:55 AM',
            actualDeparture: '10:00 AM',
            delayMinutes: 0
          },
          {
            stationName: 'Khammam',
            stationCode: 'KMT',
            arrivalTime: '11:03 AM',
            departureTime: '11:05 AM',
            platform: '2',
            stopDuration: '2 mins',
            actualArrival: '11:03 AM',
            actualDeparture: '11:05 AM',
            delayMinutes: 0
          },
          {
            stationName: 'Secunderabad',
            stationCode: 'SC',
            arrivalTime: '02:15 PM',
            departureTime: 'Destination',
            platform: '10',
            stopDuration: 'Destination',
            actualArrival: '02:15 PM',
            actualDeparture: 'Destination',
            delayMinutes: 0
          }
        ]
      },
      {
        trainNumber: '12952',
        trainName: 'Rajdhani Demo Superfast',
        source: 'Mumbai Central',
        destination: 'New Delhi',
        departureTime: '05:00 PM',
        arrivalTime: '08:35 AM',
        duration: '15h 35m',
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        currentStation: 'Vadodara',
        nextStation: 'Ratlam',
        delayMinutes: 6,
        status: 'Departed',
        stations: [
          {
            stationName: 'Mumbai Central',
            stationCode: 'MMCT',
            arrivalTime: 'Source',
            departureTime: '05:00 PM',
            platform: '1',
            stopDuration: 'Source',
            actualArrival: 'Source',
            actualDeparture: '05:00 PM',
            delayMinutes: 0
          },
          {
            stationName: 'Surat',
            stationCode: 'ST',
            arrivalTime: '07:48 PM',
            departureTime: '07:53 PM',
            platform: '1',
            stopDuration: '5 mins',
            actualArrival: '07:52 PM',
            actualDeparture: '07:57 PM',
            delayMinutes: 4
          },
          {
            stationName: 'Vadodara',
            stationCode: 'BRC',
            arrivalTime: '09:20 PM',
            departureTime: '09:30 PM',
            platform: '2',
            stopDuration: '10 mins',
            actualArrival: '09:26 PM',
            actualDeparture: '09:36 PM',
            delayMinutes: 6
          },
          {
            stationName: 'Ratlam',
            stationCode: 'RTM',
            arrivalTime: '01:05 AM',
            departureTime: '01:10 AM',
            platform: '5',
            stopDuration: '5 mins',
            actualArrival: '01:11 AM',
            actualDeparture: '01:16 AM',
            delayMinutes: 6
          },
          {
            stationName: 'Kota',
            stationCode: 'KOTA',
            arrivalTime: '04:15 AM',
            departureTime: '04:20 AM',
            platform: '1',
            stopDuration: '5 mins',
            actualArrival: '04:21 AM',
            actualDeparture: '04:26 AM',
            delayMinutes: 6
          },
          {
            stationName: 'Sawai Madhopur',
            stationCode: 'SWM',
            arrivalTime: '05:23 AM',
            departureTime: '05:25 AM',
            platform: '1',
            stopDuration: '2 mins',
            actualArrival: '05:29 AM',
            actualDeparture: '05:31 AM',
            delayMinutes: 6
          },
          {
            stationName: 'Mathura',
            stationCode: 'MTJ',
            arrivalTime: '07:08 AM',
            departureTime: '07:10 AM',
            platform: '3',
            stopDuration: '2 mins',
            actualArrival: '07:14 AM',
            actualDeparture: '07:16 AM',
            delayMinutes: 6
          },
          {
            stationName: 'New Delhi',
            stationCode: 'NDLS',
            arrivalTime: '08:35 AM',
            departureTime: 'Destination',
            platform: '2',
            stopDuration: 'Destination',
            actualArrival: '08:41 AM',
            actualDeparture: 'Destination',
            delayMinutes: 6
          }
        ]
      },
      {
        trainNumber: '12626',
        trainName: 'Kerala Demo Express',
        source: 'New Delhi',
        destination: 'Trivandrum',
        departureTime: '08:10 PM',
        arrivalTime: '07:35 PM',
        duration: '47h 25m',
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        currentStation: 'Agra Cantt',
        nextStation: 'Gwalior',
        delayMinutes: 0,
        status: 'On Time',
        stations: [
          {
            stationName: 'New Delhi',
            stationCode: 'NDLS',
            arrivalTime: 'Source',
            departureTime: '08:10 PM',
            platform: '3',
            stopDuration: 'Source',
            actualArrival: 'Source',
            actualDeparture: '08:10 PM',
            delayMinutes: 0
          },
          {
            stationName: 'Agra Cantt',
            stationCode: 'AGC',
            arrivalTime: '10:40 PM',
            departureTime: '10:45 PM',
            platform: '1',
            stopDuration: '5 mins',
            actualArrival: '10:40 PM',
            actualDeparture: '10:45 PM',
            delayMinutes: 0
          },
          {
            stationName: 'Gwalior',
            stationCode: 'GWL',
            arrivalTime: '12:18 AM',
            departureTime: '12:20 AM',
            platform: '1',
            stopDuration: '2 mins',
            actualArrival: '12:18 AM',
            actualDeparture: '12:20 AM',
            delayMinutes: 0
          },
          {
            stationName: 'Bhopal',
            stationCode: 'BPL',
            arrivalTime: '05:20 AM',
            departureTime: '05:25 AM',
            platform: '1',
            stopDuration: '5 mins',
            actualArrival: '05:20 AM',
            actualDeparture: '05:25 AM',
            delayMinutes: 0
          },
          {
            stationName: 'Nagpur',
            stationCode: 'NGP',
            arrivalTime: '11:45 AM',
            departureTime: '11:50 AM',
            platform: '2',
            stopDuration: '5 mins',
            actualArrival: '11:45 AM',
            actualDeparture: '11:50 AM',
            delayMinutes: 0
          },
          {
            stationName: 'Vijayawada',
            stationCode: 'BZA',
            arrivalTime: '09:20 PM',
            departureTime: '09:30 PM',
            platform: '7',
            stopDuration: '10 mins',
            actualArrival: '09:20 PM',
            actualDeparture: '09:30 PM',
            delayMinutes: 0
          },
          {
            stationName: 'Katpadi',
            stationCode: 'KPD',
            arrivalTime: '04:30 AM',
            departureTime: '04:35 AM',
            platform: '3',
            stopDuration: '5 mins',
            actualArrival: '04:30 AM',
            actualDeparture: '04:35 AM',
            delayMinutes: 0
          },
          {
            stationName: 'Trivandrum',
            stationCode: 'TVC',
            arrivalTime: '07:35 PM',
            departureTime: 'Destination',
            platform: '1',
            stopDuration: 'Destination',
            actualArrival: '07:35 PM',
            actualDeparture: 'Destination',
            delayMinutes: 0
          }
        ]
      },
      {
        trainNumber: '12002',
        trainName: 'Shatabdi Demo Express',
        source: 'New Delhi',
        destination: 'Bhopal',
        departureTime: '06:00 AM',
        arrivalTime: '02:40 PM',
        duration: '8h 40m',
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sun'],
        currentStation: 'Jhansi',
        nextStation: 'Bhopal',
        delayMinutes: 12,
        status: 'Arrived',
        stations: [
          {
            stationName: 'New Delhi',
            stationCode: 'NDLS',
            arrivalTime: 'Source',
            departureTime: '06:00 AM',
            platform: '1',
            stopDuration: 'Source',
            actualArrival: 'Source',
            actualDeparture: '06:00 AM',
            delayMinutes: 0
          },
          {
            stationName: 'Mathura',
            stationCode: 'MTJ',
            arrivalTime: '07:19 AM',
            departureTime: '07:20 AM',
            platform: '1',
            stopDuration: '1 min',
            actualArrival: '07:22 AM',
            actualDeparture: '07:23 AM',
            delayMinutes: 3
          },
          {
            stationName: 'Agra Cantt',
            stationCode: 'AGC',
            arrivalTime: '07:50 AM',
            departureTime: '07:55 AM',
            platform: '1',
            stopDuration: '5 mins',
            actualArrival: '07:57 AM',
            actualDeparture: '08:02 AM',
            delayMinutes: 7
          },
          {
            stationName: 'Gwalior',
            stationCode: 'GWL',
            arrivalTime: '09:23 AM',
            departureTime: '09:28 AM',
            platform: '1',
            stopDuration: '5 mins',
            actualArrival: '09:32 AM',
            actualDeparture: '09:37 AM',
            delayMinutes: 9
          },
          {
            stationName: 'Jhansi',
            stationCode: 'JHS',
            arrivalTime: '10:45 AM',
            departureTime: '10:53 AM',
            platform: '2',
            stopDuration: '8 mins',
            actualArrival: '10:57 AM',
            actualDeparture: '11:05 AM',
            delayMinutes: 12
          },
          {
            stationName: 'Bhopal',
            stationCode: 'BPL',
            arrivalTime: '02:40 PM',
            departureTime: 'Destination',
            platform: '1',
            stopDuration: 'Destination',
            actualArrival: '02:52 PM',
            actualDeparture: 'Destination',
            delayMinutes: 12
          }
        ]
      }
    ];

    const insertedTrains = await Train.insertMany(trains);
    console.log(`Successfully inserted ${insertedTrains.length} demo trains.`);

    // 3. Insert Sample Journey for the demo user
    console.log('Inserting sample active and past journeys...');
    await Journey.create([
      {
        userId: standardUser._id,
        trainId: insertedTrains[0]._id, // 12701 Demo Express
        source: 'Vijayawada',
        destination: 'Chennai Central',
        journeyDate: new Date(),
        status: 'In Progress',
        startedAt: new Date(Date.now() - 3 * 3600 * 1000), // started 3 hours ago
        reminderMinutes: 15,
        reminderTriggered: false
      },
      {
        userId: standardUser._id,
        trainId: insertedTrains[1]._id, // 12805 Vande Bharat
        source: 'Visakhapatnam',
        destination: 'Secunderabad',
        journeyDate: new Date(Date.now() - 7 * 24 * 3600 * 1000), // 7 days ago
        status: 'Completed',
        startedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000),
        completedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000 + 8.5 * 3600 * 1000),
        reminderMinutes: 30,
        reminderTriggered: true
      }
    ]);

    console.log('✅ Database seeded successfully with demo records!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
