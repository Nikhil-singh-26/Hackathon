import { useState, useEffect } from 'react';
import {
    Star, MapPin, Calendar as CalendarIcon, Users,
    Car, Home, Sun, Info, CheckCircle2,
    MessageCircle, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';
import './VendorProfilePage.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { MOCK_VENDORS } from '../constants/vendors';

const API_URL = 'http://localhost:5000/api';

// No numeric mock database - using API data

export default function VendorProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImg, setActiveImg] = useState(0);
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [availabilityStatus, setAvailabilityStatus] = useState(null); // 'available', 'unavailable', 'not-fetched'
    const [bookingRequested, setBookingRequested] = useState(false);

    useEffect(() => {
        const fetchVendorData = async () => {
            if (!id) return;

            // Check if it's a mock ID
            if (id.startsWith('mock-')) {
                const mock = MOCK_VENDORS.find(v => v._id === id);
                if (mock) {
                    setVendor(mock);
                    setLoading(false);
                    return;
                }
            }

            try {
                const res = await axios.get(`${API_URL}/users/${id}`);
                setVendor(res.data.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching vendor:', err);
                setError(true);
                setLoading(false);
            }
        };

        fetchVendorData();
        window.scrollTo(0, 0);
    }, [id]);

    const checkAvailability = (date) => {
        const targetDate = date || selectedDate;
        if (!targetDate) return;
        
        if (!vendor.availability || vendor.availability.length === 0) {
            setAvailabilityStatus('not-fetched');
            return;
        }

        if (vendor.availability.includes(targetDate)) {
            setAvailabilityStatus('available');
        } else {
            setAvailabilityStatus('unavailable');
        }
    };

    const handleBooking = async () => {
        if (!selectedDate) {
            alert("Please select a date first");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/bookings`, {
                vendorId: id,
                date: selectedDate,
                message: `Booking request for ${selectedDate}`
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookingRequested(true);
        } catch (err) {
            console.error("Booking failed", err);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-2xl font-bold mb-4">{error}</h2>
            <button className="solid-btn" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
    );

    // Default values if fields are missing in DB
    const displayVendor = {
        rating: 4.8,
        reviewsCount: 15,
        experience: "5+ Years",
        highlights: ["Verified", "Professional Staff", "Quick Response"],
        packages: [
            { name: "Standard", price: "Starting from ₹15,000", features: ["Full service", "Basic support"] }
        ],
        platePricing: { veg: "N/A", nonVeg: "N/A" },
        reviewsList: [],
        faqs: [
            { question: "How to book?", answer: "Select a date and click 'Request Booking'." }
        ],
        capacity: "N/A",
        parking: "N/A",
        rooms: 0,
        options: "Flexible",
        catering: "N/A",
        decoration: "Available",
        ...vendor,
        images: vendor.images?.length ? vendor.images : [
            "https://images.unsplash.com/photo-1519167758481-83f5affe0fb5?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200"
        ],
        startingPrice: vendor.startingPrice || "₹15,000",
        category: vendor.category || "Service Provider",
        location_str: vendor.location_str || "Near you",
        description: vendor.description || "Premium vendor providing top-notch services for your events."
    };

    // Calendar for sidebar
    const upcomingDates = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1);
        const dateStr = d.toISOString().split('T')[0];
        return {
            date: dateStr,
            day: d.getDate(),
            month: d.toLocaleString('default', { month: 'short' }),
            available: vendor.availability?.includes(dateStr)
        };
    });

    const toggleFaq = (idx) => {
        setExpandedFaq(expandedFaq === idx ? null : idx);
    };

    return (
        <div className="vp-container">
            {/* 1. Hero Section */}
            <section className="vp-hero glass-card">
                <div className="vp-hero-content">
                    <span className="vp-category">{displayVendor.category}</span>
                    <h1 className="vp-title">{displayVendor.businessName || displayVendor.name}</h1>

                    <div className="vp-meta flex items-center flex-wrap gap-4">
                        <div className="flex items-center gap-1 vp-rating-badge">
                            <Star size={18} fill="currentColor" className="text-accent" />
                            <span className="font-bold">{displayVendor.rating}</span>
                            <span className="text-sm">({displayVendor.reviewsCount} reviews)</span>
                        </div>
                        <div className="vp-location flex items-center gap-1">
                            <MapPin size={18} />
                            <span>{displayVendor.location_str}</span>
                        </div>
                    </div>

                    <div className="vp-hero-actions mt-6 flex flex-wrap gap-4 items-center justify-between">
                        <div className="vp-price-tag">
                            <span className="text-sm">Starts at</span>
                            <div className="text-2xl font-bold">{displayVendor.startingPrice}</div>
                        </div>
                        <div className="flex gap-4">
                            {!bookingRequested ? (
                                <>
                                    <button 
                                        className="glass-btn flex items-center gap-2"
                                        onClick={() => {
                                            document.getElementById('vp-availability').scrollIntoView({ behavior: 'smooth' });
                                        }}
                                    >
                                        <CalendarIcon size={18} /> Check Availability
                                    </button>
                                    <button 
                                        className="solid-btn"
                                        onClick={handleBooking}
                                    >
                                        Request Booking
                                    </button>
                                </>
                            ) : (
                                <div className="bg-primary/10 text-primary border border-primary px-6 py-2 rounded-xl font-bold flex items-center gap-2">
                                    <CheckCircle2 size={18} /> Requested (Notified)
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Image Gallery */}
            <section className="vp-gallery-section my-8">
                <div className="vp-main-image glass-card">
                    <img src={displayVendor.images[activeImg]} alt="Main Venue" />
                </div>
                <div className="vp-thumbnails grid grid-cols-4 gap-4 mt-4">
                    {displayVendor.images.map((img, idx) => (
                        <div
                            key={idx}
                            className={`vp-thumb glass-card ${activeImg === idx ? 'active' : ''}`}
                            onClick={() => setActiveImg(idx)}
                        >
                            <img src={img} alt={`Thumbnail ${idx}`} />
                        </div>
                    ))}
                </div>
            </section>

            <div className="vp-layout grid grid-cols-1 md-grid-cols-3 gap-8">

                <div className="vp-main-content md-col-span-2">
                    {/* 4. About Section */}
                    <section className="vp-section glass-card">
                        <h2 className="vp-section-title">About the Vendor</h2>
                        <p className="vp-description">{displayVendor.description}</p>
                        <div className="vp-experience mt-4 font-semibold text-primary">
                            ✓ {displayVendor.experience} Experience
                        </div>
                        <div className="vp-highlights mt-4 grid grid-cols-2 gap-2">
                            {displayVendor.highlights.map((hlt, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 size={16} className="text-accent" /> {hlt}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 5. Pricing & Packages */}
                    <section className="vp-section glass-card mt-8">
                        <h2 className="vp-section-title">Pricing & Packages</h2>
                        <div className="vp-plate-pricing flex gap-6 mb-6">
                            <div className="vp-price-box">
                                <span className="text-sm text-green">Veg Plate</span>
                                <div className="font-bold text-xl">{displayVendor.platePricing.veg}</div>
                            </div>
                            <div className="vp-price-box">
                                <span className="text-sm text-dark-green">Non-Veg Plate</span>
                                <div className="font-bold text-xl">{displayVendor.platePricing.nonVeg}</div>
                            </div>
                        </div>

                        <div className="vp-packages grid gap-4">
                            {displayVendor.packages.map((pkg, i) => (
                                <div key={i} className="vp-package-card border-glass p-4 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold text-lg">{pkg.name}</h3>
                                        <span className="font-bold text-primary">{pkg.price}</span>
                                    </div>
                                    <ul className="text-sm vp-features-list">
                                        {pkg.features.map((f, j) => <li key={j}>• {f}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 7. Reviews Section */}
                    <section className="vp-section glass-card mt-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="vp-section-title mb-0">Reviews</h2>
                            <button className="glass-btn text-sm">Write Review</button>
                        </div>
                        <div className="vp-reviews-summary flex gap-8 items-center border-b pb-6 mb-6">
                            <div className="text-center">
                                <div className="text-4xl font-bold">{displayVendor.rating}</div>
                                <div className="flex justify-center my-1">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill={s <= Math.round(displayVendor.rating) ? "currentColor" : "none"} className="text-accent" />)}
                                </div>
                                <div className="text-sm">{displayVendor.reviewsCount} reviews</div>
                            </div>
                            <div className="vp-rating-bars flex-1">
                                {[5, 4, 3, 2, 1].map(r => (
                                    <div key={r} className="flex items-center gap-2 text-sm mb-1">
                                        <span>{r}</span> <Star size={12} fill="currentColor" className="text-accent" />
                                        <div className="vp-progress-bar flex-1 bg-surface rounded-full h-2">
                                            <div className="bg-accent h-full rounded-full" style={{ width: `${r === 5 ? 70 : r === 4 ? 20 : r === 3 ? 5 : 2}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="vp-reviews-list">
                            {displayVendor.reviewsList.length > 0 ? displayVendor.reviewsList.map(review => (
                                <div key={review.id} className="vp-review-item py-4 border-b last-border-0">
                                    <div className="flex justify-between mb-2">
                                        <div className="font-bold">{review.name}</div>
                                        <div className="text-sm text-muted">{review.date}</div>
                                    </div>
                                    <div className="flex mb-2">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill={s <= review.rating ? "currentColor" : "none"} className="text-accent" />)}
                                    </div>
                                    <p className="text-sm">{review.text}</p>
                                </div>
                            )) : <p className="text-muted text-center py-4">No reviews yet.</p>}
                        </div>
                    </section>

                    {/* 9. FAQ Section */}
                    <section className="vp-section glass-card mt-8">
                        <h2 className="vp-section-title">Frequently Asked Questions</h2>
                        <div className="vp-faqs">
                            {displayVendor.faqs.map((faq, idx) => (
                                <div key={idx} className="vp-faq-item border-b py-4">
                                    <div className="flex justify-between cursor-pointer" onClick={() => toggleFaq(idx)}>
                                        <h4 className="font-medium pr-8">{faq.question}</h4>
                                        {expandedFaq === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                    {expandedFaq === idx && <p className="text-sm mt-3 text-muted">{faq.answer}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="vp-sidebar md-col-span-1">
                    {/* 2. Quick Information Section */}
                    <section className="vp-section glass-card vp-sticky-sidebar">
                        <h3 className="font-bold text-xl mb-6">Quick Info</h3>
                        <div className="vp-quick-info grid gap-4">
                            <div className="flex items-start gap-3">
                                <Users size={20} className="text-primary mt-1" />
                                <div><div className="text-sm text-muted">Capacity</div><div className="font-medium">{displayVendor.capacity}</div></div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Car size={20} className="text-primary mt-1" />
                                <div><div className="text-sm text-muted">Parking</div><div className="font-medium">{displayVendor.parking}</div></div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Home size={20} className="text-primary mt-1" />
                                <div><div className="text-sm text-muted">Rooms</div><div className="font-medium">{displayVendor.rooms} Rooms</div></div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Sun size={20} className="text-primary mt-1" />
                                <div><div className="text-sm text-muted">Space Setup</div><div className="font-medium">{displayVendor.options}</div></div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Info size={20} className="text-primary mt-1" />
                                <div><div className="text-sm text-muted">Catering</div><div className="font-medium">{displayVendor.catering}</div></div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 size={20} className="text-primary mt-1" />
                                <div><div className="text-sm text-muted">Decoration</div><div className="font-medium">{displayVendor.decoration}</div></div>
                            </div>
                        </div>
                    </section>

                    {/* 6. Availability & Booking Card */}
                    <section id="vp-availability" className="vp-section glass-card vp-booking-card mt-8">
                        <h3 className="font-bold text-xl mb-4">Select Date & Book</h3>
                        <div className="vp-calendar">
                            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {/* Dummy offset */}
                                <div /><div />
                                {upcomingDates.map((d, i) => (
                                    <div
                                        key={i}
                                        className={`vp-cal-day py-2 text-center text-sm rounded cursor-pointer transition-all ${
                                            selectedDate === d.date ? 'border-primary bg-primary/10' : 'border-transparent bg-white/5'
                                        } border hover:border-primary/50 relative`}
                                        onClick={() => {
                                            setSelectedDate(d.date);
                                            checkAvailability(d.date);
                                        }}
                                    >
                                        <div className="font-bold">{d.day}</div>
                                        {d.available && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green shadow-green shadow-sm rounded-full"></div>}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-6 border-t pt-6">
                                {availabilityStatus === 'available' && (
                                    <div className="mb-4 p-3 bg-green/10 text-green border border-green/20 rounded-lg text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                        <CheckCircle2 size={16} /> Date is Available!
                                    </div>
                                )}
                                {availabilityStatus === 'unavailable' && (
                                    <div className="mb-4 p-3 bg-red/10 text-red border border-red/20 rounded-lg text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                        <AlertCircle size={16} /> Not Available. Check other dates.
                                    </div>
                                )}
                                {availabilityStatus === 'not-fetched' && (
                                    <div className="mb-4 p-3 bg-yellow/10 text-yellow-700 border border-yellow-700/20 rounded-lg text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                        <AlertCircle size={16} /> Not fetched by vendor
                                    </div>
                                )}

                                {!bookingRequested ? (
                                    <button 
                                        className="solid-btn w-full mb-3 text-lg py-3 shadow-lg"
                                        onClick={handleBooking}
                                        disabled={availabilityStatus !== 'available'}
                                    >
                                        Request Booking Now
                                    </button>
                                ) : (
                                    <div className="bg-primary/10 text-primary border border-primary px-6 py-3 rounded-xl font-bold mb-3 text-center">
                                        Requested (Notified)
                                    </div>
                                )}

                                <button className="glass-btn w-full flex items-center justify-center gap-2 py-3">
                                    <MessageCircle size={18} /> Chat with Vendor
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* 8. Location Section */}
                    <section className="vp-section glass-card mt-8">
                        <h3 className="font-bold text-xl mb-4">Location</h3>
                        <p className="text-sm mb-4"><MapPin size={14} className="inline mr-1" /> {displayVendor.location_str}</p>
                        <div className="vp-map-mock h-48 rounded-lg overflow-hidden relative">
                            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400" alt="Map Location" className="w-full h-full object-cover opacity-70" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                                <MapPin size={32} className="text-accent drop-shadow-lg" />
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
