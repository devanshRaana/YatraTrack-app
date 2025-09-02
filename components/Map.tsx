import React, { useEffect, useRef, useState } from 'react';
import useGeolocation from '../hooks/useGeolocation';
import { ShieldExclamationIcon } from './icons/ShieldExclamationIcon';

// FIX: Add global declarations for Google Maps API to fix TypeScript errors.
// This is necessary because the API is loaded from a script tag and is not a module.
declare global {
    interface Window {
        google: any;
        googleMapsApiLoaded?: boolean;
    }
}

const mapStyle = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
];

interface MapProps {
    apiKeyError?: boolean;
}

const Map: React.FC<MapProps> = () => {
    const { position, error: locationError } = useGeolocation();
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<any | null>(null);
    const [marker, setMarker] = useState<any | null>(null);
    const [isApiLoaded, setIsApiLoaded] = useState(window.googleMapsApiLoaded);
    const [apiKeyError, setApiKeyError] = useState(false);

    useEffect(() => {
        // Fix: Cast the result of document.querySelector to HTMLScriptElement to access the 'src' property.
        const script = document.querySelector<HTMLScriptElement>('script[src*="maps.googleapis.com"]');
        if (script?.src.includes("YOUR_GOOGLE_MAPS_API_KEY")) {
            setApiKeyError(true);
        }

        const interval = setInterval(() => {
            if (window.googleMapsApiLoaded) {
                setIsApiLoaded(true);
                clearInterval(interval);
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isApiLoaded && mapRef.current && !map && !apiKeyError) {
            const newMap = new window.google.maps.Map(mapRef.current, {
                center: { lat: 20.5937, lng: 78.9629 }, // Default to India
                zoom: 15,
                styles: mapStyle,
                disableDefaultUI: true,
                zoomControl: true,
            });
            setMap(newMap);
        }
    }, [isApiLoaded, map, apiKeyError]);

    useEffect(() => {
        if (map && position) {
            const userPosition = { lat: position.latitude, lng: position.longitude };
            map.panTo(userPosition);
            if (!marker) {
                const newMarker = new window.google.maps.Marker({
                    position: userPosition,
                    map: map,
                    icon: {
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: "#4285F4",
                        fillOpacity: 1,
                        strokeColor: "white",
                        strokeWeight: 2,
                    },
                });
                setMarker(newMarker);
            } else {
                marker.setPosition(userPosition);
            }
        }
    }, [map, marker, position]);
    
    const ErrorOverlay: React.FC<{ title: string, message: string }> = ({ title, message }) => (
        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                <div className="flex items-center">
                    <ShieldExclamationIcon className="w-6 h-6 mr-2 text-red-500" />
                    <strong className="font-bold">{title}</strong>
                </div>
                <span className="block sm:inline mt-1 text-sm">{message}</span>
            </div>
        </div>
    );

    return (
        <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white relative">
            <div ref={mapRef} className="w-full h-full"></div>
            {apiKeyError && <ErrorOverlay title="Google Maps Error" message="A valid Google Maps API key is required. Please replace the placeholder API key in the code to display the map." />}
            
            {!apiKeyError && locationError && (
                 <div className="absolute inset-0 bg-gray-900/80 flex flex-col items-center justify-center p-4 text-center">
                    <p className="text-sm text-gray-400 mt-1">{locationError}</p>
                </div>
            )}

            {!apiKeyError && !position && !locationError && (
                <div className="absolute inset-0 bg-gray-900/80 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-4 border-t-transparent border-teal-400 rounded-full animate-spin"></div>
                    <p className="mt-3">Acquiring your location...</p>
                </div>
            )}
        </div>
    );
};

export default Map;