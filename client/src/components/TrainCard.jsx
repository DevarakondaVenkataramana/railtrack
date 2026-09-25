import React from 'react';
import { Link } from 'react-router-dom';
import { Train, Clock, ArrowRight, Calendar, MapPin } from 'lucide-react';
import DelayBadge from './DelayBadge';

const TrainCard = ({ train, onStartJourney }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-5 md:p-6 flex flex-col justify-between">
      {/* Top Header: Train Info & Delay Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded">
              #{train.trainNumber}
            </span>
            <h3 className="text-lg md:text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors">
              <Link to={`/trains/${train._id}`}>{train.trainName}</Link>
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Runs on: {train.runningDays?.join(', ') || 'All Days'}</span>
          </div>
        </div>

        <DelayBadge delayMinutes={train.delayMinutes} status={train.status} />
      </div>

      {/* Middle: Source, Duration, Destination */}
      <div className="py-5 grid grid-cols-3 items-center text-center gap-2">
        {/* Source */}
        <div className="text-left">
          <span className="text-xs text-slate-400 font-medium">Source</span>
          <div className="text-base md:text-lg font-bold text-slate-800 truncate">
            {train.source}
          </div>
          <div className="text-sm font-semibold text-blue-600">
            {train.departureTime}
          </div>
        </div>

        {/* Duration Indicator */}
        <div className="flex flex-col items-center justify-center">
          <span className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {train.duration}
          </span>
          <div className="w-full flex items-center justify-center gap-1">
            <div className="h-[2px] w-full bg-slate-200 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-600" />
            </div>
            <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />
          </div>
          <span className="text-[11px] text-slate-400 mt-1">
            {train.stations ? `${train.stations.length} Stops` : 'Direct'}
          </span>
        </div>

        {/* Destination */}
        <div className="text-right">
          <span className="text-xs text-slate-400 font-medium">Destination</span>
          <div className="text-base md:text-lg font-bold text-slate-800 truncate">
            {train.destination}
          </div>
          <div className="text-sm font-semibold text-blue-600">
            {train.arrivalTime}
          </div>
        </div>
      </div>

      {/* Current Live Station Pill */}
      {train.currentStation && (
        <div className="bg-slate-50 border border-slate-150 rounded-lg p-2.5 mb-4 text-xs flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            Current Station: <strong className="text-slate-800">{train.currentStation}</strong>
          </span>
          {train.nextStation && (
            <span className="text-slate-500 hidden sm:inline">
              Next: <strong>{train.nextStation}</strong>
            </span>
          )}
        </div>
      )}

      {/* Bottom Actions */}
      <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5">
        {onStartJourney && (
          <button
            onClick={() => onStartJourney(train)}
            className="px-3.5 py-2 text-xs md:text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
          >
            Start Journey
          </button>
        )}
        <Link
          to={`/trains/${train._id}`}
          className="px-4 py-2 text-xs md:text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5"
        >
          View Train & Route
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default TrainCard;
