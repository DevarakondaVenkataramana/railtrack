import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Train, Clock, ShieldCheck, MapPin, Search, ArrowRight, Activity, Bell, Compass, Calendar } from 'lucide-react';
import SearchForm from '../components/SearchForm';
import TrainCard from '../components/TrainCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { trainService } from '../services/trainService';

const Home = () => {
  const [featuredTrains, setFeaturedTrains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrains = async () => {
      try {
        const data = await trainService.getAllTrains();
        setFeaturedTrains(data.slice(0, 3));
      } catch (err) {
        console.error('Error loading featured trains:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTrains();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 text-white pt-16 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs md:text-sm font-semibold tracking-wide">
            <Train className="w-4 h-4" /> Next-Gen Railway Journey Tracking
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Track Your Train Journey <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">Smarter</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Search trains, explore station-wise schedules, inspect platform numbers, and monitor live journey progress with accurate delay calculations.
          </p>

          {/* Search Card Container */}
          <div className="pt-6 text-left">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Quick Access Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Link
            to="/search"
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
              Train Search
            </h3>
            <p className="text-xs text-slate-500">
              Query schedules between any two stations with dates and stops.
            </p>
          </Link>

          <Link
            to="/search"
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-amber-600 transition-colors">
              Station Timings
            </h3>
            <p className="text-xs text-slate-500">
              Inspect arrival, departure, halt duration, and platforms for every stop.
            </p>
          </Link>

          <Link
            to="/my-journeys"
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">
              My Journey
            </h3>
            <p className="text-xs text-slate-500">
              Save active trips, view progress bars, and configure arrival alerts.
            </p>
          </Link>

          <Link
            to="/search"
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-purple-600 transition-colors">
              Train Status
            </h3>
            <p className="text-xs text-slate-500">
              Live delay calculations, current station markers, and next halts.
            </p>
          </Link>
        </div>
      </section>

      {/* Featured Trains Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
              Popular Routes
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">
              Featured Demo Trains
            </h2>
            <p className="text-sm text-slate-500">
              Simulated express trains running across major railway corridors.
            </p>
          </div>

          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors"
          >
            View All Trains <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading popular train routes..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTrains.map((train) => (
              <TrainCard key={train._id} train={train} />
            ))}
          </div>
        )}
      </section>

      {/* Innovation Highlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-bold tracking-widest uppercase bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-400/30">
              Innovative Core Feature
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
              Interactive Station-Wise Vertical Journey Timeline
            </h2>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Never lose track of where your train is. Our chronological route timeline clearly highlights completed stops, live location, platform allocations, and scheduled vs actual timings with computed delays.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/search"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                Try Interactive Timeline <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Visual Mini Mockup of Timeline */}
          <div className="w-full lg:w-80 bg-slate-800/90 backdrop-blur rounded-2xl p-5 border border-slate-700 shadow-2xl">
            <div className="text-xs font-bold text-slate-300 pb-3 border-b border-slate-700 flex justify-between items-center">
              <span>Demo Express (12701)</span>
              <span className="text-amber-400 font-bold">+18m Delay</span>
            </div>
            <div className="py-3 space-y-3 text-xs">
              <div className="flex items-center gap-3 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-semibold">Vijayawada (Dep: 06:00 AM)</span>
              </div>
              <div className="flex items-center gap-3 text-blue-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                <span>Ongole (Train Here - Pl. 3)</span>
              </div>
              <div className="flex items-center gap-3 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Nellore (Next - Arr: 10:18 AM)</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                <span>Chennai Central (Terminus)</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
