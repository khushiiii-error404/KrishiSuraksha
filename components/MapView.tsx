import React from 'react';
import { MapPin } from 'lucide-react';

interface MapViewProps {
  center: { lat: number; lng: number };
  zoom?: number; // Kept for API compatibility, but not used
  markerPosition?: { lat: number; lng: number }; // Kept for API compatibility, but not used
  className?: string;
}

// The user-provided satellite image of the specific farmland.
const SATELLITE_IMAGE_URL = 'https://i.sstatic.net/r2G2V.png';

export const MapView: React.FC<MapViewProps> = ({ center, className = '' }) => {
  const style = {
    backgroundImage: `url(${SATELLITE_IMAGE_URL})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const altText = "Satellite view of the specified farm policy location";

  return (
    <div
      className={`h-full w-full bg-slate-800 overflow-hidden relative group ${className}`}
      style={style}
      role="img"
      aria-label={altText}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-4">
        <div className="flex items-center text-white bg-black/50 backdrop-blur-sm p-2 rounded-lg text-xs">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <div className="truncate">
            <span className="font-semibold block">Policy Location</span>
            <span className="opacity-80">{center.lat.toFixed(4)}, {center.lng.toFixed(4)}</span>
          </div>
        </div>
      </div>
      <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
        STATIC PREVIEW
      </div>
    </div>
  );
};
