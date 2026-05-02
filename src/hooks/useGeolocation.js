// Custom hook for geolocation — wraps the geolocation service into React state

import { useState, useEffect } from 'react';
import { getCurrentPosition } from '../services/geolocation';

const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getCurrentPosition()
      .then((pos) => {
        if (!cancelled) {
          setLocation(pos);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  return { location, loading, error };
};

export default useGeolocation;
