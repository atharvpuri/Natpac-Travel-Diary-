import React, { useState, useEffect } from 'react';
import { Trip, ActiveTrip, TransportMode, Coordinates } from './types';
import Header from './components/Header';
import TripCard from './components/TripCard';
import EndTripModal from './components/EndTripModal';
import ActiveTripView from './components/ActiveTripView';
import ConfirmDestinationView from './components/ConfirmDestinationView';
import { reverseGeocode, calculatePathDistance } from './services/locationService';

type EndTripState = 'confirming_destination' | 'entering_details' | null;

interface ConfirmedDestination {
    coords: Coordinates;
    name: string;
}

// --- Main App Component: Manages state and core logic ---
const App: React.FC = () => {
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTrip, setActiveTrip] = useState<ActiveTrip | null>(null);
  const [currentCoords, setCurrentCoords] = useState<Coordinates | null>(null);
  const [endingTripState, setEndingTripState] = useState<EndTripState>(null);
  const [confirmedDestination, setConfirmedDestination] = useState<ConfirmedDestination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [locationError, setLocationError] = useState<string | null>(null);

  // Load initial state from localStorage
  useEffect(() => {
    try {
      const storedConsent = localStorage.getItem('natpac-consent');
      if (storedConsent === 'true') setHasConsented(true);
      
      const storedTrips = localStorage.getItem('natpac-trips');
      if (storedTrips) setTrips(JSON.parse(storedTrips));
      
      const storedActiveTrip = localStorage.getItem('natpac-active-trip');
      if (storedActiveTrip) setActiveTrip(JSON.parse(storedActiveTrip));
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save state to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('natpac-consent', JSON.stringify(hasConsented));
      localStorage.setItem('natpac-trips', JSON.stringify(trips));
      if (activeTrip) {
        localStorage.setItem('natpac-active-trip', JSON.stringify(activeTrip));
      } else {
        localStorage.removeItem('natpac-active-trip');
      }
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
    }
  }, [hasConsented, trips, activeTrip]);

  // Geolocation watcher effect
  useEffect(() => {
    let watcherId: number | null = null;
    if (hasConsented && activeTrip) {
        watcherId = navigator.geolocation.watchPosition(
            (position) => {
                const newCoords = { lat: position.coords.latitude, lon: position.coords.longitude };
                setCurrentCoords(newCoords);
                setActiveTrip(prev => prev ? { ...prev, path: [...prev.path, newCoords] } : null);
                setLocationError(null);
            },
            (error) => {
                setLocationError(`Live location error: ${error.message}`);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }
    return () => {
        if (watcherId !== null) {
            navigator.geolocation.clearWatch(watcherId);
        }
    };
  }, [hasConsented, activeTrip !== null]);
  
  const handleConsent = () => {
    setHasConsented(true);
  };
  
  const handleStartTrip = () => {
    setStatusMessage('Getting your current location...');
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords: Coordinates = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setCurrentCoords(coords);
        setStatusMessage('Finding address...');
        const originName = await reverseGeocode(coords);
        
        setActiveTrip({
          id: Date.now(),
          origin: originName,
          startTime: new Date().toISOString(),
          startCoords: coords,
          path: [coords]
        });
        setStatusMessage('');
      },
      (error) => {
        setLocationError(`Could not get location: ${error.message}. Please enable location services.`);
        setStatusMessage('');
      },
      { enableHighAccuracy: true }
    );
  };

  const handleEndTrip = () => {
    setEndingTripState('confirming_destination');
  };

  const handleDestinationConfirm = (coords: Coordinates, name: string) => {
    setConfirmedDestination({ coords, name });
    setEndingTripState('entering_details');
  };

  const handleConfirmEndTrip = (mode: TransportMode, companions: number) => {
    if (!activeTrip || !confirmedDestination) {
        setLocationError("Could not save trip. Missing trip data.");
        setEndingTripState(null);
        return;
    }
    setStatusMessage('Saving trip...');
    setLocationError(null);

    const finalPath = [...activeTrip.path, confirmedDestination.coords];

    const newCompletedTrip: Trip = {
      id: activeTrip.id,
      origin: activeTrip.origin,
      startTime: activeTrip.startTime,
      startCoords: activeTrip.startCoords,
      destination: confirmedDestination.name,
      endTime: new Date().toISOString(),
      endCoords: confirmedDestination.coords,
      mode,
      companions,
      distance: calculatePathDistance(finalPath),
      path: finalPath,
    };

    setTrips(prevTrips => [newCompletedTrip, ...prevTrips]);
    setActiveTrip(null);
    setCurrentCoords(null);
    setEndingTripState(null);
    setConfirmedDestination(null);
    setStatusMessage('');
  };

  const handleCancelEndTrip = () => {
    setEndingTripState(null);
    setConfirmedDestination(null);
  };

  const lastKnownCoords = activeTrip?.path && activeTrip.path.length > 0 ? activeTrip.path[activeTrip.path.length - 1] : null;

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading Travel Diary...</p></div>
  }

  if (!hasConsented) {
    return <ConsentScreen onConsent={handleConsent} />;
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <Dashboard 
          activeTrip={activeTrip}
          trips={trips}
          onStartTrip={handleStartTrip}
          onEndTrip={handleEndTrip}
          statusMessage={statusMessage}
          locationError={locationError}
          currentCoords={currentCoords}
        />
        {endingTripState === 'confirming_destination' && activeTrip && lastKnownCoords && (
            <ConfirmDestinationView 
                initialCoords={lastKnownCoords}
                path={activeTrip.path}
                onConfirm={handleDestinationConfirm}
                onCancel={handleCancelEndTrip}
            />
        )}
        {endingTripState === 'entering_details' && confirmedDestination && activeTrip && (
          <EndTripModal 
            destinationName={confirmedDestination.name}
            onConfirm={handleConfirmEndTrip} 
            onCancel={handleCancelEndTrip} 
            path={activeTrip.path}
            endCoords={confirmedDestination.coords}
          />
        )}
      </main>
    </div>
  );
};

