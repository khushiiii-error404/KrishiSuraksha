
import { SatelliteData } from "../types";


export const getSatelliteData = async (lat: number, lng: number): Promise<SatelliteData> => {
  console.log(`Fetching mock satellite data for ${lat}, ${lng}...`);

  return new Promise(resolve => {
    setTimeout(() => {
      // Simulate a random but plausible NDVI value.
      // Healthy vegetation is typically > 0.4. Stressed is < 0.3.
      const mockNdvi = parseFloat((Math.random() * (0.8 - 0.1) + 0.1).toFixed(3));
      
      const today = new Date();
      today.setDate(today.getDate() - 3); // Simulate data is a few days old

      const response: SatelliteData = {
        ndvi: mockNdvi,
        lastUpdated: today.toISOString().split('T')[0],
      };
      
      console.log("Mock Satellite Data:", response);
      resolve(response);
    }, 1500); // Simulate network latency of 1.5 seconds
  });
};
