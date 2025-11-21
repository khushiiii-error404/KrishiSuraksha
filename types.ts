
export type Language = 'en' | 'kn';

export interface DisasterAnalysis {
  type: 'Drought' | 'Flood' | 'Pest' | 'Disease' | 'Fire' | 'Storm' | 'None';
  confidence: number;
  severity: number; // 0-100
  description: string;
  payout: number;
  satellite_verification: string;
  recommended_action: string;
  fraud_risk?: 'Low' | 'Medium' | 'High';
  weather_check_match?: boolean;
  is_crop_match: boolean;
  detected_crop: string;
  pmfby_clause_citation?: string; // e.g. "Clause 15.3 (Localized Calamity)"
  weather_analysis?: string; // Reasoning about weather data
}

export interface Claim {
  id: string;
  date: string;
  type: string;
  severity: number;
  payout: number;
  status: 'Processing' | 'Approved' | 'Paid' | 'Rejected' | 'Under Review';
  imageUrl?: string;
  policyId?: string;
}

export interface Policy {
  id: string;
  farmerName: string;
  landId: string; // e.g. Survey No from Bhoomi
  cropType: string;
  season: 'Kharif' | 'Rabi'; // PMFBY Season
  acres: number;
  sumInsured: number;
  premiumPaid: number; // Farmer Share (2% or 1.5%)
  implementingAgency: string; // e.g. AIC, HDFC Ergo
  location: string;
  lat: number;
  lng: number;
  govtDbStatus: 'Linked' | 'Pending'; 
}

export interface UserProfile {
  name: string;
  aadhaarLast4: string;
  phone: string;
  bankName: string;
  accountLast4: string;
  village: string;
  district: string;
}

export interface WeatherData {
  rainSum7Days: number;
  maxTemp7Days: number;
  isConsistent: boolean;
  source?: string;
}

export interface CurrentWeather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  conditionCode: number;
}

export interface SatelliteData {
  ndvi: number; // Normalized Difference Vegetation Index
  lastUpdated: string; // Date of the satellite data
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  REPORT = 'REPORT',
  ANALYSIS = 'ANALYSIS',
  RESULT = 'RESULT'
}
