import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Train,
  Clock,
  Calendar,
  MapPin,
  CheckCircle,
  Bell,
  BellRing,
  StopCircle,
  ArrowLeft,
  Navigation,
  AlertTriangle
} from 'lucide-react';
import { journeyService } from '../services/journeyService';
import StationTimeline from '../components/StationTimeline';
import ProgressBar from '../components/ProgressBar';
import DelayBadge from '../components/DelayBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const JourneyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reminder, setReminder] = useState(15);
  const [reminderActive, setReminderActive] = useState(true);
  const [simulatedAlert, setSimulatedAlert] = useState(false);
  const [feedback, setFeedback] = useState('');

  const loadJourney = async () => {
    try {
      const data = await journeyService.getJourneyById(id);
      setJourney(data);
      if (data.reminderMinutes) {
        setReminder(data.reminderMinutes);
      }
    } catch (err) {
      console.error('Error fetching journey:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJourney();
  }, [id]);

  const handleUpdateReminder = async (mins) => {
    try {
      setReminder(mins);
      await journeyService.updateJourney(id, { reminderMinutes: mins });
      setFeedback(`Destination alert updated to ${mins} minutes before arrival!`);
      setTimeout(() => setFeedback(''), 4000);
    } catch (err) {
      console.error('Failed to update reminder:', err);
    }
  };

  const handleComplete = async () => {
    try {
      await journeyService.updateJourney(id, { status: 'Completed' });
      setFeedback('Journey marked as Completed!');
      setTimeout(() => setFeedback(''), 4000);
      loadJourney();
    } catch (err) {
      console.error('Failed to complete journey:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Loading live journey tracking..." size="large" />
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="max-w-md mx-auto my-16 text-center bg-white p-8 rounded-2xl border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">Journey Not Found</h2>
        <Link to="/my-journeys" className="text-blue-600 text-sm mt-3 inline-block font-semibold">
          &larr; Back to My Journeys
        </Link>
      </div>
    );
  }

  const train = journey.trainId || {};
  const stations = train.stations || [];
  const currentIdx = stations.findIndex(
    (s) => s.stationName.toLowerCase().trim() === (train.currentStation || '').toLowerCase().trim()
  );

  const completedCount = currentIdx >= 0 ? currentIdx : 0;
  const progressPercent =
    stations.length > 1
      ? Math.round(((currentIdx >= 0 ? currentIdx : 0) / (stations.length - 1)) * 100)
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/my-journeys"
          className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Journeys
        </Link>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold">
          {feedback}
        </div>
      )}

      {/* Simulated Destination Alert Banner */}
      {simulatedAlert && (
        <div className="p-4 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm shadow-md flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-slate-950" />
            <span>
              DESTINATION REMINDER ALERT: Your train is approaching {journey.destination}! Prepare for arrival.
            </span>
          </div>
          <button
            onClick={() => setSimulatedAlert(false)}
            className="text-xs bg-slate-950 text-white px-2.5 py-1 rounded-md"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-100 text-blue-800">
                TRAIN #{train.trainNumber}
              </span>
              <DelayBadge delayMinutes={train.delayMinutes} status={train.status} />
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
                Status: {journey.status}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {train.trainName}
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Started on {new Date(journey.startedAt).toLocaleString()} • Tracking: {journey.source} &rarr; {journey.destination}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {journey.status === 'In Progress' && (
              <button
                onClick={handleComplete}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs md:text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <StopCircle className="w-4 h-4 text-emerald-400" />
                <span>Mark Journey Completed</span>
              </button>
            )}

            <button
              onClick={() => setSimulatedAlert(true)}
              className="px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs md:text-sm font-bold transition-colors flex items-center gap-2"
            >
              <Bell className="w-4 h-4 text-amber-700" />
              <span>Simulate Arrival Alert</span>
            </button>
          </div>
        </div>

        {/* Destination Reminder Configuration Box */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Destination Arrival Reminder</h4>
              <p className="text-xs text-slate-500">
                In-app notification scheduled before arrival at {journey.destination}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[10, 15, 30].map((mins) => (
              <button
                key={mins}
                onClick={() => handleUpdateReminder(mins)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  reminder === mins
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {mins}m before
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        currentStation={train.currentStation}
        nextStation={train.nextStation}
        destination={journey.destination}
        progressPercent={progressPercent}
        delayMinutes={train.delayMinutes}
        completedCount={completedCount}
        totalCount={stations.length}
        estimatedArrival={
          train.delayMinutes > 0
            ? `${train.arrivalTime} (+${train.delayMinutes}m delay)`
            : train.arrivalTime
        }
      />

      {/* Station Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
        <StationTimeline
          stations={stations}
          currentStation={train.currentStation}
          nextStation={train.nextStation}
        />
      </div>
    </div>
  );
};

export default JourneyDetails;
