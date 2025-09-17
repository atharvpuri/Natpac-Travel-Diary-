import React, { useState, useEffect, useCallback } from 'react';
import { Coordinates } from '../types';
import { reverseGeocode } from '../services/locationService';
import MapView from './MapView';

interface ConfirmDestinationViewProps {
    initialCoords: Coordinates;
    path: Coordinates[];
    onConfirm: (coords: Coordinates, name: string) => void;
    onCancel: () => void;
}

// Simple debounce utility
const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<F>): void => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), waitFor);
    };
};

const ConfirmDestinationView: React.FC<ConfirmDestinationViewProps> = ({ initialCoords, path, onConfirm, onCancel }) => {
    const [markerCoords, setMarkerCoords] = useState<Coordinates>(initialCoords);
    const [address, setAddress] = useState<string>('Loading address...');
    const [isGeocoding, setIsGeocoding] = useState(true);

    const getAddress = useCallback(async (coords: Coordinates) => {
        setIsGeocoding(true);
        const newAddress = await reverseGeocode(coords);
        setAddress(newAddress);
        setIsGeocoding(false);
    }, []);

    const debouncedGetAddress = useCallback(debounce(getAddress, 500), [getAddress]);

    useEffect(() => {
        getAddress(initialCoords);
    }, [initialCoords, getAddress]);

    const handleMapRightClick = (newCoords: Coordinates) => {
        setMarkerCoords(newCoords);
        setAddress('Updating address...');
        debouncedGetAddress(newCoords);
    };

    const handleConfirm = () => {
        if (!isGeocoding) {
            onConfirm(markerCoords, address);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col animate-fade-in-up">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Confirm Your Destination</h2>
                    <p className="text-sm text-gray-600">Right-click on the map to set your exact destination.</p>
                </div>
                
                <div className="flex-grow relative">
                    <MapView 
                        path={path}
                        endMarkerPosition={markerCoords}
                        onMapRightClick={handleMapRightClick}
                    />
                </div>
                
                <div className="p-4 border-t bg-gray-50">
                    <div className="bg-white p-3 rounded-lg border shadow-sm mb-4">
                        <p className="text-sm font-medium text-gray-500">Selected Address:</p>
                        <p className={`text-gray-800 font-semibold ${isGeocoding ? 'animate-pulse' : ''}`}>
                            {address}
                        </p>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                            Cancel
                        </button>
                        <button 
                            onClick={handleConfirm}
                            disabled={isGeocoding}
                            className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                            {isGeocoding ? 'Locating...' : 'Confirm & Continue'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDestinationView;