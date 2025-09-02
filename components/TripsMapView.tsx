import React, { useEffect, useRef, useState } from 'react';
import { Trip } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

// Add global declarations for Google Maps API
declare global {
    interface Window {
        google: any;
        googleMapsApiLoaded?: boolean;
    }
}

const mapStyle = [
    // (Same map style as in Map.tsx)
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] }, { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] }, { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] }, { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] }, { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] }, { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] }, { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] }, { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] }, { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] }, { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] }, { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] }, { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] }, { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] }, { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] }, { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] }, { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] }, { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] }, { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
];

interface TripsMapViewProps {
    trips: Trip[];
    onBack: () => void;
}

const TripsMapView: React.FC<TripsMapViewProps> = ({ trips, onBack }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<any | null>(null);
    const [isApiLoaded, setIsApiLoaded] = useState(window.googleMapsApiLoaded);

    useEffect(() => {
        const interval = setInterval(() => {
            if (window.googleMapsApiLoaded) {
                setIsApiLoaded(true);
                clearInterval(interval);
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isApiLoaded && mapRef.current && !map) {
            const newMap = new window.google.maps.Map(mapRef.current, {
                center: { lat: 20.5937, lng: 78.9629 }, // Default to India
                zoom: 5,
                styles: mapStyle,
                disableDefaultUI: true,
                zoomControl: true,
            });
            setMap(newMap);
        }
    }, [isApiLoaded, map]);

    useEffect(() => {
        if (map && trips.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            
            trips.forEach(trip => {
                if (trip.path && trip.path.length > 0) {
                    const tripPath = new window.google.maps.Polyline({
                        path: trip.path,
                        geodesic: true,
                        strokeColor: '#4285F4',
                        strokeOpacity: 0.8,
                        strokeWeight: 4,
                    });
                    tripPath.setMap(map);

                    new window.google.maps.Marker({
                        position: trip.path[0],
                        map,
                        title: `Start: ${trip.origin}`,
                    });

                    new window.google.maps.Marker({
                        position: trip.path[trip.path.length - 1],
                        map,
                        title: `End: ${trip.destination}`,
                    });

                    trip.path.forEach(pos => bounds.extend(pos));
                }
            });
            
            if (!bounds.isEmpty()) {
                map.fitBounds(bounds);
            }
        }

    }, [map, trips]);

    return (
        <div className="relative h-full w-full animate-fade-in">
            <button onClick={onBack} className="absolute top-4 left-4 z-10 bg-gray-800/80 text-white p-2 rounded-full shadow-lg hover:bg-gray-700" aria-label="Go back to dashboard">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <div ref={mapRef} className="w-full h-full"></div>
            {!isApiLoaded && (
                <div className="absolute inset-0 bg-gray-900/80 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-4 border-t-transparent border-teal-400 rounded-full animate-spin"></div>
                    <p className="mt-3">Loading Map...</p>
                </div>
            )}
        </div>
    );
};

export default TripsMapView;