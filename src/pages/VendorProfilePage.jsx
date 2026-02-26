import { useState } from 'react';
import { 
    Star, MapPin, Calendar as CalendarIcon, Users, 
    Car, Home, Sun, Info, CheckCircle2, 
    MessageCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import './VendorProfilePage.css';

const MOCK_VENDOR = {
    name: "The Grand Emerald Venue",
    category: "Venue",
    rating: 4.8,
    reviewsCount: 245,
    startingPrice: "₹1,50,000",
    location: "123 Event Street, City Center, Mumbai",
    capacity: "500 - 1500 Guests",
    parking: "Valet & 200 Slots",
    rooms: 15,
    options: "Indoor & Outdoor",
    catering: "In-house & Outside",
    decoration: "In-house Only",
    images: [
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1519167758481-83f5affe0fb5?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=1200"
    ],
    description: "The Grand Emerald Venue offers a perfect blend of luxury and natural beauty. With state-of-the-art facilities and experienced staff, we ensure your special day transcends expectations. Our heritage-inspired architecture combined with modern amenities makes it the perfect backdrop for your celebrations.",
    experience: "15+ Years in Event Management",
    highlights: ["Award-winning hospitality", "Premium location", "24/7 Power Backup", "Dedicated Event Manager"],
    packages: [
        { name: "Silver Package", price: "₹1,50,000", features: ["Venue access for 8 hours", "Basic lighting", "Standard seating setup"] },
        { name: "Platinum Package", price: "₹3,00,000", features: ["Venue access 24 hrs", "Premium decor setup", "Bridal suite included", "Valet services"] }
    ],
    platePricing: { veg: "₹1,200/plate", nonVeg: "₹1,500/plate" },
    reviewsList: [
        { id: 1, name: "Rahul S.", rating: 5, text: "Absolutely stunning venue. Our wedding was magical! The staff was extremely helpful.", date: "15 Feb 2026" },
        { id: 2, name: "Priya M.", rating: 4, text: "Great food and ambience. Parking was slightly tight but managed well by valet.", date: "10 Feb 2026" },
        { id: 3, name: "Amit K.", rating: 5, text: "Highly recommend for large gatherings. The outdoor lawn is beautiful.", date: "28 Jan 2026" }
    ],
    faqs: [
        { question: "What is the cancellation policy?", answer: "50% refund if cancelled 30 days prior. No refund if cancelled within 30 days of the event." },
        { question: "Can we bring our own decorator?", answer: "No, we have an exclusive panel of decorators to ensure the highest quality of service." },
        { question: "Is alcohol allowed?", answer: "Yes, alcohol is allowed with a valid liquor license which can be procured." }
    ]
};

export default function VendorProfilePage() {
    const [activeImg, setActiveImg] = useState(0);
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");

    // Simple calendar mock
    const upcomingDates = Array.from({length: 14}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1);
        return {
            date: d.toISOString().split('T')[0],
            day: d.getDate(),
            month: d.toLocaleString('default', { month: 'short' }),
            available: Math.random() > 0.3
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
                    <span className="vp-category">{MOCK_VENDOR.category}</span>
                    <h1 className="vp-title">{MOCK_VENDOR.name}</h1>
                    
                    <div className="vp-meta flex items-center flex-wrap gap-4">
                        <div className="flex items-center gap-1 vp-rating-badge">
                            <Star size={18} fill="currentColor" className="text-accent" />
                            <span className="font-bold">{MOCK_VENDOR.rating}</span>
                            <span className="text-sm">({MOCK_VENDOR.reviewsCount} reviews)</span>
                        </div>
                        <div className="vp-location flex items-center gap-1">
                            <MapPin size={18} />
                            <span>{MOCK_VENDOR.location}</span>
                        </div>
                    </div>

                    <div className="vp-hero-actions mt-6 flex flex-wrap gap-4 items-center justify-between">
                        <div className="vp-price-tag">
                            <span className="text-sm">Starts at</span>
                            <div className="text-2xl font-bold">{MOCK_VENDOR.startingPrice}</div>
                        </div>
                        <div className="flex gap-4">
                            <button className="glass-btn flex items-center gap-2">
                                <CalendarIcon size={18} /> Check Availability
                            </button>
                            <button className="solid-btn">Request Booking</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Image Gallery */}
            <section className="vp-gallery-section my-8">
                <div className="vp-main-image glass-card">
                    <img src={MOCK_VENDOR.images[activeImg]} alt="Main Venue" />
                </div>
                <div className="vp-thumbnails grid grid-cols-4 gap-4 mt-4">
                    {MOCK_VENDOR.images.map((img, idx) => (
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
                        <h2 className="vp-section-title">About the Venue</h2>
                        <p className="vp-description">{MOCK_VENDOR.description}</p>
                        <div className="vp-experience mt-4 font-semibold text-primary">
                            ✓ {MOCK_VENDOR.experience}
                        </div>
                        <div className="vp-highlights mt-4 grid grid-cols-2 gap-2">
                            {MOCK_VENDOR.highlights.map((hlt, i) => (
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
                                <div className="font-bold text-xl">{MOCK_VENDOR.platePricing.veg}</div>
                            </div>
                            <div className="vp-price-box">
                                <span className="text-sm text-dark-green">Non-Veg Plate</span>
                                <div className="font-bold text-xl">{MOCK_VENDOR.platePricing.nonVeg}</div>
                            </div>
                        </div>

                        <div className="vp-packages grid gap-4">
                            {MOCK_VENDOR.packages.map((pkg, i) => (
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
                                <div className="text-4xl font-bold">{MOCK_VENDOR.rating}</div>
                                <div className="flex justify-center my-1">
                                    {[1,2,3,4,5].map(s => <Star key={s} size={16} fill={s <= Math.round(MOCK_VENDOR.rating) ? "currentColor" : "none"} className="text-accent"/>)}
                                </div>
                                <div className="text-sm">{MOCK_VENDOR.reviewsCount} reviews</div>
                            </div>
                            <div className="vp-rating-bars flex-1">
                                {[5,4,3,2,1].map(r => (
                                    <div key={r} className="flex items-center gap-2 text-sm mb-1">
                                        <span>{r}</span> <Star size={12} fill="currentColor" className="text-accent" />
                                        <div className="vp-progress-bar flex-1 bg-surface rounded-full h-2">
                                            <div className="bg-accent h-full rounded-full" style={{width: `${r===5?70:r===4?20:r===3?5:2}%`}}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="vp-reviews-list">
                            {MOCK_VENDOR.reviewsList.map(review => (
                                <div key={review.id} className="vp-review-item py-4 border-b last-border-0">
                                    <div className="flex justify-between mb-2">
                                        <div className="font-bold">{review.name}</div>
                                        <div className="text-sm text-muted">{review.date}</div>
                                    </div>
                                    <div className="flex mb-2">
                                        {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= review.rating ? "currentColor" : "none"} className="text-accent" />)}
                                    </div>
                                    <p className="text-sm">{review.text}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 9. FAQ Section */}
                    <section className="vp-section glass-card mt-8">
                        <h2 className="vp-section-title">Frequently Asked Questions</h2>
                        <div className="vp-faqs">
                            {MOCK_VENDOR.faqs.map((faq, idx) => (
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
                                <div><div className="text-sm text-muted">Capacity</div><div className="font-medium">{MOCK_VENDOR.capacity}</div></div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Car size={20} className="text-primary mt-1" />
                                <div><div className="text-sm text-muted">Parking</div><div className="font-medium">{MOCK_VENDOR.parking}</div></div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Home size={20} className="text-primary mt-1" />
                                <div><div className="text-sm text-muted">Rooms</div><div className="font-medium">{MOCK_VENDOR.rooms} Rooms</div></div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Sun size={20} className="text-primary mt-1" />
                                <div><div className="text-sm text-muted">Space Setup</div><div className="font-medium">{MOCK_VENDOR.options}</div></div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Info size={20} className="text-primary mt-1" />
                                <div><div className="text-sm text-muted">Catering</div><div className="font-medium">{MOCK_VENDOR.catering}</div></div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 size={20} className="text-primary mt-1" />
                                <div><div className="text-sm text-muted">Decoration</div><div className="font-medium">{MOCK_VENDOR.decoration}</div></div>
                            </div>
                        </div>
                    </section>

                    {/* 6. Availability Section */}
                    <section className="vp-section glass-card mt-8">
                        <h3 className="font-bold text-xl mb-4">Availability</h3>
                        <div className="vp-calendar">
                            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {/* Dummy offset */}
                                <div/><div/>
                                {upcomingDates.map((d, i) => (
                                    <div 
                                        key={i} 
                                        className={`vp-cal-day py-2 text-center text-sm rounded cursor-pointer ${
                                            d.available ? 'bg-surface hover-bg-accent' : 'bg-surface-dark opacity-50 cursor-not-allowed'
                                        } border ${selectedDate === d.date ? 'border-accent shadow-sm' : 'border-transparent'}`}
                                        onClick={() => d.available && setSelectedDate(d.date)}
                                        title={d.available ? 'Available' : 'Booked'}
                                    >
                                        <div className="font-bold">{d.day}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-4 mt-4 text-xs justify-center">
                                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-surface border"></div> Available</div>
                                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-surface-dark opacity-50 border"></div> Booked</div>
                            </div>
                        </div>
                    </section>

                    {/* 8. Location Section */}
                    <section className="vp-section glass-card mt-8">
                        <h3 className="font-bold text-xl mb-4">Location</h3>
                        <p className="text-sm mb-4"><MapPin size={14} className="inline mr-1"/> {MOCK_VENDOR.location}</p>
                        <div className="vp-map-mock h-48 rounded-lg overflow-hidden relative">
                            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400" alt="Map Location" className="w-full h-full object-cover opacity-70" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                                <MapPin size={32} className="text-accent drop-shadow-lg" />
                            </div>
                        </div>
                    </section>

                    {/* 10. Final Call-to-Action */}
                    <section className="vp-section glass-card mt-8 text-center vp-sticky-bottom">
                        <div className="text-lg font-bold mb-4">Ready to Book?</div>
                        <button className="solid-btn w-full mb-3 text-lg py-3 shadow-lg">Request Booking Now</button>
                        <button className="glass-btn w-full flex items-center justify-center gap-2">
                            <MessageCircle size={18} /> Chat with Vendor
                        </button>
                    </section>

                </div>
            </div>
        </div>
    );
}
