import { useState, useEffect } from 'react';
import { Star, MapPin, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;
import { MOCK_VENDORS } from '../constants/vendors';
import './MarketplacePreview.css';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
    throw new Error('VITE_API_URL is not defined');
}

export default function MarketplacePreview() {
    const [showAll, setShowAll] = useState(false);
    const navigate = useNavigate();

    const [vendorsList, setVendorsList] = useState(MOCK_VENDORS);
    const [loading, setLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchStatus, setSearchStatus] = useState('idle');

    useEffect(() => {
        const fetchInitialVendors = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}/users/vendors`);
                if (res.data.data && res.data.data.length > 0) {
                    setVendorsList(res.data.data);
                } else {
                    setVendorsList(MOCK_VENDORS);
                }
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch vendors", err);
                setVendorsList(MOCK_VENDORS);
                setLoading(false);
            }
        };
        fetchInitialVendors();
    }, []);

    const handleFindNearby = () => {
        if (!navigator.geolocation) {
            setSearchStatus('error');
            return;
        }

        setIsSearching(true);
        setSearchStatus('loading');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await axios.get(`${API_URL}/users/nearby`, {
                        params: { lat: latitude, lng: longitude, radius: 25, role: 'vendor' }
                    });

                    const nearbyVendors = response.data.data;

                    if (nearbyVendors && nearbyVendors.length > 0) {
                        setVendorsList(nearbyVendors);
                        setSearchStatus('success');
                        setShowAll(true);
                    } else {
                        setVendorsList(MOCK_VENDORS);
                        setSearchStatus('no-results');
                    }
                } catch (error) {
                    console.error("Error fetching nearby vendors:", error);
                    setSearchStatus('error');
                    setVendorsList(MOCK_VENDORS);
                } finally {
                    setIsSearching(false);
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                setSearchStatus('error');
                setIsSearching(false);
                setVendorsList(MOCK_VENDORS);
            },
            { enableHighAccuracy: true }
        );
    };

    const displayedVendors = showAll ? vendorsList : vendorsList.slice(0, 4);

    return (
        <section id="marketplace" className="marketplace-section" style={{ position: 'relative' }}>
            <div className="container">
                <div className="text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 className="section-title">Top Rated Vendors</h2>
                    <p className="section-subtitle">Discover and book the best professionals for your special day.</p>

                    <button
                        onClick={handleFindNearby}
                        disabled={isSearching}
                        className="glass-btn"
                        style={{
                            display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, marginBottom: 24,
                            background: searchStatus === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'var(--glass-bg)',
                            borderColor: searchStatus === 'success' ? '#22c55e' : 'var(--glass-border)',
                            color: searchStatus === 'success' ? '#22c55e' : 'var(--color-primary)'
                        }}
                    >
                        {isSearching ? <Loader2 size={18} className="spin" /> : <MapPin size={18} />}
                        {isSearching ? 'Scanning 25km Radius...' : searchStatus === 'success' ? 'Viewing Local Vendors' : 'Find Vendors near me'}
                    </button>

                    {searchStatus === 'error' && <p style={{ color: 'var(--color-error)', fontSize: '0.9rem' }}>Unable to access location or server error. Showing featured vendors.</p>}
                    {searchStatus === 'no-results' && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No vendors found nearby. Showing featured vendors instead.</p>}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="spin text-primary" size={40} />
                    </div>
                ) : vendorsList.length === 0 ? (
                    <div className="text-center py-20 glass-card">
                        <p className="text-muted">No vendors found. Be the first to join!</p>
                    </div>
                ) : (
                    <div className="vendor-grid">
                        {displayedVendors.map(vendor => (
                            <div
                                key={vendor._id}
                                className="vendor-card glass-card"
                                onClick={() => navigate(`/vendor/${vendor._id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="vendor-image-wrap">
                                    <img
                                        src={vendor.images?.[0] || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800"}
                                        alt={vendor.businessName || vendor.name}
                                        className="vendor-image"
                                    />
                                    <div className="vendor-category">{vendor.category || "Service Provider"}</div>
                                </div>
                                <div className="vendor-info">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="vendor-name">{vendor.businessName || vendor.name}</h3>
                                        <div className="vendor-rating flex items-center gap-1">
                                            < Star size={16} className="star-icon" fill="currentColor" />
                                            <span>4.8</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <div className="vendor-price">
                                            <span className="price-label">Starts at</span>
                                            <p>{vendor.startingPrice || "₹15,000"}</p>
                                        </div>
                                        <Link
                                            to={`/vendor/${vendor._id}`}
                                            className="glass-btn view-btn"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            View Profile
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {vendorsList.length > 4 && (
                    <div className="text-center mt-12">
                        <button
                            className="solid-btn"
                            onClick={() => setShowAll(!showAll)}
                        >
                            {showAll ? 'Show Less' : 'View All Vendors'}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
