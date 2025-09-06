import React from 'react';
import { Trip } from '../types';
import TripCard from './TripCard';
import { CompassIcon } from './icons/CompassIcon';
import { AddIcon } from './icons/AddIcon';
import { MapIcon } from './icons/MapIcon';
import { ChecklistIcon } from './icons/ChecklistIcon';

interface DashboardProps {
  trips: Trip[];
  onNewTripClick: () => void;
  onShowMapClick: () => void;
  onChecklistClick: () => void;
  activeTrip: Trip | null;
  onResumeTrip: () => void;
  onEditTrip: (id: string) => void;
  onDeleteTrip: (id: string) => void;
  onTripClick: (id: string) => void;
  isDataLoading: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ trips, onNewTripClick, onShowMapClick, onChecklistClick, activeTrip, onResumeTrip, onEditTrip, onDeleteTrip, onTripClick, isDataLoading }) => {
  if (isDataLoading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-t-transparent border-teal-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <header className="flex items-center justify-between text-center">
        <div className="flex items-center">
            <CompassIcon className="w-7 h-7 mr-2 text-teal-500 dark:text-teal-300" />
            <h1 className="text-2xl font-bold tracking-wider text-teal-700 dark:text-teal-200">YatraTrack</h1>
        </div>
      </header>
      
      {activeTrip && (
          <div className="bg-teal-500/20 border border-teal-500 text-teal-800 dark:text-teal-200 px-4 py-3 rounded-2xl text-center animate-fade-in">
              <p className="font-bold">A trip is currently in progress.</p>
              <button onClick={onResumeTrip} className="text-sm underline hover:text-gray-900 dark:hover:text-white">View Current Trip</button>
          </div>
      )}

      <div className="relative rounded-2xl overflow-hidden shadow-lg h-36">
        <img src="https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?q=80&w=2070&auto=format&fit=crop" alt="Adventure" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4">
          <h2 className="text-white text-2xl font-extrabold">Your Next Adventure</h2>
          <p className="text-gray-200 text-sm">Where to next?</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-sm">
        <button onClick={onNewTripClick} className="bg-gray-200 dark:bg-gray-700/80 text-gray-800 dark:text-white rounded-lg p-2 flex flex-col items-center justify-center gap-1 shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 h-20">
          <AddIcon className="w-5 h-5" />
          <span className="text-center">Add Trip</span>
        </button>
        <button onClick={onChecklistClick} className="bg-gray-200 dark:bg-gray-700/80 text-gray-800 dark:text-white rounded-lg p-2 flex flex-col items-center justify-center gap-1 shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 h-20">
          <ChecklistIcon className="w-5 h-5" />
          <span className="text-center">Checklist</span>
        </button>
        <button onClick={onShowMapClick} className="bg-gray-200 dark:bg-gray-700/80 text-gray-800 dark:text-white rounded-lg p-2 flex flex-col items-center justify-center gap-1 shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 h-20">
          <MapIcon className="w-5 h-5" />
          <span className="text-center">View Map</span>
        </button>
      </div>


      <div>
        <h2 className="text-xl font-semibold text-teal-700 dark:text-teal-200 mb-4">Recent Trips</h2>
        {trips.length > 0 ? (
          <div className="space-y-4">
            {trips.map(trip => <TripCard key={trip.id} trip={trip} onEdit={onEditTrip} onDelete={onDeleteTrip} onClick={onTripClick} />)}
          </div>
        ) : (
          <div className="text-center py-10 px-4 bg-black/5 dark:bg-white/5 rounded-2xl">
            <p className="text-lg text-gray-600 dark:text-gray-300">No journeys recorded yet.</p>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Tap 'Add Trip' to start your journal!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;