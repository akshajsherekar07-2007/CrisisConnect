// Mock rescue team data for demo mode
// In production, this would be fetched from a government API or database

export const demoRescueTeams = [
  {
    id: 'rt1', name: 'Delhi Fire Station – Connaught Place', type: 'fire',
    phone: '+91 101', altPhone: '+91 011-23412222',
    lat: 28.6315, lng: 77.2167, address: 'Connaught Place, New Delhi',
    icon: '🚒', available: true
  },
  {
    id: 'rt2', name: 'AIIMS Ambulance Service', type: 'ambulance',
    phone: '+91 102', altPhone: '+91 011-26588500',
    lat: 28.5672, lng: 77.2100, address: 'AIIMS, Ansari Nagar, New Delhi',
    icon: '🚑', available: true
  },
  {
    id: 'rt3', name: 'Delhi Police – Hazrat Nizamuddin', type: 'police',
    phone: '+91 100', altPhone: '+91 011-24617219',
    lat: 28.5898, lng: 77.2453, address: 'Nizamuddin, New Delhi',
    icon: '🚔', available: true
  },
  {
    id: 'rt4', name: 'NDRF – 2nd Battalion', type: 'ndrf',
    phone: '+91 9711077372', altPhone: '+91 011-24363260',
    lat: 28.6105, lng: 77.2312, address: 'NDRF Barracks, New Delhi',
    icon: '🦺', available: true
  },
  {
    id: 'rt5', name: 'Safdarjung Hospital – Emergency', type: 'ambulance',
    phone: '+91 102', altPhone: '+91 011-26707437',
    lat: 28.5685, lng: 77.2065, address: 'Safdarjung Enclave, New Delhi',
    icon: '🚑', available: true
  },
  {
    id: 'rt6', name: 'Delhi Fire Station – Rohini', type: 'fire',
    phone: '+91 101', altPhone: '+91 011-27572222',
    lat: 28.7160, lng: 77.1189, address: 'Sector 11, Rohini, Delhi',
    icon: '🚒', available: true
  },
  {
    id: 'rt7', name: 'Delhi Police – Saket', type: 'police',
    phone: '+91 100', altPhone: '+91 011-26856527',
    lat: 28.5244, lng: 77.2066, address: 'Saket, New Delhi',
    icon: '🚔', available: true
  },
  {
    id: 'rt8', name: 'GTB Hospital – Ambulance', type: 'ambulance',
    phone: '+91 102', altPhone: '+91 011-22586262',
    lat: 28.6856, lng: 77.3100, address: 'Dilshad Garden, Delhi',
    icon: '🚑', available: true
  },
  {
    id: 'rt9', name: 'NDRF – Rapid Response', type: 'ndrf',
    phone: '+91 011-24363260', altPhone: '+91 9711077372',
    lat: 28.6350, lng: 77.1900, address: 'NDRF Unit, West Delhi',
    icon: '🦺', available: true
  },
  {
    id: 'rt10', name: 'Delhi Fire Station – Dwarka', type: 'fire',
    phone: '+91 101', altPhone: '+91 011-25083333',
    lat: 28.5921, lng: 77.0460, address: 'Sector 6, Dwarka, Delhi',
    icon: '🚒', available: true
  },
  {
    id: 'rt11', name: 'Max Hospital – Emergency', type: 'ambulance',
    phone: '+91 011-26515050', altPhone: '+91 102',
    lat: 28.5270, lng: 77.2107, address: 'Saket, New Delhi',
    icon: '🚑', available: true
  },
  {
    id: 'rt12', name: 'Delhi Police – Dwarka', type: 'police',
    phone: '+91 100', altPhone: '+91 011-25083100',
    lat: 28.5855, lng: 77.0501, address: 'Sector 23, Dwarka, Delhi',
    icon: '🚔', available: true
  },
];

// Rescue team type metadata
export const RESCUE_TEAM_TYPES = [
  { id: 'fire', label: 'Fire Station', icon: '🚒', color: '#f97316', phone: '101' },
  { id: 'ambulance', label: 'Ambulance / Hospital', icon: '🚑', color: '#ef4444', phone: '102' },
  { id: 'police', label: 'Police Station', icon: '🚔', color: '#3b82f6', phone: '100' },
  { id: 'ndrf', label: 'NDRF / Disaster Response', icon: '🦺', color: '#8b5cf6', phone: '011-24363260' },
];
