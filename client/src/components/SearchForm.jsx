import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, ArrowRightLeft } from 'lucide-react';
import { trainService } from '../services/trainService';

const SearchForm = ({ initialFrom = '', initialTo = '', initialDate = '', isCompact = false }) => {
  const navigate = useNavigate();
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    // Fetch unique stations for autocompletion
    const fetchStations = async () => {
      try {
        const data = await trainService.getAllStations();
        setStations(data);
      } catch (err) {
        console.error('Failed to load station list for search autocomplete:', err);
      }
    };
    fetchStations();
  }, []);

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (from.trim()) params.append('from', from.trim());
    if (to.trim()) params.append('to', to.trim());
    if (date) params.append('date', date);

    navigate(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 md:p-7 ${
        isCompact ? 'max-w-4xl mx-auto' : 'w-full'
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* From Station */}
        <div className="md:col-span-4 relative">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            From Station
          </label>
          <div className="relative">
            <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              list="from-stations-list"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="e.g. Vijayawada, Delhi, Mumbai"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 text-sm font-medium transition-all"
            />
            <datalist id="from-stations-list">
              {stations.map((s, idx) => (
                <option key={`from-${idx}`} value={s.name}>
                  {s.name} ({s.code})
                </option>
              ))}
            </datalist>
          </div>
        </div>

        {/* Swap Button */}
        <div className="md:col-span-1 flex justify-center -my-2 md:my-0">
          <button
            type="button"
            onClick={handleSwap}
            title="Swap Source & Destination"
            className="p-2.5 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors border border-slate-200 hover:border-blue-300"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* To Station */}
        <div className="md:col-span-4 relative">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            To Station
          </label>
          <div className="relative">
            <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              list="to-stations-list"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="e.g. Chennai, Secunderabad, Bhopal"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 text-sm font-medium transition-all"
            />
            <datalist id="to-stations-list">
              {stations.map((s, idx) => (
                <option key={`to-${idx}`} value={s.name}>
                  {s.name} ({s.code})
                </option>
              ))}
            </datalist>
          </div>
        </div>

        {/* Date */}
        <div className="md:col-span-3 relative">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Journey Date
          </label>
          <div className="relative">
            <Calendar className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 text-sm font-medium transition-all"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          className="w-full md:w-auto px-8 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Search className="w-5 h-5" />
          <span>SEARCH TRAINS</span>
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
