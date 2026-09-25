import React from 'react';
import { Navigation, Clock, MapPin, Flag } from 'lucide-react';

const ProgressBar = ({
  currentStation = '',
  nextStation = '',
  destination = '',
  progressPercent = 0,
  delayMinutes = 0,
  completedCount = 0,
  totalCount = 0,
  estimatedArrival = '',
}) => {
  const clampedProgress = Math.min(Math.max(Math.round(progressPercent), 0), 100);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6 my-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold tracking-wider uppercase text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
            Live Journey Status
          </span>
          <h3 className="text-lg md:text-xl font-bold text-slate-900 mt-2 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-blue-600 animate-pulse" />
            Currently at: <span className="text-blue-700">{currentStation || 'Departing Soon'}</span>
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {delayMinutes > 0 ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold">
              <Clock className="w-4 h-4 text-rose-500" />
              <span>Delay: +{delayMinutes} mins</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span>Running On Time</span>
            </div>
          )}

          {estimatedArrival && (
            <div className="text-sm text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              Est. Arrival: <strong className="text-slate-800">{estimatedArrival}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span>Journey Progress</span>
          <span className="text-blue-700 font-bold text-sm">{clampedProgress}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
      </div>

      {/* Info Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-3">
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <div className="text-xs text-slate-400 font-medium">Current Stop</div>
          <div className="text-sm font-bold text-slate-800 truncate">{currentStation || 'Source'}</div>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <div className="text-xs text-slate-400 font-medium">Next Stop</div>
          <div className="text-sm font-bold text-blue-700 truncate">{nextStation || 'In Transit'}</div>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <div className="text-xs text-slate-400 font-medium">Destination</div>
          <div className="text-sm font-bold text-slate-800 truncate">{destination}</div>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <div className="text-xs text-slate-400 font-medium">Stations Covered</div>
          <div className="text-sm font-bold text-slate-800">
            {completedCount} <span className="text-xs font-normal text-slate-400">/ {totalCount} total</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
