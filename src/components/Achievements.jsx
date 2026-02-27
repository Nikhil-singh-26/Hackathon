import { useEffect, useState, useRef } from 'react';
import './Achievements.css';

const stats = [
    { value: 1, label: "Events Managed", prefix: "", suffix: "" },
    { value: 4, label: "Verified Vendors", prefix: "", suffix: "" },
    { value: 100, label: "Customer Satisfaction", prefix: "", suffix: "%" },
    { value: 0, label: "Bookings", prefix: "₹", suffix: "" }
];

export default function Achievements() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section id="achievements" className="achievements-section" ref={sectionRef}>
            <div className="container">
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="achievement-stat-card glass-card text-center">
                            <h3 className="stat-number">
                                {stat.prefix}
                                <Counter value={stat.value} isVisible={isVisible} />
                                {stat.suffix}
                            </h3>
                            <p className="achievement-stat-label">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Counter({ value, isVisible }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isVisible) return;

        let start = 0;
        const duration = 2000;
        const increment = value / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [value, isVisible]);

    return <span>{count.toLocaleString('en-IN')}</span>;
}
