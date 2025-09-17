import { Coordinates } from '../types';

// Use the Nominatim API for real reverse geocoding.
export const reverseGeocode = async (coords: Coordinates): Promise<string> => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lon}&zoom=18&addressdetails=1`);
    if (!response.ok) {
        throw new Error('Failed to fetch address from API.');
    }
    const data = await response.json();
    // Construct a concise, readable address from the available parts
    if (data.address) {
      const { road, neighbourhood, suburb, city, town, village } = data.address;
      const addressParts = [road, neighbourhood, suburb, city || town || village];
      const cleanAddress = addressParts.filter(Boolean).join(', ');
      if (cleanAddress) return cleanAddress;
    }
    return data.display_name || `Location near (${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)})`;
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return `Location near (${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)})`; // Fallback
  }
};

// Haversine formula to calculate the distance between two geographical points.
export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLon = (coord2.lon - coord1.lon) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

// Calculate the total distance of a path by summing the segments.
export const calculatePathDistance = (path: Coordinates[]): number => {
  let totalDistance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    totalDistance += calculateDistance(path[i], path[i + 1]);
  }
  return totalDistance;
};