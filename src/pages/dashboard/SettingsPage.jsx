import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Demo Organizer');
  const [email] = useState(user?.email || 'demo@eventflex.com');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <h1 className="os-page-title">Settings</h1>

      <div className="os-panel">
        <div className="os-settings-section">
          <h3>Profile Details</h3>
          <p>Update your personal information and preferences.</p>

          <form onSubmit={handleSave}>
            <div className="os-form-group">
              <label className="os-form-label">Full Name</label>
              <input
                type="text"
                className="os-form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="os-form-group">
              <label className="os-form-label">Email Address</label>
              <input
                type="email"
                className="os-form-input"
                value={email}
                readOnly
                style={{ opacity: 0.6 }}
              />
            </div>

            <button type="submit" className="os-save-btn">
              {saved ? '✓ Saved!' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>

      <div className="os-panel os-danger-section">
        <h3>Danger Zone</h3>
        <p>Irreversible account actions.</p>
        <button className="os-delete-btn">Delete Account</button>
      </div>
    </>
  );
}
