import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Users, Activity, Clock, TrendingUp, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { StatusBadge } from '../../components';
import { demoAdminStats, demoUsers } from '../../data';
import { formatTimeAgo } from '../../utils';
import './AdminDashboard.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(17,17,40,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', fontSize: '0.82rem' }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, display: 'flex', gap: 8 }}>
          <span>{p.name}:</span><span style={{ fontWeight: 600 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const AdminDashboard = () => {
  const stats = demoAdminStats;
  const statCards = [
    { icon: '👥', bg: 'rgba(139,92,246,0.15)', value: stats.usersRegistered.toLocaleString(), label: 'Users Registered', change: '+12%', positive: true },
    { icon: '🦺', bg: 'rgba(46,213,115,0.15)', value: stats.volunteersVerified.toLocaleString(), label: 'Volunteers Verified', change: '+8%', positive: true },
    { icon: '🆘', bg: 'rgba(255,71,87,0.15)', value: stats.activeRequests, label: 'Active Requests', change: '-5%', positive: false },
    { icon: '⏱️', bg: 'rgba(6,182,212,0.15)', value: stats.avgResponseTime + ' min', label: 'Avg Response Time', change: '-15%', positive: true },
  ];
  const activityColors = { request: '#ff4757', verification: '#2ed573', completion: '#3742fa', alert: '#ffa502', community: '#8b5cf6' };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-inner">
          <h1 style={{ fontSize: '1.8rem', marginBottom: 4 }}>⚙️ Admin Dashboard</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Monitor platform activity, manage users, and moderate requests</p>
        </div>
      </div>
      <div className="admin-body">
        <div className="admin-stats-grid">
          {statCards.map((s, i) => (
            <div key={i} className="admin-stat-card">
              <div className="admin-stat-icon" style={{ background: s.bg }}>{s.icon}</div>
              <div className="admin-stat-value">{s.value}</div>
              <div className="admin-stat-label">{s.label}</div>
              <span className="admin-stat-change" style={{ background: s.positive ? 'rgba(46,213,115,0.1)' : 'rgba(255,71,87,0.1)', color: s.positive ? 'var(--color-safe)' : 'var(--color-emergency)' }}>{s.change}</span>
            </div>
          ))}
        </div>
        <div className="admin-charts-grid">
          <div className="admin-chart-card">
            <h3><Activity size={18} /> Requests Over Time</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={stats.requestsOverTime}>
                <defs>
                  <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} /><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient>
                  <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2ed573" stopOpacity={0.3} /><stop offset="95%" stopColor="#2ed573" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#6b6b8a', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: '#6b6b8a', fontSize: 12 }} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="requests" stroke="#8b5cf6" fill="url(#reqGrad)" strokeWidth={2} name="Requests" />
                <Area type="monotone" dataKey="resolved" stroke="#2ed573" fill="url(#resGrad)" strokeWidth={2} name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="admin-chart-card">
            <h3>📊 Requests by Type</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart><Pie data={stats.requestsByType} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">{stats.requestsByType.map((entry, i) => (<Cell key={i} fill={entry.color} />))}</Pie><Tooltip content={<CustomTooltip />} /></PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {stats.requestsByType.map((entry, i) => (<span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color }} /> {entry.name}</span>))}
            </div>
          </div>
        </div>
        <div className="admin-charts-grid">
          <div className="admin-chart-card">
            <h3><Clock size={18} /> Response Time Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stats.responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="hour" tick={{ fill: '#6b6b8a', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: '#6b6b8a', fontSize: 12 }} axisLine={false} unit=" min" />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="time" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 4 }} name="Avg Time" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="admin-chart-card">
            <h3>📋 Recent Activity</h3>
            <div className="activity-timeline">
              {stats.recentActivity.map(a => (<div key={a.id} className="activity-item"><div className="activity-dot" style={{ background: activityColors[a.type] || '#8b5cf6' }} /><div className="activity-content"><div className="action">{a.action}</div><div className="meta">{a.user} • {formatTimeAgo(a.time)}</div></div></div>))}
            </div>
          </div>
        </div>
        <div className="admin-chart-card" style={{ marginTop: 8 }}>
          <h3><Users size={18} /> Volunteer Directory</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead><tr><th>Volunteer</th><th>Type</th><th>Status</th><th>Tasks</th><th>Rating</th><th>Actions</th></tr></thead>
              <tbody>
                {demoUsers.map(u => (<tr key={u.id}><td><div className="admin-user-cell"><div className="admin-user-avatar">{u.name[0]}</div><div><div style={{ fontWeight: 600 }}>{u.name}</div><div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>ID: {u.id}</div></div></div></td><td style={{ textTransform: 'capitalize' }}>{u.type}</td><td><StatusBadge status={u.available ? 'available' : 'unavailable'} /></td><td>{u.tasksCompleted}</td><td>⭐ {u.rating}</td><td><div style={{ display: 'flex', gap: 6 }}><button className="btn btn-ghost btn-sm">View</button><button className="btn btn-outline btn-sm" style={{ color: u.verified ? 'var(--color-safe)' : 'var(--color-alert)' }}>{u.verified ? '✓ Verified' : 'Verify'}</button></div></td></tr>))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