// --- Sub-components for better organization ---

const ConsentScreen: React.FC<{onConsent: () => void}> = ({ onConsent }) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-lg w-full bg-white p-8 rounded-xl shadow-lg text-center animate-fade-in-up">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to NATPAC Travel Diary</h2>
        <p className="text-gray-600 mb-6">
          To help with transportation planning, this application collects anonymous data about your trips. This includes your trip's origin, destination, time, and mode of travel, automatically detected using your device's location services. Your privacy is important to us.
        </p>
        <p className="text-gray-600 mb-8">
          Do you consent to share your travel data?
        </p>
        <button
          onClick={onConsent}
          className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Agree and Continue
        </button>
      </div>
    </div>
);

interface DashboardProps {
    activeTrip: ActiveTrip | null;
    trips: Trip[];
    onStartTrip: () => void;
    onEndTrip: () => void;
    statusMessage: string;
    locationError: string | null;
    currentCoords: Coordinates | null;
}

const Dashboard: React.FC<DashboardProps> = ({ activeTrip, trips, onStartTrip, onEndTrip, statusMessage, locationError, currentCoords }) => (
    <>
        <div className="mb-8">
            {activeTrip ? (
                <ActiveTripView trip={activeTrip} onEndTrip={onEndTrip} currentCoords={currentCoords} locationError={locationError} />
            ) : (
                <div className="text-center">
                    <button
                        onClick={onStartTrip}
                        disabled={!!statusMessage}
                        className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-lg text-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 disabled:bg-blue-400 disabled:cursor-not-allowed disabled:scale-100"
                    >
                       {statusMessage || 'Start New Trip'}
                    </button>
                    {locationError && !activeTrip && <p className="text-red-500 mt-2 text-sm">{locationError}</p>}
                </div>
            )}
        </div>

        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">My Trip History</h2>
            {trips.length > 0 ? (
                <div className="space-y-4">
                    {trips.map(trip => <TripCard key={trip.id} trip={trip} />)}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500">You haven't recorded any trips yet.</p>
                    <p className="text-gray-400 text-sm mt-2">Click "Start New Trip" to begin logging your travel.</p>
                </div>
            )}
        </div>
    </>
);

export default App;