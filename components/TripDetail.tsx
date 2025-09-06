import React from 'react';
import { Trip, TransportMode } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import TripPathMap from './TripPathMap';
import { CarIcon } from './icons/CarIcon';
import { BusIcon } from './icons/BusIcon';
import { TrainIcon } from './icons/TrainIcon';
import { BicycleIcon } from './icons/BicycleIcon';
import { WalkIcon } from './icons/WalkIcon';
import { OtherIcon } from './icons/OtherIcon';
import { ClockIcon } from './icons/ClockIcon';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ShareIcon } from './icons/ShareIcon';

interface TripDetailProps {
  trip: Trip;
  onBack: () => void;
}

const transportIcons: Record<TransportMode, React.ReactNode> = {
    [TransportMode.CAR]: <CarIcon className="w-6 h-6" />,
    [TransportMode.BUS]: <BusIcon className="w-6 h-6" />,
    [TransportMode.TRAIN]: <TrainIcon className="w-6 h-6" />,
    [TransportMode.BICYCLE]: <BicycleIcon className="w-6 h-6" />,
    [TransportMode.WALK]: <WalkIcon className="w-6 h-6" />,
    [TransportMode.AUTO]: <CarIcon className="w-6 h-6" />, // Using car as a proxy
    [TransportMode.OTHER]: <OtherIcon className="w-6 h-6" />,
};

const formatDuration = (start: string, end: string): string => {
    const durationMs = new Date(end).getTime() - new Date(start).getTime();
    if (durationMs < 0) return 'N/A';

    const totalMinutes = Math.floor(durationMs / 60000);
     if (totalMinutes < 1) return '< 1 minute';

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes} minutes`;
};

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className="flex items-start p-4 bg-black/5 dark:bg-white/5 rounded-xl">
        <div className="text-teal-600 dark:text-teal-300 mr-4 mt-1">{icon}</div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="font-semibold text-gray-800 dark:text-white">{value}</p>
        </div>
    </div>
);

const TripDetail: React.FC<TripDetailProps> = ({ trip, onBack }) => {
    const formattedDate = new Date(trip.dateTime).toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const formattedTime = new Date(trip.dateTime).toLocaleTimeString('en-IN', {
        hour: 'numeric', minute: '2-digit', hour12: true
    });

    const hasPathData = trip.path && trip.path.length > 0;
    const duration = trip.endTime ? formatDuration(trip.dateTime, trip.endTime) : 'Not Available';

    const handleShare = async () => {
        const shareText = `Check out my trip with YatraTrack!\n\nFrom: ${trip.origin}\nTo: ${trip.destination}\nActivity: ${trip.activity}\nTransport: ${trip.mode}\nDate: ${formattedDate}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `My trip to ${trip.destination}`,
                    text: shareText,
                });
            } catch (error) {
                console.error('Error sharing trip:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareText);
                alert('Trip details copied to clipboard!');
            } catch (error) {
                console.error('Error copying to clipboard:', error);
                alert('Could not copy details. Please share manually.');
            }
        }
    };


    return (
        <div className="animate-fade-in p-6 h-full flex flex-col">
            <header className="relative flex items-center justify-center mb-6">
                <button onClick={onBack} className="absolute left-0 text-teal-600 dark:text-teal-300 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="Go back">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-semibold text-teal-700 dark:text-teal-200 truncate px-10" title={trip.activity}>{trip.activity}</h2>
            </header>
            
            <div className="flex-grow overflow-y-auto scrollbar-hide space-y-4">
                <div className="text-center mb-4 p-4 bg-black/5 dark:bg-black/10 rounded-xl">
                    <p className="font-bold text-2xl leading-tight truncate" title={trip.origin}>{trip.origin}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-lg my-1">to</p>
                    <p className="font-bold text-2xl leading-tight truncate" title={trip.destination}>{trip.destination}</p>
                </div>

                {hasPathData ? (
                    <div className="h-56 rounded-xl overflow-hidden shadow-lg">
                        <TripPathMap path={trip.path} />
                    </div>
                ) : (
                    <div className="h-56 rounded-xl bg-black/10 dark:bg-black/20 flex items-center justify-center text-center text-gray-500 dark:text-gray-400 p-4">
                        No map data was recorded for this trip.
                    </div>
                )}
                
                <div className="grid grid-cols-1 gap-3">
                    <DetailItem icon={transportIcons[trip.mode]} label="Transport Mode" value={trip.mode} />
                    <DetailItem icon={<ClockIcon className="w-6 h-6" />} label="Trip Duration" value={duration} />
                    <DetailItem icon={<CalendarDaysIcon className="w-6 h-6" />} label="Date & Time" value={`${formattedDate} at ${formattedTime}`} />
                    <DetailItem icon={<UsersIcon className="w-6 h-6" />} label="Companions" value={trip.accompanying > 0 ? `${trip.accompanying} traveler(s)` : 'Traveling solo'} />
                </div>
            </div>
             <div className="mt-auto pt-4 flex-shrink-0">
                <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors duration-300">
                    <ShareIcon className="w-5 h-5" />
                    Share Trip
                </button>
            </div>
        </div>
    );
};

export default TripDetail;