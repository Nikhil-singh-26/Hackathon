import { Leaf, Twitter, Instagram, Linkedin, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="logo footer-logo">
                            <Leaf className="logo-icon" />
                            <span>EventFlex</span>
                        </div>
                        <p className="footer-desc">
                            Your one-stop intelligent platform to plan, manage, and execute perfect events without the stress.
                        </p>
                        <div className="social-links flex gap-4 mt-6">
                            <a href="#" className="social-icon"><Twitter size={20} /></a>
                            <a href="#" className="social-icon"><Instagram size={20} /></a>
                            <a href="#" className="social-icon"><Linkedin size={20} /></a>
                            <a href="#" className="social-icon"><Facebook size={20} /></a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <div className="link-group">
                            <h4>Platform</h4>
                            <ul>
                                <li><a href="#">About Us</a></li>
                                <li><a href="#marketplace">Marketplace</a></li>
                                <li><a href="#features">Features</a></li>
                                <li><a href="#">Pricing</a></li>
                            </ul>
                        </div>
                        <div className="link-group">
                            <h4>Vendors</h4>
                            <ul>
                                <li><a href="#">Join Network</a></li>
                                <li><a href="#">Vendor Guidelines</a></li>
                                <li><a href="#">Success Stories</a></li>
                                <li><a href="#">Support</a></li>
                            </ul>
                        </div>
                        <div className="link-group">
                            <h4>Legal</h4>
                            <ul>
                                <li><Link to="/legal/privacy-policy">Privacy Policy</Link></li>
                                <li><Link to="/legal/terms-of-service">Terms of Service</Link></li>
                                <li><Link to="/legal/cookie-policy">Cookie Policy</Link></li>
                                <li><Link to="/legal/refund-policy">Refund Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} EventFlex Marketplace. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
