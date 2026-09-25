import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Save, Train, MapPin } from 'lucide-react';
import { trainService } from '../services/trainService';
import LoadingSpinner from '../components/LoadingSpinner';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const AddTrain = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Train metadata
  const [trainNumber, setTrainNumber] = useState('');
  const [trainName, setTrainName] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('06:00 AM');
  const [arrivalTime, setArrivalTime] = useState('01:00 PM');
  const [duration, setDuration] = useState('7h 00m');
  const [runningDays, setRunningDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

  // Dynamic stations
  const [stations, setStations] = useState([
    {
      stationName: '',
      stationCode: '',
      arrivalTime: 'Source',
      departureTime: '06:00 AM',
      platform: '1',
      stopDuration: 'Source',
      actualArrival: 'Source',
      actualDeparture: '06:00 AM',
      delayMinutes: 0
    },
    {
      stationName: '',
      stationCode: '',
      arrivalTime: '01:00 PM',
      departureTime: 'Destination',
      platform: '2',
      stopDuration: 'Destination',
      actualArrival: '01:00 PM',
      actualDeparture: 'Destination',
      delayMinutes: 0
    }
  ]);

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

    if (stations.some((s) => !s.stationName || !s.stationCode)) {
      return setError('All stations must have a Station Name and Station Code.');
    }

    setLoading(true);
    try {
      await trainService.createTrain({
        trainNumber: trainNumber.trim(),
        trainName: trainName.trim(),
        source: source.trim(),
        destination: destination.trim(),
        departureTime,
        arrivalTime,
        duration,
        runningDays,
        stations,
        currentStation: stations[0]?.stationName || source,
        nextStation: stations[1]?.stationName || destination,
        status: 'On Time'
      });

      navigate('/admin/trains');
    } catch (err) {
      console.error('Failed to create train:', err);
      setError(err.response?.data?.message || 'Error creating train. Check fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <Link to="/admin/trains" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Manage Trains
          </Link>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Add New Train Route</h1>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Train Core Information */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Train className="w-5 h-5 text-blue-600" /> Train General Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Train Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 12701"
                value={trainNumber}
                onChange={(e) => setTrainNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Train Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Circar Express"
                value={trainName}
                onChange={(e) => setTrainName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Source Station *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Vijayawada"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Destination Station *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Chennai Central"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Departure Time
              </label>
              <input
                type="text"
                placeholder="06:00 AM"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Arrival Time
              </label>
              <input
                type="text"
                placeholder="01:00 PM"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Total Journey Duration
              </label>
              <input
                type="text"
                placeholder="7h 00m"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 outline-none"
              />
            </div>
          </div>

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

        {/* Dynamic Station Timeline Builder */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" /> Route Stations & Halts ({stations.length})
              </h2>
              <p className="text-xs text-slate-500">
                Configure station order, platform numbers, arrival, and departure timings.
              </p>
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
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                    Stop #{idx + 1} {idx === 0 ? '(Origin)' : idx === stations.length - 1 ? '(Terminus)' : ''}
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
                      placeholder="e.g. Ongole"
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
                      placeholder="OGL"
                      value={st.stationCode}
                      onChange={(e) => handleStationChange(idx, 'stationCode', e.target.value.toUpperCase())}
                      className="w-full p-2 bg-white rounded-lg border border-slate-200 text-xs font-medium uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Arrival Time
                    </label>
                    <input
                      type="text"
                      placeholder="08:30 AM"
                      value={st.arrivalTime}
                      onChange={(e) => handleStationChange(idx, 'arrivalTime', e.target.value)}
                      className="w-full p-2 bg-white rounded-lg border border-slate-200 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Departure Time
                    </label>
                    <input
                      type="text"
                      placeholder="08:35 AM"
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
                      placeholder="1"
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

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Link
            to="/admin/trains"
            className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs md:text-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-xs md:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Train...' : 'SAVE TRAIN'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTrain;
