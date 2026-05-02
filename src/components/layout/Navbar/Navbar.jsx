import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Menu, X, LogOut, User, Settings, Shield, MapPin, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNotifications } from '../../../context/NotificationContext';
import { formatTimeAgo } from '../../../utils';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const isActive = (path) => location.pathname === path;

  const navLinks = user ? (
    user.role === 'admin' ? [
      { path: '/admin', label: 'Dashboard' },
      { path: '/map', label: 'Live Map' },
      { path: '/community', label: 'Communities' },
      { path: '/pre-alerts', label: 'Pre-Alerts' },
    ] : user.role === 'volunteer' ? [
      { path: '/volunteer', label: 'Dashboard' },
      { path: '/map', label: 'Live Map' },
      { path: '/community', label: 'Communities' },
      { path: '/pre-alerts', label: 'Pre-Alerts' },
    ] : [
      { path: '/victim', label: 'Dashboard' },
      { path: '/map', label: 'Live Map' },
      { path: '/community', label: 'Communities' },
      { path: '/pre-alerts', label: 'Pre-Alerts' },
    ]
  ) : [
    { path: '/', label: 'Home' },
    { path: '/map', label: 'Live Map' },
    { path: '/community', label: 'Communities' },
    { path: '/pre-alerts', label: 'Pre-Alerts' },
  ];

  const getNotifIcon = (type) => {
    switch (type) {
      case 'alert': return { bg: 'rgba(255,165,2,0.15)', icon: '⚠️' };
      case 'request': return { bg: 'rgba(255,71,87,0.15)', icon: '🆘' };
      case 'update': return { bg: 'rgba(55,66,250,0.15)', icon: '✅' };
      case 'community': return { bg: 'rgba(6,182,212,0.15)', icon: '👥' };
      case 'prealert': return { bg: 'rgba(139,92,246,0.15)', icon: '🔔' };
      default: return { bg: 'rgba(255,255,255,0.1)', icon: 'ℹ️' };
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            <div className="navbar-logo-icon">🛡️</div>
            <span>CrisisConnect</span>
          </Link>
          <div className="navbar-links">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} className={`navbar-link ${isActive(link.path) ? 'active' : ''}`}>{link.label}</Link>
            ))}
          </div>
          <div className="navbar-actions">
            {user && (
              <div ref={notifRef} style={{ position: 'relative' }}>
                <button className="navbar-notification-btn" onClick={() => setShowNotifications(!showNotifications)}>
                  <Bell size={18} />
                  {unreadCount > 0 && <span className="notification-badge-count">{unreadCount}</span>}
                </button>
                {showNotifications && (
                  <div className="notification-panel">
                    <div className="notification-panel-header">
                      <h4>Notifications</h4>
                      <button className="btn btn-ghost btn-sm" onClick={markAllAsRead}>Mark all read</button>
                    </div>
                    <div className="notification-panel-body">
                      {notifications.map(notif => {
                        const ni = getNotifIcon(notif.type);
                        return (
                          <div key={notif.id} className={`notification-item ${!notif.read ? 'unread' : ''}`} onClick={() => markAsRead(notif.id)}>
                            <div className="notification-icon" style={{ background: ni.bg }}>{ni.icon}</div>
                            <div className="notification-content">
                              <h5>{notif.title}</h5>
                              <p>{notif.message}</p>
                              <span className="notification-time">{formatTimeAgo(notif.time)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
            {user ? (
              <div ref={userRef} style={{ position: 'relative' }}>
                <button className="navbar-user-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
                  <div className="navbar-user-avatar">{user.name?.[0] || 'U'}</div>
                  <span className="navbar-user-name">{user.name}</span>
                </button>
                {showUserMenu && (
                  <div className="navbar-user-dropdown">
                    <div style={{ padding: '8px 12px', borderBottom: 'var(--border-glass)' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{user.role}</div>
                    </div>
                    <div style={{ padding: '4px 0' }}>
                      <button className="navbar-dropdown-item" onClick={() => { setShowUserMenu(false); navigate(user.role === 'admin' ? '/admin' : user.role === 'volunteer' ? '/volunteer' : '/victim'); }}><User size={16} /> Dashboard</button>
                      <button className="navbar-dropdown-item" onClick={() => { setShowUserMenu(false); }}><Settings size={16} /> Settings</button>
                      <div className="navbar-dropdown-divider" />
                      <button className="navbar-dropdown-item" onClick={() => { logout(); setShowUserMenu(false); navigate('/'); }} style={{ color: 'var(--color-emergency)' }}><LogOut size={16} /> Logout</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
              </>
            )}
            <button className="navbar-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>
      <div className={`navbar-mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {navLinks.map(link => (<Link key={link.path} to={link.path} className={`navbar-mobile-link ${isActive(link.path) ? 'active' : ''}`}>{link.label}</Link>))}
        {!user && (<><Link to="/login" className="navbar-mobile-link">Login</Link><Link to="/register" className="navbar-mobile-link" style={{ color: 'var(--color-purple)' }}>Get Started</Link></>)}
        {user && (<button className="navbar-mobile-link" onClick={() => { logout(); navigate('/'); }} style={{ color: 'var(--color-emergency)', textAlign: 'left' }}>Logout</button>)}
      </div>
    </>
  );
};

export default Navbar;
