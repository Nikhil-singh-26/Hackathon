import { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  ToggleLeft, 
  ToggleRight, 
  CheckCircle, 
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function VendorDashboard() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    businessName: user?.businessName || '',
    description: user?.description || '',
    phone: user?.phone || '',
    isLocationSharing: user?.isLocationSharing || false,
    status: user?.status || 'active'
  });

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(`${API_URL}/users/update-profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser({ ...user, ...res.data.data });
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  const toggleLocation = () => {
    const newVal = !formData.isLocationSharing;
    setFormData({ ...formData, isLocationSharing: newVal });
    // Proactively save this toggle
    setTimeout(() => handleUpdate(null), 100);
  };

  const toggleStatus = () => {
    const newVal = formData.status === 'active' ? 'inactive' : 'active';
    setFormData({ ...formData, status: newVal });
    setTimeout(() => handleUpdate(null), 100);
  };

  return (
    <div className="vendor-dashboard">
      <div className="flex justify-between items-center mb-8">
        <h1 className="os-page-title">Vendor Dashboard</h1>
        <div className="flex gap-4">
          <button 
            className={`glass-btn flex items-center gap-2 ${formData.status === 'active' ? 'text-green' : 'text-muted'}`}
            onClick={toggleStatus}
          >
            {formData.status === 'active' ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
            <span>Status: {formData.status.toUpperCase()}</span>
          </button>
        </div>
      </div>

      {msg.text && (
        <div className={`form-message ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} p-4 rounded-lg mb-6 flex items-center gap-2`}>
          {msg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{msg.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md-grid-cols-3 gap-8">
        <div className="md-col-span-2">
          <section className="glass-card p-6 mb-8">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
              <Building2 size={24} className="text-primary" />
              Business Profile
            </h3>
            
            <form onSubmit={handleUpdate} className="grid gap-6">
              <div className="form-group">
                <label className="text-sm font-medium mb-2 block">Business Name</label>
                <input 
                  type="text" 
                  className="os-input w-full p-3 rounded-lg bg-white/50 border"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="Enter your business name"
                />
              </div>

              <div className="form-group">
                <label className="text-sm font-medium mb-2 block">Description</label>
                <textarea 
                  className="os-input w-full p-3 rounded-lg bg-white/50 border min-h-[120px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell organizers about your services..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="text-sm font-medium mb-2 block">Phone Number</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input 
                      type="tel" 
                      className="os-input w-full p-3 pl-10 rounded-lg bg-white/50 border"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 9876543210"
                    />
                  </div>
                </div>
              </div>

              <button disabled={loading} type="submit" className="solid-btn w-fit px-8">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </section>
        </div>

        <div className="md-col-span-1">
          <section className="glass-card p-6 mb-8">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <MapPin size={20} className="text-primary" />
              Location Settings
            </h3>
            
            <div className="flex items-center justify-between p-4 bg-white/30 rounded-xl border border-white/50">
              <div>
                <div className="font-bold">Live Location</div>
                <div className="text-xs text-muted">Share your current spot</div>
              </div>
              <button 
                className={`text-3xl ${formData.isLocationSharing ? 'text-accent' : 'text-muted'}`}
                onClick={toggleLocation}
              >
                {formData.isLocationSharing ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
              </button>
            </div>

            <p className="text-xs text-muted mt-4">
              When enabled, organizers nearby can find you on the map. We use your browser's Geolocation API.
            </p>
          </section>

          <section className="glass-card p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <MessageSquare size={20} className="text-primary" />
              Quick Stats
            </h3>
            <div className="grid gap-3">
              <div className="flex justify-between items-center p-3 bg-white/20 rounded-lg">
                <span className="text-sm">Total Messages</span>
                <span className="font-bold">0</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/20 rounded-lg">
                <span className="text-sm">Profile Views</span>
                <span className="font-bold">124</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
