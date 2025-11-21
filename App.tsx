
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { DisasterReporter } from './components/DisasterReporter';
import { AnalysisView } from './components/AnalysisView';
import { ResultView } from './components/ResultView';
import { Claim, DisasterAnalysis, ViewState, Policy, WeatherData, Language, SatelliteData, UserProfile } from './types';
import { analyzeDisasterImage } from './services/geminiService';
import { getLocalWeatherHistory } from './services/weatherService';
import { getSatelliteData } from './services/satelliteService';
import { calculatePMFBYPayout } from './services/payoutService';

// Mock Policies Database (Simulating Backend/Bhoomi)
// Calculating premium based on standard rates: Kharif 2%, Rabi 1.5%
const MOCK_POLICIES: Policy[] = [
  {
    id: 'pol_01',
    farmerName: 'Ramesh Kumar',
    landId: 'SVY-102/4',
    cropType: 'Paddy (Rice)',
    season: 'Kharif',
    acres: 2.5,
    sumInsured: 250000,
    premiumPaid: 5000, // 2% of 250000
    implementingAgency: 'AIC of India',
    location: 'Mandya, Karnataka',
    lat: 12.532981,
    lng: 76.932119,
    govtDbStatus: 'Linked'
  },
  {
    id: 'pol_02',
    farmerName: 'Ramesh Kumar',
    landId: 'SVY-104/2',
    cropType: 'Cotton',
    season: 'Kharif',
    acres: 5.0,
    sumInsured: 500000,
    premiumPaid: 10000, // 2% of 500000
    implementingAgency: 'HDFC Ergo',
    location: 'Mandya, Karnataka',
    lat: 12.533500,
    lng: 76.931500,
    govtDbStatus: 'Linked'
  },
  {
    id: 'pol_03',
    farmerName: 'Ramesh Kumar',
    landId: 'SVY-108/A',
    cropType: 'Wheat',
    season: 'Rabi',
    acres: 2.0,
    sumInsured: 150000,
    premiumPaid: 2250, // 1.5% of 150000
    implementingAgency: 'AIC of India',
    location: 'Mandya, Karnataka',
    lat: 12.531500,
    lng: 76.933000,
    govtDbStatus: 'Linked'
  }
];

// Mock User Profile
const MOCK_USER: UserProfile = {
  name: "Ramesh Kumar",
  aadhaarLast4: "8821",
  phone: "+91 98765 43210",
  bankName: "SBI Mandya",
  accountLast4: "3302",
  village: "Keregodu",
  district: "Mandya"
};

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<DisasterAnalysis | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [activePolicy, setActivePolicy] = useState<Policy | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | undefined>(undefined);
  const [satelliteData, setSatelliteData] = useState<SatelliteData | undefined>(undefined);
  const [language, setLanguage] = useState<Language>('en');
  const [claimLocation, setClaimLocation] = useState<{lat: number, lng: number} | null>(null);

  const resetState = () => {
    setView(ViewState.DASHBOARD);
    setCurrentAnalysis(null);
    setActivePolicy(null);
    setWeatherData(undefined);
    setSatelliteData(undefined);
    setCurrentImage(null);
    setClaimLocation(null);
  };

  const handleStartReport = (policy: Policy) => {
    setActivePolicy(policy);
    setView(ViewState.REPORT);
  };

  const handleAnalyze = async (file: File, lat: number, lng: number) => {
    if (!activePolicy) return;

    try {
      setView(ViewState.ANALYSIS);
      setClaimLocation({ lat, lng });
      
      // 1. Fetch Real Weather & Satellite Data (Ground Truth) in parallel
      const [weather, satellite] = await Promise.all([
        getLocalWeatherHistory(lat, lng),
        getSatelliteData(lat, lng),
      ]);
      setWeatherData(weather);
      setSatelliteData(satellite);
      console.log("Fetched Weather Context:", weather);
      console.log("Fetched Satellite Context:", satellite);

      // 2. Process Image
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.readAsDataURL(file);
      });

      // Save preview for UI
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setCurrentImage(reader.result as string);

      // 3. Call Gemini API (With Weather, Satellite Context, Expected Crop, and Language)
      const analysis = await analyzeDisasterImage(
        base64, 
        lat, 
        lng, 
        activePolicy.cropType,
        weather,
        satellite,
        language
      );
      
      // 4. Calculate Payout using PMFBY Logic (Deterministic Math)
      const calculatedPayout = calculatePMFBYPayout(analysis.severity, activePolicy, analysis.type);
      analysis.payout = calculatedPayout;

      // Artificial delay for better UX to show the "Scanning" animation steps
      setTimeout(() => {
        setCurrentAnalysis(analysis);
        setView(ViewState.RESULT);
      }, 4000); 

    } catch (error) {
      console.error(error);
      alert("Analysis failed. Please try again.");
      resetState();
    }
  };

  const handleAcceptPayout = () => {
    if (currentAnalysis && activePolicy) {
      const isHighRisk = currentAnalysis.fraud_risk === 'High';
      const newClaim: Claim = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        type: currentAnalysis.type,
        severity: currentAnalysis.severity,
        payout: isHighRisk ? 0 : currentAnalysis.payout, // Payout is 0 if under review
        status: isHighRisk ? 'Under Review' : 'Paid',
        imageUrl: currentImage || undefined,
        policyId: activePolicy.id
      };
      setClaims([newClaim, ...claims]);
    }
    resetState();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header 
        onHome={resetState} 
        language={language}
        setLanguage={setLanguage}
      />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === ViewState.DASHBOARD && (
          <Dashboard 
            onReportClick={handleStartReport} 
            claims={claims}
            policies={MOCK_POLICIES}
            language={language}
            userProfile={MOCK_USER}
          />
        )}
        
        {view === ViewState.REPORT && (
          <DisasterReporter 
            onAnalyze={handleAnalyze} 
            onCancel={resetState}
            language={language}
          />
        )}
        
        {view === ViewState.ANALYSIS && (
          <AnalysisView language={language} />
        )}
        
        {view === ViewState.RESULT && currentAnalysis && (
          <ResultView 
            analysis={currentAnalysis}
            onAccept={handleAcceptPayout}
            onReject={resetState}
            language={language}
            weatherData={weatherData}
            satelliteData={satelliteData}
            claimLocation={claimLocation}
          />
        )}
      </main>
    </div>
  );
}