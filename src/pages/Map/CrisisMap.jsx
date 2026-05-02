import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { X, List, Phone, MapPin } from 'lucide-react';
import { RequestCard, StatusBadge } from '../../components';
import { CRISIS_TYPES } from '../../constants';
import { demoRequests, demoUsers, demoRescueTeams, RESCUE_TEAM_TYPES } from '../../data';
import { formatTimeAgo } from '../../utils';
import { getCurrentPosition } from '../../services/geolocation';
import 'leaflet/dist/leaflet.css';
import './CrisisMap.css';

const createIcon = (color, emoji) => L.divIcon({
  className: 'custom-marker',
  html: `<div style="width:36px;height:36px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 12px ${color}60;border:2px solid rgba(255,255,255,0.3)">${emoji}</div>`,
  iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -20],
});

const sosIcon = createIcon('#ff4757', '🆘');
const volIcon = createIcon('#2ed573', '🦺');
const shelterIcon = createIcon('#3742fa', '🏠');
const fireIcon = createIcon('#f97316', '🚒');
const ambulanceIcon = createIcon('#ef4444', '🚑');
const policeIcon = createIcon('#3b82f6', '🚔');
const ndrfIcon = createIcon('#8b5cf6', '🦺');

const rescueIconMap = {
  fire: fireIcon,
  ambulance: ambulanceIcon,
  police: policeIcon,
  ndrf: ndrfIcon,
};

const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, 13); }, [center, map]);
  return null;
};

