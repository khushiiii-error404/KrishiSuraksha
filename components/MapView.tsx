
import React, { useState } from 'react';
import { MapPin, Target } from 'lucide-react';

interface MapViewProps {
  center: { lat: number; lng: number };
  zoom?: number; // Kept for interface compatibility
  markerPosition?: { lat: number; lng: number };
  className?: string;
}

// Primary: High-resolution aerial view (Unsplash) requested by user
const SATELLITE_IMAGE_URL = "https://images.unsplash.com/photo-1599120657548-b0b0124c911c?q=80&w=1080&auto=format&fit=crop";
// Backup: Reliable Wikimedia static image
const BACKUP_IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Rice_paddies_seen_from_above.jpg/1280px-Rice_paddies_seen_from_above.jpg";

export const MapView: React.FC<MapViewProps> = ({ 
  center, 
  className = '' 
}) => {
  const [imgSrc, setImgSrc] = useState(SATELLITE_IMAGE_URL);

  return (
    <div className={`relative w-full h-full bg-slate-900 rounded-lg overflow-hidden min-h-[200px] group ${className}`}>
      {/* Authentic Top-Down Farm Grid Satellite View */}
      <img 
        src={imgSrc}
        alt="Satellite Farm Grid View"
        referrerPolicy="no-referrer"
        onError={() => setImgSrc(BACKUP_IMAGE_URL)}
        className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
      />
      
      {/* HUD Overlay - Sci-Fi / Tech look for Insurance Monitoring */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Scan lines effect */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20"></div>
        
        {/* Reticle / Crosshairs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
           <Target className="w-32 h-32 text-white/20 stroke-1" />
        </div>

        {/* Dynamic Coordinates */}
        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-emerald-400 text-[10px] font-mono px-3 py-1.5 rounded border border-emerald-500/30 shadow-lg flex flex-col items-end">
           <span>LAT: {center.lat.toFixed(6)} N</span>
           <span>LNG: {center.lng.toFixed(6)} E</span>
           <span className="text-white/50 text-[9px] mt-0.5">ALT: 680m • RES: 10m</span>
        </div>
        
        {/* Corner Accents */}
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white/30 rounded-tr"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white/30 rounded-bl"></div>
      </div>

      {/* Map Marker */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-4 transition-all duration-500">
        <div className="relative flex flex-col items-center group-hover:-translate-y-2 transition-transform">
          <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Target Farm
          </div>
          <MapPin className="w-10 h-10 text-red-500 drop-shadow-2xl filter" fill="currentColor" />
          <div className="w-4 h-1.5 bg-black/50 blur-sm rounded-[100%] mt-[-2px]"></div>
        </div>
      </div>
    </div>
  );
};