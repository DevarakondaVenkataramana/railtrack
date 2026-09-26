import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Train, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  Search, 
  ArrowRight, 
  Activity, 
  Bell, 
  Compass, 
  Calendar,
  Sparkles,
  Zap,
  Gauge,
  Radio,
  Layers,
  Award,
  CheckCircle2,
  TrendingUp,
  Cpu
} from 'lucide-react';
import SearchForm from '../components/SearchForm';
import ThreeHeroCanvas from '../components/ThreeHeroCanvas';
import ThreeDCard from '../components/ThreeDCard';
import ThreeDStationMap from '../components/ThreeDStationMap';
import ThreeFeatureBento from '../components/ThreeFeatureBento';
import ThreeTrainShowcase from '../components/ThreeTrainShowcase';
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
    <div className="space-y-16 md:space-y-24 pb-20 bg-slate-950 text-slate-100 overflow-hidden">
      {/* 1. HERO SECTION WITH 3D WEBGL KINETIC CANVAS */}
      <section className="relative pt-6 md:pt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative">
          {/* 3D Three.js WebGL Interactive Canvas */}
          <ThreeHeroCanvas />

          {/* Overlaid Hero Content */}
          <div className="relative -mt-44 md:-mt-56 z-20 max-w-5xl mx-auto text-center space-y-6 px-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-cyan-400/30 text-cyan-300 text-xs md:text-sm font-bold tracking-wider uppercase shadow-xl animate-pulse">
              <Sparkles className="w-4 h-4 text-cyan-400" /> ThreeUI 3D Kinetic Tracking Engine
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-tight drop-shadow-2xl">
              Next-Gen Train <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
                Journey Intelligence
              </span>
            </h1>

            <p className="text-sm sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed drop-shadow">
              Experience real-time high-speed train tracking with 3D track simulations, AI-predicted delays, live platform telemetry, and coach layouts.
            </p>

            {/* Main Search Panel */}
            <div className="pt-4 text-left">
              <SearchForm />
            </div>
          </div>
        </div>
      </section>

      {/* 2. REAL-TIME TELEMETRY METRICS TICKER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border-blue-500/20 text-center">
            <div className="text-2xl md:text-3xl font-black text-cyan-400 font-mono">99.8%</div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Live Tracking Precision</div>
          </div>
          <div className="glass-panel p-5 rounded-2xl border-cyan-500/20 text-center">
            <div className="text-2xl md:text-3xl font-black text-white font-mono">10 ms</div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Telemetry Latency</div>
          </div>
          <div className="glass-panel p-5 rounded-2xl border-indigo-500/20 text-center">
            <div className="text-2xl md:text-3xl font-black text-indigo-400 font-mono">12,500+</div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Active Stations Mapped</div>
          </div>
          <div className="glass-panel p-5 rounded-2xl border-emerald-500/20 text-center">
            <div className="text-2xl md:text-3xl font-black text-emerald-400 font-mono">KAVACH 4.0</div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Collision Safety Feed</div>
          </div>
        </div>
      </section>

      {/* 3. 3D INTERACTIVE STATION MAP & LIVE ROUTE SIMULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 mb-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-cyan-400" /> Interactive Route Radar
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Live Station-Wise Waypoint Telemetry
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Select waypoints to inspect platform assignments, arrival times, delay forecasts, and track speeds in real-time.
          </p>
        </div>

        <ThreeDStationMap />
      </section>

      {/* 4. THREEUI BENTO GRID INTELLIGENCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ThreeFeatureBento />
      </section>

      {/* 5. 3D HIGH SPEED TRAIN SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ThreeTrainShowcase />
      </section>

      {/* 6. CALL TO ACTION WITH 3D NEON SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl glass-panel p-8 sm:p-12 md:p-16 border border-blue-500/30 overflow-hidden text-center shadow-2xl">
          {/* Glowing Radial Backgrounds */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 right-1/4 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-yellow-400" /> Instant Access
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to Track Your Next Journey in 3D?
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
              Save your journeys, monitor real-time platform allocations, inspect coach locations, and receive live delay alerts seamlessly.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/30 transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
              >
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/search"
                className="px-8 py-4 rounded-xl glass-panel hover:bg-slate-800 text-white font-bold text-sm uppercase tracking-wider border border-slate-700 transition-all cursor-pointer"
              >
                Search Trains
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
