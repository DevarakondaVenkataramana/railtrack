import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Train, Search, Filter, AlertCircle, ArrowLeft } from 'lucide-react';
import SearchForm from '../components/SearchForm';
import TrainCard from '../components/TrainCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { trainService } from '../services/trainService';
import { journeyService } from '../services/journeyService';
import { useAuth } from '../context/AuthContext';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';

  const { isAuthenticated } = useAuth();
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [journeyAlert, setJourneyAlert] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await trainService.searchTrains(from, to, date);
        setTrains(data);
      } catch (err) {
        console.error('Failed to search trains:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [from, to, date]);

  const handleStartJourney = async (train) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    try {
      await journeyService.startJourney({
        trainId: train._id,
        source: from || train.source,
        destination: to || train.destination,
        journeyDate: date || new Date(),
        reminderMinutes: 15,
      });
      setJourneyAlert(`✅ Journey on ${train.trainName} started! Track it in My Journeys.`);
      setTimeout(() => setJourneyAlert(''), 5000);
    } catch (err) {
      console.error('Failed to start journey:', err);
      setJourneyAlert('❌ Failed to start journey. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Search Controls */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-md">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-400" />
            Search Trains & Station Timelines
          </h2>
          <SearchForm initialFrom={from} initialTo={to} initialDate={date} isCompact={true} />
        </div>
      </div>

      {journeyAlert && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center justify-between">
          <span>{journeyAlert}</span>
          <Link to="/my-journeys" className="underline font-bold text-emerald-900">
            Go to My Journeys &rarr;
          </Link>
        </div>
      )}

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            {from || to ? (
              <span>
                Trains from <span className="text-blue-700">{from || 'Anywhere'}</span> to{' '}
                <span className="text-blue-700">{to || 'Anywhere'}</span>
              </span>
            ) : (
              'All Available Trains'
            )}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {date ? `Journey Date: ${date} • ` : ''} Showing {trains.length} matching result(s)
          </p>
        </div>
      </div>

      {/* Results Content */}
      {loading ? (
        <LoadingSpinner message="Searching matching trains and routes..." size="large" />
      ) : trains.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-800">No trains found for this route</h4>
          <p className="text-xs text-slate-500">
            We couldn't find any direct or intermediate trains between{' '}
            <strong>{from || 'specified source'}</strong> and <strong>{to || 'destination'}</strong> on this day.
          </p>
          <div className="pt-2">
            <Link
              to="/search"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" /> View All Demo Trains
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trains.map((train) => (
            <TrainCard
              key={train._id}
              train={train}
              onStartJourney={isAuthenticated ? handleStartJourney : null}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
