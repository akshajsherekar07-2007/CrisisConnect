import { MapPin, Clock, Users, ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatTimeAgo, getSeverityLabel } from '../../utils';
import { CRISIS_TYPES, HELP_TYPES } from '../../constants';

const RequestCard = ({ request, onAccept, onView, showActions = true, compact = false }) => {
  const crisis = CRISIS_TYPES.find(c => c.id === request.crisisType) || {};
  const severity = getSeverityLabel(request.severity);

  if (compact) {
    return (
      <div className="glass-card" style={{ padding: '12px 16px', cursor: 'pointer' }} onClick={() => onView?.(request)}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: '1.3rem' }}>{crisis.icon}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {request.victimName}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                {crisis.label} • {formatTimeAgo(request.timestamp)}
              </div>
            </div>
          </div>
          <StatusBadge status={request.status} />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: `${crisis.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem'
          }}>
            {crisis.icon}
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: 2 }}>{request.victimName}</h4>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={12} /> {formatTimeAgo(request.timestamp)}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <StatusBadge status={request.status} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: severity.color }}>
            {severity.label} (Lv.{request.severity})
          </span>
        </div>
      </div>

      <p style={{ fontSize: '0.9rem', marginBottom: 12, lineHeight: 1.5, color: 'var(--color-text-secondary)' }}>
        {request.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        {request.helpTypes?.map(ht => {
          const help = HELP_TYPES.find(h => h.id === ht);
          return help ? (
            <span key={ht} style={{
              padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem',
              background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
              color: 'var(--color-purple)', fontWeight: 500
            }}>
              {help.icon} {help.label}
            </span>
          ) : null;
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={13} /> {request.address}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Users size={13} /> {request.peopleAffected} affected
          </span>
        </div>
        {showActions && request.status === 'pending' && onAccept && (
          <button className="btn btn-primary btn-sm" onClick={() => onAccept(request)}>
            Accept <ChevronRight size={14} />
          </button>
        )}
        {showActions && onView && (
          <button className="btn btn-ghost btn-sm" onClick={() => onView(request)}>
            Details <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
