import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Save, Train, MapPin } from 'lucide-react';
import { trainService } from '../services/trainService';
import LoadingSpinner from '../components/LoadingSpinner';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const EditTrain = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [trainNumber, setTrainNumber] = useState('');
  const [trainName, setTrainName] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [duration, setDuration] = useState('');
  const [runningDays, setRunningDays] = useState([]);
  const [currentStation, setCurrentStation] = useState('');
  const [nextStation, setNextStation] = useState('');
  const [delayMinutes, setDelayMinutes] = useState(0);
  const [status, setStatus] = useState('On Time');
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchTrain = async () => {
      try {
        const data = await trainService.getTrainById(id);
        setTrainNumber(data.trainNumber);
        setTrainName(data.trainName);
        setSource(data.source);
        setDestination(data.destination);
        setDepartureTime(data.departureTime);
        setArrivalTime(data.arrivalTime);
        setDuration(data.duration);
        setRunningDays(data.runningDays || []);
        setCurrentStation(data.currentStation || '');
        setNextStation(data.nextStation || '');
        setDelayMinutes(data.delayMinutes || 0);
        setStatus(data.status || 'On Time');
        setStations(data.stations || []);
      } catch (err) {
        console.error('Failed to load train:', err);
        setError('Error loading train data.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrain();
  }, [id]);

  const toggleDay = (day) => {
    if (runningDays.includes(day)) {
      setRunningDays(runningDays.filter((d) => d !== day));
    } else {
      setRunningDays([...runningDays, day]);
    }
  };

  const handleStationChange = (index, field, value) => {
    const updated = [...stations];
    updated[index][field] = value;
    setStations(updated);
  };

  const addStation = () => {
    setStations([
      ...stations,
      {
        stationName: '',
        stationCode: '',
        arrivalTime: '10:00 AM',
        departureTime: '10:05 AM',
        platform: '1',
        stopDuration: '5 mins',
        actualArrival: '',
        actualDeparture: '',
        delayMinutes: 0
      }
    ]);
  };

  const removeStation = (index) => {
    if (stations.length <= 2) {
      alert('Train route must have at least 2 stations (source and destination).');
      return;
    }
    setStations(stations.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!trainNumber || !trainName || !source || !destination) {
      return setError('Please fill all required train information fields.');
    }

    setSaving(true);
    try {
      await trainService.updateTrain(id, {
        trainNumber: trainNumber.trim(),
        trainName: trainName.trim(),
        source: source.trim(),
        destination: destination.trim(),
        departureTime,
        arrivalTime,
        duration,
        runningDays,
        currentStation,
        nextStation,
        delayMinutes: Number(delayMinutes),
        status,
        stations
      });

      navigate('/admin/trains');
    } catch (err) {
      console.error('Failed to update train:', err);
      setError(err.response?.data?.message || 'Error updating train.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Loading train for editing..." size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <Link to="/admin/trains" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Manage Trains
          </Link>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Edit Train: #{trainNumber} – {trainName}
          </h1>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Train Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Train className="w-5 h-5 text-blue-600" /> General Train Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Train Number *
              </label>
              <input
                type="text"
                required
                value={trainNumber}
                onChange={(e) => setTrainNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Train Name *
              </label>
              <input
                type="text"
                required
                value={trainName}
                onChange={(e) => setTrainName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Source
              </label>
              <input
                type="text"
                required
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Destination
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Departure Time
              </label>
              <input
                type="text"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Arrival Time
              </label>
              <input
                type="text"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Total Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>

          {/* Running Days */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Operating Days
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  type="button"
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    runningDays.includes(day)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Status Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
            Live Tracking State
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Current Station
              </label>
              <input
                type="text"
                value={currentStation}
                onChange={(e) => setCurrentStation(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Next Station
              </label>
              <input
                type="text"
                value={nextStation}
                onChange={(e) => setNextStation(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Delay (Minutes)
              </label>
              <input
                type="number"
                min="0"
                value={delayMinutes}
                onChange={(e) => setDelayMinutes(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Train Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 text-xs font-medium"
              >
                <option value="On Time">On Time</option>
                <option value="Delayed">Delayed</option>
                <option value="Arrived">Arrived</option>
                <option value="Departed">Departed</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Stations */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" /> Route Stations ({stations.length})
              </h2>
            </div>

            <button
              type="button"
              onClick={addStation}
              className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> ADD STATION
            </button>
          </div>

          <div className="space-y-4">
            {stations.map((st, idx) => (
              <div
                key={st._id || idx}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                    Stop #{idx + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeStation(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Remove Station"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  <div className="col-span-2 md:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Station Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={st.stationName}
                      onChange={(e) => handleStationChange(idx, 'stationName', e.target.value)}
                      className="w-full p-2 bg-white rounded-lg border border-slate-200 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={st.stationCode}
                      onChange={(e) => handleStationChange(idx, 'stationCode', e.target.value.toUpperCase())}
                      className="w-full p-2 bg-white rounded-lg border border-slate-200 text-xs font-medium uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Arrival
                    </label>
                    <input
                      type="text"
                      value={st.arrivalTime}
                      onChange={(e) => handleStationChange(idx, 'arrivalTime', e.target.value)}
                      className="w-full p-2 bg-white rounded-lg border border-slate-200 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Departure
                    </label>
                    <input
                      type="text"
                      value={st.departureTime}
                      onChange={(e) => handleStationChange(idx, 'departureTime', e.target.value)}
                      className="w-full p-2 bg-white rounded-lg border border-slate-200 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Platform #
                    </label>
                    <input
                      type="text"
                      value={st.platform}
                      onChange={(e) => handleStationChange(idx, 'platform', e.target.value)}
                      className="w-full p-2 bg-white rounded-lg border border-slate-200 text-xs font-medium"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Link
            to="/admin/trains"
            className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs md:text-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-xs md:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'SAVE CHANGES'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTrain;
