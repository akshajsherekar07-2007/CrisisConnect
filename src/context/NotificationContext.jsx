import { createContext, useContext, useState, useCallback } from 'react';
import { demoNotifications } from '../data';

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(demoNotifications);
  const [toasts, setToasts] = useState([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notification) => {
    const newNotif = {
      id: 'n-' + Date.now(),
      time: Date.now(),
      read: false,
      ...notification,
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const toast = { id: 't-' + Date.now(), message, type };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, duration);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications, unreadCount, addNotification, markAsRead, markAllAsRead, toasts, showToast
    }}>
      {children}
      {/* Toast Container */}
      <div className="toast-container" style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 999,
        display: 'flex', flexDirection: 'column', gap: 8
      }}>
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`} style={{
            padding: '12px 20px', borderRadius: 12,
            background: toast.type === 'success' ? 'rgba(46,213,115,0.9)' :
              toast.type === 'error' ? 'rgba(255,71,87,0.9)' :
              toast.type === 'warning' ? 'rgba(255,165,2,0.9)' : 'rgba(55,66,250,0.9)',
            color: 'white', fontWeight: 500, fontSize: '0.9rem',
            backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            animation: 'fadeInUp 0.3s ease forwards', maxWidth: 350,
            fontFamily: 'var(--font-body)'
          }}>
            {toast.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
