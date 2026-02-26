import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, BarChart3, Settings, Moon, Sun, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './Dashboard.css';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { path: '/dashboard/events', label: 'Events', icon: CalendarDays },
  { path: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
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

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <div className="os-layout">
      {/* Top Navigation Bar */}
      <header className="os-top-nav">
        <div className="os-nav-left">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div className="os-sidebar-logo">EventFlex</div>
          </Link>
          <nav className="os-nav-links">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `os-nav-item ${isActive ? 'active' : ''}`
                }
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="os-nav-right">
          <button className="theme-toggle flex items-center justify-center" onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer', padding: '8px', borderRadius: '50%', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <div className="os-user-controls">
            <div
              className="os-topbar-avatar"
              onClick={handleAvatarClick}
              title="Settings"
            />
            <button onClick={handleLogout} className="os-logout-btn">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="os-main">
        <div className="os-content container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
