import { Bot, CalendarCheck, PieChart, ShieldCheck } from 'lucide-react';
import './Features.css';

const features = [
    {
        icon: <Bot size={32} />,
        title: "AI Vendor Matching",
        description: "Our smart algorithm finds the perfect vendors based on your event style, size, and budget."
    },
    {
        icon: <CalendarCheck size={32} />,
        title: "Real-Time Availability",
        description: "See up-to-date calendars and book instantly without the back-and-forth emails."
    },
    {
        icon: <PieChart size={32} />,
        title: "Smart Budget Dashboard",
        description: "Track every penny with visual insights, automated payment schedules, and budget alerts."
    },
    {
        icon: <ShieldCheck size={32} />,
        title: "Transparent Pricing",
        description: "No hidden fees. What you see is exactly what you pay, with verified vendor reviews."
    }
];

export default function Features() {
    return (
        <section id="features" className="features-section">
            <div className="container">
                <div className="text-center">
                    <h2 className="section-title">Intelligent Event Planning</h2>
                    <p className="section-subtitle">Experience a new era of event management with tools designed to give you complete control and peace of mind.</p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card glass-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-desc">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
