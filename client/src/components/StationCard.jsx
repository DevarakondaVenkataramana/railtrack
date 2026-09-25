import React from 'react';
import { Clock, MapPin, CheckCircle, Navigation, ArrowRight } from 'lucide-react';
import DelayBadge from './DelayBadge';

const StationCard = ({ station, state = 'upcoming', isFirst = false, isLast = false }) => {
  const isCurrent = state === 'current';
  const isNext = state === 'next';
  const isCompleted = state === 'completed';

  return (
    <div
      className={`rounded-xl p-4 md:p-5 transition-all duration-300 border ${
        isCurrent
          ? 'bg-blue-50/70 border-blue-400 shadow-md ring-2 ring-blue-500/20'
          : isNext
          ? 'bg-amber-50/50 border-amber-300 shadow-sm'
          : isCompleted
          ? 'bg-slate-50/80 border-slate-200 opacity-90'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <h4 className="text-base md:text-lg font-bold text-slate-900">
            {station.stationName}
          </h4>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
            {station.stationCode}
          </span>

          {isCurrent && (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white animate-pulse">
              <Navigation className="w-3 h-3" /> Train Here
            </span>
          )}

          {isNext && (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-600 text-white">
              Next Stop
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
            Platform <strong>{station.platform || '1'}</strong>
          </span>
          {station.delayMinutes > 0 ? (
            <DelayBadge delayMinutes={station.delayMinutes} status="Delayed" size="small" />
          ) : isCompleted ? (
            <DelayBadge delayMinutes={0} status="Departed" size="small" />
          ) : (
            <DelayBadge delayMinutes={0} status="On Time" size="small" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs md:text-sm">
        {/* Arrival Time */}
        <div className="space-y-0.5">
          <span className="text-slate-400 font-medium block">Arrival</span>
          <div className="font-semibold text-slate-800">
            {station.arrivalTime === 'Source' ? 'Origin' : station.arrivalTime}
          </div>
          {station.actualArrival && station.actualArrival !== station.arrivalTime && station.actualArrival !== 'Source' && (
            <div className="text-[11px] text-rose-600 font-medium">
              Act: {station.actualArrival}
            </div>
          )}
        </div>

        {/* Departure Time */}
        <div className="space-y-0.5">
          <span className="text-slate-400 font-medium block">Departure</span>
          <div className="font-semibold text-slate-800">
            {station.departureTime === 'Destination' ? 'Terminus' : station.departureTime}
          </div>
          {station.actualDeparture && station.actualDeparture !== station.departureTime && station.actualDeparture !== 'Destination' && (
            <div className="text-[11px] text-rose-600 font-medium">
              Act: {station.actualDeparture}
            </div>
          )}
        </div>

        {/* Stop Duration */}
        <div className="space-y-0.5">
          <span className="text-slate-400 font-medium block">Halt Time</span>
          <div className="font-semibold text-slate-700">
            {station.stopDuration || '2 mins'}
          </div>
        </div>

        {/* Delay Status */}
        <div className="space-y-0.5">
          <span className="text-slate-400 font-medium block">Delay</span>
          <div className={`font-semibold ${station.delayMinutes > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {station.delayMinutes > 0 ? `+${station.delayMinutes} mins` : 'No delay'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationCard;
