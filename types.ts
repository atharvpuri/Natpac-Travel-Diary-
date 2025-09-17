export enum TransportMode {
  WALK = 'Walk',
  CYCLE = 'Cycle',
  CAR = 'Car',
  BUS = 'Bus',
  TRAIN = 'Train',
  AUTO = 'Auto-rickshaw',
  TAXI = 'Taxi',
  MOTORBIKE = 'Motorbike'
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface Trip {
  id: number;
  origin: string;
  destination: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  mode: TransportMode;
  companions: number;
  startCoords: Coordinates;
  endCoords: Coordinates;
  distance: number; // in kilometers
  path: Coordinates[];
}

export interface ActiveTrip {
  id: number;
  origin: string;
  startTime: string; // ISO string
  startCoords: Coordinates;
  path: Coordinates[]; // To draw the route later
}