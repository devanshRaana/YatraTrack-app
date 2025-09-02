import React, { useEffect, useRef, useState } from 'react';

// Declaration for Google Maps API
declare global {
    interface Window {
        google: any;
        googleMapsApiLoaded?: boolean;
    }
}

const mapStyle = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] }, { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] }, { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] }, { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] }, { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] }, { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] }, { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] }, { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] }, { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] }, { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] }, { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] }, { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] }, { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] }, { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] }, { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] }, { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] }, { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] }, { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
];

interface TripPathMapProps {
    path: { lat: number; lng: number; }[];
}

const TripPathMap: React.FC<TripPathMapProps> = ({ path }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<any | null>(null);
    const [isApiLoaded, setIsApiLoaded] = useState(window.googleMapsApiLoaded);

    // Check if the Google Maps API script has loaded
    useEffect(() => {
        if (window.googleMapsApiLoaded) {
            setIsApiLoaded(true);
            return;
        }
        const interval = setInterval(() => {
            if (window.googleMapsApiLoaded) {
                setIsApiLoaded(true);
                clearInterval(interval);
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);

    // Initialize the map
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

    // Draw path and markers on the map
    useEffect(() => {
        if (map && path && path.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            
            // Draw the path
            const tripPath = new window.google.maps.Polyline({
                path: path,
                geodesic: true,
                strokeColor: '#4285F4',
                strokeOpacity: 0.8,
                strokeWeight: 4,
            });
            tripPath.setMap(map);

            // Add start marker
            new window.google.maps.Marker({
                position: path[0],
                map,
                title: 'Start',
            });

            // Add end marker
            new window.google.maps.Marker({
                position: path[path.length - 1],
                map,
                title: 'End',
            });

            // Extend bounds to include all points and fit the map
            path.forEach(pos => bounds.extend(pos));
            if (!bounds.isEmpty()) {
                map.fitBounds(bounds);
            }
        }
    }, [map, path]);

    return (
        <div className="relative h-full w-full bg-gray-900">
            <div ref={mapRef} className="w-full h-full"></div>
            {!isApiLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <p>Loading Map...</p>
                </div>
            )}
        </div>
    );
};

export default TripPathMap;