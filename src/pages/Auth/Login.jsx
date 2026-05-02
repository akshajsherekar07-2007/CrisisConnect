import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { getDashboardPath } from '../../routes';
import './Auth.css';

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      const user = login(email, password);
      showToast(`Welcome back, ${user.name}!`, 'success');
      navigate(getDashboardPath(user.role));
      setLoading(false);
    }, 800);
  };

  const handleDemoLogin = (role) => {
    const emails = { victim: 'victim@demo.com', volunteer: 'vol@demo.com', admin: 'admin@demo.com' };
    setEmail(emails[role]);
    setPassword('demo123');
    setTimeout(() => {
      const user = login(emails[role], 'demo123');
      showToast(`Logged in as demo ${role}!`, 'success');
      navigate(getDashboardPath(role));
    }, 400);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">🛡️</div>
            <h2>Welcome Back</h2>
            <p>Login to your CrisisConnect account</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input type="email" className="form-input" placeholder="you@example.com" value={email}
                  onChange={e => setEmail(e.target.value)} style={{ paddingLeft: 40 }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input type={showPass ? 'text' : 'password'} className="form-input" placeholder="Enter your password"
                  value={password} onChange={e => setPassword(e.target.value)} style={{ paddingLeft: 40, paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer'
                }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-divider"><span>or try demo accounts</span></div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => handleDemoLogin('volunteer')}>
              🦺 Volunteer
            </button>
            <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => handleDemoLogin('admin')}>
              ⚙️ Admin
            </button>
          </div>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
