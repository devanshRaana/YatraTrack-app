
import React from 'react';
import { View } from '../types';
import { HomeIcon } from './icons/HomeIcon';
import { PlusIcon } from './icons/PlusIcon';

interface BottomNavProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setCurrentView }) => {
  const activeClass = 'bg-cyan-500 text-white';
  const inactiveClass = 'text-gray-300 hover:bg-white/20';

  return (
    <nav className="bg-white/10 backdrop-blur-sm p-2 mt-auto grid grid-cols-2 gap-2">
        <button
            onClick={() => setCurrentView(View.DASHBOARD)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${currentView === View.DASHBOARD ? activeClass : inactiveClass}`}
        >
            <HomeIcon className="w-6 h-6" />
            <span className="text-xs font-medium">Dashboard</span>
        </button>
        <button
            onClick={() => setCurrentView(View.ADD_TRIP)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${currentView === View.ADD_TRIP ? activeClass : inactiveClass}`}
        >
            <PlusIcon className="w-6 h-6" />
            <span className="text-xs font-medium">New Trip</span>
        </button>
    </nav>
  );
};

export default BottomNav;
