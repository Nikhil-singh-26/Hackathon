import { useState } from 'react';
import { Star, MapPin, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MarketplacePreview.css';

export const vendors = [
    {
        id: 1,
        name: "Lumina Photography",
        category: "Photography",
        rating: 4.9,
        reviews: 128,
        price: "₹15,000",
        image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 2,
        name: "The Grand Emerald Venue",
        category: "Venue",
        rating: 4.8,
        reviews: 245,
        price: "₹1,50,000",
        image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 3,
        name: "Melody Masters",
        category: "Music",
        rating: 5.0,
        reviews: 89,
        price: "₹25,000",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 4,
        name: "Gourmet Delights",
        category: "Catering",
        rating: 4.7,
        reviews: 156,
        price: "₹800/plate",
        image: "https://images.unsplash.com/photo-1555243896-c709bfa0b564?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 5,
        name: "Royal Event Planners",
        category: "Planner",
        rating: 4.9,
        reviews: 312,
        price: "₹50,000",
        image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 6,
        name: "Floral Fantasies",
        category: "Decoration",
        rating: 4.8,
        reviews: 210,
        price: "₹35,000",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 7,
        name: "Elite Makeovers",
        category: "Makeup",
        rating: 4.9,
        reviews: 175,
        price: "₹20,000",
        image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 8,
        name: "Rhythm Rockers",
        category: "DJ",
        rating: 4.7,
        reviews: 95,
        price: "₹18,000",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800"
    }
];

export default function MarketplacePreview() {
    const [showAll, setShowAll] = useState(false);
    const navigate = useNavigate();

    const [vendorsList, setVendorsList] = useState(vendors);
    const [isSearching, setIsSearching] = useState(false);
    const [searchStatus, setSearchStatus] = useState('idle'); // idle, loading, success, error, no-results

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
                    // Our backend route uses radius in KM. So radius=5 means 5km.
                    const API_URL = import.meta.env.VITE_API_URL || '/api';
                    const response = await axios.get(`${API_URL}/users/nearby`, {
                        params: { lat: latitude, lng: longitude, radius: 5, role: 'vendor' }
                    });

                    const nearbyVendors = response.data.users;

                    if (nearbyVendors && nearbyVendors.length > 0) {
                        // Map database schema to frontend card schema
                        const mappedVendors = nearbyVendors.map(v => ({
                            id: v._id,
                            name: v.name,
                            category: "Local Vendor", // Could be dynamic if schema supports it
                            rating: "5.0", // Mock rating since DB doesn't have it yet
                            reviews: 0,
                            price: "Price on request",
                            image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800"
                        }));
                        setVendorsList(mappedVendors);
                        setSearchStatus('success');
                        setShowAll(true); // show all nearby by default
                    } else {
                        setVendorsList([]);
                        setSearchStatus('no-results');
                    }
                } catch (error) {
                    console.error("Error fetching nearby vendors:", error);
                    setSearchStatus('error');
                } finally {
                    setIsSearching(false);
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                setSearchStatus('error');
                setIsSearching(false);
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
                        {isSearching ? 'Scanning 5km Radius...' : searchStatus === 'success' ? 'Viewing Local Vendors (5km)' : 'Find Vendors near me (5km)'}
                    </button>

                    {searchStatus === 'error' && <p style={{ color: 'var(--color-error)', fontSize: '0.9rem' }}>Unable to access location or server error.</p>}
                    {searchStatus === 'no-results' && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No vendors found within exactly 5km of your current location. Showing mock data instead.</p>}
                </div>

                <div className="vendor-grid">
                    {displayedVendors.map(vendor => (
                        <div
                            key={vendor.id}
                            className="vendor-card glass-card"
                            onClick={() => navigate(`/vendor/${vendor.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="vendor-image-wrap">
                                <img src={vendor.image} alt={vendor.name} className="vendor-image" />
                                <div className="vendor-category">{vendor.category}</div>
                            </div>
                            <div className="vendor-info">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="vendor-name">{vendor.name}</h3>
                                    <div className="vendor-rating flex items-center gap-1">
                                        <Star size={16} className="star-icon" fill="currentColor" />
                                        <span>{vendor.rating}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <div className="vendor-price">
                                        <span className="price-label">Starts at</span>
                                        <p>{vendor.price}</p>
                                    </div>
                                    <Link
                                        to={`/vendor/${vendor.id}`}
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

                {searchStatus !== 'success' && (
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
