import { Leaf } from 'lucide-react';
import './Auth.css';

export default function AuthLayout({ children, heading, subtitle }) {
  return (
    <div className="auth-page">
      {/* ---- Left branding panel ---- */}
      <div className="auth-branding">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />

        <div className="auth-branding-content">
          <div className="auth-branding-logo">
            <Leaf />
            <span>EventFlex</span>
          </div>
          <h2>Your Premium Event Marketplace</h2>
          <p>
            Discover, organize, and manage world-class events with the power of
            a next-generation platform built for creators and attendees alike.
          </p>
        </div>
      </div>

      {/* ---- Right form panel ---- */}
      <div className="auth-form-panel">
        <div className="auth-form-card">
          {heading && <h1>{heading}</h1>}
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
