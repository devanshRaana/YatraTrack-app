import React, { useState, useEffect } from 'react';
import { Trip } from '../types';
import Map from './Map';
import useGeolocation from '../hooks/useGeolocation';
import { ShieldExclamationIcon } from './icons/ShieldExclamationIcon';

interface CurrentTripProps {
  trip: Trip;
  onEndTrip: (path: { lat: number; lng: number; }[]) => void;
  onEmergencyClick: () => void;
}

const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

const CurrentTrip: React.FC<CurrentTripProps> = ({ trip, onEndTrip, onEmergencyClick }) => {
  const { position, error: locationError, distance, speed } = useGeolocation();
  const [duration, setDuration] = useState(0);
  const [path, setPath] = useState<{lat: number, lng: number}[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(d => d + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    if (position) {
      setPath(prevPath => [...prevPath, { lat: position.latitude, lng: position.longitude }]);
    }
  }, [position]);

  return (
    <div className="flex flex-col h-full p-4 space-y-4 bg-gray-200/20 dark:bg-gray-800/20 backdrop-blur-md animate-fade-in text-gray-900 dark:text-white">
        <header className="text-center">
            <h1 className="text-xl font-bold tracking-wider text-teal-700 dark:text-teal-200">{trip.origin}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">to</p>
            <h1 className="text-xl font-bold tracking-wider text-teal-700 dark:text-teal-200">{trip.destination}</h1>
        </header>

        {locationError && (
             <div className="bg-red-500/20 border border-red-500 text-red-800 dark:text-red-200 px-4 py-2 rounded-lg text-center text-sm" role="alert">
                <strong className="font-bold">Location Error: </strong>
                <span>{locationError}</span>
            </div>
        )}

        <div className="flex-grow rounded-2xl overflow-hidden shadow-lg my-2">
            <Map apiKeyError/>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-black/10 dark:bg-black/20 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">DISTANCE</p>
                <p className="text-2xl font-bold">{distance.toFixed(2)} <span className="text-base font-normal">km</span></p>
            </div>
            <div className="bg-black/10 dark:bg-black/20 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">DURATION</p>
                <p className="text-2xl font-bold">{formatDuration(duration)}</p>
            </div>
            <div className="bg-black/10 dark:bg-black/20 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">SPEED</p>
                <p className="text-2xl font-bold">{speed.toFixed(0)} <span className="text-base font-normal">km/h</span></p>
            </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-4">
            <button onClick={onEmergencyClick} className="w-full bg-red-600/80 text-white font-bold py-3 px-4 rounded-xl hover:bg-red-600 transition-colors duration-300 shadow-lg flex items-center justify-center gap-2">
                <ShieldExclamationIcon className="w-6 h-6" />
                Emergency
            </button>
            <button onClick={() => onEndTrip(path)} className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-teal-700 transition-colors duration-300 shadow-lg">
                End Trip
            </button>
        </div>
    </div>
  );
};

export default CurrentTrip;