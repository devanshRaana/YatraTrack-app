import React, { useState } from 'react';
import { Trip, TransportMode } from '../types';
import { CarIcon } from './icons/CarIcon';
import { BusIcon } from './icons/BusIcon';
import { TrainIcon } from './icons/TrainIcon';
import { BicycleIcon } from './icons/BicycleIcon';
import { WalkIcon } from './icons/WalkIcon';
import { OtherIcon } from './icons/OtherIcon';
import { EditIcon } from './icons/EditIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import TripPathMap from './TripPathMap';
import { ClockIcon } from './icons/ClockIcon';
import { TrashIcon } from './icons/TrashIcon';

interface TripCardProps {
  trip: Trip;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
}

const transportIcons: Record<TransportMode, React.ReactNode> = {
    [TransportMode.CAR]: <CarIcon className="w-5 h-5 text-teal-500 dark:text-teal-300" />,
    [TransportMode.BUS]: <BusIcon className="w-5 h-5 text-teal-500 dark:text-teal-300" />,
    [TransportMode.TRAIN]: <TrainIcon className="w-5 h-5 text-teal-500 dark:text-teal-300" />,
    [TransportMode.BICYCLE]: <BicycleIcon className="w-5 h-5 text-teal-500 dark:text-teal-300" />,
    [TransportMode.WALK]: <WalkIcon className="w-5 h-5 text-teal-500 dark:text-teal-300" />,
    [TransportMode.AUTO]: <CarIcon className="w-5 h-5 text-teal-500 dark:text-teal-300" />, // Using car as a proxy
    [TransportMode.OTHER]: <OtherIcon className="w-5 h-5 text-teal-500 dark:text-teal-300" />,
};

const formatDuration = (start: string, end: string): string => {
    const durationMs = new Date(end).getTime() - new Date(start).getTime();
    if (durationMs < 0) return 'N/A';

    const totalMinutes = Math.floor(durationMs / 60000);
    if (totalMinutes < 1) return '< 1m';
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
};

const TripCard: React.FC<TripCardProps> = ({ trip, onEdit, onDelete, onClick }) => {
    const [isMapVisible, setIsMapVisible] = useState(false);
    
    const formattedDate = new Date(trip.dateTime).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    
    const formattedTime = new Date(trip.dateTime).toLocaleString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    const hasPathData = trip.path && trip.path.length > 0;
    const duration = trip.endTime ? formatDuration(trip.dateTime, trip.endTime) : 'N/A';
    
    const handleActionClick = (e: React.MouseEvent, action: (id: string) => void) => {
      e.stopPropagation();
      action(trip.id);
    };
    
    const handleMapToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMapVisible(prev => !prev);
    };

  return (
    <div 
      className="bg-black/5 dark:bg-white/10 p-4 rounded-2xl shadow-lg backdrop-blur-lg transition-all hover:scale-105 hover:bg-black/10 dark:hover:bg-white/20 duration-300 animate-fade-in flex flex-col cursor-pointer"
      onClick={() => onClick(trip.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(trip.id)}
      aria-label={`View details for trip from ${trip.origin} to ${trip.destination}`}
    >
      {/* Trip Details Section */}
      <div className="flex-grow">
        <div className="mb-3">
            <p className="font-bold text-lg leading-tight truncate" title={trip.origin}>{trip.origin}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm my-0.5">to</p>
            <p className="font-bold text-lg leading-tight truncate" title={trip.destination}>{trip.destination}</p>
        </div>
        
        <div className="text-sm text-teal-600 dark:text-teal-200 mb-4">{trip.activity}</div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-teal-500/10 dark:bg-teal-900/50 py-1 px-2.5 rounded-full">
                    {transportIcons[trip.mode]}
                    <span className="text-xs font-medium text-teal-700 dark:text-teal-200">{trip.mode}</span>
                </div>
                <div className="flex items-center gap-1.5" title="Trip duration">
                    <ClockIcon className="w-4 h-4 text-teal-500 dark:text-teal-300" />
                    <span className="text-xs font-medium">{duration}</span>
                </div>
            </div>
            <div className="text-right text-xs">
                <p>{formattedDate}</p>
                <p className="text-gray-500 dark:text-gray-400">{formattedTime}</p>
            </div>
        </div>
      </div>

      {/* Visual Separator */}
      <div className="my-3 border-t border-black/10 dark:border-white/10"></div>

      {/* Actions Section */}
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <div>
            {trip.accompanying > 0 && 
                <p>With {trip.accompanying} {trip.accompanying > 1 ? 'others' : 'other'}</p>
            }
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleMapToggle}
              disabled={!hasPathData}
              className="flex items-center gap-1.5 py-1 px-2 rounded-md text-teal-600 dark:text-teal-300 hover:bg-black/10 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-colors disabled:text-gray-400 dark:disabled:text-gray-500 disabled:hover:bg-transparent"
              aria-label={isMapVisible ? "Hide trip path on map" : "Show trip path on map"}
            >
                <MapPinIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{isMapVisible ? 'Hide Map' : 'Show Map'}</span>
            </button>
            <button
              onClick={(e) => handleActionClick(e, onEdit)}
              className="flex items-center gap-1.5 py-1 px-2 rounded-md text-teal-600 dark:text-teal-300 hover:bg-black/10 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label={`Edit trip from ${trip.origin} to ${trip.destination}`}
            >
                <EditIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={(e) => handleActionClick(e, onDelete)}
              className="flex items-center gap-1.5 py-1 px-2 rounded-md text-red-500 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-300 transition-colors"
              aria-label={`Delete trip from ${trip.origin} to ${trip.destination}`}
            >
                <TrashIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
      </div>
      
      {/* Embedded Map View */}
      {isMapVisible && (
        <div className="mt-3" onClick={(e) => e.stopPropagation()}>
          {hasPathData ? (
            <div className="h-48 rounded-lg overflow-hidden animate-fade-in">
              <TripPathMap path={trip.path} />
            </div>
          ) : (
            <div className="p-4 bg-black/20 rounded-lg text-center text-sm text-gray-500 dark:text-gray-400">
              No path data was recorded for this trip.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TripCard;