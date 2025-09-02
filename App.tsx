import React, { useState, useMemo, useEffect } from 'react';
import { View, Trip } from './types';
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
import { useAuth } from './hooks/useAuth';
import Login from './components/Login';
import { auth } from './firebase';


const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isEmergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);


  // Load consent and trips from local storage on initial mount
  useEffect(() => {
    const consent = localStorage.getItem('dataConsent');
    setHasConsented(consent === 'true');
    try {
      const storedTrips = localStorage.getItem('journeys');
      if (storedTrips) {
        setTrips(JSON.parse(storedTrips));
      }
    } catch (error) {
      console.error("Failed to load trips from local storage", error);
    }
  }, []);
  
  // Save trips to local storage whenever they change
  useEffect(() => {
    try {
        localStorage.setItem('journeys', JSON.stringify(trips));
    } catch (error) {
        console.error("Failed to save trips to local storage", error);
    }
  }, [trips]);


  const handleConsent = () => {
    localStorage.setItem('dataConsent', 'true');
    setHasConsented(true);
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
      const completedTrip: Trip = { 
        ...activeTrip, 
        path,
        endTime: new Date().toISOString() 
      };
      setTrips(prevTrips => [completedTrip, ...prevTrips]);
      setActiveTrip(null);
    }
    setCurrentView(View.DASHBOARD);
  };
  
  const handleSaveTrips = () => {
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 2000);
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
      prevTrips.map(t => (t.id === updatedTrip.id ? updatedTrip : t))
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
  
  const handleLogout = () => {
    auth.signOut();
  };

  const backgroundUrl = useMemo(() => 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop', []);
  const isModalOpen = isEmergencyModalOpen || !!tripToDelete;

  const renderMainContent = () => {
    switch (currentView) {
      case View.ADD_TRIP:
        return <TripForm onStartTrip={startTrip} onCancel={handleCancelForm} tripToEdit={tripToEdit} onUpdateTrip={handleUpdateTrip} />;
      case View.CURRENT_TRIP:
        return activeTrip ? <CurrentTrip trip={activeTrip} onEndTrip={endTrip} onEmergencyClick={() => setEmergencyModalOpen(true)} /> : <Dashboard onNewTripClick={() => setCurrentView(View.ADD_TRIP)} onShowMapClick={() => setCurrentView(View.TRIPS_MAP_VIEW)} onSaveTripsClick={handleSaveTrips} showSavedMessage={showSavedMessage} trips={trips} activeTrip={activeTrip} onResumeTrip={() => setCurrentView(View.CURRENT_TRIP)} onEditTrip={handleStartEditTrip} onDeleteTrip={handleRequestDeleteTrip} onTripClick={handleSelectTrip} />;
      case View.TRIPS_MAP_VIEW:
        return <TripsMapView trips={trips} onBack={() => setCurrentView(View.DASHBOARD)} />;
      case View.TRIP_DETAIL:
        return selectedTrip ? <TripDetail trip={selectedTrip} onBack={handleDeselectTrip} /> : <Dashboard onNewTripClick={() => setCurrentView(View.ADD_TRIP)} onShowMapClick={() => setCurrentView(View.TRIPS_MAP_VIEW)} onSaveTripsClick={handleSaveTrips} showSavedMessage={showSavedMessage} trips={trips} activeTrip={activeTrip} onResumeTrip={() => setCurrentView(View.CURRENT_TRIP)} onEditTrip={handleStartEditTrip} onDeleteTrip={handleRequestDeleteTrip} onTripClick={handleSelectTrip} />;
      case View.DASHBOARD:
      default:
        return <Dashboard onNewTripClick={() => setCurrentView(View.ADD_TRIP)} onShowMapClick={() => setCurrentView(View.TRIPS_MAP_VIEW)} onSaveTripsClick={handleSaveTrips} showSavedMessage={showSavedMessage} trips={trips} activeTrip={activeTrip} onResumeTrip={() => setCurrentView(View.CURRENT_TRIP)} onEditTrip={handleStartEditTrip} onDeleteTrip={handleRequestDeleteTrip} onTripClick={handleSelectTrip} />;
    }
  };

  const renderContent = () => {
    if (hasConsented === null) {
      return <div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-4 border-t-transparent border-teal-400 rounded-full animate-spin"></div></div>;
    }
    if (!hasConsented) {
      return <ConsentScreen onConsent={handleConsent} />;
    }
    return renderMainContent();
  };

  const showFab = hasConsented && (currentView === View.DASHBOARD || currentView === View.ADD_TRIP);
  
  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-800 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-transparent border-teal-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }


  return (
    <>
      <div className="fixed inset-0 bg-cover bg-center transition-all duration-500" style={{ backgroundImage: `url(${backgroundUrl})`, filter: isModalOpen ? 'blur(8px)' : 'none' }}></div>
      <div className="relative flex justify-center items-center min-h-screen font-sans p-0 sm:p-4">
        <div className="w-full h-full sm:max-w-md sm:h-[850px] sm:max-h-[95vh] bg-gray-900/50 backdrop-blur-xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white">
          <main className="flex-grow overflow-y-auto scrollbar-hide">
            {renderContent()}
          </main>
        </div>
      </div>
      <EmergencyModal isOpen={isEmergencyModalOpen} onClose={() => setEmergencyModalOpen(false)} />
      <ConfirmationModal 
        isOpen={!!tripToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDeleteTrip}
        title="Delete Trip"
        message="Are you sure you want to permanently delete this trip? This action cannot be undone."
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} user={user} />
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