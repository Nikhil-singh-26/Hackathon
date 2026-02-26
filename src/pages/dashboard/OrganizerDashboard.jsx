import { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  Search, 
  MessageSquare, 
  Star,
  Navigation,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (searchQuery.trim()) {
        // Global search across all vendors
        const res = await axios.get(`${API_URL}/users/vendors`, {
          params: { search: searchQuery },
          headers: { Authorization: `Bearer ${token}` }
        });
        setVendors(res.data.data);
        setLoading(false);
      } else {
        // Nearby scan logic
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const res = await axios.get(`${API_URL}/users/nearby`, {
            params: { lat: latitude, lng: longitude, radius },
            headers: { Authorization: `Bearer ${token}` }
          });
          setVendors(res.data.data);
          setLoading(false);
        }, (err) => {
          console.error("Geolocation error", err);
          // Fallback to all vendors if geo fails
          const res = axios.get(`${API_URL}/users/vendors`, {
            headers: { Authorization: `Bearer ${token}` }
          }).then(res => {
            setVendors(res.data.data);
            setLoading(false);
          });
        });
      }
    } catch (err) {
      console.error("Fetch error", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchVendors();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [radius, searchQuery]);

  const handleChat = async (vendorId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/chat`, { userId: vendorId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/dashboard/chat/${res.data._id}`);
    } catch (err) {
      console.error("Chat initiation failed", err);
    }
  };

  return (
    <div className="organizer-dashboard">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="os-page-title">Find Vendors</h1>
          <p className="text-muted">Discover and connect with service providers near you.</p>
        </div>
        
        {!searchQuery && (
          <div className="flex gap-4 items-center bg-white/50 p-2 rounded-xl border">
            <Navigation size={18} className="text-primary ml-2" />
            <select 
              value={radius} 
              onChange={(e) => setRadius(e.target.value)}
              className="bg-transparent border-none outline-none font-medium p-1"
            >
              <option value="5">Within 5 km</option>
              <option value="10">Within 10 km</option>
              <option value="25">Within 25 km</option>
              <option value="50">Within 50 km</option>
            </select>
          </div>
        )}
      </div>

      <div className="glass-card p-4 mb-8 flex items-center gap-4 relative">
        <Search className={searchQuery ? "text-primary" : "text-muted"} size={20} />
        <input 
          type="text" 
          placeholder="Search by business name, Category, or keyword..." 
          className="bg-transparent border-none outline-none w-full text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-4 p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <X size={18} className="text-muted" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted">
            {searchQuery ? `Searching for "${searchQuery}"...` : "Scanning for nearby vendors..."}
          </p>
        </div>
      ) : vendors.length === 0 ? (
        <div className="glass-card p-20 text-center">
          <Search size={48} className="mx-auto text-muted mb-4 opacity-20" />
          <h3 className="text-xl font-bold mb-2">
            {searchQuery ? `No results for "${searchQuery}"` : "No vendors found nearby"}
          </h3>
          <p className="text-muted">
            {searchQuery 
              ? "Try searching for something else or clear the search to see nearby vendors." 
              : "Try increasing the search radius or checking back later."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <div key={vendor._id} className="glass-card hover-glow flex flex-col h-full overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-2xl shadow-lg">
                  {vendor.businessName?.[0] || vendor.name[0]}
                </div>
                <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                  <Star size={12} className="text-yellow-500 fill-yellow-500" />
                  4.8
                </div>
              </div>
              
              <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{vendor.businessName || vendor.name}</h3>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">ACTIVE</span>
                </div>
                <p className="text-sm text-muted line-clamp-2 mb-4">
                  {vendor.description || "No description available for this vendor."}
                </p>
                
                <div className="flex items-center gap-2 text-xs text-muted mb-4">
                  <MapPin size={14} />
                  <span>~2.4 km away</span>
                </div>
              </div>
              
              <div className="p-5 bg-white/10 border-t flex gap-3">
                <button 
                  onClick={() => handleChat(vendor._id)}
                  className="flex-1 glass-btn py-2 flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} />
                  <span>Chat</span>
                </button>
                <button 
                  onClick={() => navigate(`/vendor/${vendor._id}`)}
                  className="flex-1 solid-btn py-2"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
