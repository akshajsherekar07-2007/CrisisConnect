import { useState, useRef } from 'react';
import { Users, Plus, MapPin, Phone, Search, Filter, ChevronDown, Send, Camera, X, Check, AlertTriangle, Clock, Heart, Package, Navigation, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCommunities } from '../../context/CommunityContext';
import { useNotifications } from '../../context/NotificationContext';
import { useGeolocation } from '../../hooks';
import { Modal } from '../../components';
import { CRISIS_TYPES } from '../../constants';
import { RESOURCE_TYPES, INDIAN_STATES } from '../../data';
import { formatTimeAgo } from '../../utils';
import { getCurrentPosition } from '../../services/geolocation';
import './CommunityHub.css';

const CommunityHub = () => {
  const { user } = useAuth();
  const { communities, activeCommunities, createCommunity, joinCommunity, raiseResourceRequest, closeCommunity } = useCommunities();
  const { showToast, addNotification } = useNotifications();
  const { location } = useGeolocation();
  const [activeTab, setActiveTab] = useState('browse');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);

  // Create community form
  const [createData, setCreateData] = useState({
    name: '', type: 'post-crisis', crisisType: 'flood', description: '',
    state: '', city: '', pincode: '', address: '',
    lat: null, lng: null,
    memberName: '', memberPhone: '',
    members: [],
    contactPhone: '',
  });

  // Resource request form
  const [resourceData, setResourceData] = useState({
    type: 'food', label: '', quantity: '', urgency: 'medium',
  });

  const updateCreate = (field, value) => setCreateData(prev => ({ ...prev, [field]: value }));

  // Filter communities
  const filteredCommunities = activeCommunities.filter(c => {
    if (filterType !== 'all' && c.type !== filterType) return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const myCommunities = user ? communities.filter(c =>
    c.members?.some(m => m.id === user.id) || c.createdBy?.id === user.id
  ) : [];

  const isLeader = (community) => community.createdBy?.id === user?.id;
  const isMember = (community) => community.members?.some(m => m.id === user?.id);

  const handleJoin = (community) => {
    if (!user) {
      showToast('Please login to join a community.', 'warning');
      return;
    }
    joinCommunity(community.id, user);
    showToast(`✅ You joined ${community.name}!`, 'success');
    addNotification({
      type: 'community',
      title: 'Joined Community',
      message: `You have joined ${community.name}.`,
    });
  };

  const handleCreateCommunity = () => {
    if (!createData.name || !createData.description || !createData.city) {
      showToast('Please fill in all required fields.', 'warning');
      return;
    }
    if (!user) {
      showToast('Please login to create a community.', 'warning');
      return;
    }

    const newCommunity = createCommunity({
      name: createData.name,
      type: createData.type,
      crisisType: createData.crisisType,
      description: createData.description,
      createdBy: { id: user.id, name: user.name, phone: createData.contactPhone || user.phone },
      location: {
        lat: createData.lat || location?.lat || 28.6139,
        lng: createData.lng || location?.lng || 77.2090,
        address: createData.address,
        state: createData.state,
        city: createData.city,
        pincode: createData.pincode,
      },
      members: [
        { id: user.id, name: user.name, role: 'leader', phone: createData.contactPhone || user.phone },
        ...createData.members,
      ],
    });

    showToast(`🏘️ Community "${createData.name}" created successfully!`, 'success');
    addNotification({
      type: 'community',
      title: 'Community Created',
      message: `You created "${createData.name}". Volunteers are being notified.`,
    });
    setShowCreateForm(false);
    setCreateData({
      name: '', type: 'post-crisis', crisisType: 'flood', description: '',
      state: '', city: '', pincode: '', address: '',
      lat: null, lng: null, memberName: '', memberPhone: '', members: [], contactPhone: '',
    });
    setActiveTab('my');
  };

  const addMember = () => {
    if (!createData.memberName || !createData.memberPhone) return;
    updateCreate('members', [
      ...createData.members,
      { id: `m-${Date.now()}`, name: createData.memberName, role: 'volunteer', phone: createData.memberPhone },
    ]);
    updateCreate('memberName', '');
    updateCreate('memberPhone', '');
  };

  const removeMember = (idx) => {
    updateCreate('members', createData.members.filter((_, i) => i !== idx));
  };

  const handleRaiseResource = () => {
    if (!resourceData.quantity) {
      showToast('Please specify the quantity needed.', 'warning');
      return;
    }
    const resType = RESOURCE_TYPES.find(r => r.id === resourceData.type);
    raiseResourceRequest(selectedCommunity.id, {
      type: resourceData.type,
      label: resType?.label || resourceData.type,
      quantity: resourceData.quantity,
      urgency: resourceData.urgency,
    });
    showToast(`📦 Resource request raised: ${resType?.label}`, 'success');
    addNotification({
      type: 'community',
      title: 'Resource Request',
      message: `New resource need in ${selectedCommunity.name}: ${resType?.label} (${resourceData.quantity})`,
    });
    setShowResourceForm(false);
    setResourceData({ type: 'food', label: '', quantity: '', urgency: 'medium' });
  };

  const handleCloseCommunity = () => {
    closeCommunity(selectedCommunity.id, ['recovery_proof.jpg']);
    showToast(`✅ Community "${selectedCommunity.name}" has been closed. Great work!`, 'success');
    addNotification({
      type: 'community',
      title: 'Community Closed',
      message: `${selectedCommunity.name} has been closed after successful recovery.`,
    });
    setShowCloseModal(false);
    setSelectedCommunity(null);
  };

  const detectCreateLocation = async () => {
    try {
      const pos = await getCurrentPosition();
      updateCreate('lat', pos.lat);
      updateCreate('lng', pos.lng);
      showToast('📍 Location detected!', 'success');
    } catch {
      showToast('Could not detect location.', 'warning');
    }
  };

  const urgencyColors = {
    low: { bg: 'rgba(46,213,115,0.1)', color: '#2ed573', border: 'rgba(46,213,115,0.2)' },
    medium: { bg: 'rgba(255,165,2,0.1)', color: '#ffa502', border: 'rgba(255,165,2,0.2)' },
    high: { bg: 'rgba(255,71,87,0.1)', color: '#ff4757', border: 'rgba(255,71,87,0.2)' },
    critical: { bg: 'rgba(255,0,0,0.1)', color: '#ff0000', border: 'rgba(255,0,0,0.3)' },
  };

  return (
    <div className="community-page">
      <div className="community-header">
        <div className="community-header-inner">
          <h1>👥 Community Hub</h1>
          <p>Create, join, and manage crisis response communities</p>
        </div>
        {user?.role === 'volunteer' && (
          <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>
            <Plus size={18} /> Create Community
          </button>
        )}
      </div>

      <div className="community-body">
        {/* Tabs */}
        <div className="community-tabs">
          {[
            { id: 'browse', label: `Browse (${activeCommunities.length})`, icon: '🔍' },
            { id: 'my', label: `My Communities (${myCommunities.length})`, icon: '🏠' },
          ].map(tab => (
            <button key={tab.id} className={`community-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        {activeTab === 'browse' && (
          <div className="community-filters">
            <div className="search-bar">
              <Search size={16} />
              <input type="text" placeholder="Search communities..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)} />
            </div>
            <div className="filter-pills">
              {[
                { id: 'all', label: 'All' },
                { id: 'pre-crisis', label: '🛡️ Pre-Crisis' },
                { id: 'post-crisis', label: '🆘 Post-Crisis' },
              ].map(f => (
                <button key={f.id} className={`filter-pill ${filterType === f.id ? 'active' : ''}`}
                  onClick={() => setFilterType(f.id)}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Community Grid */}
        <div className="community-grid">
          {(activeTab === 'browse' ? filteredCommunities : myCommunities).map(community => {
            const crisis = CRISIS_TYPES.find(ct => ct.id === community.crisisType);
            const memberCheck = isMember(community);
            const leaderCheck = isLeader(community);

            return (
              <div key={community.id} className={`community-card ${community.status === 'resolved' ? 'resolved' : ''}`}>
                <div className="community-card-header">
                  <div className="community-card-title">
                    <span className="community-crisis-icon">{crisis?.icon || '⚠️'}</span>
                    <div>
                      <h3>{community.name}</h3>
                      <div className="community-badges">
                        <span className={`type-badge ${community.type}`}>
                          {community.type === 'pre-crisis' ? '🛡️ Pre-Crisis' : '🆘 Post-Crisis'}
                        </span>
                        {community.status === 'resolved' && (
                          <span className="status-badge resolved">✅ Resolved</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="community-desc">{community.description}</p>

                <div className="community-meta">
                  <span><MapPin size={13} /> {community.location?.city || community.location?.address}</span>
                  <span><Users size={13} /> {community.memberCount} members</span>
                  {community.victimsHelped > 0 && (
                    <span><Heart size={13} /> {community.victimsHelped} helped</span>
                  )}
                  <span><Clock size={13} /> {formatTimeAgo(community.createdAt)}</span>
                </div>

                {/* Resource Needs */}
                {community.resourceNeeds?.length > 0 && (
                  <div className="community-resources">
                    <h4><Package size={14} /> Resource Needs</h4>
                    <div className="resource-tags">
                      {community.resourceNeeds.filter(r => !r.fulfilled).map(r => {
                        const urg = urgencyColors[r.urgency] || urgencyColors.medium;
                        return (
                          <span key={r.id} className="resource-tag" style={{ background: urg.bg, color: urg.color, border: `1px solid ${urg.border}` }}>
                            {RESOURCE_TYPES.find(rt => rt.id === r.type)?.icon} {r.label} — {r.quantity}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="community-actions">
                  {community.status === 'active' && (
                    <>
                      {!memberCheck && !leaderCheck ? (
                        <button className="btn btn-primary btn-sm" onClick={() => handleJoin(community)}>
                          <Users size={14} /> Join Community
                        </button>
                      ) : (
                        <button className="btn btn-outline btn-sm" onClick={() => setSelectedCommunity(community)}>
                          View Details
                        </button>
                      )}
                      {leaderCheck && (
                        <>
                          <button className="btn btn-outline btn-sm" style={{ color: 'var(--color-alert)' }}
                            onClick={() => { setSelectedCommunity(community); setShowResourceForm(true); }}>
                            <Package size={14} /> Raise Request
                          </button>
                          <button className="btn btn-outline btn-sm" style={{ color: 'var(--color-safe)' }}
                            onClick={() => { setSelectedCommunity(community); setShowCloseModal(true); }}>
                            <Check size={14} /> Close
                          </button>
                        </>
                      )}
                    </>
                  )}
                  {community.status === 'resolved' && (
                    <button className="btn btn-ghost btn-sm" onClick={() => setSelectedCommunity(community)}>
                      View Record
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {(activeTab === 'browse' ? filteredCommunities : myCommunities).length === 0 && (
            <div className="community-empty">
              <div className="empty-icon">{activeTab === 'browse' ? '🔍' : '🏠'}</div>
              <h3>{activeTab === 'browse' ? 'No communities found' : 'No communities yet'}</h3>
              <p>{activeTab === 'browse' ? 'Try adjusting your filters.' : 'Join or create a community to get started.'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Community Modal */}
      <Modal isOpen={showCreateForm} onClose={() => setShowCreateForm(false)} title="🏘️ Create Community" size="lg">
        <div className="create-community-form">
          <div className="form-group">
            <label className="form-label">Community Name *</label>
            <input type="text" className="form-input" placeholder="e.g., Delhi Flood Relief Force"
              value={createData.name} onChange={e => updateCreate('name', e.target.value)} />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Community Type *</label>
              <div className="type-selector">
                <button className={`type-option ${createData.type === 'pre-crisis' ? 'selected' : ''}`}
                  onClick={() => updateCreate('type', 'pre-crisis')}>
                  🛡️ Pre-Crisis
                </button>
                <button className={`type-option ${createData.type === 'post-crisis' ? 'selected' : ''}`}
                  onClick={() => updateCreate('type', 'post-crisis')}>
                  🆘 Post-Crisis
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Crisis Type</label>
              <select className="form-input" value={createData.crisisType}
                onChange={e => updateCreate('crisisType', e.target.value)}>
                {CRISIS_TYPES.map(ct => (
                  <option key={ct.id} value={ct.id}>{ct.icon} {ct.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea className="form-input" placeholder="Describe the purpose and goals of this community..."
              value={createData.description} onChange={e => updateCreate('description', e.target.value)} rows={3} />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Phone</label>
            <input type="tel" className="form-input" placeholder="+91 98765 43210"
              value={createData.contactPhone} onChange={e => updateCreate('contactPhone', e.target.value)} />
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label">Location</label>
            <button type="button" className="detect-location-btn" onClick={detectCreateLocation}>
              <Navigation size={16} />
              {createData.lat ? `📍 ${createData.lat.toFixed(4)}, ${createData.lng.toFixed(4)}` : 'Auto-detect location'}
            </button>
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">State *</label>
              <select className="form-input" value={createData.state}
                onChange={e => updateCreate('state', e.target.value)}>
                <option value="">Select</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">City *</label>
              <input type="text" className="form-input" placeholder="City"
                value={createData.city} onChange={e => updateCreate('city', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Pincode</label>
              <input type="text" className="form-input" placeholder="110001"
                value={createData.pincode} onChange={e => updateCreate('pincode', e.target.value)} maxLength={6} />
            </div>
          </div>

          {/* Add Members */}
          <div className="form-group">
            <label className="form-label">Add Members</label>
            <div className="add-member-row">
              <input type="text" className="form-input" placeholder="Member name"
                value={createData.memberName} onChange={e => updateCreate('memberName', e.target.value)} />
              <input type="tel" className="form-input" placeholder="Phone"
                value={createData.memberPhone} onChange={e => updateCreate('memberPhone', e.target.value)} />
              <button className="btn btn-outline btn-sm" onClick={addMember}>
                <Plus size={14} /> Add
              </button>
            </div>
            {createData.members.length > 0 && (
              <div className="member-list">
                {createData.members.map((m, i) => (
                  <div key={i} className="member-chip">
                    <span>{m.name}</span>
                    <span className="member-phone">{m.phone}</span>
                    <button onClick={() => removeMember(i)}><X size={12} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleCreateCommunity}>
            <Users size={18} /> Create Community
          </button>
        </div>
      </Modal>

      {/* Community Detail Modal */}
      <Modal isOpen={!!selectedCommunity && !showResourceForm && !showCloseModal}
        onClose={() => setSelectedCommunity(null)} title={selectedCommunity?.name || ''} size="lg">
        {selectedCommunity && (
          <div className="community-detail">
            <div className="detail-badges">
              <span className={`type-badge ${selectedCommunity.type}`}>
                {selectedCommunity.type === 'pre-crisis' ? '🛡️ Pre-Crisis' : '🆘 Post-Crisis'}
              </span>
              <span className={`status-badge ${selectedCommunity.status}`}>
                {selectedCommunity.status === 'active' ? '🟢 Active' : '✅ Resolved'}
              </span>
            </div>

            <p style={{ marginBottom: 20, color: 'var(--color-text-secondary)' }}>{selectedCommunity.description}</p>

            <div className="detail-info-grid">
              <div className="detail-info-item">
                <MapPin size={14} /> {selectedCommunity.location?.address || selectedCommunity.location?.city}
              </div>
              <div className="detail-info-item">
                <Users size={14} /> {selectedCommunity.memberCount} members
              </div>
              <div className="detail-info-item">
                <Clock size={14} /> Created {formatTimeAgo(selectedCommunity.createdAt)}
              </div>
              {selectedCommunity.victimsHelped > 0 && (
                <div className="detail-info-item">
                  <Heart size={14} /> {selectedCommunity.victimsHelped} victims helped
                </div>
              )}
            </div>

            {/* Members List */}
            <div className="detail-section">
              <h4><Users size={16} /> Members ({selectedCommunity.members?.length || 0})</h4>
              <div className="members-grid">
                {selectedCommunity.members?.map(m => (
                  <div key={m.id} className="member-card">
                    <div className="member-avatar">{m.name?.[0]}</div>
                    <div>
                      <div className="member-name">{m.name}</div>
                      <div className="member-role">{m.role === 'leader' ? '👑 Leader' : '🦺 Volunteer'}</div>
                    </div>
                    {m.phone && (
                      <a href={`tel:${m.phone}`} className="member-call">
                        <Phone size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Resource Needs */}
            {selectedCommunity.resourceNeeds?.length > 0 && (
              <div className="detail-section">
                <h4><Package size={16} /> Resource Needs</h4>
                <div className="resources-list">
                  {selectedCommunity.resourceNeeds.map(r => {
                    const urg = urgencyColors[r.urgency] || urgencyColors.medium;
                    return (
                      <div key={r.id} className={`resource-item ${r.fulfilled ? 'fulfilled' : ''}`}>
                        <span className="resource-icon">{RESOURCE_TYPES.find(rt => rt.id === r.type)?.icon}</span>
                        <div className="resource-info">
                          <span className="resource-label">{r.label}</span>
                          <span className="resource-qty">{r.quantity}</span>
                        </div>
                        <span className="urgency-badge" style={{ background: urg.bg, color: urg.color }}>{r.urgency}</span>
                        {r.fulfilled && <span className="fulfilled-badge">✅</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Leader Actions */}
            {isLeader(selectedCommunity) && selectedCommunity.status === 'active' && (
              <div className="detail-actions">
                <button className="btn btn-primary" onClick={() => setShowResourceForm(true)}>
                  <Package size={16} /> Raise Resource Request
                </button>
                <button className="btn btn-safe" onClick={() => setShowCloseModal(true)}>
                  <Check size={16} /> Close Community
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Raise Resource Modal */}
      <Modal isOpen={showResourceForm} onClose={() => setShowResourceForm(false)} title="📦 Raise Resource Request">
        <div className="resource-form">
          <div className="form-group">
            <label className="form-label">Resource Type</label>
            <div className="resource-type-grid">
              {RESOURCE_TYPES.map(rt => (
                <button key={rt.id} className={`resource-type-btn ${resourceData.type === rt.id ? 'selected' : ''}`}
                  onClick={() => setResourceData(prev => ({ ...prev, type: rt.id }))}>
                  <span>{rt.icon}</span>
                  <span>{rt.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Quantity / Amount Needed</label>
            <input type="text" className="form-input" placeholder="e.g., 200 meals, 50 tents, ₹5,00,000"
              value={resourceData.quantity} onChange={e => setResourceData(prev => ({ ...prev, quantity: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Urgency</label>
            <div className="urgency-selector">
              {['low', 'medium', 'high', 'critical'].map(u => (
                <button key={u} className={`urgency-btn ${resourceData.urgency === u ? 'selected' : ''}`}
                  onClick={() => setResourceData(prev => ({ ...prev, urgency: u }))}
                  style={{ '--urg-color': urgencyColors[u].color }}>
                  {u.charAt(0).toUpperCase() + u.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleRaiseResource}>
            <Send size={16} /> Submit Request
          </button>
        </div>
      </Modal>

      {/* Close Community Modal */}
      <Modal isOpen={showCloseModal} onClose={() => setShowCloseModal(false)} title="✅ Close Community">
        <div className="close-community-form">
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🏁</div>
            <h3>Close "{selectedCommunity?.name}"?</h3>
            <p style={{ color: 'var(--color-text-secondary)', margin: '8px 0 24px' }}>
              This will mark the community as resolved. Please upload geo-tagged proof of recovery before closing.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Upload Recovery Proof (Geo-tagged Photos)</label>
            <div className="proof-upload-area">
              <Upload size={28} />
              <p>Click to upload geo-tagged photos of recovery</p>
              <span>JPG, PNG up to 10MB each</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowCloseModal(false)}>Cancel</button>
            <button className="btn btn-safe" style={{ flex: 1 }} onClick={handleCloseCommunity}>
              <Check size={16} /> Confirm & Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CommunityHub;
