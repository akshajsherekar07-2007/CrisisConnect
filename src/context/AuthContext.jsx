import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for demo user
    const saved = localStorage.getItem('crisisconnect_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Demo login
    const demoUser = {
      id: 'demo-user-' + Date.now(),
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      role: email.includes('admin') ? 'admin' : email.includes('vol') ? 'volunteer' : 'victim',
      volunteerType: email.includes('vol') ? 'rescue' : null,
      verified: true,
      available: true,
      avatar: null,
      phone: '+91 98765 43210',
      joinedDate: Date.now(),
      tasksCompleted: Math.floor(Math.random() * 50),
      rating: (4 + Math.random()).toFixed(1),
    };
    setUser(demoUser);
    localStorage.setItem('crisisconnect_user', JSON.stringify(demoUser));
    return demoUser;
  };

  const register = (userData) => {
    const newUser = {
      id: 'user-' + Date.now(),
      ...userData,
      verified: userData.role === 'victim',
      available: true,
      joinedDate: Date.now(),
      tasksCompleted: 0,
      rating: 5.0,
    };
    setUser(newUser);
    localStorage.setItem('crisisconnect_user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('crisisconnect_user');
  };

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('crisisconnect_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
