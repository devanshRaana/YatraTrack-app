import React, { useState, useEffect } from 'react';
import useGeolocation from '../hooks/useGeolocation';
import { getNearbySuggestions } from '../services/geminiService';
import { XMarkIcon } from './icons/XMarkIcon';
import { CompassIcon } from './icons/CompassIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import type firebase from 'firebase/compat/app';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  user: firebase.User | null;
}

type Suggestion = {
  name: string;
  description: string;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onLogout, user }) => {
  const { position, error: locationError } = useGeolocation();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && position && suggestions.length === 0) {
      const fetchSuggestions = async () => {
        setIsLoading(true);
        const results = await getNearbySuggestions(position.latitude, position.longitude);
        setSuggestions(results);
        setIsLoading(false);
      };
      fetchSuggestions();
    } else if (!isOpen) {
        // Reset when closed
        setSuggestions([]);
    }
  }, [isOpen, position]);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <aside 
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-gray-800/80 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        <div className="flex flex-col h-full text-white">
          <header className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 id="sidebar-title" className="text-xl font-bold text-teal-300 flex items-center">
              <CompassIcon className="w-6 h-6 mr-2" />
              What's Nearby?
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close sidebar">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </header>

          <div className="flex-grow p-4 overflow-y-auto">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-8 h-8 border-4 border-t-transparent border-teal-400 rounded-full animate-spin"></div>
                <p className="mt-3 text-gray-300">Finding cool spots near you...</p>
              </div>
            )}
            {locationError && !isLoading && (
              <div className="text-center text-red-400 p-4 bg-red-500/10 rounded-lg">
                <p className="font-semibold">Location Error</p>
                <p className="text-sm">{locationError}</p>
              </div>
            )}
            {!isLoading && suggestions.length > 0 && (
              <ul className="space-y-3">
                {suggestions.map((item, index) => (
                  <li key={index} className="bg-white/5 p-4 rounded-lg animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <h3 className="font-bold text-teal-300">{item.name}</h3>
                    <p className="text-sm text-gray-300 mt-1">{item.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <footer className="p-4 border-t border-gray-700 mt-auto">
            {user && (
              <div className="text-sm mb-4">
                <p className="text-gray-400">Signed in as</p>
                <p className="font-semibold truncate">{user.email}</p>
              </div>
            )}
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-600/30 text-red-300 py-2.5 px-4 rounded-lg hover:bg-red-600/50 hover:text-red-200 transition-colors duration-200"
            >
              <LogoutIcon className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </footer>
        </div>
      </aside>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Sidebar;