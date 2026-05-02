// Mock pre-alert, weather, and community data for demo mode

export const demoPreAlerts = [
  {
    id: 'pa1', type: 'flood', title: 'Heavy Rainfall Warning',
    description: 'IMD predicts heavy to very heavy rainfall in the next 48 hours. River levels may rise significantly.',
    severity: 'high', region: 'Delhi NCR', issueDate: Date.now() - 86400000,
    expiryDate: Date.now() + 172800000, status: 'active',
    preparationTasks: ['Stock emergency supplies', 'Move to higher ground', 'Keep emergency contacts ready', 'Charge all devices', 'Prepare first aid kit'],
    communityMembers: 24
  },
  {
    id: 'pa2', type: 'cyclone', title: 'Cyclone Alert - Category 3',
    description: 'Cyclonic storm forming in Bay of Bengal expected to make landfall in 72 hours. Wind speeds up to 120 kmph expected.',
    severity: 'critical', region: 'Coastal Areas', issueDate: Date.now() - 43200000,
    expiryDate: Date.now() + 259200000, status: 'active',
    preparationTasks: ['Evacuate coastal areas', 'Board up windows', 'Store water and food', 'Prepare evacuation bags', 'Identify nearest shelter'],
    communityMembers: 67
  },
  {
    id: 'pa3', type: 'earthquake', title: 'Seismic Activity Detected',
    description: 'Minor seismic activity detected in Zone IV. Residents advised to review earthquake preparedness measures.',
    severity: 'medium', region: 'North India', issueDate: Date.now() - 172800000,
    expiryDate: Date.now() + 86400000, status: 'monitoring',
    preparationTasks: ['Identify safe spots in home', 'Prepare emergency kit', 'Learn earthquake drill', 'Check building integrity'],
    communityMembers: 15
  },
];

export const demoCommunities = [
  { id: 'c1', name: 'Delhi Flood Response Team', members: 156, activeAlerts: 2, type: 'flood', region: 'Delhi NCR' },
  { id: 'c2', name: 'NCR Earthquake Preparedness', members: 89, activeAlerts: 1, type: 'earthquake', region: 'NCR' },
  { id: 'c3', name: 'Highway Accident Response', members: 234, activeAlerts: 3, type: 'accident', region: 'Pan India' },
  { id: 'c4', name: 'Coastal Cyclone Watch', members: 312, activeAlerts: 1, type: 'cyclone', region: 'Coastal India' },
];

export const demoWeather = {
  current: { temp: 32, humidity: 78, windSpeed: 15, condition: 'Partly Cloudy', icon: '⛅', pressure: 1008 },
  forecast: [
    { day: 'Today', temp: 32, condition: 'Partly Cloudy', icon: '⛅', rain: 20 },
    { day: 'Tomorrow', temp: 28, condition: 'Heavy Rain', icon: '🌧️', rain: 85 },
    { day: 'Wed', temp: 26, condition: 'Thunderstorm', icon: '⛈️', rain: 90 },
    { day: 'Thu', temp: 29, condition: 'Light Rain', icon: '🌦️', rain: 40 },
    { day: 'Fri', temp: 33, condition: 'Sunny', icon: '☀️', rain: 5 },
  ],
  alerts: [
    { type: 'Heavy Rain', severity: 'warning', message: 'Heavy rainfall expected in the next 48 hours' },
    { type: 'Flood Risk', severity: 'watch', message: 'River levels approaching danger mark' },
  ]
};
