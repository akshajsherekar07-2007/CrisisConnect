// Date/time and severity formatting utilities

export const formatTimeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const getSeverityLabel = (severity) => {
  if (severity >= 5) return { label: 'Critical', color: '#ef4444' };
  if (severity >= 4) return { label: 'High', color: '#f97316' };
  if (severity >= 3) return { label: 'Medium', color: '#eab308' };
  if (severity >= 2) return { label: 'Low', color: '#22c55e' };
  return { label: 'Minimal', color: '#6b7280' };
};
