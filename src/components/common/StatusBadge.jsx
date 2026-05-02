const StatusBadge = ({ status }) => {
  const config = {
    pending: { label: 'Pending', className: 'badge-pending' },
    accepted: { label: 'Accepted', className: 'badge-accepted' },
    active: { label: 'In Progress', className: 'badge-active' },
    completed: { label: 'Completed', className: 'badge-completed' },
    emergency: { label: 'Emergency', className: 'badge-emergency' },
    critical: { label: 'Critical', className: 'badge-emergency' },
    high: { label: 'High', className: 'badge-pending' },
    medium: { label: 'Medium', className: 'badge-accepted' },
    low: { label: 'Low', className: 'badge-completed' },
    monitoring: { label: 'Monitoring', className: 'badge-active' },
    verified: { label: 'Verified', className: 'badge-completed' },
    unverified: { label: 'Unverified', className: 'badge-pending' },
    available: { label: 'Available', className: 'badge-completed' },
    unavailable: { label: 'Unavailable', className: 'badge-pending' },
  };
  const c = config[status] || { label: status, className: 'badge-pending' };
  return <span className={`badge ${c.className}`}>{c.label}</span>;
};

export default StatusBadge;
