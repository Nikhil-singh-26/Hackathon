import { ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Hero.css';

export default function Hero() {
    return (
        <section id="home" className="hero-section">
            <div className="hero-background">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            <div className="container hero-content">
                <div className="hero-text">
                    <h1 className="hero-title">Plan Events <span className="highlight-text">Smarter</span></h1>
                    <p className="hero-subtitle">
                        Find verified vendors, manage bookings, and track your budget — all in one intelligent platform.
                    </p>
                    <div className="hero-actions">
                        <a href="#marketplace" className="solid-btn hero-btn flex items-center justify-center gap-2">
                            Explore Vendors <ArrowRight size={20} />
                        </a>
                        <Link to="/dashboard/events" className="glass-btn hero-btn">
                            Create Event
                        </Link>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="glass-card dashboard-preview">
                        <div className="dashboard-header flex justify-between items-center">
                            <div className="search-pill glass-card flex items-center gap-2">
                                <Search size={16} />
                                <span>Find photographers, venues...</span>
                            </div>
                            <div className="user-avatar"></div>
                        </div>

                        <div className="dashboard-body grid grid-cols-2 gap-4">
                            <div className="stat-card glass-card">
                                <p className="stat-title">Budget Used</p>
                                <h3 className="stat-value">₹45,000</h3>
                                <div className="progress-bar">
                                    <div className="progress-fill"></div>
                                </div>
                            </div>
                            <div className="stat-card glass-card">
                                <p className="stat-title">Vendors Booked</p>
                                <h3 className="stat-value">3 / 5</h3>
                                <div className="avatars flex">
                                    <div className="avatar"></div>
                                    <div className="avatar"></div>
                                    <div className="avatar"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
