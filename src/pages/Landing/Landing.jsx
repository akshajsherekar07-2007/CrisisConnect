import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, MapPin, Bell, Users, Zap, Phone, Camera, Send, Navigation, AlertTriangle, Newspaper, ExternalLink, ChevronRight } from 'lucide-react';
import { StatCounter } from '../../components';
import { useReports } from '../../context/ReportContext';
import { useNotifications } from '../../context/NotificationContext';
import { INDIAN_STATES } from '../../data';
import { demoStats } from '../../data';
import { fetchCrisisNews } from '../../services/newsService';
import { getCurrentPosition } from '../../services/geolocation';
import { formatTimeAgo } from '../../utils';
import './Landing.css';

const Landing = () => {
  const { submitReport, getNearbyTeams } = useReports();
  const { showToast } = useNotifications();
  const [newsItems, setNewsItems] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const newsTickerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Report form state
  const [formData, setFormData] = useState({
    name: '', phone: '', photo: null, photoPreview: null,
    lat: null, lng: null, state: '', city: '', pincode: '', address: '',
  });
  const [locationLoading, setLocationLoading] = useState(false);
  const [nearbyTeams, setNearbyTeams] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch news on mount
  useEffect(() => {
    fetchCrisisNews()
      .then(items => { setNewsItems(items); setNewsLoading(false); })
      .catch(() => setNewsLoading(false));
  }, []);

  // Auto-scroll news ticker
  useEffect(() => {
    if (!newsTickerRef.current || isPaused || newsItems.length === 0) return;
    const ticker = newsTickerRef.current;
    const scrollInterval = setInterval(() => {
      if (ticker.scrollLeft >= ticker.scrollWidth - ticker.clientWidth) {
        ticker.scrollLeft = 0;
      } else {
        ticker.scrollLeft += 1;
      }
    }, 30);
    return () => clearInterval(scrollInterval);
  }, [isPaused, newsItems]);

  const updateForm = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const detectLocation = async () => {
    setLocationLoading(true);
    try {
      const pos = await getCurrentPosition();
      updateForm('lat', pos.lat);
      updateForm('lng', pos.lng);
      const teams = getNearbyTeams(pos.lat, pos.lng);
      setNearbyTeams(teams);
      showToast('📍 Location detected successfully!', 'success');
    } catch {
      showToast('Could not detect location. Please enter manually.', 'warning');
    }
    setLocationLoading(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateForm('photo', file);
      const reader = new FileReader();
      reader.onload = (ev) => updateForm('photoPreview', ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast('Please enter your name and phone number.', 'warning');
      return;
    }
    if (!formData.state || !formData.city) {
      showToast('Please enter your address details.', 'warning');
      return;
    }

    submitReport({
      name: formData.name,
      phone: formData.phone,
      photo: formData.photoPreview,
      lat: formData.lat,
      lng: formData.lng,
      state: formData.state,
      city: formData.city,
      pincode: formData.pincode,
      address: formData.address,
    });

    setFormSubmitted(true);
    showToast('🆘 Crisis report submitted! Rescue teams have been notified.', 'success');

    // Reset after 5 seconds
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', phone: '', photo: null, photoPreview: null, lat: null, lng: null, state: '', city: '', pincode: '', address: '' });
      setNearbyTeams([]);
    }, 5000);
  };

  // Update nearby teams when location changes manually (pincode-based approximation)
  useEffect(() => {
    if (formData.lat && formData.lng) {
      const teams = getNearbyTeams(formData.lat, formData.lng);
      setNearbyTeams(teams);
    }
  }, [formData.lat, formData.lng, getNearbyTeams]);

  const features = [
    { icon: '🆘', bg: 'rgba(255,71,87,0.15)', title: 'Instant Crisis Reporting', desc: 'Report emergencies with photos, live location, and address details. Rescue teams are notified instantly.' },
    { icon: '🗺️', bg: 'rgba(55,66,250,0.15)', title: 'Live Crisis Map', desc: 'Real-time visualization of ongoing crises, volunteer positions, and rescue team locations.' },
    { icon: '🔔', bg: 'rgba(255,165,2,0.15)', title: 'Pre-Alert System', desc: 'Weather-based early warnings enable communities to prepare before crises strike.' },
    { icon: '🦺', bg: 'rgba(46,213,115,0.15)', title: 'Verified Volunteers', desc: 'Aadhaar & PAN verified volunteers categorized by rescue, on-ground, and fundraiser roles.' },
    { icon: '👥', bg: 'rgba(6,182,212,0.15)', title: 'Community Hub', desc: 'Create and join pre-crisis or post-crisis communities. Coordinate resources and relief efforts.' },
    { icon: '📊', bg: 'rgba(139,92,246,0.15)', title: 'Resource Tracking', desc: 'Community leaders raise resource requests — food, shelter, funds, transport — on behalf of victims.' },
  ];

  const uspFeatures = [
    { icon: '⚡', bg: 'rgba(255,165,2,0.15)', title: 'Early Warning Integration', desc: 'Weather forecasts, news alerts, and risk indicators feed into proactive notifications.' },
    { icon: '🏘️', bg: 'rgba(6,182,212,0.15)', title: 'Pre-Crisis Communities', desc: 'Communities form before disasters, enabling evacuation and resource planning.' },
    { icon: '🛡️', bg: 'rgba(139,92,246,0.15)', title: 'Preventive Actions', desc: 'Coordinated evacuations, re-sheltering, and awareness campaigns before impact.' },
    { icon: '📡', bg: 'rgba(46,213,115,0.15)', title: 'Multi-Hazard Coverage', desc: 'Floods, earthquakes, cyclones, fires — comprehensive crisis type coverage.' },
  ];

  return (
    <div>
      {/* Live News Ticker */}
      <div className="news-ticker-bar">
        <div className="news-ticker-label">
          <Newspaper size={14} />
          <span>LIVE</span>
        </div>
        <div
          className="news-ticker-scroll"
          ref={newsTickerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {newsLoading ? (
            <span className="news-ticker-loading">Loading crisis news...</span>
          ) : (
            <div className="news-ticker-track">
              {[...newsItems, ...newsItems].map((item, i) => (
                <a
                  key={`${item.id}-${i}`}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-ticker-item"
                >
                  <span className="news-source">{item.source}</span>
                  <span className="news-title">{item.title}</span>
                  <span className="news-time">{formatTimeAgo(item.publishedAt)}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hero + Crisis Report Form */}
      <section className="landing-hero">
        <div className="hero-orb-1" />
        <div className="hero-orb-2" />
        <div className="hero-content">
          <div className="hero-badge">
            <span className="pulse-dot" />
            Real-time Crisis Management Platform
          </div>
          <h1 className="hero-title">
            Connecting Communities,<br />
            <span className="gradient-text">Saving Lives</span>
          </h1>
          <p className="hero-subtitle">
            Report a crisis instantly. Get connected to nearby rescue teams. Verified volunteers respond in real-time.
          </p>
        </div>

        {/* Crisis Report Form */}
        <div className="crisis-report-section" id="report-crisis">
          <div className="crisis-report-card">
            <div className="crisis-report-header">
              <div className="crisis-report-icon">🆘</div>
              <div>
                <h2>Report a Crisis</h2>
                <p>No login required. Your report is forwarded to rescue teams immediately.</p>
              </div>
            </div>

            {formSubmitted ? (
              <div className="report-success">
                <div className="success-icon">✅</div>
                <h3>Report Submitted Successfully!</h3>
                <p>Your crisis report has been forwarded to nearby rescue teams. They will contact you shortly.</p>
                <div className="success-ref">Reference ID: #{Date.now().toString(36).toUpperCase()}</div>
              </div>
            ) : (
              <form className="crisis-report-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input type="text" className="form-input" placeholder="Enter your full name"
                      value={formData.name} onChange={e => updateForm('name', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <div className="input-with-icon">
                      <Phone size={16} className="input-icon" />
                      <input type="tel" className="form-input" placeholder="+91 98765 43210"
                        value={formData.phone} onChange={e => updateForm('phone', e.target.value)} style={{ paddingLeft: 40 }} />
                    </div>
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="form-group">
                  <label className="form-label">Upload Photo / Geo-tagged Image</label>
                  <div className="photo-upload-area" onClick={() => fileInputRef.current?.click()}>
                    {formData.photoPreview ? (
                      <div className="photo-preview">
                        <img src={formData.photoPreview} alt="Uploaded" />
                        <span className="photo-change">Click to change</span>
                      </div>
                    ) : (
                      <>
                        <Camera size={28} />
                        <p>Click to upload a photo of the situation</p>
                        <span>JPG, PNG up to 10MB</span>
                      </>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" capture="environment"
                      style={{ display: 'none' }} onChange={handlePhotoUpload} />
                  </div>
                </div>

                {/* Location */}
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <button type="button" className="detect-location-btn" onClick={detectLocation} disabled={locationLoading}>
                    <Navigation size={16} className={locationLoading ? 'spin' : ''} />
                    {locationLoading ? 'Detecting...' : formData.lat ? `📍 ${formData.lat.toFixed(4)}, ${formData.lng.toFixed(4)}` : 'Auto-detect my location'}
                  </button>
                </div>

                {/* Address Details */}
                <div className="form-row form-row-3">
                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <select className="form-input form-select" value={formData.state}
                      onChange={e => updateForm('state', e.target.value)}>
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input type="text" className="form-input" placeholder="Enter city"
                      value={formData.city} onChange={e => updateForm('city', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode</label>
                    <input type="text" className="form-input" placeholder="110001" maxLength={6}
                      value={formData.pincode} onChange={e => updateForm('pincode', e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Additional Address Details</label>
                  <textarea className="form-input" placeholder="Landmark, street, building name..."
                    value={formData.address} onChange={e => updateForm('address', e.target.value)} rows={2} />
                </div>

                <button type="submit" className="btn btn-emergency btn-lg submit-report-btn">
                  <Send size={18} /> Submit Crisis Report
                </button>
                <p className="form-disclaimer">
                  <Shield size={13} /> Your report is encrypted and shared only with verified rescue teams.
                </p>
              </form>
            )}
          </div>

          {/* Nearby Rescue Teams */}
          {nearbyTeams.length > 0 && (
            <div className="rescue-teams-section">
              <div className="rescue-teams-header">
                <AlertTriangle size={20} />
                <div>
                  <h3>Nearby Rescue Teams</h3>
                  <p>{nearbyTeams.length} teams found near your location</p>
                </div>
              </div>
              <div className="rescue-teams-grid">
                {nearbyTeams.slice(0, 6).map(team => (
                  <div key={team.id} className="rescue-team-card">
                    <div className="rescue-team-icon">{team.icon}</div>
                    <div className="rescue-team-info">
                      <h4>{team.name}</h4>
                      <p className="rescue-team-address">{team.address}</p>
                      <div className="rescue-team-meta">
                        <span className="rescue-distance">
                          <MapPin size={12} /> {team.distance.toFixed(1)} km away
                        </span>
                      </div>
                    </div>
                    <a href={`tel:${team.phone}`} className="rescue-call-btn">
                      <Phone size={16} />
                      <span>Call</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="hero-stats">
          <div className="hero-stat-card">
            <StatCounter end={demoStats.totalVolunteers} suffix="+" label="Verified Volunteers" />
          </div>
          <div className="hero-stat-card">
            <StatCounter end={demoStats.resolvedCrises} suffix="+" label="Crises Resolved" />
          </div>
          <div className="hero-stat-card">
            <StatCounter end={demoStats.communitiesFormed} suffix="+" label="Communities" />
          </div>
          <div className="hero-stat-card">
            <StatCounter end={45} prefix="" suffix="K+" label="Lives Impacted" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Three simple steps to connect with help during any emergency</p>
          <div className="hiw-grid">
            <div className="hiw-card">
              <div className="hiw-number">1</div>
              <h3>Report Crisis</h3>
              <p>Enter your name, phone, and location. Upload a geo-tagged photo. Nearby rescue teams appear instantly.</p>
              <span className="hiw-arrow">→</span>
            </div>
            <div className="hiw-card">
              <div className="hiw-number">2</div>
              <h3>Auto-Forward</h3>
              <p>Your report is automatically forwarded to relevant rescue teams with your location and contact info.</p>
              <span className="hiw-arrow">→</span>
            </div>
            <div className="hiw-card">
              <div className="hiw-number">3</div>
              <h3>Get Rescued</h3>
              <p>Rescue teams respond immediately. Volunteers join community efforts for sustained relief and recovery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Platform Features</h2>
          <p className="section-subtitle">Everything you need for effective crisis management and community resilience</p>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="feature-icon" style={{ background: f.bg }}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USP - Pre-Alert */}
      <section className="usp-section">
        <div className="usp-inner">
          <div className="usp-content">
            <div className="hero-badge" style={{ marginBottom: 16 }}>
              <Zap size={14} /> Unique Selling Point
            </div>
            <h2>Pre-Alert Notification System</h2>
            <p>Our standout feature enables <strong style={{ color: 'var(--color-text-primary)' }}>proactive crisis management</strong>. Based on early warnings from weather forecasts and risk indicators, the system notifies volunteers and communities in advance — before a crisis even occurs.</p>
            <div className="usp-features">
              {uspFeatures.map((f, i) => (
                <div key={i} className="usp-feature-item">
                  <div className="usp-feature-icon" style={{ background: f.bg }}>{f.icon}</div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: 4 }}>{f.title}</h4>
                    <p style={{ fontSize: '0.85rem', margin: 0 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="usp-visual">
            <div className="usp-visual-card">
              <h4 style={{ marginBottom: 20, fontSize: '1rem' }}>⏱️ Pre-Alert Timeline</h4>
              <div className="usp-timeline">
                {[
                  { time: '72h Before', desc: 'Weather systems detected, initial alert issued', color: 'var(--color-alert)' },
                  { time: '48h Before', desc: 'Community formed, volunteers mobilized', color: 'var(--color-purple)' },
                  { time: '24h Before', desc: 'Evacuation plans activated, shelters prepared', color: 'var(--color-cyan)' },
                  { time: 'During Crisis', desc: 'Real-time response coordination active', color: 'var(--color-safe)' },
                  { time: 'After Crisis', desc: 'Recovery support and community closure', color: 'var(--color-safe)' },
                ].map((item, i) => (
                  <div key={i} className="usp-timeline-item">
                    <div className="usp-timeline-dot" style={{ background: item.color }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.time}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2>Ready to Make a Difference?</h2>
          <p>Join thousands of verified volunteers and communities working together to save lives and build resilience.</p>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Become a Volunteer <ArrowRight size={18} />
            </Link>
            <Link to="/community" className="btn btn-outline btn-lg">
              <Users size={18} /> Join a Community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
