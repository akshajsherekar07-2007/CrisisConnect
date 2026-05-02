// Mock statistics data for demo mode

export const demoStats = {
  totalVolunteers: 2847,
  activeRequests: 156,
  resolvedCrises: 12453,
  communitiesFormed: 89,
  avgResponseTime: '4.2 min',
  livesImpacted: 45000,
};

export const demoAdminStats = {
  usersRegistered: 4523,
  volunteersVerified: 2847,
  pendingVerifications: 34,
  activeRequests: 156,
  requestsToday: 23,
  avgResponseTime: 4.2,
  resolutionRate: 94.5,
  requestsByType: [
    { name: 'Flood', value: 45, color: '#3b82f6' },
    { name: 'Earthquake', value: 15, color: '#ef4444' },
    { name: 'Fire', value: 20, color: '#f97316' },
    { name: 'Accident', value: 30, color: '#eab308' },
    { name: 'Medical', value: 25, color: '#ec4899' },
    { name: 'Cyclone', value: 10, color: '#8b5cf6' },
    { name: 'Other', value: 12, color: '#6b7280' },
  ],
  requestsOverTime: [
    { date: 'Mon', requests: 12, resolved: 10 },
    { date: 'Tue', requests: 19, resolved: 17 },
    { date: 'Wed', requests: 25, resolved: 22 },
    { date: 'Thu', requests: 18, resolved: 16 },
    { date: 'Fri', requests: 23, resolved: 21 },
    { date: 'Sat', requests: 31, resolved: 28 },
    { date: 'Sun', requests: 15, resolved: 14 },
  ],
  responseTimeData: [
    { hour: '00:00', time: 3.5 },
    { hour: '04:00', time: 5.2 },
    { hour: '08:00', time: 2.8 },
    { hour: '12:00', time: 3.1 },
    { hour: '16:00', time: 4.0 },
    { hour: '20:00', time: 3.8 },
  ],
  recentActivity: [
    { id: 'a1', action: 'New SOS Request', user: 'Suresh Yadav', time: Date.now() - 300000, type: 'request' },
    { id: 'a2', action: 'Volunteer Verified', user: 'Rahul Sharma', time: Date.now() - 1200000, type: 'verification' },
    { id: 'a3', action: 'Task Completed', user: 'Priya Patel', time: Date.now() - 2400000, type: 'completion' },
    { id: 'a4', action: 'Pre-Alert Issued', user: 'System', time: Date.now() - 3600000, type: 'alert' },
    { id: 'a5', action: 'Community Created', user: 'Vikram Singh', time: Date.now() - 7200000, type: 'community' },
  ]
};
