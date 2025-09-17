import React, { useState } from 'react';
import { TransportMode, Coordinates } from '../types';
import { TransportIcon } from './icons';
import MapView from './MapView';

interface EndTripModalProps {
  destinationName: string;
  onConfirm: (mode: TransportMode, companions: number) => void;
  onCancel: () => void;
  path: Coordinates[];
  endCoords: Coordinates;
}

const EndTripModal: React.FC<EndTripModalProps> = ({ destinationName, onConfirm, onCancel, path, endCoords }) => {
    const [mode, setMode] = useState<TransportMode>(TransportMode.CAR);
    const [companions, setCompanions] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(mode, companions);
    };

    const finalPath = [...path, endCoords];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-2xl w-full max-w-md animate-fade-in-up flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Trip</h2>
                    <p className="text-gray-600 mb-1">
                      <span className="font-semibold">Destination:</span> {destinationName}
                    </p>
                    <p className="text-gray-600">Please provide the final details for this trip.</p>
                </div>
                
                {/* Scrollable Body */}
                <div className="p-6 overflow-y-auto space-y-6">
                    <div className="h-48 w-full rounded-lg overflow-hidden border border-gray-200">
                      <MapView path={finalPath} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mode of Transport</label>
                        <div className="grid grid-cols-4 gap-2">
                           {Object.values(TransportMode).map(transportMode => (
                               <button type="button" key={transportMode} onClick={() => setMode(transportMode)} className={`flex flex-col items-center justify-center p-2 border-2 rounded-lg transition-colors h-20 ${mode === transportMode ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`} aria-label={transportMode}>
                                   <TransportIcon mode={transportMode} className="h-7 w-7 mb-1 text-gray-600"/>
                                   <span className="text-xs font-semibold text-center text-gray-700">{transportMode}</span>
                               </button>
                           ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="companions" className="block text-sm font-medium text-gray-700">Accompanying Travelers</label>
                        <input type="number" id="companions" value={companions} onChange={(e) => setCompanions(Math.max(0, parseInt(e.target.value, 10)))} min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
                    <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                        Cancel
                    </button>
                     <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                        Save Trip
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EndTripModal;