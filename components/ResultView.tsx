import React from 'react';
import { DisasterAnalysis, Language, WeatherData, SatelliteData } from '../types';
import { Button } from './Button';
import { CheckCircle, AlertCircle, Satellite, ArrowRight, FileWarning, BookOpen, Thermometer, CloudRain, Signal, AlertTriangle, MapPin } from 'lucide-react';
import { translations } from '../translations';
import { MapView } from './MapView';

interface ResultViewProps {
  analysis: DisasterAnalysis;
  onAccept: () => void;
  onReject: () => void;
  language: Language;
  weatherData?: WeatherData;
  satelliteData?: SatelliteData;
  claimLocation: { lat: number, lng: number } | null;
}

export const ResultView: React.FC<ResultViewProps> = ({ analysis, onAccept, onReject, language, weatherData, satelliteData, claimLocation }) => {
  const isDisaster = analysis.type !== 'None';
  const isCropMatch = analysis.is_crop_match;
  const isHighRisk = analysis.fraud_risk === 'High';
  const t = translations[language];
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatConfidence = (val: number) => {
    if (val > 1) return val.toFixed(0);
    return (val * 100).toFixed(0);
  };

  // 1. CROP MISMATCH / UNCLEAR IMAGE STATE
  if (!isCropMatch) {
    return (
      <div className="max-w-md mx-auto animate-in zoom-in-95 duration-500 mt-10">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-red-100">
          <div className="bg-red-50 p-8 text-center border-b border-red-100">
            <div className="mx-auto bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
              <FileWarning className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-900 mb-2">{t.verificationFailed}</h2>
            <p className="text-red-700 text-sm font-medium">{analysis.description}</p>
          </div>
          
          <div className="p-8">
            <div className="bg-slate-50 rounded-xl p-4 mb-6 text-sm space-y-3 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">{t.aiDetected}</span>
                <span className="font-bold text-slate-900">{analysis.detected_crop || "Unclear"}</span>
              </div>
              {analysis.confidence > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.confidence}</span>
                  <span className="font-bold text-slate-900">{formatConfidence(analysis.confidence)}%</span>
                </div>
              )}
            </div>
            
            <Button 
              variant="primary"
              onClick={onReject} 
              className="w-full justify-center py-3"
            >
              {t.tryAgain}
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // 2. HIGH FRAUD RISK STATE
  if (isDisaster && isHighRisk) {
    return (
      <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200">
          <div className="bg-amber-500 p-8 text-center">
            <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm mb-4">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-1">{t.inconsistencyDetected}</h2>
            <p className="text-amber-100">{t.claimUnderReview}</p>
          </div>
          <div className="p-8">
            <div className="text-center mb-6">
              <p className="text-slate-600">
                {t.fraudWarning}
              </p>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-8">
              <h4 className="font-semibold text-slate-900 mb-3">{t.lossAssessment}</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{t.cause}</span>
                  <span className="font-medium text-red-600">{analysis.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{t.yieldLoss}</span>
                  <span className="font-medium text-slate-900">{analysis.severity}%</span>
                </div>
                 <div className="flex justify-between text-sm items-center border-t border-slate-200 pt-2 mt-2">
                  <span className="text-slate-500">{t.netPayout}</span>
                  <span className="font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs">{t.underReview.toUpperCase()}</span>
                </div>
              </div>
            </div>
            <Button 
              className="w-full justify-center py-3"
              onClick={onAccept}
            >
              {t.acknowledgeAndReturn}
            </Button>
          </div>
        </div>
        <p className="text-center text-slate-400 text-xs mt-6">
          {t.poweredBy}
        </p>
      </div>
    );
  }
  
  // 3. STANDARD RESULTS STATE (Crop Matched, Low/Medium Fraud Risk)
  return (
    <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
      <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden border ${isDisaster ? 'border-emerald-100' : 'border-slate-200'}`}>
        
        {/* Header Banner */}
        <div className={`p-8 text-center ${isDisaster ? 'bg-gradient-to-b from-emerald-600 to-emerald-700' : 'bg-slate-700'}`}>
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm mb-4">
            {isDisaster ? <CheckCircle className="w-10 h-10 text-white" /> : <AlertCircle className="w-10 h-10 text-white" />}
          </div>
          <h2 className="text-3xl font-bold text-white mb-1">
            {isDisaster ? t.claimApproved : t.noDisaster}
          </h2>
          <p className="text-emerald-100">
            {isDisaster ? t.parametricActive : t.normalConditions}
          </p>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {isDisaster ? (
            <>
              <div className="flex flex-col items-center mb-8">
                <span className="text-slate-500 font-medium uppercase tracking-wider text-xs mb-2">{t.netPayout}</span>
                <div className="text-5xl font-bold text-slate-900 tracking-tight">
                  {formatCurrency(analysis.payout)}
                </div>
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium">
                  <BookOpen className="w-3 h-3 mr-2" />
                  {analysis.pmfby_clause_citation || "PMFBY Guidelines"}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <h4 className="font-semibold text-slate-900 mb-3">{t.lossAssessment}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{t.cause}</span>
                      <span className="font-medium text-red-600">{analysis.type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{t.yieldLoss}</span>
                      <span className="font-medium text-slate-900">{analysis.severity}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{t.confidence}</span>
                      <span className="font-medium text-slate-900">{formatConfidence(analysis.confidence)}%</span>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-3">
                    "{analysis.description}"
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Satellite Verification Card */}
                  {satelliteData && (
                    <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                       <h4 className="font-semibold text-purple-900 mb-2 text-xs uppercase flex items-center">
                         <Signal className="w-3 h-3 mr-1.5" /> {t.satelliteCheck}
                       </h4>
                       <div className="flex justify-between items-center text-sm mb-2">
                         <span className="text-slate-600">{t.ndvi}:</span>
                         <span className={`font-bold px-2 py-0.5 rounded-full text-xs text-white ${
                            satelliteData.ndvi < 0.3 ? 'bg-red-500' : 
                            satelliteData.ndvi < 0.5 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}>
                           {satelliteData.ndvi.toFixed(3)}
                         </span>
                       </div>
                       <p className="text-xs text-purple-800 bg-purple-100 p-2 rounded">
                         {analysis.satellite_verification}
                       </p>
                    </div>
                  )}

                  {/* Weather Verification Card */}
                  {weatherData && (
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                     <h4 className="font-semibold text-blue-900 mb-2 text-xs uppercase flex items-center">
                       <CloudRain className="w-3 h-3 mr-1.5" /> {t.weatherCheck}
                     </h4>
                       <div className="flex justify-between text-sm mb-2">
                         <span className="text-slate-600">{t.rain7Days}:</span>
                         <span className="font-bold">{weatherData.rainSum7Days.toFixed(1)}mm</span>
                       </div>
                       <div className="flex justify-between text-sm mb-2">
                         <span className="text-slate-600">{t.tempMax}:</span>
                         <span className="font-bold">{weatherData.maxTemp7Days.toFixed(1)}°C</span>
                       </div>
                       <div className={`mt-2 text-xs p-2 rounded ${analysis.weather_check_match ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                         {analysis.weather_check_match ? 
                           `✅ ${t.consistent} (${analysis.weather_analysis})` : 
                           `❌ ${t.inconsistent} (${analysis.weather_analysis})`
                         }
                       </div>
                  </div>
                  )}

                  {/* Map Card */}
                  {claimLocation && (
                    <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                       <h4 className="font-semibold text-green-900 mb-2 text-xs uppercase flex items-center">
                         <MapPin className="w-3 h-3 mr-1.5" /> {t.claimLocation}
                       </h4>
                       <div className="h-40 w-full bg-slate-200 rounded-lg overflow-hidden">
                         <MapView 
                           center={claimLocation}
                           zoom={17}
                           markerPosition={claimLocation}
                         />
                       </div>
                    </div>
                   )}
                </div>
              </div>

               <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6">
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">{t.recommendation}</h4>
                    <p className="text-sm text-slate-600">{analysis.recommended_action}</p>
              </div>
            </>
          ) : (
             <div className="text-center py-8">
                <p className="text-slate-600 mb-6">
                  {analysis.description}
                </p>
                <div className="bg-slate-50 p-4 rounded-xl text-left text-sm text-slate-500">
                   <p><strong>Observation:</strong> {analysis.description}</p>
                   <div className="mt-2 flex justify-between items-center border-t border-slate-200 pt-2">
                     <span className="text-slate-500">{t.confidence}</span>
                     <span className="font-medium text-slate-900">{formatConfidence(analysis.confidence)}%</span>
                   </div>
                </div>
             </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button 
              variant="secondary" 
              className="flex-1 justify-center"
              onClick={onReject}
            >
              {isDisaster ? t.decline : t.returnDashboard}
            </Button>
            {isDisaster && (
              <Button 
                className="flex-1 justify-center py-4 text-lg shadow-emerald-200 shadow-lg"
                onClick={onAccept}
              >
                {t.acceptSettlement} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <p className="text-center text-slate-400 text-xs mt-6">
        {t.poweredBy}
      </p>
    </div>
  );
};