import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, Bell, Lock, Shield, Mail, Smartphone } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Demo Organizer');
  const [email] = useState(user?.email || 'demo@eventflex.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');

  // Notification states
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [marketingNotif, setMarketingNotif] = useState(false);

  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <h1 className="os-page-title">Settings</h1>

      <div className="os-settings-layout flex gap-8">
        {/* Settings Sidebar */}
        <div className="w-64 flex flex-col gap-2">
          <button
            className={`os-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} /> <span>Profile Details</span>
          </button>
          <button
            className={`os-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} /> <span>Notifications</span>
          </button>
          <button
            className={`os-nav-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={18} /> <span>Security</span>
          </button>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="os-panel animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="os-settings-section">
                <h3>Profile Details</h3>
                <p>Update your personal information and preferences.</p>

                <form onSubmit={handleSave} className="mt-6">
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
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted opacity-50" size={16} />
                      <input
                        type="email"
                        className="os-form-input !pl-10"
                        value={email}
                        readOnly
                        style={{ opacity: 0.6, paddingLeft: '36px' }}
                      />
                    </div>
                  </div>

                  <div className="os-form-group">
                    <label className="os-form-label">Phone Number</label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted opacity-50" size={16} />
                      <input
                        type="text"
                        className="os-form-input !pl-10"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ paddingLeft: '36px' }}
                      />
                    </div>
                  </div>

                  <button type="submit" className="os-save-btn mt-4">
                    {saved ? '✓ Saved!' : 'Save Changes'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="os-panel animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="os-settings-section mb-0">
                <h3>Notification Preferences</h3>
                <p>Control what alerts you receive and how.</p>

                <div className="mt-6 flex flex-col gap-4">
                  <label className="flex items-center justify-between p-4 rounded-lg border border-glass bg-surface-dark cursor-pointer">
                    <div>
                      <div className="font-semibold text-sm">Email Notifications</div>
                      <div className="text-xs text-muted mt-1">Receive daily summaries and event alerts.</div>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle-checkbox"
                      checked={emailNotif}
                      onChange={(e) => setEmailNotif(e.target.checked)}
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 rounded-lg border border-glass bg-surface-dark cursor-pointer">
                    <div>
                      <div className="font-semibold text-sm">Push Notifications</div>
                      <div className="text-xs text-muted mt-1">Get instant alerts on your desktop.</div>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle-checkbox"
                      checked={pushNotif}
                      onChange={(e) => setPushNotif(e.target.checked)}
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 rounded-lg border border-glass bg-surface-dark cursor-pointer">
                    <div>
                      <div className="font-semibold text-sm">Marketing Emails</div>
                      <div className="text-xs text-muted mt-1">Receive offers and platform updates.</div>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle-checkbox"
                      checked={marketingNotif}
                      onChange={(e) => setMarketingNotif(e.target.checked)}
                    />
                  </label>
                </div>

                <button className="os-save-btn mt-6" onClick={handleSave}>
                  {saved ? '✓ Saved!' : 'Save Preferences'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="os-panel">
                <div className="os-settings-section mb-0">
                  <h3>Security Settings</h3>
                  <p>Protect your account with these security measures.</p>

                  <div className="mt-4 flex flex-col gap-4">
                    <div className="p-4 border border-glass bg-surface-dark rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Lock size={20} className="text-primary" />
                        <div>
                          <div className="font-semibold text-sm">Password</div>
                          <div className="text-xs text-muted mt-1">Last changed 3 months ago</div>
                        </div>
                      </div>
                      <button className="glass-btn text-sm py-2 px-4">Change Password</button>
                    </div>

                    <div className="p-4 border border-glass bg-surface-dark rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield size={20} className="text-primary" />
                        <div>
                          <div className="font-semibold text-sm">Two-Factor Authentication</div>
                          <div className="text-xs text-muted mt-1">Add an extra layer of security.</div>
                        </div>
                      </div>
                      <button className="solid-btn text-sm py-2 px-4 border-none">Enable 2FA</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="os-panel os-danger-section mt-0">
                <h3>Danger Zone</h3>
                <p>Irreversible account actions. Please act carefully.</p>
                <button className="os-delete-btn mt-2">Delete Account Permanently</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
