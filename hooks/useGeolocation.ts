import { useState, useEffect, useRef } from 'react';

interface GeolocationPosition {
  latitude: number;
  longitude: number;
}

const haversineDistance = (
    pos1: GeolocationPosition, 
    pos2: GeolocationPosition
): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (pos2.latitude - pos1.latitude) * (Math.PI / 180);
    const dLon = (pos2.longitude - pos1.longitude) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(pos1.latitude * (Math.PI / 180)) *
        Math.cos(pos2.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
};


const useGeolocation = () => {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);

  const lastPositionRef = useRef<GeolocationPosition | null>(null);

  useEffect(() => {
    let locationEnabled = true;
    try {
      const storedSettings = localStorage.getItem('appSettings');
      if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        if (settings.locationEnabled === false) { // Check for explicit false
          locationEnabled = false;
        }
      }
    } catch (e) {
      console.error("Could not parse settings for geolocation", e);
    }

    if (!locationEnabled) {
      setError('Location tracking is disabled in settings.');
      return;
    }

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const currentPosition = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setPosition(currentPosition);

        if (lastPositionRef.current) {
            const newDistance = haversineDistance(lastPositionRef.current, currentPosition);
            setDistance(prevDistance => prevDistance + newDistance);
        }
        lastPositionRef.current = currentPosition;
        
        // Speed from Geolocation API is in meters/second. Convert to km/h.
        const speedInKmh = pos.coords.speed ? pos.coords.speed * 3.6 : 0;
        setSpeed(speedInKmh);

        setError(null);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access was denied.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case err.TIMEOUT:
            setError('The request to get user location timed out.');
            break;
          default:
            setError('An unknown error occurred.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watcher);
    };
  }, []);

  return { position, error, distance, speed };
};

export default useGeolocation;