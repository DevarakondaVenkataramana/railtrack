import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Train,
  MapPin,
  Clock,
  Compass,
  AlertTriangle,
  PlusCircle,
  Settings,
  Edit,
  Trash2,
  Activity,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { trainService } from '../services/trainService';
import DelayBadge from '../components/DelayBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status update modal
  const [editingStatusTrain, setEditingStatusTrain] = useState(null);
  const [statusForm, setStatusForm] = useState({
    currentStation: '',
    nextStation: '',
    delayMinutes: 0,
    status: 'On Time',
  });
  const [updateFeedback, setUpdateFeedback] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, trainsData] = await Promise.all([
        adminService.getStats(),
        trainService.getAllTrains(),
      ]);
      setStats(statsData);
      setTrains(trainsData);
    } catch (err) {
      console.error('Admin dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const openStatusModal = (train) => {
    setEditingStatusTrain(train);
    setStatusForm({
      currentStation: train.currentStation || train.source,
      nextStation: train.nextStation || train.destination,
      delayMinutes: train.delayMinutes || 0,
      status: train.status || 'On Time',
    });
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    try {
      await trainService.updateTrainStatus(editingStatusTrain._id, statusForm);
      setUpdateFeedback(`Updated status for #${editingStatusTrain.trainNumber} successfully!`);
      setEditingStatusTrain(null);
      setTimeout(() => setUpdateFeedback(''), 4000);
      loadDashboardData();
    } catch (err) {
      console.error('Failed to update train status:', err);
      alert('Error updating status.');
    }
  };

  const handleDeleteTrain = async (id, trainName) => {
    if (!window.confirm(`Are you sure you want to delete train: ${trainName}?`)) return;
    try {
      await trainService.deleteTrain(id);
      loadDashboardData();
    } catch (err) {
      console.error('Delete train error:', err);
      alert('Error deleting train.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Loading railway administration console..." size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded border border-amber-800/40">
            System Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            Railway Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Monitor real-time network statistics, update train positions, and manage route schedules.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={loadDashboardData}
            title="Refresh Data"
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/admin/trains/add"
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs md:text-sm shadow-md transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Train</span>
          </Link>
          <Link
            to="/admin/trains"
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs md:text-sm shadow-md transition-all flex items-center gap-2"
          >
            <Train className="w-4 h-4" />
            <span>Manage Trains</span>
          </Link>
        </div>
      </div>

      {updateFeedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold">
          {updateFeedback}
        </div>
      )}

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Total Trains
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {stats?.totalTrains ?? trains.length}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Train className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Total Stations
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {stats?.totalStations ?? 0}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Active Journeys
            </span>
            <div className="text-3xl font-black text-emerald-700 mt-1">
              {stats?.activeJourneys ?? 0}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Delayed Trains
            </span>
            <div className="text-3xl font-black text-rose-600 mt-1">
              {stats?.delayedTrains ?? 0}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Train Management & Status Updates Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Active Train Fleet</h2>
            <p className="text-xs text-slate-500">
              Update real-time station locations, delays, and schedule statuses dynamically.
            </p>
          </div>
          <Link
            to="/admin/trains/add"
            className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
          >
            + Create New Train
          </Link>
        </div>

        {/* Responsive Table / Cards */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Train</th>
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Current Stop</th>
                <th className="py-3 px-4">Next Stop</th>
                <th className="py-3 px-4">Status & Delay</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs md:text-sm">
              {trains.map((train) => (
                <tr key={train._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-bold text-blue-700 block">#{train.trainNumber}</span>
                    <span className="font-semibold text-slate-800">{train.trainName}</span>
                  </td>

                  <td className="py-4 px-4 text-slate-600">
                    <div className="font-medium text-slate-800">
                      {train.source} &rarr; {train.destination}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {train.departureTime} - {train.arrivalTime} ({train.stations?.length || 0} stops)
                    </span>
                  </td>

                  <td className="py-4 px-4 font-semibold text-slate-800">
                    {train.currentStation || train.source}
                  </td>

                  <td className="py-4 px-4 font-semibold text-slate-800">
                    {train.nextStation || train.destination}
                  </td>

                  <td className="py-4 px-4">
                    <DelayBadge delayMinutes={train.delayMinutes} status={train.status} size="small" />
                  </td>

                  <td className="py-4 px-4 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => openStatusModal(train)}
                      title="Update Live Location & Delay"
                      className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>Update Status</span>
                    </button>

                    <Link
                      to={`/admin/trains/edit/${train._id}`}
                      title="Edit Train"
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors inline-block"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleDeleteTrain(train._id, train.trainName)}
                      title="Delete Train"
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors inline-block cursor-pointer"
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

      {/* Status Management Modal */}
      {editingStatusTrain && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Update Train Live Status
                </h3>
                <p className="text-xs text-slate-500">
                  #{editingStatusTrain.trainNumber} – {editingStatusTrain.trainName}
                </p>
              </div>
              <button
                onClick={() => setEditingStatusTrain(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Current Station
                </label>
                <select
                  value={statusForm.currentStation}
                  onChange={(e) => setStatusForm({ ...statusForm, currentStation: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800"
                >
                  {editingStatusTrain.stations?.map((s) => (
                    <option key={s._id} value={s.stationName}>
                      {s.stationName} ({s.stationCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Next Station
                </label>
                <select
                  value={statusForm.nextStation}
                  onChange={(e) => setStatusForm({ ...statusForm, nextStation: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800"
                >
                  {editingStatusTrain.stations?.map((s) => (
                    <option key={s._id} value={s.stationName}>
                      {s.stationName} ({s.stationCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Delay (Minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={statusForm.delayMinutes}
                    onChange={(e) => setStatusForm({ ...statusForm, delayMinutes: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Status
                  </label>
                  <select
                    value={statusForm.status}
                    onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800"
                  >
                    <option value="On Time">On Time</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Arrived">Arrived</option>
                    <option value="Departed">Departed</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingStatusTrain(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  Save Live Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
