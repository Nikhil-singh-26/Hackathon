import { useState } from 'react';
import { Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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

    const displayedVendors = showAll ? vendors : vendors.slice(0, 4);

    return (
        <section id="marketplace" className="marketplace-section">
            <div className="container">
                <div className="text-center">
                    <h2 className="section-title">Top Rated Vendors</h2>
                    <p className="section-subtitle">Discover and book the best professionals for your special day.</p>
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

                <div className="text-center mt-12">
                    <button
                        className="solid-btn"
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ? 'Show Less' : 'View All Vendors'}
                    </button>
                </div>
            </div>
        </section>
    );
}
