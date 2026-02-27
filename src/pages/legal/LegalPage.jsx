import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, FileText, Cookie, CreditCard, ChevronLeft } from 'lucide-react';
import './LegalPage.css';

const LEGAL_CONTENT = {
    'privacy-policy': {
        title: 'Privacy Policy',
        icon: <Shield size={40} />,
        lastUpdated: 'February 27, 2026',
        sections: [
            {
                heading: 'Information We Collect',
                content: 'We collect information you provide directly to us when you create an account, update your profile, or use our marketplace services. This includes your name, email address, phone number, and any vendor-specific details.'
            },
            {
                heading: 'How We Use Your Information',
                content: 'We use the information we collect to provide, maintain, and improve our services, to process transactions, and to communicate with you about event updates and vendor availability.'
            },
            {
                heading: 'Information Sharing',
                content: 'We do not share your personal information with third parties except as described in this policy, such as when you request a booking with a vendor or when required by law.'
            }
        ]
    },
    'terms-of-service': {
        title: 'Terms of Service',
        icon: <FileText size={40} />,
        lastUpdated: 'February 27, 2026',
        sections: [
            {
                heading: 'Acceptance of Terms',
                content: 'By accessing or using EventFlex, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.'
            },
            {
                heading: 'User Accounts',
                content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.'
            },
            {
                heading: 'Marketplace Rules',
                content: 'Vendors must provide accurate information about their services, pricing, and availability. EventFlex reserves the right to remove any content that violates our community guidelines.'
            }
        ]
    },
    'cookie-policy': {
        title: 'Cookie Policy',
        icon: <Cookie size={40} />,
        lastUpdated: 'February 27, 2026',
        sections: [
            {
                heading: 'What are Cookies?',
                content: 'Cookies are small text files stored on your device that help us provide a better user experience by remembering your preferences and login status.'
            },
            {
                heading: 'Types of Cookies We Use',
                content: 'We use essential cookies for authentication, functional cookies for preferences, and analytical cookies to understand how users interact with our platform.'
            },
            {
                heading: 'Managing Cookies',
                content: 'Most web browsers allow you to control cookies through their settings. However, disabling certain cookies may affect the functionality of our site.'
            }
        ]
    },
    'refund-policy': {
        title: 'Refund Policy',
        icon: <CreditCard size={40} />,
        lastUpdated: 'February 27, 2026',
        sections: [
            {
                heading: 'Booking Deposits',
                content: 'Deposits paid to vendors through EventFlex are governed by each vendor\'s individual cancellation policy. Please review the specific vendor terms before booking.'
            },
            {
                heading: 'Service Fees',
                content: 'EventFlex service fees are generally non-refundable unless there is a confirmed technical error that prevented the service from being rendered.'
            },
            {
                heading: 'Dispute Resolution',
                content: 'If you are unsatisfied with a vendor\'s service, please contact our support team. We will facilitate communication between you and the vendor to reach a fair resolution.'
            }
        ]
    }
};

export default function LegalPage() {
    const { type } = useParams();
    const navigate = useNavigate();
    const content = LEGAL_CONTENT[type];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [type]);

    if (!content) {
        return (
            <div className="legal-container error-state">
                <h2>Page Not Found</h2>
                <button className="solid-btn mt-4" onClick={() => navigate('/')}>Return Home</button>
            </div>
        );
    }

    return (
        <div className="legal-container">
            <button className="back-link flex items-center gap-2 mb-8" onClick={() => navigate(-1)}>
                <ChevronLeft size={18} /> Back
            </button>
            
            <div className="legal-header glass-card p-8 mb-12 flex flex-col items-center text-center">
                <div className="legal-icon mb-4 text-primary">{content.icon}</div>
                <h1 className="text-4xl font-bold mb-2">{content.title}</h1>
                <p className="text-muted">Last Updated: {content.lastUpdated}</p>
            </div>

            <div className="legal-content-grid grid gap-8">
                {content.sections.map((section, idx) => (
                    <section key={idx} className="legal-section glass-card p-8">
                        <h2 className="text-2xl font-bold mb-4 text-primary">{section.heading}</h2>
                        <p className="leading-relaxed text-muted text-lg">{section.content}</p>
                    </section>
                ))}
            </div>

            <div className="legal-footer mt-12 text-center p-8 glass-card">
                <p>Have questions about our {content.title.toLowerCase()}?</p>
                <button className="glass-btn mt-4" onClick={() => navigate('/#contact')}>Contact Support</button>
            </div>
        </div>
    );
}
