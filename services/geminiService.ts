import { GoogleGenAI, Type } from "@google/genai";
import { DisasterAnalysis, WeatherData, Language, SatelliteData } from "../types";
import { getClauseCitation } from "./payoutService";

const API_KEY = process.env.API_KEY || '';

export const analyzeDisasterImage = async (
  imageBase64: string, 
  lat: number, 
  lng: number,
  expectedCrop: string,
  weatherData?: WeatherData,
  satelliteData?: SatelliteData,
  language: Language = 'en'
): Promise<DisasterAnalysis> => {
  if (!API_KEY) {
    console.error("API Key is missing");
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Construct context-aware prompts
  let weatherContext = "No local weather data available.";
  if (weatherData) {
    weatherContext = `
      Real-time Weather Station Data (Last 7 days):
      - Total Rainfall: ${weatherData.rainSum7Days.toFixed(1)} mm
      - Max Temperature: ${weatherData.maxTemp7Days.toFixed(1)} °C
    `;
  }

  let satelliteContext = "No satellite vegetation index data available.";
  if (satelliteData) {
    satelliteContext = `
      Satellite Vegetation Index (NDVI) from ${satelliteData.lastUpdated}:
      - NDVI Value: ${satelliteData.ndvi}
      (Note: Healthy vegetation NDVI is > 0.4. Stressed/unhealthy is < 0.3).
    `;
  }

  const languageInstruction = language === 'kn' 
    ? "IMPORTANT: Provide all text fields ('description', 'satellite_verification', etc.) in KANNADA language." 
    : "Provide all text fields ('description', 'satellite_verification', etc.) in ENGLISH language.";

  const prompt = `
    You are an AI Digital Surveyor for the Pradhan Mantri Fasal Bima Yojana (PMFBY).
    Your task is to perform an "Individual Farm Level Assessment" under Clause 20 (Use of Innovative Technology).
    
    Context: 
    1. Location: Lat ${lat}, Lng ${lng}.
    2. Policy Data: Farmer insured for '${expectedCrop}'.
    3. ${weatherContext}
    4. ${satelliteContext}
    
    Protocol:
    1. CROP VERIFICATION (Bhoomi Database Match): 
       - Visually confirm if the crop in the photo is '${expectedCrop}'.
       - If it is a completely different crop, or if the image is too blurry/unclear to identify, flag "is_crop_match": false.

    2. DISASTER IDENTIFICATION (Clause 8.1):
       - Detect: 'Drought', 'Flood' (Inundation), 'Pest', 'Disease', 'Fire', 'Storm' (Hailstorm/Cyclone), or 'None'.
    
    3. SATELLITE CROSS-VERIFICATION (Ground Truth Check 1):
       - Compare the visual evidence with the satellite NDVI value. 
       - If "Drought" or severe "Pest/Disease" is claimed, the NDVI should be low (<0.3).
       - If "Flood" is claimed, NDVI might be very low or negative.
       - If the photo shows healthy crops but NDVI is low, it could indicate a recent event not yet visible from space. Note this possibility.
       - Provide a concise one-sentence analysis in the 'satellite_verification' field explaining if the NDVI data supports the visual evidence.
       
    4. WEATHER PATTERN VALIDITY (Ground Truth Check 2):
       - If "Flood" detected AND Rain < 10mm -> Flag "weather_check_match": false.
       - If "Drought" detected AND Rain > 50mm -> Flag "weather_check_match": false.
       - Otherwise "weather_check_match": true.
       - Provide a short reasoning in 'weather_analysis'.
       
    5. LOSS ASSESSMENT (Clause 15.3):
       - Estimate 'severity' (0-100%) representing the Percentage of Yield Loss based on the photo.
       
    ${languageInstruction}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { 
              type: Type.STRING, 
              description: "Disaster type per Clause 8.1. One of: Drought, Flood, Pest, Disease, Fire, Storm, None" 
            },
            confidence: { 
              type: Type.INTEGER, 
              description: "AI Confidence (0-100)" 
            },
            severity: { 
              type: Type.INTEGER, 
              description: "Estimated Yield Loss % (0-100)" 
            },
            description: { 
              type: Type.STRING, 
              description: "Technical assessment description (Localized)" 
            },
            satellite_verification: { 
              type: Type.STRING, 
              description: "Concise analysis of whether NDVI data supports visual evidence." 
            },
            recommended_action: { 
              type: Type.STRING, 
              description: "Next steps for farmer or IA (Localized)" 
            },
            fraud_risk: { 
              type: Type.STRING, 
              description: "Risk level: Low, Medium, or High" 
            },
            weather_check_match: { 
              type: Type.BOOLEAN, 
              description: "Does visual evidence align with weather data?" 
            },
            weather_analysis: {
              type: Type.STRING,
              description: "Reasoning for weather data correlation"
            },
            is_crop_match: { 
              type: Type.BOOLEAN, 
              description: "Does crop match policy?" 
            },
            detected_crop: { 
              type: Type.STRING, 
              description: "Name of crop identified" 
            }
          },
          required: [
            "type", "confidence", "severity", "description", 
            "satellite_verification", "recommended_action", 
            "fraud_risk", "weather_check_match", "weather_analysis",
            "is_crop_match", "detected_crop"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    const result = JSON.parse(text);
    
    // Inject the specific PMFBY clause citation based on the result
    const citation = getClauseCitation(result.type);

    return {
      ...result,
      pmfby_clause_citation: citation,
      payout: 0 // Calculated in App.tsx
    } as DisasterAnalysis;

  } catch (error) {import { GoogleGenAI, Type } from "@google/genai";
import { DisasterAnalysis, WeatherData, Language, SatelliteData } from "../types";
import { getClauseCitation } from "./payoutService";

const API_KEY = process.env.API_KEY || '';

export const analyzeDisasterImage = async (
  imageBase64: string, 
  lat: number, 
  lng: number,
  expectedCrop: string,
  weatherData?: WeatherData,
  satelliteData?: SatelliteData,
  language: Language = 'en'
): Promise<DisasterAnalysis> => {
  if (!API_KEY) {
    console.error("API Key is missing");
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Construct context-aware prompts
  let weatherContext = "No local weather data available.";
  if (weatherData) {
    weatherContext = `
      Real-time Weather Station Data (Last 7 days):
      - Total Rainfall: ${weatherData.rainSum7Days.toFixed(1)} mm
      - Max Temperature: ${weatherData.maxTemp7Days.toFixed(1)} °C
    `;
  }

  let satelliteContext = "No satellite vegetation index data available.";
  if (satelliteData) {
    satelliteContext = `
      Satellite Vegetation Index (NDVI) from ${satelliteData.lastUpdated}:
      - NDVI Value: ${satelliteData.ndvi}
      (Note: Healthy vegetation NDVI is > 0.4. Stressed/unhealthy is < 0.3).
    `;
  }

  const languageInstruction = language === 'kn' 
    ? "IMPORTANT: Provide all text fields ('description', 'satellite_verification', etc.) in KANNADA language." 
    : "Provide all text fields ('description', 'satellite_verification', etc.) in ENGLISH language.";

  const prompt = `
    You are an AI Digital Surveyor for the Pradhan Mantri Fasal Bima Yojana (PMFBY).
    Your task is to perform an "Individual Farm Level Assessment" under Clause 20 (Use of Innovative Technology).
    
    Context: 
    1. Location: Lat ${lat}, Lng ${lng}.
    2. Policy Data: Farmer insured for '${expectedCrop}'.
    3. ${weatherContext}
    4. ${satelliteContext}
    
    Protocol:
    1. CROP VERIFICATION (Bhoomi Database Match): 
       - Visually confirm if the crop in the photo is '${expectedCrop}'.
       - If it is a completely different crop, or if the image is too blurry/unclear to identify, flag "is_crop_match": false.

    2. DISASTER IDENTIFICATION (Clause 8.1):
       - Detect: 'Drought', 'Flood' (Inundation), 'Pest', 'Disease', 'Fire', 'Storm' (Hailstorm/Cyclone), or 'None'.
    
    3. SATELLITE CROSS-VERIFICATION (Ground Truth Check 1):
       - Compare the visual evidence with the satellite NDVI value. 
       - If "Drought" or severe "Pest/Disease" is claimed, the NDVI should be low (<0.3).
       - If "Flood" is claimed, NDVI might be very low or negative.
       - If the photo shows healthy crops but NDVI is low, it could indicate a recent event not yet visible from space. Note this possibility.
       - Provide a concise one-sentence analysis in the 'satellite_verification' field explaining if the NDVI data supports the visual evidence.
       
    4. WEATHER PATTERN VALIDITY (Ground Truth Check 2):
       - If "Flood" detected AND Rain < 10mm -> Flag "weather_check_match": false.
       - If "Drought" detected AND Rain > 50mm -> Flag "weather_check_match": false.
       - Otherwise "weather_check_match": true.
       - Provide a short reasoning in 'weather_analysis'.
       
    5. LOSS ASSESSMENT (Clause 15.3):
       - Estimate 'severity' (0-100%) representing the Percentage of Yield Loss based on the photo.
       
    ${languageInstruction}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { 
              type: Type.STRING, 
              description: "Disaster type per Clause 8.1. One of: Drought, Flood, Pest, Disease, Fire, Storm, None" 
            },
            confidence: { 
              type: Type.INTEGER, 
              description: "AI Confidence (0-100)" 
            },
            severity: { 
              type: Type.INTEGER, 
              description: "Estimated Yield Loss % (0-100)" 
            },
            description: { 
              type: Type.STRING, 
              description: "Technical assessment description (Localized)" 
            },
            satellite_verification: { 
              type: Type.STRING, 
              description: "Concise analysis of whether NDVI data supports visual evidence." 
            },
            recommended_action: { 
              type: Type.STRING, 
              description: "Next steps for farmer or IA (Localized)" 
            },
            fraud_risk: { 
              type: Type.STRING, 
              description: "Risk level: Low, Medium, or High" 
            },
            weather_check_match: { 
              type: Type.BOOLEAN, 
              description: "Does visual evidence align with weather data?" 
            },
            weather_analysis: {
              type: Type.STRING,
              description: "Reasoning for weather data correlation"
            },
            is_crop_match: { 
              type: Type.BOOLEAN, 
              description: "Does crop match policy?" 
            },
            detected_crop: { 
              type: Type.STRING, 
              description: "Name of crop identified" 
            }
          },
          required: [
            "type", "confidence", "severity", "description", 
            "satellite_verification", "recommended_action", 
            "fraud_risk", "weather_check_match", "weather_analysis",
            "is_crop_match", "detected_crop"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    const result = JSON.parse(text);
    
    // Inject the specific PMFBY clause citation based on the result
    const citation = getClauseCitation(result.type);

    return {
      ...result,
      pmfby_clause_citation: citation,
      payout: 0 // Calculated in App.tsx
    } as DisasterAnalysis;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      type: 'None',
      confidence: 0,
      severity: 0,
      description: language === 'kn' ? "ವಿಶ್ಲೇಷಣೆ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ." : "Analysis failed. Please retry.",
      satellite_verification: "N/A",
      recommended_action: "Retry",
      fraud_risk: 'Low',
      weather_check_match: true,
      is_crop_match: false,
      detected_crop: "Unknown",
      pmfby_clause_citation: "N/A",
      weather_analysis: "N/A",
      payout: 0
    };
  }
};
    console.error("Gemini Analysis Error:", error);
    return {
      type: 'None',
      confidence: 0,
      severity: 0,
      description: language === 'kn' ? "ವಿಶ್ಲೇಷಣೆ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ." : "Analysis failed. Please retry.",
      satellite_verification: "N/A",
      recommended_action: "Retry",
      fraud_risk: 'Low',
      weather_check_match: true,
      is_crop_match: false,
      detected_crop: "Unknown",
      pmfby_clause_citation: "N/A",
      weather_analysis: "N/A",
      payout: 0
    };
  }
};