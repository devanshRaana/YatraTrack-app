import React from 'react';
import { CompassIcon } from './icons/CompassIcon';

const SplashScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in">
      <CompassIcon className="w-24 h-24 text-teal-500 dark:text-teal-300 animate-pulse" />
      <h1 className="text-4xl font-bold tracking-widest text-teal-700 dark:text-teal-200 mt-6" style={{ fontFamily: "'Orbitron', sans-serif" }}>
        YatraTrack
      </h1>
    </div>
  );
};

export default SplashScreen;