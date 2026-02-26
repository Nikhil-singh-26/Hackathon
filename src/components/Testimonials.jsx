import { Quote } from 'lucide-react';
import './Testimonials.css';

const testimonials = [
    {
        name: "Priya Sharma",
        role: "Bride",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
        text: "EventFlex made our wedding planning completely stress-free. We found all our vendors through the platform, and the budget tracker kept us perfectly in line. Highly recommended!"
    },
    {
        name: "Rahul Verma",
        role: "Corporate Event Manager",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
        text: "Managing large tech events requires precision. The real-time availability and transparent pricing on EventFlex saved me countless hours of negotiation. It's a game changer."
    },
    {
        name: "Anita Desai",
        role: "Birthday Organizer",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
        text: "From finding a great local bakery to hiring a magician, this platform had everything. The vendors were verified and exactly as described in their profiles."
    }
];

export default function Testimonials() {
    return (
        <section className="testimonials-section">
            <div className="container">
                <div className="text-center">
                    <h2 className="section-title">What Our Users Say</h2>
                    <p className="section-subtitle">Real stories from people who planned their perfect events with EventFlex.</p>
                </div>

                <div className="testimonials-grid">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="testimonial-card glass-card">
                            <Quote className="quote-icon" size={32} />
                            <p className="testimonial-text">{testimonial.text}</p>
                            <div className="testimonial-author flex items-center gap-4 mt-6">
                                <img src={testimonial.image} alt={testimonial.name} className="author-image" />
                                <div>
                                    <h4 className="author-name">{testimonial.name}</h4>
                                    <p className="author-role">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