const CrisisMap = () => {
  const [center, setCenter] = useState([28.6139, 77.2090]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => { getCurrentPosition().then(pos => setCenter([pos.lat, pos.lng])); }, []);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'sos', label: '🔴 SOS Requests' },
    { id: 'volunteers', label: '🟢 Volunteers' },
    { id: 'rescue', label: '🚒 Rescue Teams' },
    { id: 'shelters', label: '🔵 Safe Zones' },
  ];
  const shelters = [
    { id: 's1', name: 'Community Center', lat: 28.6050, lng: 77.2150, capacity: 200 },
    { id: 's2', name: 'School Shelter', lat: 28.6250, lng: 77.2300, capacity: 150 },
    { id: 's3', name: 'Hospital', lat: 28.6150, lng: 77.1980, capacity: 300 },
  ];
  const filteredRequests = demoRequests.filter(r => r.status !== 'completed');
  const availableVols = demoUsers.filter(v => v.available);

  return (
    <div className="crisis-map-page">
      <div className="map-toolbar">
        <div className="map-toolbar-left">
          <h2>🗺️ Live Crisis Map</h2>
          <div className="map-stats-bar">
            <div className="map-stat"><span className="dot" style={{ background: '#ff4757' }} /> {filteredRequests.length} Active SOS</div>
            <div className="map-stat"><span className="dot" style={{ background: '#2ed573' }} /> {availableVols.length} Volunteers</div>
            <div className="map-stat"><span className="dot" style={{ background: '#f97316' }} /> {demoRescueTeams.length} Rescue Teams</div>
            <div className="map-stat"><span className="dot" style={{ background: '#3742fa' }} /> {shelters.length} Safe Zones</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="map-filter-pills">
            {filters.map(f => (<button key={f.id} className={`map-filter-pill ${activeFilter === f.id ? 'active' : ''}`} onClick={() => setActiveFilter(f.id)}>{f.label}</button>))}
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => setShowSidebar(!showSidebar)}><List size={14} /> Requests</button>
        </div>
      </div>
      <div className="map-container">
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={true}>
          <MapController center={center} />
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />

          {/* SOS Requests */}
          {(activeFilter === 'all' || activeFilter === 'sos') && filteredRequests.map(req => {
            const crisis = CRISIS_TYPES.find(c => c.id === req.crisisType);
            return (<Marker key={req.id} position={[req.lat, req.lng]} icon={sosIcon}><Popup><div style={{ minWidth: 220, fontFamily: 'var(--font-body)' }}><div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><span style={{ fontSize: '1.3rem' }}>{crisis?.icon}</span><div><strong style={{ color: '#f0f0ff' }}>{req.victimName}</strong><div style={{ fontSize: '0.75rem', color: '#a0a0c0' }}>{formatTimeAgo(req.timestamp)}</div></div></div><p style={{ fontSize: '0.82rem', color: '#c0c0e0', marginBottom: 8 }}>{req.description?.slice(0, 100)}...</p><div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}><span style={{ padding: '2px 8px', borderRadius: 10, fontSize: '0.7rem', background: 'rgba(255,71,87,0.2)', color: '#ff6b81' }}>{crisis?.label}</span><span style={{ padding: '2px 8px', borderRadius: 10, fontSize: '0.7rem', background: 'rgba(255,165,2,0.2)', color: '#ffc048' }}>Severity: {req.severity}</span></div></div></Popup></Marker>);
          })}

          {/* Volunteers */}
          {(activeFilter === 'all' || activeFilter === 'volunteers') && availableVols.map(vol => (<Marker key={vol.id} position={[vol.lat, vol.lng]} icon={volIcon}><Popup><div style={{ minWidth: 180, fontFamily: 'var(--font-body)' }}><strong style={{ color: '#f0f0ff' }}>{vol.name}</strong><div style={{ fontSize: '0.78rem', color: '#a0a0c0', marginTop: 4 }}>{vol.type === 'rescue' ? '🦺 Rescue' : vol.type === 'onground' ? '🤝 On-Ground' : '💰 Fundraiser'}</div><div style={{ fontSize: '0.78rem', color: '#2ed573', marginTop: 4 }}>✅ Verified • ⭐ {vol.rating}</div></div></Popup></Marker>))}

          {/* Rescue Teams */}
          {(activeFilter === 'all' || activeFilter === 'rescue') && demoRescueTeams.map(team => (
            <Marker key={team.id} position={[team.lat, team.lng]} icon={rescueIconMap[team.type] || fireIcon}>
              <Popup>
                <div style={{ minWidth: 220, fontFamily: 'var(--font-body)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: '1.5rem' }}>{team.icon}</span>
                    <div>
                      <strong style={{ color: '#f0f0ff', fontSize: '0.9rem' }}>{team.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#a0a0c0' }}>{team.address}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <a href={`tel:${team.phone}`} style={{
                      flex: 1, padding: '6px 12px', borderRadius: 8,
                      background: 'rgba(46,213,115,0.15)', color: '#2ed573',
                      textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
                    }}>
                      📞 {team.phone}
                    </a>
                  </div>
                  {team.altPhone && (
                    <a href={`tel:${team.altPhone}`} style={{
                      display: 'block', marginTop: 4, fontSize: '0.75rem',
                      color: '#8b8ba0', textDecoration: 'none', textAlign: 'center'
                    }}>
                      Alt: {team.altPhone}
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Shelters */}
          {(activeFilter === 'all' || activeFilter === 'shelters') && shelters.map(s => (<Marker key={s.id} position={[s.lat, s.lng]} icon={shelterIcon}><Popup><div style={{ minWidth: 160, fontFamily: 'var(--font-body)' }}><strong style={{ color: '#f0f0ff' }}>🏠 {s.name}</strong><div style={{ fontSize: '0.78rem', color: '#a0a0c0', marginTop: 4 }}>Capacity: {s.capacity} people</div></div></Popup></Marker>))}

          {/* Danger Radius */}
          {filteredRequests.filter(r => r.severity >= 4).map(req => (<Circle key={`zone-${req.id}`} center={[req.lat, req.lng]} radius={500} pathOptions={{ color: '#ff4757', fillColor: '#ff4757', fillOpacity: 0.08, weight: 1 }} />))}
        </MapContainer>
        <div className="map-legend">
          <h4>Legend</h4>
          <div className="map-legend-item"><div className="map-legend-dot" style={{ background: '#ff4757' }} /> SOS Request</div>
          <div className="map-legend-item"><div className="map-legend-dot" style={{ background: '#2ed573' }} /> Available Volunteer</div>
          <div className="map-legend-item"><div className="map-legend-dot" style={{ background: '#f97316' }} /> Fire Station</div>
          <div className="map-legend-item"><div className="map-legend-dot" style={{ background: '#ef4444' }} /> Ambulance / Hospital</div>
          <div className="map-legend-item"><div className="map-legend-dot" style={{ background: '#3b82f6' }} /> Police Station</div>
          <div className="map-legend-item"><div className="map-legend-dot" style={{ background: '#8b5cf6' }} /> NDRF Team</div>
          <div className="map-legend-item"><div className="map-legend-dot" style={{ background: '#3742fa' }} /> Safe Zone / Shelter</div>
          <div className="map-legend-item"><div style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid rgba(255,71,87,0.3)', flexShrink: 0 }} /> Danger Radius</div>
        </div>
        {showSidebar && (<div className="map-sidebar"><div className="map-sidebar-header"><h4 style={{ fontSize: '1rem' }}>📋 Active Requests</h4><button onClick={() => setShowSidebar(false)} style={{ background: 'var(--color-bg-glass)', border: 'var(--border-glass)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', cursor: 'pointer' }}><X size={14} /></button></div><div className="map-sidebar-body">{filteredRequests.map(req => (<RequestCard key={req.id} request={req} compact />))}</div></div>)}
      </div>
    </div>
  );
};

export default CrisisMap;
