// Fix: Add global declarations for window.google and window.gm_authFailure to satisfy TypeScript, as they are loaded from an external script.
declare global {
  interface Window {
    google?: {
      maps?: any;
    };
    gm_authFailure?: () => void;
  }
}

const MAPS_API_KEY = process.env.API_KEY || '';

let googleMapsPromise: Promise<void> | null = null;

export const loadGoogleMapsScript = (): Promise<void> => {
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    if (!MAPS_API_KEY) {
      googleMapsPromise = null; // Reset for retry
      return reject(new Error("Google Maps API Key is missing. Ensure the API_KEY environment variable is set."));
    }

    if (window.google && window.google.maps) {
      return resolve();
    }

    // This is the recommended way by Google to handle auth errors.
    window.gm_authFailure = () => {
      googleMapsPromise = null; // Reset for retry
      const scriptTag = document.querySelector(`script[src*="maps.googleapis.com"]`);
      scriptTag?.remove(); // Clean up failed script
      delete window.gm_authFailure; // Clean up the global callback
      
      const detailedError = `Google Maps: Invalid API Key
This must be fixed in your Google Cloud project, not in the code.

Follow this checklist:
1. Enable Billing: Your project must have a credit card on file.
2. Enable APIs: Ensure "Maps JavaScript API" is enabled.
3. Check Key Restrictions: If you have "Website restrictions", make sure this app's URL is listed as an allowed referrer. This is the most common problem.
4. Check the Key: Double-check that the API key is correct and has no typos.

Fix it here: https://console.cloud.google.com/apis/credentials`;
      
      reject(new Error(detailedError));
    };
    
    const script = document.createElement('script');
    // Using v=weekly and relying on onload is a robust way to load the script.
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&v=weekly`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      // Once loaded successfully, we can clean up the auth failure callback.
      if (window.gm_authFailure) {
        delete window.gm_authFailure;
      }
      resolve();
    };
    
    script.onerror = () => {
      googleMapsPromise = null; // Reset for retry
      const scriptTag = document.querySelector(`script[src*="maps.googleapis.com"]`);
      scriptTag?.remove(); // Clean up failed script
      if (window.gm_authFailure) {
        delete window.gm_authFailure;
      }
      reject(new Error(`The Google Maps script failed to load. Please check your network connection.`));
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
};
