import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>🛡️ CrisisConnect</h3>
          <p>Connecting communities, saving lives. A real-time crisis management platform for proactive emergency response.</p>
          <div className="footer-emergency">
            <Phone size={16} />
            Emergency: 112 | NDRF: 011-24363260
          </div>
        </div>

        <div className="footer-section">
          <h4>Platform</h4>
          <Link to="/map" className="footer-link">Live Map</Link>
          <Link to="/pre-alerts" className="footer-link">Pre-Alerts</Link>
          <Link to="/register" className="footer-link">Volunteer</Link>
          <Link to="/" className="footer-link">About</Link>
        </div>

        <div className="footer-section">
          <h4>Resources</h4>
          <a href="#" className="footer-link">Help Center</a>
          <a href="#" className="footer-link">Safety Guide</a>
          <a href="#" className="footer-link">API Docs</a>
          <a href="#" className="footer-link">Status</a>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Terms of Service</a>
          <a href="#" className="footer-link">Cookie Policy</a>
          <a href="#" className="footer-link">Contact</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 CrisisConnect. Built for HTF 3.0 Hackathon.</span>
        <div className="footer-social">
          <button className="footer-social-btn">𝕏</button>
          <button className="footer-social-btn">in</button>
          <button className="footer-social-btn">▶</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
