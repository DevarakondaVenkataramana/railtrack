import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Activity, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Gauge, Radio } from 'lucide-react';

const STATIONS_DATA = [
  {
    id: 'NDLS',
    name: 'New Delhi',
    code: 'NDLS',
    arr: 'Start',
    dep: '06:00 AM',
    platform: '1',
    distance: '0 km',
    status: 'Departed',
    delay: 0,
    active: false,
    speed: '130 km/h'
  },
  {
    id: 'CNB',
    name: 'Kanpur Central',
    code: 'CNB',
    arr: '10:08 AM',
    dep: '10:13 AM',
    platform: '4',
    distance: '440 km',
    status: 'Approaching Now',
    delay: 0,
    active: true,
    speed: '160 km/h'
  },
  {
    id: 'PRYJ',
    name: 'Prayagraj Jn',
    code: 'PRYJ',
    arr: '12:08 PM',
    dep: '12:12 PM',
    platform: '6',
    distance: '635 km',
    status: 'On Time',
    delay: 0,
    active: false,
    speed: '145 km/h'
  },
  {
    id: 'BSB',
    name: 'Varanasi Cantt',
    code: 'BSB',
    arr: '02:00 PM',
    dep: 'End',
    platform: '1',
    distance: '759 km',
    status: 'Scheduled',
    delay: 0,
    active: false,
    speed: '120 km/h'
  }
];

const ThreeDStationMap = () => {
  const [selectedStation, setSelectedStation] = useState(STATIONS_DATA[1]);
  const [activeTab, setActiveTab] = useState('live');

  return (
    <div className="w-full glass-panel rounded-3xl p-6 md:p-8 text-white border border-slate-700/80 shadow-2xl relative overflow-hidden">
      {/* Background Neon Glow Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/60 pb-6 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Live Telemetry Radar
          </div>
          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            20608 • Vande Bharat Express 2.0
          </h3>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            New Delhi (NDLS) &rarr; Varanasi Cantt (BSB) • High-Speed Corridor
          </p>
        </div>

        {/* Live Train Status Badge */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            ON TIME (0m DELAY)
          </div>
          <div className="px-3 py-2 rounded-xl bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700">
            GPS: 26.4499° N, 80.3319° E
          </div>
        </div>
      </div>

      {/* 3D Interactive Station Waypoint Track */}
      <div className="relative my-8 px-2 md:px-6">
        {/* Glow Line Connector */}
        <div className="absolute top-1/2 left-6 right-6 h-1.5 -translate-y-1/2 bg-slate-800 rounded-full z-0">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 rounded-full transition-all duration-700 shadow-lg shadow-cyan-500/50"
            style={{ width: '50%' }}
          />
        </div>

        {/* Station Waypoints */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          {STATIONS_DATA.map((station, index) => {
            const isSelected = selectedStation.id === station.id;
            const isPassed = index === 0;
            const isCurrent = station.active;

            return (
              <button
                key={station.id}
                onClick={() => setSelectedStation(station)}
                className={`p-4 rounded-2xl transition-all text-left cursor-pointer transform hover:-translate-y-1 ${
                  isSelected
                    ? 'glass-panel border-cyan-400/80 shadow-lg shadow-cyan-500/20 bg-blue-950/60 ring-2 ring-cyan-400/40'
                    : 'bg-slate-900/80 hover:bg-slate-850 border border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isCurrent
                        ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-400/30 animate-pulse'
                        : isPassed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-4 h-4" /> : station.code}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    PF {station.platform}
                  </span>
                </div>

                <div className="font-bold text-sm text-white truncate">{station.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">{station.arr} • {station.distance}</div>

                {isCurrent && (
                  <div className="mt-2.5 inline-flex items-center gap-1 text-[10px] font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-md border border-cyan-400/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    LIVE EN ROUTE
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Station Telemetry Detail Card */}
      <div className="mt-8 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Scheduled Arrival</div>
          <div className="text-lg font-black text-white font-mono mt-1">{selectedStation.arr}</div>
          <div className="text-xs text-emerald-400 font-semibold mt-0.5">Estimated: {selectedStation.arr} (0m delay)</div>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Scheduled Departure</div>
          <div className="text-lg font-black text-white font-mono mt-1">{selectedStation.dep}</div>
          <div className="text-xs text-slate-400 font-semibold mt-0.5">Halt duration: 5 minutes</div>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Platform & Track</div>
          <div className="text-lg font-black text-cyan-400 font-mono mt-1">Platform #{selectedStation.platform}</div>
          <div className="text-xs text-slate-400 font-semibold mt-0.5">Main High-Speed Loop 1</div>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Corridor Velocity</div>
          <div className="text-lg font-black text-amber-400 font-mono mt-1">{selectedStation.speed}</div>
          <div className="text-xs text-emerald-400 font-semibold mt-0.5">KAVACH Anti-Collision Active</div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDStationMap;
