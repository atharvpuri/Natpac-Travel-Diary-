import React, { useEffect, useRef } from 'react';
import { Coordinates } from '../types';

declare const L: any; // Inform TypeScript that L is a global object from the Leaflet script

interface MapViewProps {
    path: Coordinates[];
    currentPosition?: Coordinates | null;
    endMarkerPosition?: Coordinates | null;
    onMapRightClick?: (coords: Coordinates) => void;
}

const MapView: React.FC<MapViewProps> = ({ path, currentPosition, endMarkerPosition, onMapRightClick }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const polylineRef = useRef<any>(null);
    const currentPosMarkerRef = useRef<any>(null);
    const endMarkerRef = useRef<any>(null);

    const startPin = L.divIcon({ className: 'map-pin start-pin', iconSize: [30, 30], iconAnchor: [15, 30] });
    const endPin = L.divIcon({ className: 'map-pin end-pin', iconSize: [30, 30], iconAnchor: [15, 30] });
    const currentPosIcon = L.divIcon({ className: 'current-pos-marker', iconSize: [20, 20] });

    // Initialize map
    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            const centerCoords = path[0] || { lat: 51.505, lon: -0.09 };
            const map = L.map(mapContainerRef.current).setView([centerCoords.lat, centerCoords.lon], 16);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            if (onMapRightClick) {
                map.on('contextmenu', (e: any) => {
                    const { lat, lng } = e.latlng;
                    onMapRightClick({ lat, lon: lng });
                });
            }

            mapRef.current = map;
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [onMapRightClick]);

    // Update map with path and markers
    useEffect(() => {
        const map = mapRef.current;
        if (!map || path.length === 0) return;

        const latLngs = path.map(p => [p.lat, p.lon]);

        if (polylineRef.current) {
            polylineRef.current.setLatLngs(latLngs);
        } else {
            polylineRef.current = L.polyline(latLngs, { color: 'blue' }).addTo(map);
        }
        
        map.eachLayer((layer: any) => {
            if (layer instanceof L.Marker && layer !== currentPosMarkerRef.current && layer !== endMarkerRef.current) {
                map.removeLayer(layer);
            }
        });
        
        L.marker(latLngs[0], { icon: startPin }).addTo(map);
        
        const isHistoryView = !currentPosition && !onMapRightClick;
        if (isHistoryView && path.length > 1) {
             L.marker(latLngs[latLngs.length - 1], { icon: endPin }).addTo(map);
        }

        if ((isHistoryView || onMapRightClick) && latLngs.length > 0) {
            map.fitBounds(L.polyline(latLngs).getBounds().pad(0.2));
        }

    }, [path, onMapRightClick]);

    // Update non-draggable end marker
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        if (endMarkerPosition) {
            if (endMarkerRef.current) {
                endMarkerRef.current.setLatLng([endMarkerPosition.lat, endMarkerPosition.lon]);
            } else {
                endMarkerRef.current = L.marker([endMarkerPosition.lat, endMarkerPosition.lon], { 
                    icon: endPin, 
                    draggable: false 
                }).addTo(map);
            }
        } else if (endMarkerRef.current) {
            map.removeLayer(endMarkerRef.current);
            endMarkerRef.current = null;
        }
    }, [endMarkerPosition]);

    // Update current position marker on live trips
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !currentPosition) return;

        const { lat, lon } = currentPosition;
        
        if (currentPosMarkerRef.current) {
            currentPosMarkerRef.current.setLatLng([lat, lon]);
        } else {
            currentPosMarkerRef.current = L.marker([lat, lon], { icon: currentPosIcon }).addTo(map);
        }
        
        map.panTo([lat, lon]);

    }, [currentPosition]);

    return <div ref={mapContainerRef} className="w-full h-full" />;
};

export default MapView;