import React, { useMemo } from 'react';
import { AppSettings, Theme, Trip, TransportMode } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { ThemeIcon } from './icons/ThemeIcon';
import { LocationOnIcon } from './icons/LocationOnIcon';
import { UserIcon } from './icons/UserIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { CompassIcon } from './icons/CompassIcon';
import { MapIcon } from './icons/MapIcon';
import { CarIcon } from './icons/CarIcon';

interface SettingsProps {
  settings: AppSettings;
  onSettingsChange: (newSettings: Partial<AppSettings>) => void;
  onBack: () => void;
  onLogout: () => void;
  trips: Trip[];
}

// Haversine distance function to calculate distance between two lat/lng points
const haversineDistance = (
    pos1: { lat: number, lng: number }, 
    pos2: { lat: number, lng: number }
): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (pos2.lat - pos1.lat) * (Math.PI / 180);
    const dLon = (pos2.lng - pos1.lng) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(pos1.lat * (Math.PI / 180)) *
        Math.cos(pos2.lat * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
};


const SettingsToggle: React.FC<{ label: string; enabled: boolean; onToggle: (enabled: boolean) => void; icon: React.ReactNode; }> = ({ label, enabled, onToggle, icon }) => (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
        <div className="flex items-center gap-4">
            <span className="text-teal-600 dark:text-teal-400">{icon}</span>
            <span className="text-gray-700 dark:text-gray-300">{label}</span>
        </div>
        <button onClick={() => onToggle(!enabled)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; unit?: string }> = ({ icon, label, value, unit }) => (
    <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl flex items-center gap-4">
        <div className="text-teal-600 dark:text-teal-300 bg-teal-500/10 p-2 rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="font-bold text-lg text-gray-800 dark:text-white">
                {value} <span className="text-sm font-normal">{unit}</span>
            </p>
        </div>
    </div>
);

const Settings: React.FC<SettingsProps> = ({ settings, onSettingsChange, onBack, onLogout, trips }) => {
    
    const travelStats = useMemo(() => {
        if (!trips || trips.length === 0) {
            return { totalDistance: 0, favoriteMode: 'N/A' };
        }

        const totalDistance = trips.reduce((total, trip) => {
            let tripDistance = 0;
            if (trip.path && trip.path.length > 1) {
                for (let i = 0; i < trip.path.length - 1; i++) {
                    tripDistance += haversineDistance(trip.path[i], trip.path[i + 1]);
                }
            }
            return total + tripDistance;
        }, 0);

        const modeCounts = trips.reduce((acc, trip) => {
            acc[trip.mode] = (acc[trip.mode] || 0) + 1;
            return acc;
        }, {} as Record<TransportMode, number>);

        const favoriteMode = Object.keys(modeCounts).length > 0
            ? Object.entries(modeCounts).sort((a, b) => b[1] - a[1])[0][0]
            : 'N/A';
            
        return {
            totalDistance: Math.round(totalDistance),
            favoriteMode
        };

    }, [trips]);


  return (
    <div className="animate-fade-in p-6 h-full flex flex-col">
        <header className="relative flex items-center justify-center mb-6">
            <button onClick={onBack} className="absolute left-0 text-teal-600 dark:text-teal-300 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="Go back">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-semibold text-teal-700 dark:text-teal-200">Profile & Settings</h2>
        </header>

        <div className="flex-grow overflow-y-auto scrollbar-hide space-y-6">
            {/* Profile Header */}
            <div className="flex flex-col items-center justify-center text-center p-6 bg-black/5 dark:bg-white/10 rounded-2xl shadow-lg">
                <div className="w-24 h-24 rounded-full bg-teal-500/20 flex items-center justify-center mb-4 ring-4 ring-teal-500/30">
                    <UserIcon className="w-16 h-16 text-teal-600 dark:text-teal-300" />
                </div>
                <h3 className="text-2xl font-bold text-teal-700 dark:text-teal-200">Wanderer</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Explorer of new horizons</p>
            </div>

             {/* Travel Stats */}
            <div className="bg-black/5 dark:bg-white/10 p-4 rounded-2xl shadow-lg">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">TRAVEL STATS</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <StatCard icon={<CompassIcon className="w-6 h-6"/>} label="Total Distance" value={travelStats.totalDistance} unit="km" />
                    <StatCard icon={<MapIcon className="w-6 h-6"/>} label="Total Trips" value={trips.length} />
                    <StatCard icon={<CarIcon className="w-6 h-6"/>} label="Favorite Mode" value={travelStats.favoriteMode} />
                </div>
            </div>

            {/* Appearance Section */}
            <div className="bg-black/5 dark:bg-white/10 p-4 rounded-2xl shadow-lg">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">APPEARANCE</h3>
                <div className="flex items-center justify-between p-3 rounded-lg">
                    <div className="flex items-center gap-4">
                        <span className="text-teal-600 dark:text-teal-400"><ThemeIcon className="w-5 h-5" /></span>
                        <span className="text-gray-700 dark:text-gray-300">Theme</span>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-300 dark:bg-gray-700 p-1 rounded-lg text-xs">
                        {(Object.values(Theme)).map(theme => (
                            <button 
                                key={theme} 
                                onClick={() => onSettingsChange({ theme })}
                                className={`px-3 py-1 rounded-md capitalize transition-colors ${settings.theme === theme ? 'bg-white dark:bg-gray-500 text-gray-900 dark:text-white shadow' : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-black/20'}`}
                            >
                                {theme}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Privacy Section */}
            <div className="bg-black/5 dark:bg-white/10 p-4 rounded-2xl shadow-lg">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">PRIVACY & DATA</h3>
                <SettingsToggle 
                    label="Enable Location Tracking"
                    enabled={settings.locationEnabled}
                    onToggle={(value) => onSettingsChange({ locationEnabled: value })}
                    icon={<LocationOnIcon className="w-5 h-5" />}
                />
            </div>
        </div>
        
        <div className="mt-auto pt-4 flex-shrink-0">
            <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 bg-red-600/10 text-red-500 dark:text-red-400 font-bold py-3 px-4 rounded-lg hover:bg-red-600/20 hover:text-red-600 dark:hover:text-red-300 transition-colors duration-300">
                <LogoutIcon className="w-5 h-5" />
                Logout & Clear Data
            </button>
        </div>
    </div>
  );
};

export default Settings;