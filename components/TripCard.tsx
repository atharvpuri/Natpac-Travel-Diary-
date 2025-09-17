import React from 'react';
import { Trip } from '../types';
import { TransportIcon, LocationMarkerIcon, UsersIcon } from './icons';
import MapView from './MapView';

interface TripCardProps {
  trip: Trip;
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const startTime = new Date(trip.startTime);
  const endTime = new Date(trip.endTime);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 text-blue-800 p-2 rounded-full">
                <TransportIcon mode={trip.mode} className="h-6 w-6" />
            </div>
            <div>
                <p className="font-semibold text-lg text-gray-800">{trip.mode}</p>
                <p className="text-sm text-gray-500">{startTime.toLocaleDateString()}</p>
            </div>
          </div>
          <div className="text-right">
             <p className="font-bold text-gray-800">{duration} min</p>
             <p className="text-sm text-gray-500">{trip.distance.toFixed(2)} km</p>
          </div>
        </div>

        <div className="space-y-3 text-gray-700 mb-4">
          <div className="flex items-start space-x-3">
            <LocationMarkerIcon className="h-5 w-5 mt-1 text-green-500 flex-shrink-0" />
            <div>
              <span className="font-semibold">From:</span> {trip.origin}
              <span className="text-gray-400 ml-2 text-sm">({formatTime(startTime)})</span>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <LocationMarkerIcon className="h-5 w-5 mt-1 text-red-500 flex-shrink-0" />
            <div>
              <span className="font-semibold">To:</span> {trip.destination}
              <span className="text-gray-400 ml-2 text-sm">({formatTime(endTime)})</span>
            </div>
          </div>
        </div>
        
        <div className="h-48 w-full rounded-lg overflow-hidden border-2 border-gray-300">
            <MapView path={trip.path} />
        </div>
        
        {trip.companions > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center text-gray-600">
                <UsersIcon className="h-5 w-5 mr-2" />
                <span>Travelled with {trip.companions} other person(s)</span>
            </div>
        )}
      </div>
    </div>
  );
};

export default TripCard;