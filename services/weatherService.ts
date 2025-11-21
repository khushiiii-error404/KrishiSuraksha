import { WeatherData, CurrentWeather } from "../types";

// FETCH CURRENT WEATHER (For Dashboard)
export const getCurrentWeather = async (lat: number, lng: number): Promise<CurrentWeather> => {
  try {
    // Using Open-Meteo Forecast API
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.current) {
      throw new Error("Current weather data unavailable");
    }

    return {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      conditionCode: data.current.weather_code
    };
  } catch (error) {
    console.warn("Current weather fetch failed:", error);
    return {
      temperature: 32,
      humidity: 65,
      windSpeed: 12,
      conditionCode: 0
    };
  }
};

// FETCH HISTORICAL WEATHER (For Verification)
// FIXED: Switched from 'archive-api' to 'forecast?past_days=7'
// The Archive API has a 5-day lag. The Forecast API provides modeled history for the immediate past, which is accurate for recent claims.
export const getLocalWeatherHistory = async (lat: number, lng: number): Promise<WeatherData> => {
  try {
    // past_days=7 includes today and the previous 7 days
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,precipitation_sum&past_days=7&timezone=auto`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.daily) {
      throw new Error("Weather data unavailable");
    }

    // Calculate totals/averages for the PAST 7 days (excluding forecast days if any)
    // The API returns past days first.
    const rains = data.daily.precipitation_sum.slice(0, 7);
    const temps = data.daily.temperature_2m_max.slice(0, 7);

    const rainSum = rains.reduce((a: number, b: number) => a + (b || 0), 0);
    const maxTemp = Math.max(...temps);

    return {
      rainSum7Days: rainSum,
      maxTemp7Days: maxTemp,
      isConsistent: true, // Default, will be checked against claim type by AI
      source: 'Open-Meteo API'
    };
  } catch (error) {
    console.warn("Weather API failed, using fallback values:", error);
    // Fallback data if API fails (to prevent app crash)
    return {
      rainSum7Days: 0,
      maxTemp7Days: 30,
      isConsistent: true,
      source: 'Fallback Mode'
    };
  }
};
