import React from 'react';
import { CheckCircle2, Navigation, Circle, Clock, ArrowDown } from 'lucide-react';
import StationCard from './StationCard';

const StationTimeline = ({ stations = [], currentStation = '', nextStation = '' }) => {
  if (!stations || stations.length === 0) {
    return (
      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-500">
        No station schedule available for this route.
      </div>
    );
  }

  // Find index of current station
  const currentIdx = stations.findIndex(
    (s) => s.stationName.toLowerCase().trim() === (currentStation || '').toLowerCase().trim()
  );

  // Find index of next station
  const nextIdx = stations.findIndex(
    (s) => s.stationName.toLowerCase().trim() === (nextStation || '').toLowerCase().trim()
  );

  const getStationState = (index) => {
    if (currentIdx !== -1) {
      if (index < currentIdx) return 'completed';
      if (index === currentIdx) return 'current';
      if (index === currentIdx + 1 || index === nextIdx) return 'next';
      return 'upcoming';
    }
    // Fallback if currentStation not matched:
    return index === 0 ? 'current' : 'upcoming';
  };

  return (
    <div className="w-full">
      {/* Legend & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-6 bg-slate-50 rounded-xl border border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-800">Station-Wise Route Timeline</h3>
          <p className="text-xs text-slate-500">
            Interactive chronological breakdown of stops, platform numbers, and timing delays.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-medium">
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed
          </span>
          <span className="flex items-center gap-1 text-blue-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" /> Current
          </span>
          <span className="flex items-center gap-1 text-amber-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Next Stop
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Upcoming
          </span>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 md:pl-10 space-y-4">
        {stations.map((station, index) => {
          const state = getStationState(index);
          const isFirst = index === 0;
          const isLast = index === stations.length - 1;

          // Node styling based on state
          let NodeIcon = Circle;
          let nodeBg = 'bg-white border-slate-300 text-slate-400';
          let lineBg = 'bg-slate-200';

          if (state === 'completed') {
            NodeIcon = CheckCircle2;
            nodeBg = 'bg-emerald-500 border-emerald-600 text-white';
            lineBg = 'bg-emerald-500';
          } else if (state === 'current') {
            NodeIcon = Navigation;
            nodeBg = 'bg-blue-600 border-blue-700 text-white shadow-lg shadow-blue-500/50 scale-110';
            lineBg = 'bg-blue-300';
          } else if (state === 'next') {
            NodeIcon = Circle;
            nodeBg = 'bg-amber-500 border-amber-600 text-white';
            lineBg = 'bg-slate-200';
          }

          return (
            <div key={station._id || index} className="relative group">
              {/* Connecting vertical line to next item */}
              {!isLast && (
                <div
                  className={`absolute left-[-19px] md:left-[-27px] top-8 w-1 h-[calc(100%+16px)] -translate-x-1/2 rounded-full transition-colors duration-300 ${
                    state === 'completed' ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}

              {/* Node Icon on Timeline */}
              <div
                className={`absolute left-[-19px] md:left-[-27px] top-4 -translate-x-1/2 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 ${nodeBg}`}
              >
                <NodeIcon className="w-4 h-4" />
              </div>

              {/* Station Card Content */}
              <div className="ml-2">
                <StationCard
                  station={station}
                  state={state}
                  isFirst={isFirst}
                  isLast={isLast}
                />
              </div>

              {/* Arrow Connector Indicator for aesthetics */}
              {!isLast && (
                <div className="flex justify-center my-1 text-slate-300">
                  <ArrowDown className="w-4 h-4 opacity-40" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center text-xs text-slate-400 italic">
        * Demo tracking data. Actual railway schedules may vary.
      </div>
    </div>
  );
};

export default StationTimeline;
