// Geolocation service — wraps browser Geolocation API
// Pure async functions only. For geo calculations, see utils/geo.js

export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      // Fallback: return Delhi coordinates for demo
      resolve({ lat: 28.6139, lng: 77.2090 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        console.warn('Geolocation error, using demo location:', error.message);
        resolve({ lat: 28.6139, lng: 77.2090 });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
};
