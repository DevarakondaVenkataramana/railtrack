import React from 'react';
import { Clock, AlertTriangle, CheckCircle, Navigation } from 'lucide-react';

const DelayBadge = ({ delayMinutes = 0, status = 'On Time', size = 'default' }) => {
  const isDelayed = delayMinutes > 0 || status === 'Delayed';
  const isSevere = delayMinutes > 15;

  const sizeClass = size === 'small' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs md:text-sm font-semibold';

  if (status === 'Completed') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 font-medium ${sizeClass}`}>
        <CheckCircle className="w-3.5 h-3.5 text-slate-500" />
        Completed
      </span>
    );
  }

  if (isDelayed) {
    const bgClass = isSevere
      ? 'bg-rose-50 text-rose-700 border-rose-200'
      : 'bg-amber-50 text-amber-700 border-amber-200';
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border ${bgClass} ${sizeClass}`}>
        <AlertTriangle className={`w-3.5 h-3.5 ${isSevere ? 'text-rose-500' : 'text-amber-500'}`} />
        Delayed {delayMinutes > 0 ? `+${delayMinutes}m` : ''}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClass}`}>
      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
      {status === 'Departed' ? 'Departed' : status === 'Arrived' ? 'Arrived' : 'On Time'}
    </span>
  );
};

export default DelayBadge;
