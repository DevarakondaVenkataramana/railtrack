import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Train,
  Clock,
  Calendar,
  MapPin,
  ArrowRight,
  Navigation,
  Play,
  Bell,
  CheckCircle,
  AlertCircle,
  Share2
} from 'lucide-react';
import { trainService } from '../services/trainService';
import { journeyService } from '../services/journeyService';
import { useAuth } from '../context/AuthContext';
import StationTimeline from '../components/StationTimeline';
import ProgressBar from '../components/ProgressBar';
import DelayBadge from '../components/DelayBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const TrainDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startingJourney, setStartingJourney] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(15);

  useEffect(() => {
    const fetchTrain = async () => {
      setLoading(true);
      try {
        const data = await trainService.getTrainById(id);
        setTrain(data);
      } catch (err) {
        console.error('Error fetching train details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrain();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Loading train schedule and live station data..." size="large" />
      </div>
    );
  }

  if (!train) {
    return (
      <div className="max-w-xl mx-auto my-16 text-center bg-white p-8 rounded-2xl border border-slate-200">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Train Not Found</h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          The requested train could not be located in the database.
        </p>
        <Link
          to="/search"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold"
        >
          Back to Trains List
        </Link>
      </div>
    );
  }

  // Calculate station progress metrics
  const stations = train.stations || [];
  const currentIdx = stations.findIndex(
    (s) => s.stationName.toLowerCase().trim() === (train.currentStation || '').toLowerCase().trim()
  );

  const completedCount = currentIdx >= 0 ? currentIdx : 0;
  const progressPercent =
    stations.length > 1
      ? Math.round(((currentIdx >= 0 ? currentIdx : 0) / (stations.length - 1)) * 100)
      : 0;

  // Handle Start Journey action
  const handleStartJourney = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/trains/${train._id}` } } });
      return;
    }

    setStartingJourney(true);
    try {
      const journey = await journeyService.startJourney({
        trainId: train._id,
        source: train.source,
        destination: train.destination,
        journeyDate: new Date(),
        reminderMinutes: selectedReminder,
      });

      setFeedback({
        type: 'success',
        text: `Journey initiated successfully! You can track live progress in My Journeys.`
      });
      setReminderModalOpen(false);
      setTimeout(() => {
        navigate('/my-journeys');
      }, 1500);
    } catch (err) {
      console.error('Failed to start journey:', err);
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to start journey.'
      });
    } finally {
      setStartingJourney(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Train Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-blue-700 text-white text-xs font-bold px-3 py-1 rounded-md tracking-wider">
                TRAIN #{train.trainNumber}
              </span>
              <DelayBadge delayMinutes={train.delayMinutes} status={train.status} size="default" />
              <span className="text-xs bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-md">
                Demo tracking data
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900">
              {train.trainName}
            </h1>

            <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500 mt-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Running Days: <strong>{train.runningDays?.join(', ') || 'All Days'}</strong></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setReminderModalOpen(true)}
              className="px-4 py-3 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Bell className="w-4 h-4 text-blue-600" />
              <span>Arrival Reminder</span>
            </button>

            <button
              onClick={handleStartJourney}
              disabled={startingJourney}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{startingJourney ? 'Starting...' : 'START JOURNEY'}</span>
            </button>
          </div>
        </div>

        {feedback.text && (
          <div
            className={`mt-4 p-4 rounded-xl text-sm font-semibold ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* Route Summary Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase">Source</span>
              <div className="text-base font-bold text-slate-800">{train.source}</div>
              <div className="text-xs font-semibold text-blue-600 mt-0.5">
                Departs: {train.departureTime}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase">Journey Time</span>
              <div className="text-base font-bold text-slate-800">{train.duration}</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Total Route Halts: <strong>{stations.length}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase">Destination</span>
              <div className="text-base font-bold text-slate-800">{train.destination}</div>
              <div className="text-xs font-semibold text-emerald-600 mt-0.5">
                Arrives: {train.arrivalTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Journey Progress Bar */}
      <ProgressBar
        currentStation={train.currentStation}
        nextStation={train.nextStation}
        destination={train.destination}
        progressPercent={progressPercent}
        delayMinutes={train.delayMinutes}
        completedCount={completedCount}
        totalCount={stations.length}
        estimatedArrival={
          train.delayMinutes > 0
            ? `${train.arrivalTime} (+${train.delayMinutes}m)`
            : train.arrivalTime
        }
      />

      {/* Main Innovative Feature: Station-wise Train Journey Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
        <StationTimeline
          stations={stations}
          currentStation={train.currentStation}
          nextStation={train.nextStation}
        />
      </div>

      {/* Destination Reminder Modal */}
      {reminderModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Set Destination Reminder</h3>
              </div>
              <button
                onClick={() => setReminderModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Receive an in-app destination reminder alert before your train arrives at{' '}
              <strong className="text-slate-800">{train.destination}</strong>.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Remind Me:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[30, 15, 10].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setSelectedReminder(mins)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedReminder === mins
                        ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {mins} mins before
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
              Alert configured for: <strong>{selectedReminder} minutes prior</strong> to estimated arrival at {train.destination}.
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReminderModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartJourney}
                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm"
              >
                Save & Start Journey
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainDetails;
