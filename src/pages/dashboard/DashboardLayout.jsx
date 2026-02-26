import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, BarChart3, Settings, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import './Dashboard.css';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { path: '/dashboard/events', label: 'Events', icon: CalendarDays },
  { path: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleAvatarClick = () => {
    navigate('/dashboard/settings');
  };

  return (
    <div className="os-layout">
      {/* Sidebar */}
      <aside className="os-sidebar">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className="os-sidebar-logo">EventFlex</div>
        </Link>
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
        <div className="os-topbar" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="theme-toggle flex items-center justify-center" onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer', padding: '8px', borderRadius: '50%', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
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
