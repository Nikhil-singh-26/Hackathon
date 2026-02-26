import { Mail, Phone, MapPin } from 'lucide-react';
import './Contact.css';

export default function Contact() {
    return (
        <section id="contact" className="contact-section">
            <div className="container">
                <div className="contact-wrapper glass-card">
                    <div className="contact-info">
                        <h2>Get in Touch</h2>
                        <p>Ready to start planning? Or maybe you have a question? We'd love to hear from you.</p>

                        <div className="info-items">
                            <div className="info-item flex items-center gap-4">
                                <div className="info-icon"><Mail size={20} /></div>
                                <div>
                                    <h4>Email Us</h4>
                                    <p>prathmeshdandekar@gmail.com</p>
                                </div>
                            </div>
                            <div className="info-item flex items-center gap-4">
                                <div className="info-icon"><Phone size={20} /></div>
                                <div>
                                    <h4>Call Us</h4>
                                    <p>+91 94079 35884</p>
                                </div>
                            </div>
                            <div className="info-item flex items-center gap-4">
                                <div className="info-icon"><MapPin size={20} /></div>
                                <div>
                                    <h4>Visit Us</h4>
                                    <p>Gandhi nagar SUAS<br />Indore, 493221</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-container">
                        <form className="contact-form">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" placeholder="Awanish Kumar Upadhyay" className="glass-input" />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" placeholder="aku@gmail.com" className="glass-input" />
                            </div>
                            <div className="form-group">
                                <label>Message</label>
                                <textarea placeholder="How can we help you?" rows="4" className="glass-input"></textarea>
                            </div>
                            <button type="button" className="solid-btn w-full">Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
