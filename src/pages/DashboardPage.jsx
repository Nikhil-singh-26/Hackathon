import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  TrendingUp,
  LogOut,
  Leaf,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import '../components/auth/Auth.css';

const MOCK_STATS = [
  { label: 'Events Created', value: '12', icon: Calendar },
  { label: 'Total Attendees', value: '1,248', icon: Users },
  { label: 'Revenue', value: 'â‚¹8,420', icon: TrendingUp },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="dashboard-welcome">
            <h1>
              <Leaf
                size={28}
                style={{
                  display: 'inline',
                  marginRight: 10,
                  color: 'var(--color-primary)',
                  verticalAlign: 'middle',
                }}
              />
              Welcome, {user?.name || 'User'}!
            </h1>
            <p>Here&apos;s your EventFlex dashboard</p>
          </div>
          <button className="dashboard-logout-btn" onClick={handleLogout}>
            <LogOut size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Logout
          </button>
        </div>

        <div className="dashboard-stats">
          {MOCK_STATS.map((stat) => (
            <div key={stat.label} className="dash-stat-card">
              <h3>
                <stat.icon
                  size={16}
                  style={{ marginRight: 6, verticalAlign: 'middle' }}
                />
                {stat.label}
              </h3>
              <div className="stat-value">{stat.value}</div>
            </div>
          ))}
        </div>

        <div
          className="dash-stat-card"
          style={{ padding: 32, textAlign: 'center' }}
        >
          <p style={{ color: 'var(--color-text-muted)' }}>
            ðŸš€ This is a protected route. Only authenticated users can see this
            page. Connect your backend to see real data here.
          </p>
        </div>
      </div>
    </div>
  );
}
