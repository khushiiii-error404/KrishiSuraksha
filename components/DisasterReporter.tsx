
import React, { useState, useRef } from 'react';
import { Camera, Upload, MapPin, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { Language } from '../types';
import { translations } from '../translations';

interface DisasterReporterProps {
  onAnalyze: (file: File, lat: number, lng: number) => void;
  onCancel: () => void;
  language: Language;
}

export const DisasterReporter: React.FC<DisasterReporterProps> = ({ onAnalyze, onCancel, language }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const t = translations[language];
  
  // Refs to trigger file inputs programmatically
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
      
      // Auto-fetch location when file is selected if not already found
      if (!location) {
        fetchLocation();
      }
    }
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleGalleryClick = () => {
    galleryInputRef.current?.click();
  };

  const fetchLocation = () => {
    setLocating(true);
    setLocationError(null);
    setLocation(null); // Clear old location to ensure freshness

    const useFallback = () => {
      // Fallback to Mandya, Karnataka for Demo purposes
      console.log("Using fallback location (Mandya)");
      // Updated coordinates as requested
      setLocation({ lat: 12.532981, lng: 76.932119 });
      setLocating(false);
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocating(false);
        },
        (error) => {
          console.warn(`Location error (${error.code}): ${error.message}. Using fallback.`);
          // Instead of blocking, we use the fallback for the demo
          useFallback();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // Reduced timeout since we have a fallback
          maximumAge: 0
        }
      );
    } else {
      console.warn("Geolocation not supported. Using fallback.");
      useFallback();
    }
  };

  const handleSubmit = () => {
    if (selectedFile && location) {
      onAnalyze(selectedFile, location.lat, location.lng);
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreviewUrl(null);
    // Reset inputs
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  // Helper to check if using fallback coordinates
  const isFallbackLocation = location?.lat === 12.532981 && location?.lng === 76.932119;

  return (
    <div className="max-w-lg mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">{t.reportTitle}</h2>
          <p className="text-slate-500 text-sm mt-1">
            {t.reportSubtitle}
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Hidden Inputs */}
          <input 
            type="file" 
            ref={cameraInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            capture="environment"
            className="hidden" 
          />
          <input 
            type="file" 
            ref={galleryInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />

          {/* Image Upload Area */}
          <div className="relative">
            {previewUrl ? (
              <div className="relative border-2 border-emerald-500 bg-emerald-50 rounded-xl p-4 text-center">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-h-64 w-full object-contain rounded-lg shadow-sm mx-auto" 
                />
                <button 
                  onClick={handleReset}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-full shadow-md transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span className="sr-only">Change Photo</span>
                </button>
                <p className="mt-2 text-sm font-medium text-emerald-700 flex items-center justify-center">
                  <CheckCircleIcon className="w-4 h-4 mr-1" /> {t.photoAttached}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Camera Option */}
                <button 
                  type="button"
                  onClick={handleCameraClick}
                  className="cursor-pointer group border-2 border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50 rounded-xl p-6 flex flex-col items-center justify-center transition-all h-40 relative w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full mb-3 group-hover:scale-110 transition-transform">
                    <Camera className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-slate-900">{t.takePhoto}</h3>
                  <p className="text-xs text-slate-500 mt-1">{t.systemCamera}</p>
                </button>

                {/* Gallery Option */}
                <button 
                  type="button"
                  onClick={handleGalleryClick}
                  className="cursor-pointer group border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 rounded-xl p-6 flex flex-col items-center justify-center transition-all h-40 relative w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-full mb-3 group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-slate-900">{t.uploadFile}</h3>
                  <p className="text-xs text-slate-500 mt-1">{t.fromGallery}</p>
                </button>
              </div>
            )}
          </div>

          {/* Location Status */}
          <div className={`rounded-lg p-4 flex items-center justify-between transition-colors ${locationError ? 'bg-red-50 border border-red-100' : 'bg-slate-50'}`}>
            <div className="flex items-center">
              <div className={`p-2 rounded-full mr-3 ${location ? 'bg-emerald-100 text-emerald-600' : locationError ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-500'}`}>
                {locationError ? <AlertCircle className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
              </div>
              <div>
                <p className={`text-sm font-medium ${locationError ? 'text-red-900' : 'text-slate-900'}`}>
                  {locationError ? t.locError : t.locationVerification}
                </p>
                <p className={`text-xs ${locationError ? 'text-red-700' : 'text-slate-500'}`}>
                  {locating ? t.triangulating : 
                   isFallbackLocation ? t.usingDemoLoc :
                   location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : 
                   locationError ? locationError : t.exactLocReq}
                </p>
              </div>
            </div>
            {(!location && !locating) && (
              <Button 
                variant={locationError ? 'danger' : 'secondary'} 
                onClick={fetchLocation} 
                className="text-xs py-1 px-2 h-8"
              >
                {locationError ? t.retryGps : t.getLocation}
              </Button>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button 
              variant="secondary" 
              onClick={onCancel}
              className="flex-1"
            >
              {t.cancel}
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!selectedFile || !location}
              className="flex-1"
            >
              {t.analyze}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  )
}