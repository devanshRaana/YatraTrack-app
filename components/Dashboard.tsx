import React from 'react';
import { Trip } from '../types';
import TripCard from './TripCard';
import { CompassIcon } from './icons/CompassIcon';
import { AddIcon } from './icons/AddIcon';
import { MapIcon } from './icons/MapIcon';
import { SaveIcon } from './icons/SaveIcon';

interface DashboardProps {
  trips: Trip[];
  onNewTripClick: () => void;
  onShowMapClick: () => void;
  onSaveTripsClick: () => void;
  showSavedMessage: boolean;
  activeTrip: Trip | null;
  onResumeTrip: () => void;
  onEditTrip: (id: string) => void;
  onDeleteTrip: (id: string) => void;
  onTripClick: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ trips, onNewTripClick, onShowMapClick, onSaveTripsClick, showSavedMessage, activeTrip, onResumeTrip, onEditTrip, onDeleteTrip, onTripClick }) => {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <header className="flex items-center justify-between text-center">
        <div className="flex items-center">
            <CompassIcon className="w-7 h-7 mr-2 text-teal-300" />
            <h1 className="text-2xl font-bold tracking-wider text-teal-200">My Journeys</h1>
        </div>
      </header>
      
      {activeTrip && (
          <div className="bg-teal-500/20 border border-teal-500 text-teal-200 px-4 py-3 rounded-2xl text-center animate-fade-in">
              <p className="font-bold">A trip is currently in progress.</p>
              <button onClick={onResumeTrip} className="text-sm underline hover:text-white">View Current Trip</button>
          </div>
      )}

      <div className="relative rounded-2xl overflow-hidden shadow-lg h-36">
        <img src="https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?q=80&w=2070&auto=format&fit=crop" alt="Adventure" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4">
          <h2 className="text-white text-2xl font-extrabold">Your Next Adventure</h2>
          <p className="text-gray-200 text-sm">Where to next?</p>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-2 text-sm">
        <button onClick={onNewTripClick} className="flex-1 bg-gray-700/80 text-white rounded-lg px-3 py-2 flex items-center justify-center gap-2 shadow-md hover:bg-gray-600 transition-all duration-300">
          <AddIcon className="w-5 h-5" />
          <span>Add Trip Details</span>
        </button>
        <button onClick={onShowMapClick} className="flex-1 bg-gray-700/80 text-white rounded-lg px-3 py-2 flex items-center justify-center gap-2 shadow-md hover:bg-gray-600 transition-all duration-300">
          <MapIcon className="w-5 h-5" />
          <span>Show Trip on Map</span>
        </button>
        <button onClick={onSaveTripsClick} className="flex-1 bg-gray-700/80 text-white rounded-lg px-3 py-2 flex items-center justify-center gap-2 shadow-md hover:bg-gray-600 transition-all duration-300">
           <SaveIcon className="w-5 h-5" />
           <span className={`transition-opacity duration-300 ${showSavedMessage ? 'opacity-0' : 'opacity-100'}`}>Save Trips</span>
           <span className={`absolute transition-opacity duration-300 ${showSavedMessage ? 'opacity-100' : 'opacity-0'}`}>Saved!</span>
        </button>
      </div>


      <div>
        <h2 className="text-xl font-semibold text-teal-200 mb-4">Recent Trips</h2>
        {trips.length > 0 ? (
          <div className="space-y-4">
            {trips.map(trip => <TripCard key={trip.id} trip={trip} onEdit={onEditTrip} onDelete={onDeleteTrip} onClick={onTripClick} />)}
          </div>
        ) : (
          <div className="text-center py-10 px-4 bg-white/5 rounded-2xl">
            <p className="text-lg text-gray-300">No journeys recorded yet.</p>
            <p className="text-gray-400 mt-1">Tap 'Add Trip Details' to start your journal!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;