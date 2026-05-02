import { useState } from 'react';
import { CheckCircle, Clock, Star, Activity, MapPin, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { RequestCard, StatusBadge, Modal } from '../../components';
import { useRequests } from '../../hooks';
import { demoRequests } from '../../data';
import './Dashboard.css';

const VolunteerDashboard = () => {
  const { user, updateProfile } = useAuth();
  const { showToast, addNotification } = useNotifications();
  const [available, setAvailable] = useState(user?.available ?? true);
  const [activeTab, setActiveTab] = useState('incoming');
  const { requests, pending, active, completed, acceptRequest, completeRequest } = useRequests(demoRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const toggleAvailability = () => {
    const newState = !available;
    setAvailable(newState);
    updateProfile({ available: newState });
    showToast(newState ? '✅ You are now available for requests' : '⏸️ You are now set to unavailable', 'info');
  };

  const handleAccept = (request) => {
    acceptRequest(request.id, user?.id);
    showToast(`✅ You accepted ${request.victimName}'s request!`, 'success');
    addNotification({
      type: 'update',
      title: 'Task Accepted',
      message: `You accepted an emergency request from ${request.victimName}.`
    });
  };

  const handleComplete = (request) => {
    completeRequest(request.id);
    showToast('🎉 Task marked as completed!', 'success');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-header-inner">
          <div className="dashboard-welcome">
            <h1>Volunteer Dashboard 🦺</h1>
            <p>Welcome back, {user?.name?.split(' ')[0] || 'Volunteer'}</p>
          </div>
          <div className="status-toggle">
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Status:</span>
            <button className={`toggle-switch ${available ? 'on' : 'off'}`} onClick={toggleAvailability} />
            <StatusBadge status={available ? 'available' : 'unavailable'} />
          </div>
        </div>
      </div>

      <div className="dashboard-body">
        {/* Stats */}
        <div className="vol-stats-grid">
          <div className="vol-stat-card">
            <div className="stat-value" style={{ color: 'var(--color-safe)' }}>{user?.tasksCompleted || 23}</div>
            <div className="stat-label">Tasks Completed</div>
          </div>
          <div className="vol-stat-card">
            <div className="stat-value" style={{ color: 'var(--color-alert)' }}>{active.length}</div>
            <div className="stat-label">Active Tasks</div>
          </div>
          <div className="vol-stat-card">
            <div className="stat-value" style={{ color: 'var(--color-purple)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                {user?.rating || '4.8'} <Star size={18} fill="currentColor" />
              </span>
            </div>
            <div className="stat-label">Rating</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 4 }}>
          {[
            { id: 'incoming', label: `Incoming (${pending.length})`, icon: '🔔' },
            { id: 'active', label: `Active (${active.length})`, icon: '⚡' },
            { id: 'completed', label: `Completed (${completed.length})`, icon: '✅' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, padding: '12px 16px', borderRadius: 10, border: 'none',
              background: activeTab === tab.id ? 'rgba(139,92,246,0.15)' : 'transparent',
              color: activeTab === tab.id ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              fontWeight: activeTab === tab.id ? 600 : 400, fontSize: '0.9rem',
              transition: 'all 0.2s', cursor: 'pointer'
            }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Request Lists */}
        <div className="request-list">
          {activeTab === 'incoming' && pending.map(req => (
            <RequestCard key={req.id} request={req} onAccept={handleAccept} onView={setSelectedRequest} />
          ))}
          {activeTab === 'active' && active.map(req => (
            <div key={req.id}>
              <RequestCard request={req} showActions={false} onView={setSelectedRequest} />
              <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'flex-end' }}>
                <button className="btn btn-outline btn-sm" onClick={() => setSelectedRequest(req)}>
                  <MapPin size={14} /> Navigate
                </button>
                <button className="btn btn-safe btn-sm" onClick={() => handleComplete(req)}>
                  <CheckCircle size={14} /> Mark Complete
                </button>
              </div>
            </div>
          ))}
          {activeTab === 'completed' && completed.map(req => (
            <RequestCard key={req.id} request={req} showActions={false} />
          ))}
          {((activeTab === 'incoming' && pending.length === 0) ||
            (activeTab === 'active' && active.length === 0) ||
            (activeTab === 'completed' && completed.length === 0)) && (
            <div className="glass-card" style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>
                {activeTab === 'incoming' ? '📭' : activeTab === 'active' ? '🏖️' : '📋'}
              </div>
              <p>No {activeTab} requests at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Request Detail Modal */}
      <Modal isOpen={!!selectedRequest} onClose={() => setSelectedRequest(null)} title="Request Details" size="lg">
        {selectedRequest && (
          <div>
            <RequestCard request={selectedRequest} showActions={false} />
            <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
              {selectedRequest.status === 'pending' && (
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { handleAccept(selectedRequest); setSelectedRequest(null); }}>
                  Accept Request
                </button>
              )}
              {(selectedRequest.status === 'accepted' || selectedRequest.status === 'active') && (
                <button className="btn btn-safe" style={{ flex: 1 }} onClick={() => { handleComplete(selectedRequest); setSelectedRequest(null); }}>
                  <CheckCircle size={16} /> Mark as Completed
                </button>
              )}
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setSelectedRequest(null)}>Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VolunteerDashboard;
