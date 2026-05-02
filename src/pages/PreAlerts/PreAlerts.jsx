import { useState } from 'react';
import { CloudLightning, Droplets, Wind, Thermometer, Users, MapPin, Check, Bell } from 'lucide-react';
import { StatusBadge } from '../../components';
import { useNotifications } from '../../context/NotificationContext';
import { CRISIS_TYPES } from '../../constants';
import { demoPreAlerts, demoWeather } from '../../data';
import { demoCommunityList as demoCommunities } from '../../data';
import './PreAlerts.css';

const PreAlerts = () => {
  const { showToast } = useNotifications();
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (alertId, idx) => {
    const key = `${alertId}-${idx}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const joinCommunity = (name) => { showToast(`✅ You joined ${name}!`, 'success'); };

  return (
    <div className="prealerts-page">
      <div className="prealerts-header">
        <div className="prealerts-header-inner">
          <h1 style={{ fontSize: '1.8rem', marginBottom: 4 }}>🔔 Pre-Alert System</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Proactive crisis management — prepare before disasters strike</p>
        </div>
      </div>
      <div className="prealerts-body">
        <div className="weather-card">
          <div className="weather-current">
            <div><span style={{ fontSize: '3rem' }}>{demoWeather.current.icon}</span></div>
            <div>
              <div className="weather-temp">{demoWeather.current.temp}°C</div>
              <div style={{ color: 'var(--color-text-secondary)', marginTop: 4 }}>{demoWeather.current.condition}</div>
            </div>
            <div className="weather-details" style={{ marginLeft: 'auto' }}>
              <div className="weather-detail"><Droplets size={14} /> {demoWeather.current.humidity}%</div>
              <div className="weather-detail"><Wind size={14} /> {demoWeather.current.windSpeed} km/h</div>
              <div className="weather-detail"><Thermometer size={14} /> {demoWeather.current.pressure} hPa</div>
            </div>
          </div>
          <div className="weather-forecast">
            {demoWeather.forecast.map((day, i) => (<div key={i} className="forecast-day"><div className="day-name">{day.day}</div><div className="day-icon">{day.icon}</div><div className="day-temp">{day.temp}°C</div><div className="day-rain">💧 {day.rain}%</div></div>))}
          </div>
        </div>
        {demoWeather.alerts.length > 0 && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
            {demoWeather.alerts.map((a, i) => (<div key={i} style={{ flex: 1, padding: '14px 18px', borderRadius: 12, background: a.severity === 'warning' ? 'rgba(255,165,2,0.1)' : 'rgba(255,71,87,0.1)', border: `1px solid ${a.severity === 'warning' ? 'rgba(255,165,2,0.2)' : 'rgba(255,71,87,0.2)'}`, display: 'flex', alignItems: 'center', gap: 10 }}><CloudLightning size={18} style={{ color: a.severity === 'warning' ? 'var(--color-alert)' : 'var(--color-emergency)' }} /><div><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.type}</div><div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{a.message}</div></div></div>))}
          </div>
        )}
        <div className="alerts-section">
          <h2 style={{ fontSize: '1.3rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><Bell size={20} /> Active Pre-Alerts</h2>
          {demoPreAlerts.map(alert => {
            const crisis = CRISIS_TYPES.find(c => c.id === alert.type);
            return (
              <div key={alert.id} className={`alert-card ${alert.severity}`}>
                <div className="alert-header">
                  <div className="alert-title">
                    <span style={{ fontSize: '1.5rem' }}>{crisis?.icon}</span>
                    <div><h3>{alert.title}</h3><div style={{ display: 'flex', gap: 8, marginTop: 4 }}><StatusBadge status={alert.severity} /><StatusBadge status={alert.status} /></div></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Users size={14} style={{ color: 'var(--color-text-muted)' }} /><span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{alert.communityMembers} members</span></div>
                </div>
                <p style={{ fontSize: '0.92rem', marginBottom: 8 }}>{alert.description}</p>
                <div className="alert-meta"><span><MapPin size={13} /> {alert.region}</span></div>
                <div className="checklist">
                  <h4 style={{ fontSize: '0.9rem', marginBottom: 4 }}>📋 Preparation Checklist</h4>
                  {alert.preparationTasks.map((task, idx) => {
                    const key = `${alert.id}-${idx}`;
                    const checked = checkedItems[key];
                    return (<div key={idx} className={`checklist-item ${checked ? 'checked' : ''}`} onClick={() => toggleCheck(alert.id, idx)}><div className="check-box">{checked && <Check size={12} color="white" />}</div><span style={{ textDecoration: checked ? 'line-through' : 'none', opacity: checked ? 0.6 : 1 }}>{task}</span></div>);
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>👥 Crisis Communities</h2>
          <div className="communities-grid">
            {demoCommunities.filter(c => c.status === 'active').map(c => {
              const crisis = CRISIS_TYPES.find(ct => ct.id === c.crisisType);
              return (<div key={c.id} className="community-card" onClick={() => joinCommunity(c.name)}><div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}><span style={{ fontSize: '1.5rem' }}>{crisis?.icon}</span><h4>{c.name}</h4></div><div className="community-stats"><span><Users size={13} /> {c.memberCount} members</span><span><Bell size={13} /> {c.resourceNeeds?.filter(r => !r.fulfilled).length || 0} needs</span><span><MapPin size={13} /> {c.location?.city || 'India'}</span></div><button className="btn btn-outline btn-sm" style={{ marginTop: 12, width: '100%' }}>Join Community</button></div>);
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreAlerts;
