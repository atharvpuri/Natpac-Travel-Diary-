
import React from 'react';
import { TransportMode } from '../types';

export const WalkIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm-4 8a8 8 0 00-8-8h0a8 8 0 008 8zM8 4a4 4 0 108 0 4 4 0 00-8 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12v8m-4-4h8" />
  </svg>
);

export const CycleIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 00-10 10c0 4.418 3.582 8 8 8h2a8 8 0 100-16zM12 12a2 2 0 100-4 2 2 0 000 4z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12h.01M16 16a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export const CarIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6.216a2 2 0 011.055-1.789l4.586-2.412a2 2 0 012.71 1.789V19M3 19h18" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 19a2 2 0 100-4 2 2 0 000 4zM18 19a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
);

export const BusIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M5 12v6h14v-6M10 12h4" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 18a2 2 0 100 4h14a2 2 0 100-4H5z" />
  </svg>
);

export const TrainIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v12H4z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 20h20M4 16v4m16-4v4" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 8h8M8 12h8" />
  </svg>
);

export const MotorbikeIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12a3 3 0 100-6 3 3 0 000 6z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 17.657L19 19m-7-7l1.343 1.343M6.343 6.343L5 5m7 7l-1.343-1.343M12 21a9 9 0 100-18 9 9 0 000 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12h4" />
  </svg>
);

export const LocationMarkerIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 20l-4.95-6.05a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

export const ClockIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const UsersIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm6-11a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export const TransportIcon: React.FC<{ mode: TransportMode; className?: string }> = ({ mode, className }) => {
  switch (mode) {
    case TransportMode.WALK: return <WalkIcon className={className} />;
    case TransportMode.CYCLE: return <CycleIcon className={className} />;
    case TransportMode.CAR: return <CarIcon className={className} />;
    case TransportMode.BUS: return <BusIcon className={className} />;
    case TransportMode.TRAIN: return <TrainIcon className={className} />;
    case TransportMode.MOTORBIKE: return <MotorbikeIcon className={className} />;
    case TransportMode.AUTO: return <CarIcon className={className} />; // Placeholder
    case TransportMode.TAXI: return <CarIcon className={className} />; // Placeholder
    default: return <CarIcon className={className} />;
  }
};
