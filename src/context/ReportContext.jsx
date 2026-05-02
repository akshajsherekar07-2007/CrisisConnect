import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { demoRescueTeams } from '../data';

const ReportContext = createContext(null);

export const useReports = () => {
  const ctx = useContext(ReportContext);
  if (!ctx) throw new Error('useReports must be used within ReportProvider');
  return ctx;
};

// Haversine formula to calculate distance between two coordinates
const calcDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('crisisconnect_reports');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('crisisconnect_reports', JSON.stringify(reports));
  }, [reports]);

  const submitReport = useCallback((data) => {
    const newReport = {
      id: 'report-' + Date.now(),
      timestamp: Date.now(),
      status: 'submitted',
      forwarded: true,
      ...data,
    };
    setReports(prev => [newReport, ...prev]);
    return newReport;
  }, []);

  const getNearbyTeams = useCallback((lat, lng, maxDistance = 50) => {
    if (!lat || !lng) return [];
    return demoRescueTeams
      .map(team => ({
        ...team,
        distance: calcDistance(lat, lng, team.lat, team.lng),
      }))
      .filter(team => team.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);
  }, []);

  return (
    <ReportContext.Provider value={{
      reports,
      submitReport,
      getNearbyTeams,
    }}>
      {children}
    </ReportContext.Provider>
  );
};
