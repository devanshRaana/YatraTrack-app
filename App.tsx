import React, { useState, useMemo, useEffect } from 'react';
import { View, Trip, AppSettings, Theme, Checklist, EmergencyContact } from './types';
import Dashboard from './components/Dashboard';
import TripForm from './components/TripForm';
import CurrentTrip from './components/CurrentTrip';
import EmergencyModal from './components/EmergencyModal';
import ConsentScreen from './components/ConsentScreen';
import Sidebar from './components/Sidebar';
import FloatingActionButton from './components/FloatingActionButton';
import { InfoIcon } from './components/icons/InfoIcon';
import TripsMapView from './components/TripsMapView';
import ConfirmationModal from './components/ConfirmationModal';
import TripDetail from './components/TripDetail';
import SplashScreen from './components/SplashScreen';
import Settings from './components/Settings';
import { UserIcon } from './components/icons/UserIcon';
import ChecklistView from './components/ChecklistView';

const App: React.FC = () => {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isEmergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [personalContacts, setPersonalContacts] = useState<EmergencyContact[]>([]);
  const [isLogoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    theme: Theme.SYSTEM,
    locationEnabled: true,
  });

  // Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplashScreen(false);
    }, 1200); // 1.2 seconds
    return () => clearTimeout(timer);
  }, []);
  
  // Load all data from storage
  useEffect(() => {
      try {
          const storedSettings = localStorage.getItem('appSettings');
          if (storedSettings) setSettings(JSON.parse(storedSettings));
          
          const consent = localStorage.getItem('dataConsent');
          setHasConsented(consent === 'true');
          
          const storedTrips = localStorage.getItem('trips');
          if (storedTrips) setTrips(JSON.parse(storedTrips));

          const storedChecklists = localStorage.getItem('checklists');
          if (storedChecklists) setChecklists(JSON.parse(storedChecklists));

          const storedContacts = localStorage.getItem('personalContacts');
          if (storedContacts) setPersonalContacts(JSON.parse(storedContacts));

      } catch (e) { console.error('Failed to load data from storage', e); }
      finally {
        setIsDataLoading(false);
      }
  }, []);

  // Apply theme and save settings
  useEffect(() => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');

      let themeToApply = settings.theme;
      if (themeToApply === Theme.SYSTEM) {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT;
          root.classList.add(systemTheme);
      } else {
          root.classList.add(settings.theme);
      }
      
      try {
        if (!isDataLoading) localStorage.setItem('appSettings', JSON.stringify(settings));
      } catch (e) { console.error('Failed to save settings', e); }
  }, [settings, isDataLoading]);
  
  // Save trips to local storage whenever they change
  useEffect(() => {
    if (!isDataLoading) {
        try {
            localStorage.setItem('trips', JSON.stringify(trips));
        } catch (e) {
            console.error('Failed to save trips to storage', e);
        }
    }
  }, [trips, isDataLoading]);

  // Save checklists to local storage
  useEffect(() => {
    if (!isDataLoading) {
        try {
            localStorage.setItem('checklists', JSON.stringify(checklists));
        } catch (e) { console.error('Failed to save checklists', e); }
    }
  }, [checklists, isDataLoading]);

  // Save personal contacts to local storage
  useEffect(() => {
    if (!isDataLoading) {
        try {
            localStorage.setItem('personalContacts', JSON.stringify(personalContacts));
        } catch (e) { console.error('Failed to save contacts', e); }
    }
  }, [personalContacts, isDataLoading]);

  const handleConsent = () => {
    localStorage.setItem('dataConsent', 'true');
    setHasConsented(true);
  };
  
  const handleSettingsChange = (newSettings: Partial<AppSettings>) => {
      setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleLogout = () => {
    try {
        // Clear all data from localStorage
        localStorage.removeItem('trips');
        localStorage.removeItem('checklists');
        localStorage.removeItem('personalContacts');
        localStorage.removeItem('appSettings');
        localStorage.removeItem('dataConsent');
        
        // Reset all application state
        setTrips([]);
        setChecklists([]);
        setPersonalContacts([]);
        setSettings({ theme: Theme.SYSTEM, locationEnabled: true });
        setHasConsented(false); // This will trigger the ConsentScreen
        setCurrentView(View.DASHBOARD);
        setLogoutConfirmOpen(false);
        setActiveTrip(null);
        setSelectedTrip(null);

        alert("You have been logged out and all data on this device has been cleared.");

    } catch (error) {
        console.error("Error during logout:", error);
        alert("Failed to clear data. Please try again.");
    }
  };


  const startTrip = (tripData: Omit<Trip, 'id' | 'path'>) => {
    const newTrip: Trip = {
      ...tripData,
      id: new Date().toISOString(),
      path: [],
    };
    setActiveTrip(newTrip);
    setCurrentView(View.CURRENT_TRIP);
  };

  const endTrip = (path: { lat: number; lng: number; }[]) => {
    if (activeTrip) {
        const endedTrip = {
            ...activeTrip,
            path,
            endTime: new Date().toISOString()
        };
        setTrips(prevTrips => 
            [endedTrip, ...prevTrips]
            .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
        );
        setActiveTrip(null);
    }
    setCurrentView(View.DASHBOARD);
  };
  
  const handleStartEditTrip = (tripId: string) => {
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
      setTripToEdit(trip);
      setCurrentView(View.ADD_TRIP);
    }
  };

  const handleUpdateTrip = (updatedTrip: Trip) => {
    setTrips(prevTrips => 
        prevTrips.map(t => t.id === updatedTrip.id ? updatedTrip : t)
        .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
    );
    setTripToEdit(null);
    setCurrentView(View.DASHBOARD);
  };
  
  const handleRequestDeleteTrip = (tripId: string) => {
    setTripToDelete(tripId);
  };

  const handleConfirmDeleteTrip = () => {
    if (tripToDelete) {
        setTrips(prevTrips => prevTrips.filter(t => t.id !== tripToDelete));
        setTripToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setTripToDelete(null);
  };
  
  const handleSelectTrip = (tripId: string) => {
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
      setSelectedTrip(trip);
      setCurrentView(View.TRIP_DETAIL);
    }
  };

  const handleDeselectTrip = () => {
    setSelectedTrip(null);
    setCurrentView(View.DASHBOARD);
  };

  const handleCancelForm = () => {
    setTripToEdit(null);
    setCurrentView(View.DASHBOARD);
  };

  const backgroundUrl = useMemo(() => 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop', []);
  const isModalOpen = isEmergencyModalOpen || !!tripToDelete || isSidebarOpen || isLogoutConfirmOpen;

  const renderMainContent = () => {
    const dashboardProps = {
      isDataLoading,
      trips,
      activeTrip,
      onNewTripClick: () => setCurrentView(View.ADD_TRIP),
      onShowMapClick: () => setCurrentView(View.TRIPS_MAP_VIEW),
      onResumeTrip: () => setCurrentView(View.CURRENT_TRIP),
      onEditTrip: handleStartEditTrip,
      onDeleteTrip: handleRequestDeleteTrip,
      onTripClick: handleSelectTrip,
      onChecklistClick: () => setCurrentView(View.CHECKLIST),
    };
    
    switch (currentView) {
      case View.ADD_TRIP:
        return <TripForm onStartTrip={startTrip} onCancel={handleCancelForm} tripToEdit={tripToEdit} onUpdateTrip={handleUpdateTrip} allTrips={trips} />;
      case View.CURRENT_TRIP:
        return activeTrip ? <CurrentTrip trip={activeTrip} onEndTrip={endTrip} onEmergencyClick={() => setEmergencyModalOpen(true)} /> : <Dashboard {...dashboardProps} />;
      case View.TRIPS_MAP_VIEW:
        return <TripsMapView trips={trips} onBack={() => setCurrentView(View.DASHBOARD)} />;
      case View.TRIP_DETAIL:
        return selectedTrip ? <TripDetail trip={selectedTrip} onBack={handleDeselectTrip} /> : <Dashboard {...dashboardProps} />;
      case View.SETTINGS:
        return <Settings settings={settings} onSettingsChange={handleSettingsChange} onBack={() => setCurrentView(View.DASHBOARD)} onLogout={() => setLogoutConfirmOpen(true)} trips={trips} />;
      case View.CHECKLIST:
        return <ChecklistView checklists={checklists} setChecklists={setChecklists} onBack={() => setCurrentView(View.DASHBOARD)} />;
      case View.DASHBOARD:
      default:
        return <Dashboard {...dashboardProps} />;
    }
  };

  const renderAppContent = () => {
    if (showSplashScreen) {
      return <SplashScreen />;
    }
    if (hasConsented === null && !isDataLoading) {
      // If still null after loading, default to needing consent.
      if (!localStorage.getItem('dataConsent')) setHasConsented(false);
    }
    if (hasConsented === null) {
      return <div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-4 border-t-transparent border-teal-400 rounded-full animate-spin"></div></div>;
    }
    if (!hasConsented) {
      return <ConsentScreen onConsent={handleConsent} />;
    }
    return renderMainContent();
  };

  const showFab = hasConsented && !showSplashScreen && (currentView === View.DASHBOARD || currentView === View.ADD_TRIP);

  return (
    <>
      <div className="fixed inset-0 bg-cover bg-center transition-all duration-500" style={{ backgroundImage: `url(${backgroundUrl})`, filter: isModalOpen ? 'blur(8px)' : 'none' }}></div>
      <div className="relative flex justify-center items-center min-h-screen font-sans p-0 sm:p-4">
        <div className="w-full h-full sm:max-w-md sm:h-[850px] sm:max-h-[95vh] bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col text-gray-900 dark:text-white">
          {hasConsented && !showSplashScreen && (
             <button
                onClick={() => setCurrentView(View.SETTINGS)}
                className="absolute top-4 right-4 z-20 text-teal-600 dark:text-teal-300 hover:text-gray-900 dark:hover:text-white transition-colors p-2 rounded-full bg-black/10 dark:bg-black/20 hover:bg-black/20 dark:hover:bg-black/40"
                aria-label="Open profile and settings"
             >
                <UserIcon className="w-6 h-6" />
             </button>
           )}
          <main className="flex-grow overflow-y-auto scrollbar-hide">
            {renderAppContent()}
          </main>
        </div>
      </div>
      <EmergencyModal isOpen={isEmergencyModalOpen} onClose={() => setEmergencyModalOpen(false)} personalContacts={personalContacts} setPersonalContacts={setPersonalContacts} />
      <ConfirmationModal 
        isOpen={!!tripToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDeleteTrip}
        title="Delete Trip"
        message="Are you sure you want to permanently delete this trip? This action cannot be undone."
        confirmButtonText="Delete"
      />
      <ConfirmationModal 
        isOpen={isLogoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="This will permanently delete all your trip data, checklists, and settings from this device. Are you sure?"
        confirmButtonText="Logout"
        confirmButtonClassName="bg-red-600 text-white hover:bg-red-700"
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      {showFab && (
         <FloatingActionButton onClick={() => setSidebarOpen(true)} aria-label="Show nearby suggestions">
            <InfoIcon className="w-6 h-6" />
        </FloatingActionButton>
      )}
    </>
  );
};

// Custom scrollbar utility CSS
const style = document.createElement('style');
style.innerHTML = `
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;
document.head.appendChild(style);

export default App;