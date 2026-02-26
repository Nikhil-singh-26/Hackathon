import './History.css';

const milestones = [
    { year: "2021", title: "Founded", desc: "Started with a vision to simplify event planning." },
    { year: "2022", title: "10K Users", desc: "Reached our first major milestone of active users." },
    { year: "2024", title: "5K Vendors", desc: "Built a strong network of verified service providers." },
    { year: "2026", title: "Global Expansion", desc: "Taking our intelligent platform to international markets." }
];

export default function History() {
    return (
        <section id="history" className="history-section">
            <div className="container">
                <div className="text-center">
                    <h2 className="section-title">Our Journey</h2>
                    <p className="section-subtitle">How we've grown to become the most trusted event platform.</p>
                </div>

                <div className="timeline-container">
                    <div className="timeline-line"></div>
                    <div className="timeline-dots">
                        {milestones.map((milestone, index) => (
                            <div key={index} className="timeline-item">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content glass-card">
                                    <span className="timeline-year">{milestone.year}</span>
                                    <h3 className="timeline-title">{milestone.title}</h3>
                                    <p className="timeline-desc">{milestone.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
