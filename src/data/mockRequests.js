// Mock SOS request data for demo mode

export const demoRequests = [
  {
    id: 'r1', victimName: 'Suresh Yadav', crisisType: 'flood', helpTypes: ['food', 'shelter'],
    description: 'Water level rising in our area. Family of 5 stuck on second floor. Need immediate evacuation and shelter.',
    severity: 4, status: 'pending', lat: 28.6180, lng: 77.2200, address: 'Sector 15, Noida',
    timestamp: Date.now() - 1800000, photo: null, peopleAffected: 5
  },
  {
    id: 'r2', victimName: 'Meena Devi', crisisType: 'earthquake', helpTypes: ['rescue', 'medical'],
    description: 'Building partially collapsed. Two people trapped under debris. Urgent medical assistance needed.',
    severity: 5, status: 'accepted', lat: 28.6250, lng: 77.2050, address: 'Lajpat Nagar, Delhi',
    timestamp: Date.now() - 3600000, photo: null, peopleAffected: 8, assignedVolunteer: 'v1'
  },
  {
    id: 'r3', victimName: 'Ramesh Verma', crisisType: 'fire', helpTypes: ['rescue', 'medical', 'shelter'],
    description: 'Fire broke out in the apartment building. 3 families need to be evacuated. Fire brigade contacted but delayed.',
    severity: 5, status: 'active', lat: 28.6100, lng: 77.2350, address: 'Connaught Place, Delhi',
    timestamp: Date.now() - 900000, photo: null, peopleAffected: 12, assignedVolunteer: 'v2'
  },
  {
    id: 'r4', victimName: 'Kavita Singh', crisisType: 'flood', helpTypes: ['food', 'transport'],
    description: 'Roads are flooded. Cannot get food supplies. Elderly parents need medication from pharmacy.',
    severity: 3, status: 'pending', lat: 28.6320, lng: 77.1950, address: 'Dwarka, Delhi',
    timestamp: Date.now() - 7200000, photo: null, peopleAffected: 3
  },
  {
    id: 'r5', victimName: 'Anil Gupta', crisisType: 'accident', helpTypes: ['medical', 'transport'],
    description: 'Major road accident on highway. Multiple vehicles involved. Need ambulances and medical help urgently.',
    severity: 5, status: 'completed', lat: 28.5900, lng: 77.2500, address: 'NH-24 Highway, Ghaziabad',
    timestamp: Date.now() - 14400000, photo: null, peopleAffected: 6, assignedVolunteer: 'v6'
  },
  {
    id: 'r6', victimName: 'Lakshmi Nair', crisisType: 'cyclone', helpTypes: ['shelter', 'food', 'clothing'],
    description: 'Cyclone warning. Our house roof blown away. Family needs temporary shelter and basic supplies.',
    severity: 4, status: 'accepted', lat: 28.6400, lng: 77.2150, address: 'Rohini, Delhi',
    timestamp: Date.now() - 5400000, photo: null, peopleAffected: 4, assignedVolunteer: 'v5'
  },
];
