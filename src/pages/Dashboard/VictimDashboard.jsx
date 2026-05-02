import { useState } from 'react';
import { MapPin, Camera, Send, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { RequestCard, Modal } from '../../components';
import { useGeolocation, useRequests } from '../../hooks';
import { CRISIS_TYPES, HELP_TYPES } from '../../constants';
import { demoRequests } from '../../data';
import './Dashboard.css';

const VictimDashboard = () => {
  const { user } = useAuth();
  const { showToast, addNotification } = useNotifications();
  const { location } = useGeolocation();
  const [showSOSForm, setShowSOSForm] = useState(false);
  const { requests: myRequests, addRequest } = useRequests(demoRequests.slice(0, 3));
  const [formData, setFormData] = useState({
    crisisType: '', helpTypes: [], description: '', severity: 3
  });

  const toggleHelpType = (id) => {
    setFormData(prev => ({
      ...prev,
      helpTypes: prev.helpTypes.includes(id)
        ? prev.helpTypes.filter(h => h !== id)
        : [...prev.helpTypes, id]
    }));
  };

  const handleSubmitSOS = () => {
    if (!formData.crisisType || formData.helpTypes.length === 0) {
      showToast('Please select crisis type and at least one help type', 'warning');
      return;
    }
    addRequest({
      victimName: user?.name || 'You',
      crisisType: formData.crisisType,
      helpTypes: formData.helpTypes,
      description: formData.description || 'Emergency assistance needed',
      severity: formData.severity,
      lat: location?.lat || 28.6139,
      lng: location?.lng || 77.209,
      address: 'Your Current Location',
      peopleAffected: 1,
    });
    setShowSOSForm(false);
    setFormData({ crisisType: '', helpTypes: [], description: '', severity: 3 });
    showToast('🆘 SOS Request sent! Nearby volunteers are being notified.', 'success');
    addNotification({
      type: 'update',
      title: 'SOS Request Submitted',
      message: 'Your emergency request has been broadcast to nearby volunteers.'
    });
  };

  const severityColors = ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444'];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-header-inner">
          <div className="dashboard-welcome">
            <h1>Hi, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
            <p>Report an emergency or track your existing requests</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {location && (
              <div className="location-display">
                <div className="loc-icon"><MapPin size={16} /></div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-safe)' }}>Location Active</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-body">
        {/* SOS Button */}
        <div className="sos-button-wrapper">
          <button className="sos-button" onClick={() => setShowSOSForm(true)}>
            <span className="sos-icon">🆘</span>
            <span>SEND SOS</span>
          </button>
        </div>

        {/* SOS Form Modal */}
        <Modal isOpen={showSOSForm} onClose={() => setShowSOSForm(false)} title="🆘 Report Emergency" size="lg">
          <div className="sos-form">
            <div className="form-group">
              <label className="form-label">Crisis Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {CRISIS_TYPES.map(ct => (
                  <button key={ct.id} className={`help-type-btn ${formData.crisisType === ct.id ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, crisisType: ct.id }))}>
                    <span className="help-icon">{ct.icon}</span>
                    <span>{ct.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">What help do you need?</label>
              <div className="help-type-grid">
                {HELP_TYPES.map(ht => (
                  <button key={ht.id} className={`help-type-btn ${formData.helpTypes.includes(ht.id) ? 'selected' : ''}`}
                    onClick={() => toggleHelpType(ht.id)}>
                    <span className="help-icon">{ht.icon}</span>
                    <span>{ht.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Severity Level</label>
              <div className="severity-slider">
                <div className="severity-track">
                  {[1, 2, 3, 4, 5].map(s => (
                    <div key={s} className="severity-dot" onClick={() => setFormData(prev => ({ ...prev, severity: s }))}
                      style={{
                        background: s <= formData.severity ? severityColors[s - 1] : 'rgba(255,255,255,0.06)',
                        height: formData.severity === s ? 12 : 8,
                        borderRadius: 6
                      }} />
                  ))}
                </div>
                <div className="severity-labels">
                  <span>Low</span>
                  <span style={{ color: severityColors[formData.severity - 1], fontWeight: 600 }}>
                    Level {formData.severity}
                  </span>
                  <span>Critical</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Describe your situation</label>
              <textarea className="form-input" placeholder="Provide details about the emergency, number of people affected, specific needs..."
                value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={3} />
            </div>

            <div className="form-group">
              <label className="form-label">Upload Photo (optional)</label>
              <div className="photo-upload">
                <Camera size={24} style={{ color: 'var(--color-text-muted)', marginBottom: 8 }} />
                <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--color-text-secondary)' }}>Click to upload a photo of the situation</p>
              </div>
            </div>

            {location && (
              <div className="location-display">
                <div className="loc-icon"><MapPin size={16} /></div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-safe)' }}>📍 Location will be shared automatically</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</div>
                </div>
              </div>
            )}

            <button className="btn btn-emergency btn-lg" style={{ width: '100%' }} onClick={handleSubmitSOS}>
              <Send size={18} /> Send Emergency SOS
            </button>
          </div>
        </Modal>

        {/* Requests */}
        <div>
          <h3 className="dashboard-section-title"><Clock size={18} /> My Requests</h3>
          <div className="request-list">
            {myRequests.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🕊️</div>
                <p style={{ fontSize: '0.95rem' }}>No active requests. Stay safe!</p>
              </div>
            ) : (
              myRequests.map(req => <RequestCard key={req.id} request={req} showActions={false} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VictimDashboard;
