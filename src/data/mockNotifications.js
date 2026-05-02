// Mock notification data for demo mode

export const demoNotifications = [
  { id: 'n1', type: 'alert', title: 'Heavy Rainfall Warning', message: 'IMD has issued heavy rain warning for Delhi NCR region.', time: Date.now() - 300000, read: false },
  { id: 'n2', type: 'request', title: 'New SOS Request Nearby', message: 'A new emergency request was posted 2.3 km from your location.', time: Date.now() - 900000, read: false },
  { id: 'n3', type: 'update', title: 'Task Completed', message: 'Your rescue task for Suresh Yadav has been marked as completed.', time: Date.now() - 3600000, read: true },
  { id: 'n4', type: 'community', title: 'Community Alert', message: 'Delhi Flood Response Team has activated emergency protocols.', time: Date.now() - 7200000, read: true },
  { id: 'n5', type: 'prealert', title: 'Pre-Alert: Cyclone Watch', message: 'Category 3 cyclone expected in 72 hours. Review preparedness checklist.', time: Date.now() - 14400000, read: true },
];
