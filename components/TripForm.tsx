import React, { useState, useEffect } from 'react';
import { Trip, TransportMode } from '../types';
import { suggestActivity } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import RouteAnalytics from './RouteAnalytics';

interface TripFormProps {
  onStartTrip: (trip: Omit<Trip, 'id' | 'path'>) => void;
  onUpdateTrip: (trip: Trip) => void;
  onCancel: () => void;
  tripToEdit?: Trip | null;
  allTrips: Trip[];
}

const TripForm: React.FC<TripFormProps> = ({ onStartTrip, onUpdateTrip, onCancel, tripToEdit, allTrips }) => {
  const isEditMode = !!tripToEdit;
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 16));
  const [mode, setMode] = useState<TransportMode>(TransportMode.CAR);
  const [activity, setActivity] = useState('');
  const [accompanying, setAccompanying] = useState(0);

  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [debouncedOrigin, setDebouncedOrigin] = useState('');
  const [debouncedDestination, setDebouncedDestination] = useState('');

  useEffect(() => {
    if (tripToEdit) {
      setOrigin(tripToEdit.origin);
      setDestination(tripToEdit.destination);
      setDateTime(new Date(tripToEdit.dateTime).toISOString().slice(0, 16));
      setMode(tripToEdit.mode);
      setActivity(tripToEdit.activity);
      setAccompanying(tripToEdit.accompanying);
      setError(null);
      setSuggestions([]);
    } else {
      setOrigin('');
      setDestination('');
      setDateTime(new Date().toISOString().slice(0, 16));
      setMode(TransportMode.CAR);
      setActivity('');
      setAccompanying(0);
      setError(null);
      setSuggestions([]);
    }
  }, [tripToEdit]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedOrigin(origin);
      setDebouncedDestination(destination);
    }, 500); // 500ms delay to avoid flashing while typing

    return () => {
      clearTimeout(handler);
    };
  }, [origin, destination]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !activity) {
        setError("Please fill in Origin, Destination, and Activity.");
        return;
    }
    setError(null);
    if (isEditMode && tripToEdit) {
      onUpdateTrip({
        ...tripToEdit,
        origin,
        destination,
        dateTime,
        mode,
        activity,
        accompanying,
      });
    } else {
      onStartTrip({ origin, destination, dateTime, mode, activity, accompanying });
    }
  };
  
  const handleSuggestActivity = async () => {
    if (!origin || !destination) {
        setError("Please enter an origin and destination first.");
        return;
    }
    setError(null);
    setIsSuggesting(true);
    setSuggestions([]);
    const result = await suggestActivity(origin, destination);
    setSuggestions(result);
    setIsSuggesting(false);
  };

  return (
    <div className="animate-fade-in p-6">
        <div className="relative flex items-center justify-center mb-6">
            <button onClick={onCancel} className="absolute left-0 text-teal-600 dark:text-teal-300 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="Go back">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-semibold text-teal-700 dark:text-teal-200">{isEditMode ? 'Edit Journey' : 'Start a New Journey'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="origin" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Origin</label>
                <input type="text" id="origin" value={origin} onChange={e => setOrigin(e.target.value)} className="mt-1 block w-full bg-black/5 dark:bg-white/10 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 dark:text-white" required />
            </div>
            <div>
                <label htmlFor="destination" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Destination</label>
                <input type="text" id="destination" value={destination} onChange={e => setDestination(e.target.value)} className="mt-1 block w-full bg-black/5 dark:bg-white/10 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 dark:text-white" required />
            </div>

            {debouncedOrigin && debouncedDestination && !isEditMode && (
                <RouteAnalytics 
                    origin={debouncedOrigin}
                    destination={debouncedDestination}
                    allTrips={allTrips}
                />
            )}

            <div>
                <label htmlFor="dateTime" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Date & Time</label>
                <input type="datetime-local" id="dateTime" value={dateTime} onChange={e => setDateTime(e.target.value)} className="mt-1 block w-full bg-black/5 dark:bg-white/10 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 dark:text-white" required />
            </div>
            <div>
                <label htmlFor="mode" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Mode of Transport</label>
                <select id="mode" value={mode} onChange={e => setMode(e.target.value as TransportMode)} className="mt-1 block w-full bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 dark:text-white">
                    {Object.values(TransportMode).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="activity" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Trip Activity</label>
                <div className="relative">
                    <input type="text" id="activity" value={activity} onChange={e => setActivity(e.target.value)} className="mt-1 block w-full bg-black/5 dark:bg-white/10 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500 pr-10 text-gray-900 dark:text-white" required />
                    <button type="button" onClick={handleSuggestActivity} disabled={isSuggesting} className="absolute inset-y-0 right-0 flex items-center px-3 text-teal-500 dark:text-teal-300 hover:text-teal-700 dark:hover:text-teal-100 disabled:text-gray-500">
                        {isSuggesting ? <div className="w-5 h-5 border-2 border-t-transparent border-gray-800 dark:border-white rounded-full animate-spin"></div> : <SparklesIcon className="w-5 h-5"/>}
                    </button>
                </div>
                {suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {suggestions.map((s, i) => (
                            <button type="button" key={i} onClick={() => setActivity(s)} className="bg-teal-500/50 dark:bg-teal-600/50 text-xs py-1 px-2 rounded-full hover:bg-teal-500/80 dark:hover:bg-teal-600/80 text-teal-900 dark:text-teal-100">{s}</button>
                        ))}
                    </div>
                )}
            </div>
            <div>
                <label htmlFor="accompanying" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Accompanying Travelers</label>
                <input type="number" id="accompanying" value={accompanying} min="0" onChange={e => setAccompanying(parseInt(e.target.value, 10))} className="mt-1 block w-full bg-black/5 dark:bg-white/10 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 dark:text-white" required />
            </div>
           
            {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}

            <div className="pt-4 space-y-3">
              <button type="submit" className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors duration-300 disabled:bg-gray-500">{isEditMode ? 'Save Changes' : 'Start Trip'}</button>
            </div>
        </form>
    </div>
  );
};

export default TripForm;
