import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Train,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Activity,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { trainService } from '../services/trainService';
import DelayBadge from '../components/DelayBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const ManageTrains = () => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState('');

  const loadTrains = async () => {
    try {
      const data = await trainService.getAllTrains();
      setTrains(data);
    } catch (err) {
      console.error('Error fetching trains:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrains();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${name}?`)) return;
    try {
      await trainService.deleteTrain(id);
      setFeedback(`Train ${name} deleted successfully.`);
      setTimeout(() => setFeedback(''), 4000);
      loadTrains();
    } catch (err) {
      console.error('Failed to delete train:', err);
    }
  };

  const filteredTrains = trains.filter(
    (t) =>
      t.trainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.trainNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/admin/dashboard" className="text-xs font-semibold text-blue-600 hover:underline">
              &larr; Admin Dashboard
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Train Fleet Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Add new train schedules, edit stations, and manage railway routes.
          </p>
        </div>

        <Link
          to="/admin/trains/add"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs md:text-sm font-bold shadow-sm transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Train</span>
        </Link>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold">
          {feedback}
        </div>
      )}

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by train name, number, or city..."
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-xs md:text-sm text-slate-800 focus:outline-none focus:border-blue-600"
        />
      </div>

      {/* Table / List */}
      {loading ? (
        <LoadingSpinner message="Loading trains..." size="large" />
      ) : filteredTrains.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
          No trains matched your search query.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Train No. & Name</th>
                  <th className="py-3 px-4">Origin & Terminus</th>
                  <th className="py-3 px-4">Timings</th>
                  <th className="py-3 px-4">Stops</th>
                  <th className="py-3 px-4">Delay & Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs md:text-sm">
                {filteredTrains.map((train) => (
                  <tr key={train._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-bold text-blue-700 block">#{train.trainNumber}</span>
                      <span className="font-semibold text-slate-900">{train.trainName}</span>
                    </td>

                    <td className="py-4 px-4 text-slate-700 font-medium">
                      {train.source} &rarr; {train.destination}
                    </td>

                    <td className="py-4 px-4 text-slate-600">
                      {train.departureTime} - {train.arrivalTime} ({train.duration})
                    </td>

                    <td className="py-4 px-4">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-semibold text-slate-700">
                        {train.stations?.length || 0} Stations
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <DelayBadge delayMinutes={train.delayMinutes} status={train.status} size="small" />
                    </td>

                    <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                      <Link
                        to={`/admin/trains/edit/${train._id}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors inline-flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Link>

                      <button
                        onClick={() => handleDelete(train._id, train.trainName)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors inline-block cursor-pointer"
                        title="Delete Train"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTrains;
