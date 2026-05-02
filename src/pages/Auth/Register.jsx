import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, ArrowLeft, Check, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { VOLUNTEER_TYPES } from '../../constants';
import { getDashboardPath } from '../../routes';
import './Auth.css';

const Register = () => {
  const { register } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '',
    role: '', volunteerType: '',
    aadhaar: '', pancard: '', photoVerification: null
  });

  const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    const user = register(formData);
    showToast('Account created successfully! Welcome to CrisisConnect.', 'success');
    navigate(getDashboardPath(user.role));
  };

  const canNext = () => {
    if (step === 1) return formData.name && formData.email && formData.password && formData.phone;
    if (step === 2) return formData.role && (formData.role !== 'volunteer' || formData.volunteerType);
    return true;
  };

  return (
    <div className="auth-page">
      <div className="auth-container register-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">🛡️</div>
            <h2>Join CrisisConnect</h2>
            <p>Create your account and start making a difference</p>
          </div>

          {/* Steps indicator */}
          <div className="register-steps">
            {[1, 2, 3].map((s, i) => (
              <div key={s} className="register-step">
                <div className={`register-step-dot ${step === s ? 'active' : step > s ? 'completed' : 'inactive'}`}>
                  {step > s ? <Check size={14} /> : s}
                </div>
                {i < 2 && <div className={`register-step-line ${step > s ? 'active' : ''}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="auth-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input type="text" className="form-input" placeholder="Enter your full name" value={formData.name}
                    onChange={e => update('name', e.target.value)} style={{ paddingLeft: 40 }} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input type="email" className="form-input" placeholder="you@example.com" value={formData.email}
                    onChange={e => update('email', e.target.value)} style={{ paddingLeft: 40 }} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input type="tel" className="form-input" placeholder="+91 98765 43210" value={formData.phone}
                    onChange={e => update('phone', e.target.value)} style={{ paddingLeft: 40 }} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input type="password" className="form-input" placeholder="Create a strong password" value={formData.password}
                    onChange={e => update('password', e.target.value)} style={{ paddingLeft: 40 }} />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Role Selection */}
          {step === 2 && (
            <div className="auth-form">
              <div className="form-group">
                <label className="form-label">Select Your Role</label>
                <div className="role-selector">
                  <div className={`role-card ${formData.role === 'victim' ? 'selected' : ''}`} onClick={() => update('role', 'victim')}>
                    <div className="role-icon">🆘</div>
                    <h4>I Need Help</h4>
                    <p>Report emergencies and request assistance</p>
                  </div>
                  <div className={`role-card ${formData.role === 'volunteer' ? 'selected' : ''}`} onClick={() => update('role', 'volunteer')}>
                    <div className="role-icon">🦺</div>
                    <h4>I Want to Help</h4>
                    <p>Volunteer and respond to emergencies</p>
                  </div>
                </div>
              </div>

              {formData.role === 'volunteer' && (
                <div className="form-group">
                  <label className="form-label">Volunteer Type</label>
                  <div className="vol-type-selector">
                    {VOLUNTEER_TYPES.map(vt => (
                      <div key={vt.id} className={`vol-type-card ${formData.volunteerType === vt.id ? 'selected' : ''}`}
                        onClick={() => update('volunteerType', vt.id)}>
                        <span className="vol-type-icon">{vt.icon}</span>
                        <div>
                          <h4 style={{ fontSize: '0.9rem', marginBottom: 2 }}>{vt.label}</h4>
                          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: 0 }}>{vt.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Verification */}
          {step === 3 && (
            <div className="auth-form">
              {formData.role === 'volunteer' ? (
                <>
                  <div style={{
                    padding: 16, borderRadius: 12, background: 'rgba(255,165,2,0.1)',
                    border: '1px solid rgba(255,165,2,0.2)', fontSize: '0.85rem', color: 'var(--color-alert)'
                  }}>
                    🔐 Volunteer verification ensures trust and safety for all users. Your documents are securely encrypted.
                  </div>
                  <div className="form-group">
                    <label className="form-label">Aadhaar Number</label>
                    <input type="text" className="form-input" placeholder="XXXX XXXX XXXX" value={formData.aadhaar}
                      maxLength={14}
                      onChange={e => {
                        const val = e.target.value.replace(/[^\d\s]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();
                        update('aadhaar', val.slice(0, 14));
                      }} />
                    <div style={{ fontSize: '0.75rem', marginTop: 4, color: formData.aadhaar.replace(/\s/g, '').length === 12 ? 'var(--color-safe)' : 'var(--color-text-muted)' }}>
                      {formData.aadhaar.replace(/\s/g, '').length === 12 ? '✅ Valid Aadhaar format' : `${formData.aadhaar.replace(/\s/g, '').length}/12 digits — Format: XXXX XXXX XXXX`}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">PAN Card Number</label>
                    <input type="text" className="form-input" placeholder="ABCDE1234F" value={formData.pancard}
                      maxLength={10}
                      style={{ textTransform: 'uppercase' }}
                      onChange={e => update('pancard', e.target.value.toUpperCase().slice(0, 10))} />
                    <div style={{ fontSize: '0.75rem', marginTop: 4, color: /^[A-Z]{5}\d{4}[A-Z]$/.test(formData.pancard) ? 'var(--color-safe)' : 'var(--color-text-muted)' }}>
                      {/^[A-Z]{5}\d{4}[A-Z]$/.test(formData.pancard) ? '✅ Valid PAN format' : 'Format: ABCDE1234F (5 letters, 4 digits, 1 letter)'}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Photo Verification</label>
                    <div style={{
                      padding: 32, borderRadius: 12, border: '2px dashed rgba(255,255,255,0.1)',
                      textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s'
                    }}>
                      <Upload size={24} style={{ color: 'var(--color-text-muted)', marginBottom: 8 }} />
                      <p style={{ fontSize: '0.85rem', margin: 0 }}>Click to upload a clear photo of yourself</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>JPG, PNG up to 5MB</p>
                    </div>
                  </div>
                  {/* Verification Status */}
                  {formData.aadhaar && formData.pancard && (
                    <div style={{
                      padding: 14, borderRadius: 12, background: 'rgba(46,213,115,0.08)',
                      border: '1px solid rgba(46,213,115,0.2)', display: 'flex', alignItems: 'center', gap: 10
                    }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', background: 'rgba(46,213,115,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem'
                      }}>🛡️</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-safe)' }}>Documents Ready for Verification</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Your documents will be verified within 24 hours after registration.</div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: 32 }}>
                  <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
                  <h3 style={{ marginBottom: 8 }}>Almost Done!</h3>
                  <p>Your account is ready. You can start reporting emergencies and requesting help immediately.</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="auth-actions" style={{ marginTop: 24 }}>
            {step > 1 && (
              <button className="btn btn-outline" onClick={() => setStep(step - 1)}>
                <ArrowLeft size={16} /> Back
              </button>
            )}
            {step < 3 ? (
              <button className="btn btn-primary" disabled={!canNext()} onClick={() => setStep(step + 1)}
                style={{ marginLeft: 'auto' }}>
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleSubmit} style={{ marginLeft: 'auto' }}>
                Create Account <ArrowRight size={16} />
              </button>
            )}
          </div>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
