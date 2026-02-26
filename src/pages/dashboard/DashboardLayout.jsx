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
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New booking request from Sarah for Grand Emerald Venue', time: '2 mins ago', read: false },
    { id: 2, text: 'Your event "Tech Meetup" was successfully published', time: '1 hour ago', read: false },
    { id: 3, text: 'System update scheduled for tonight at 2 AM', time: '5 hours ago', read: true }
  ]);

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


  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const toggleNotificationDropdown = () => {
    setShowNotifications(!showNotifications);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="os-layout glass-dashboard">
      {}
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

      {}
      <div className="os-main">
        <div className="os-topbar glass-topbar">

          <div className="os-notification-wrapper">
            <button
              className="os-icon-btn"
              title="Notifications"
              onClick={toggleNotificationDropdown}
            >
              <Bell size={20} />
              {unreadCount > 0 && <span className="os-badge">{unreadCount}</span>}
            </button>

            {showNotifications && (
              <div className="os-notifications-dropdown glass-card">
                <div className="os-notifications-header">
                  <h4>Notifications</h4>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead}>Mark all read</button>
                  )}
                </div>
                <div className="os-notifications-list">
                  {notifications.length === 0 ? (
                    <p className="no-notifications">No new notifications</p>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`os-notification-item ${n.read ? '' : 'unread'}`}>
                        <p>{n.text}</p>
                        <span>{n.time}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

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
