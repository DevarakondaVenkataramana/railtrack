import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  CheckCircle,
  Clock,
  Train,
  ArrowRight,
  Activity,
  PlusCircle,
  MapPin,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { journeyService } from '../services/journeyService';
import SearchForm from '../components/SearchForm';
import ProgressBar from '../components/ProgressBar';
import DelayBadge from '../components/DelayBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        const data = await journeyService.getMyJourneys();
        setJourneys(data);
      } catch (err) {
        console.error('Error fetching dashboard journeys:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJourneys();
  }, []);

  const activeJourneys = journeys.filter((j) => j.status === 'In Progress');
  const completedJourneys = journeys.filter((j) => j.status === 'Completed');
  const currentActive = activeJourneys[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Header */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-2xl p-6 md:p-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-900/60 px-2.5 py-1 rounded">
            Passenger Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 text-white">
            Hello, {user?.name || 'Traveler'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Track your ongoing train routes, review past travels, and schedule your next destination reminders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/search"
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs md:text-sm shadow-md transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Search & Start Journey</span>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{journeys.length}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Total Journeys
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-700">{activeJourneys.length}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Active / In Progress
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-700">{completedJourneys.length}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Completed Journeys
            </div>
          </div>
        </div>
      </div>

      {/* Active Ongoing Journey Card */}
      {currentActive && currentActive.trainId && (
        <div className="bg-white rounded-2xl border-2 border-blue-500/30 shadow-md p-6 md:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-blue-600 animate-ping" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Currently Traveling On
                </span>
                <h2 className="text-xl font-black text-slate-900">
                  #{currentActive.trainId.trainNumber} – {currentActive.trainId.trainName}
                </h2>
              </div>
            </div>

            <Link
              to={`/journeys/${currentActive._id}`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>View Full Journey Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Progress Indicator */}
          <div className="pt-2">
            <ProgressBar
              currentStation={currentActive.trainId.currentStation}
              nextStation={currentActive.trainId.nextStation}
              destination={currentActive.destination}
              progressPercent={65}
              delayMinutes={currentActive.trainId.delayMinutes}
              completedCount={4}
              totalCount={currentActive.trainId.stations?.length || 8}
              estimatedArrival={currentActive.trainId.arrivalTime}
            />
          </div>
        </div>
      )}

      {/* Quick Search Widget */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Find Another Train Route</h3>
        <SearchForm />
      </div>

      {/* Recent Journeys History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Recent Journeys</h3>
          <Link to="/my-journeys" className="text-xs font-bold text-blue-600 hover:underline">
            View All ({journeys.length}) &rarr;
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading your journeys..." />
        ) : journeys.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            You haven't tracked any train journeys yet. Search for a train to begin!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {journeys.slice(0, 4).map((j) => (
              <div
                key={j._id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      #{j.trainId?.trainNumber || 'EXP'}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1">
                      {j.trainId?.trainName || 'Express Route'}
                    </h4>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(j.journeyDate || j.startedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      j.status === 'In Progress'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {j.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <span>{j.source} &rarr; {j.destination}</span>
                  <Link
                    to={`/journeys/${j._id}`}
                    className="font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Details <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
