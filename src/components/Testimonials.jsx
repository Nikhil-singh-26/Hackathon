import { Quote } from 'lucide-react';
import './Testimonials.css';

const testimonials = [
    {
        name: "Nikhil Singh",
        role: "GROOM",
        text: "EventFlex made our wedding planning completely stress-free. We found all our vendors through the platform, and the budget tracker kept us perfectly in line. Highly recommended!"
    },
    {
        name: "Ishan Patel",
        role: "Corporate Event Manager",
        text: "Managing large tech events requires precision. The real-time availability and transparent pricing on EventFlex saved me countless hours of negotiation. It's a game changer."
    },
    {
        name: "Shekhar Verma",
        role: "Birthday Organizer",
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
                                <div className="author-avatar">{testimonial.name.charAt(0)}</div>
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
