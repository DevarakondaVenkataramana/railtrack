import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Train, ArrowRight, Gauge, Clock, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import ThreeDCard from './ThreeDCard';

const SHOWCASE_TRAINS = [
  {
    number: '20608',
    name: 'Vande Bharat Express 2.0',
    type: 'Superfast Electric Multiple Unit',
    speed: '180 km/h (Max)',
    route: 'New Delhi (NDLS) ⇄ Varanasi Cantt (BSB)',
    duration: '8h 00m',
    gradient: 'from-blue-600/30 via-cyan-500/20 to-transparent',
    border: 'border-cyan-500/40',
    glow: 'cyan',
    tag: 'Flagship High-Speed',
    tagColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
    stats: {
      punctuality: '99.2%',
      coaches: '16 Car EMU',
      safety: 'KAVACH 4.0'
    }
  },
  {
    number: '12952',
    name: 'Mumbai Rajdhani Express',
    type: 'Premium Superfast Tejas-Rake',
    speed: '140 km/h',
    route: 'New Delhi (NDLS) ⇄ Mumbai Central (MMCT)',
    duration: '15h 32m',
    gradient: 'from-amber-600/30 via-orange-500/20 to-transparent',
    border: 'border-amber-500/40',
    glow: 'amber',
    tag: 'King of Speed',
    tagColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    stats: {
      punctuality: '98.7%',
      coaches: '22 LHB Coaches',
      safety: 'WAP-7 Twin-Loco'
    }
  },
  {
    number: '12050',
    name: 'Gatimaan Express',
    type: 'High-Speed Luxury Express',
    speed: '160 km/h',
    route: 'Hazrat Nizamuddin (NZM) ⇄ Agra Cantt (AGC)',
    duration: '1h 40m',
    gradient: 'from-emerald-600/30 via-teal-500/20 to-transparent',
    border: 'border-emerald-500/40',
    glow: 'emerald',
    tag: 'Executive Luxury',
    tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    stats: {
      punctuality: '99.5%',
      coaches: '12 Executive LHB',
      safety: 'WAP-5 High Acceleration'
    }
  }
];

const ThreeTrainShowcase = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Train className="w-3.5 h-3.5 text-cyan-400" /> Premium Fleet
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            High-Speed Express Fleet
          </h2>
        </div>
        <Link
          to="/search"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors group"
        >
          View All Trains & Schedules <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SHOWCASE_TRAINS.map((train) => (
          <ThreeDCard
            key={train.number}
            className={`glass-panel p-6 border ${train.border} flex flex-col justify-between h-full relative overflow-hidden group`}
          >
            {/* Ambient Spotlight */}
            <div
              className={`absolute -top-12 -right-12 w-44 h-44 rounded-full bg-gradient-to-br ${train.gradient} blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`}
            />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${train.tagColor}`}>
                  {train.tag}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  #{train.number}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors">
                  {train.name}
                </h3>
                <div className="text-xs text-slate-400 font-medium mt-1">
                  {train.type}
                </div>
              </div>

              {/* Route Badge */}
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{train.route}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <span>Duration: <strong className="text-white font-mono">{train.duration}</strong></span>
                  <span>Max Speed: <strong className="text-amber-400 font-mono">{train.speed}</strong></span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <div className="text-slate-400">PUNCTUALITY</div>
                  <div className="text-emerald-400 font-bold mt-0.5">{train.stats.punctuality}</div>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <div className="text-slate-400">RAKE</div>
                  <div className="text-cyan-400 font-bold mt-0.5">{train.stats.coaches.split(' ')[0]}</div>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <div className="text-slate-400">SAFETY</div>
                  <div className="text-amber-400 font-bold mt-0.5">KAVACH</div>
                </div>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <Link
                to={`/trains/${train.number}`}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40"
              >
                Track Live Telemetry <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </ThreeDCard>
        ))}
      </div>
    </div>
  );
};

export default ThreeTrainShowcase;
