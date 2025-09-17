import React, { useState, useEffect, useCallback } from 'react';
import { ActiveTrip, Coordinates } from '../types';
import MapView from './MapView';

interface ActiveTripViewProps {
  trip: ActiveTrip;
  onEndTrip: () => void;
  currentCoords: Coordinates | null;
  locationError: string | null;
}

const ActiveTripView: React.FC<ActiveTripViewProps> = ({ trip, onEndTrip, currentCoords, locationError }) => {
    const [duration, setDuration] = useState(0);

    const updateDuration = useCallback(() => {
        const now = new Date();
        const start = new Date(trip.startTime);
        const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
        setDuration(diff);
    }, [trip.startTime]);

    useEffect(() => {
        updateDuration();
        const interval = setInterval(updateDuration, 1000);
        return () => clearInterval(interval);
    }, [updateDuration]);

    const formatDuration = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Trip in Progress...</h3>
            
            <div className="h-64 w-full rounded-lg overflow-hidden border-2 border-gray-300 mb-4">
                <MapView path={trip.path} currentPosition={currentCoords} />
            </div>

            {locationError && <p className="text-red-500 text-sm mb-4 text-center">{locationError}</p>}

            <div className="flex justify-between items-center my-6">
                <div>
                    <p className="text-sm text-gray-500">Origin</p>
                    <p className="font-semibold text-lg">{trip.origin}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-mono text-2xl font-bold text-green-600">{formatDuration(duration)}</p>
                </div>
            </div>

            <button onClick={onEndTrip} className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors">
                End Trip
            </button>
        </div>
    );
};

export default ActiveTripView;