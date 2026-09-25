import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Train,
  Clock,
  Calendar,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Trash2,
  StopCircle,
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import { journeyService } from '../services/journeyService';
import LoadingSpinner from '../components/LoadingSpinner';

const MyJourneys = () => {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [actionFeedback, setActionFeedback] = useState('');

  const loadJourneys = async () => {
    try {
      const data = await journeyService.getMyJourneys();
      setJourneys(data);
    } catch (err) {
      console.error('Error fetching journeys:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJourneys();
  }, []);

  const handleCompleteJourney = async (id) => {
    try {
      await journeyService.updateJourney(id, { status: 'Completed' });
      setActionFeedback('Journey marked as Completed!');
      setTimeout(() => setActionFeedback(''), 4000);
      loadJourneys();
    } catch (err) {
      console.error('Error completing journey:', err);
    }
  };

  const handleDeleteJourney = async (id) => {
    if (!window.confirm('Are you sure you want to remove this journey record?')) return;
    try {
      await journeyService.deleteJourney(id);
      setActionFeedback('Journey deleted successfully.');
      setTimeout(() => setActionFeedback(''), 4000);
      loadJourneys();
    } catch (err) {
      console.error('Error deleting journey:', err);
    }
  };

  const filteredJourneys = journeys.filter((j) => {
    if (filter === 'active') return j.status === 'In Progress';
    if (filter === 'completed') return j.status === 'Completed';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            My Journeys
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track real-time train positions, view past travels, and configure arrival notifications.
          </p>
        </div>

        <Link
          to="/search"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs md:text-sm font-bold shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Journey</span>
        </Link>
      </div>

      {actionFeedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold">
          {actionFeedback}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All ({journeys.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
            filter === 'active'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Active ({journeys.filter((j) => j.status === 'In Progress').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
            filter === 'completed'
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Completed ({journeys.filter((j) => j.status === 'Completed').length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Retrieving your journey records..." size="large" />
      ) : filteredJourneys.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Train className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">My journeys are empty.</h3>
          <p className="text-xs text-slate-500">
            You don't have any journeys in this category. Search for a train route and click "Start Journey" to track your journey in real time!
          </p>
          <div className="pt-2">
            <Link
              to="/search"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm inline-block"
            >
              Search Trains
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJourneys.map((journey) => {
            const train = journey.trainId || {};
            const isActive = journey.status === 'In Progress';

            return (
              <div
                key={journey._id}
                className={`bg-white rounded-2xl border shadow-sm p-6 flex flex-col justify-between space-y-4 transition-all ${
                  isActive ? 'border-blue-400 ring-1 ring-blue-400/20' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
                          #{train.trainNumber || 'EXP'}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {journey.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">
                        {train.trainName || 'Express Service'}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleDeleteJourney(journey._id)}
                      title="Delete Journey"
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 my-4 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium block">Source</span>
                      <strong className="text-slate-800 text-sm">{journey.source}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Destination</span>
                      <strong className="text-slate-800 text-sm">{journey.destination}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Journey Date</span>
                      <span className="text-slate-700 font-semibold">
                        {new Date(journey.journeyDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Started At</span>
                      <span className="text-slate-700 font-semibold">
                        {new Date(journey.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {isActive && train.currentStation && (
                    <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs flex items-center justify-between text-blue-900">
                      <span>
                        Current Station: <strong>{train.currentStation}</strong>
                      </span>
                      <span>
                        Delay: <strong>{train.delayMinutes > 0 ? `+${train.delayMinutes}m` : 'On Time'}</strong>
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  {isActive && (
                    <button
                      onClick={() => handleCompleteJourney(journey._id)}
                      className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <StopCircle className="w-3.5 h-3.5 text-slate-500" />
                      <span>Complete Journey</span>
                    </button>
                  )}

                  <Link
                    to={`/journeys/${journey._id}`}
                    className="ml-auto px-4 py-2 text-xs md:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>VIEW JOURNEY</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyJourneys;
