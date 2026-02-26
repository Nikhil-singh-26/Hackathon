import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, BarChart3, Settings,
  Moon, Sun, LogOut, Home, Bell, User, MessageSquare
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './Dashboard.css';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { path: '/dashboard/events', label: 'Events', icon: CalendarDays },
  { path: '/dashboard/chat', label: 'Messages', icon: MessageSquare },
  { path: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <div className="os-layout glass-dashboard">
      {/* Sidebar */}
      <aside className="os-sidebar glass-sidebar">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className="os-sidebar-logo">EventFlex</div>
        </Link>
        <div className="os-sidebar-nav">
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
        </div>

        <div className="os-sidebar-bottom">
          <button className="os-nav-item text-danger" onClick={handleLogout} style={{ color: '#ef4444' }}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>

          <div className="os-user-profile mt-4">
            <div className="os-user-avatar">
              <User size={18} />
            </div>
            <div className="os-user-info">
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="user-email">{user?.email || 'user@example.com'}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="os-main">
        <div className="os-topbar glass-topbar">
          <button className="os-icon-btn" title="Notifications">
            <Bell size={20} />
            <span className="os-badge">3</span>
          </button>
          <button className="os-icon-btn" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
        <div className="os-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
