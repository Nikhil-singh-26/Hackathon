import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, BarChart3, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import './Dashboard.css';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { path: '/dashboard/events', label: 'Events', icon: CalendarDays },
  { path: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    navigate('/dashboard/settings');
  };

  return (
    <div className="os-layout">
      {/* Sidebar */}
      <aside className="os-sidebar">
        <div className="os-sidebar-logo">EventFlex OS</div>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `os-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </aside>

      {/* Main content */}
      <div className="os-main">
        <div className="os-topbar">
          <div
            className="os-topbar-avatar"
            onClick={handleAvatarClick}
            title="Settings"
          />
        </div>
        <div className="os-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
