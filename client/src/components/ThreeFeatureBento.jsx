import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Activity, 
  Layers, 
  BellRing, 
  ShieldCheck, 
  Compass, 
  ArrowUpRight, 
  Check, 
  Clock, 
  Gauge, 
  Zap, 
  Train 
} from 'lucide-react';
import ThreeDCard from './ThreeDCard';

const ThreeFeatureBento = () => {
  const [pnrInput, setPnrInput] = useState('4251890214');
  const [pnrResult, setPnrResult] = useState({
    trainNo: '12952',
    trainName: 'Mumbai Rajdhani Express',
    from: 'NDLS',
    to: 'MMCT',
    coach: 'B4',
    berth: '32 (Side Lower)',
    status: 'CNF (Confirmed)',
    chartStatus: 'Chart Prepared'
  });

  const [selectedCoach, setSelectedCoach] = useState('E1');

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> ThreeUI Design System Architecture
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">Precision</span> & Speed
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Explore our suite of next-generation railway intelligence tools with real-time telemetry, 3D kinetic visuals, and AI-assisted delay analytics.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pt-4">
        
        {/* Bento 1: AI Delay & Platform Neural Predictor (Large 2 Col) */}
        <div className="md:col-span-2 lg:col-span-2">
          <ThreeDCard className="glass-panel p-6 md:p-8 h-full border-blue-500/30 text-white flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/25 transition-all duration-700" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-cyan-400 shadow-inner">
                  <Cpu className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-cyan-300 text-xs font-mono font-bold">
                  99.4% ML ACCURACY
                </span>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-black text-white">
                  Neural Delay & Platform Predictor
                </h3>
                <p className="text-xs md:text-sm text-slate-400 mt-1">
                  Machine learning model calculating real-time congestion, signal clearances, track maintenance speed-restrictions, and platform reallocations.
                </p>
              </div>

              {/* Live Simulated Prediction Chart */}
              <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Predicted Arrival at Kanpur:</span>
                  <span className="text-emerald-400 font-bold font-mono">10:08 AM (Exact 0m delay)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Platform Probability (PF 4):</span>
                  <span className="text-cyan-400 font-bold font-mono">98.2% Confidence</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-full w-[98%]" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mt-6 group-hover:translate-x-1 transition-transform">
              Explore Neural Network Models <ArrowUpRight className="w-4 h-4" />
            </div>
          </ThreeDCard>
        </div>

        {/* Bento 2: 3D Coach Layout & Composition Visualizer (1 Col) */}
        <div className="md:col-span-1 lg:col-span-1">
          <ThreeDCard className="glass-panel p-6 h-full border-cyan-500/20 text-white flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">
                3D Coach & Seat Layout
              </h3>
              <p className="text-xs text-slate-400">
                Know your coach position relative to locomotive before the train arrives at the platform.
              </p>

              {/* Interactive Coach Selector */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Select Coach:
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {['ENG', 'E1', 'E2', 'C1', 'C2', 'C3'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCoach(c)}
                      className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                        selectedCoach === c
                          ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md shadow-cyan-500/40'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div className="text-[11px] font-mono text-cyan-300 bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                  {selectedCoach === 'ENG'
                    ? 'WAP-7 6000 HP Electric Locomotive'
                    : `Coach ${selectedCoach} • Executive Chair Car • Seats 1-52`}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-cyan-400 mt-4">
              Inspect Layout Map <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </ThreeDCard>
        </div>

        {/* Bento 3: Instant PNR Tracker Simulator (1 Col) */}
        <div className="md:col-span-1 lg:col-span-1">
          <ThreeDCard className="glass-panel p-6 h-full border-indigo-500/20 text-white flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">
                Live PNR Status Resolver
              </h3>
              <p className="text-xs text-slate-400">
                Instant confirmation chances, coach allocation, and berth numbers.
              </p>

              {/* Mini Interactive PNR Widget */}
              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 space-y-2">
                <div className="text-[10px] text-slate-400 uppercase font-bold">PNR: {pnrInput}</div>
                <div className="text-xs font-bold text-white truncate">{pnrResult.trainName}</div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Berth:</span>
                  <span className="text-amber-400 font-bold font-mono">{pnrResult.coach} - {pnrResult.berth}</span>
                </div>
                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  <Check className="w-3 h-3" /> {pnrResult.status}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-indigo-400 mt-4">
              Track Another PNR <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </ThreeDCard>
        </div>

        {/* Bento 4: Smart Station Audio & Notifications (1 Col) */}
        <div className="md:col-span-1 lg:col-span-2">
          <ThreeDCard className="glass-panel p-6 md:p-8 h-full border-amber-500/20 text-white flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <BellRing className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">
                  Intelligent Platform Alert Radar
                </h3>
                <p className="text-xs md:text-sm text-slate-400 mt-1">
                  Get automated proximity alerts 15 minutes before reaching your destination station, platform change alarms, and wake-up notifications.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-xs font-bold text-amber-300">Destination Alarm</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Vibrates 10 km before destination</div>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-xs font-bold text-cyan-300">PF Shift Radar</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Instant audio alert if platform swaps</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-amber-400 mt-4">
              Configure Live Alerts <ArrowUpRight className="w-4 h-4" />
            </div>
          </ThreeDCard>
        </div>

        {/* Bento 5: KAVACH Anti-Collision & Telemetry (2 Col) */}
        <div className="md:col-span-2 lg:col-span-2">
          <ThreeDCard className="glass-panel p-6 md:p-8 h-full border-emerald-500/30 text-white flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                  <Gauge className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-xs font-mono font-bold">
                  KAVACH ACTIVE
                </span>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-black text-white">
                  KAVACH Telemetry & Safety Stream
                </h3>
                <p className="text-xs md:text-sm text-slate-400 mt-1">
                  Direct telemetry feeds indicating loco speed governor status, automatic brake triggers, cab signaling, and level-crossing auto-whistling.
                </p>
              </div>

              <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 grid grid-cols-3 gap-2 text-center font-mono">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Emergency Brake</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5">READY (0.0s)</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Signal Aspect</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5">DOUBLE GREEN</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Max Permitted</div>
                  <div className="text-xs font-bold text-cyan-400 mt-0.5">160 KM/H</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 mt-4">
              View Live Safety Telemetry <ArrowUpRight className="w-4 h-4" />
            </div>
          </ThreeDCard>
        </div>

      </div>
    </div>
  );
};

export default ThreeFeatureBento;
