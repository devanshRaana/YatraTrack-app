import React, { useState, useEffect } from 'react';
import { Trip, TransportMode } from '../types';
import PieChart from './PieChart';
import { ChartPieIcon } from './icons/ChartPieIcon';
import { ClipboardListIcon } from './icons/ClipboardListIcon';

interface RouteAnalyticsProps {
  origin: string;
  destination: string;
  allTrips: Trip[];
}

interface AnalyticsData {
    modeDistribution: { name: string; value: number }[];
    activityDistribution: { name: string; value: number }[];
    totalTrips: number;
}

const RouteAnalytics: React.FC<RouteAnalyticsProps> = ({ origin, destination, allTrips }) => {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        // Simulate a data fetch/calculation delay
        const timer = setTimeout(() => {
            const matchingTrips = allTrips.filter(trip => 
                trip.origin.trim().toLowerCase() === origin.trim().toLowerCase() && 
                trip.destination.trim().toLowerCase() === destination.trim().toLowerCase()
            );

            if (matchingTrips.length > 0) {
                const modeCounts = matchingTrips.reduce((acc, trip) => {
                    acc[trip.mode] = (acc[trip.mode] || 0) + 1;
                    return acc;
                }, {} as Record<TransportMode, number>);

                const activityCounts = matchingTrips.reduce((acc, trip) => {
                    const activityKey = trip.activity.trim().toLowerCase();
                    acc[activityKey] = (acc[activityKey] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>);
                
                const modeDistribution = Object.entries(modeCounts)
                    .map(([name, value]) => ({ name, value }))
                    .sort((a, b) => b.value - a.value);
                
                const activityDistribution = Object.entries(activityCounts)
                    .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 3); // Top 3 activities

                setAnalytics({
                    modeDistribution,
                    activityDistribution,
                    totalTrips: matchingTrips.length,
                });
            } else {
                setAnalytics(null);
            }
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, [origin, destination, allTrips]);
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-24">
                    <div className="w-6 h-6 border-2 border-t-transparent border-teal-500 dark:border-teal-400 rounded-full animate-spin"></div>
                    <p className="ml-3 text-sm text-gray-500 dark:text-gray-400">Analyzing travel data...</p>
                </div>
            );
        }

        if (!analytics) {
            return (
                <div className="text-center py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">No travel data found for this route yet.</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Be the first to log this journey!</p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                <p className="text-center text-xs text-gray-500 dark:text-gray-400 -mb-2">Based on {analytics.totalTrips} similar trip(s)</p>
                {/* Transport Modes */}
                <div>
                    <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-200 flex items-center gap-2 mb-2">
                        <ChartPieIcon className="w-5 h-5 text-teal-600 dark:text-teal-400"/>
                        Common Transport Modes
                    </h4>
                    <div className="flex items-center justify-around p-2 bg-black/5 dark:bg-white/5 rounded-lg">
                        <PieChart data={analytics.modeDistribution} size={80} />
                    </div>
                </div>

                {/* Popular Activities */}
                <div>
                    <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-200 flex items-center gap-2 mb-2">
                        <ClipboardListIcon className="w-5 h-5 text-teal-600 dark:text-teal-400"/>
                        Popular Activities
                    </h4>
                    <ul className="space-y-1 text-sm">
                        {analytics.activityDistribution.map((activity, index) => (
                             <li key={index} className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-2 rounded-md">
                                <span>{activity.name}</span>
                                <span className="font-bold text-teal-600 dark:text-teal-300">{((activity.value / analytics.totalTrips) * 100).toFixed(0)}%</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    };

    return (
        <div className="my-4 p-4 bg-gray-200/50 dark:bg-gray-800/50 rounded-2xl animate-fade-in">
            <h3 className="text-center font-bold text-teal-700 dark:text-teal-200 mb-3">Route Insights</h3>
            {renderContent()}
        </div>
    );
};

export default RouteAnalytics;
