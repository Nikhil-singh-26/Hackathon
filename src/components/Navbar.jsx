import { Menu, X, Leaf, Moon, Sun, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        <nav className={`navbar ${isScrolled ? 'scrolled glass-card' : ''}`}>
            <div className="nav-container">
                <Link to="/" className="logo">
                    <Leaf className="logo-icon" />
                    <span>EventFlex</span>
                </Link>

                <div className="nav-links desktop-only">
                    <a href="/#home">Home</a>
                    <a href="/#features">Features</a>
                    <a href="/#marketplace">Marketplace</a>
                    <a href="/#history">History</a>
                    <a href="/#achievements">Achievements</a>
                    <a href="/#contact">Contact</a>
                </div>

                <div className="nav-actions desktop-only">
                    <button className="theme-toggle flex items-center justify-center p-2" onClick={toggleTheme}>
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="login-btn" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <User size={16} />
                                <span>{user?.name || 'Dashboard'}</span>
                            </Link>
                            <button className="glass-btn" onClick={handleLogout}>
                                <LogOut size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/auth/login" className="login-btn">Login</Link>
                            <Link to="/auth/signup" className="glass-btn">Get Started</Link>
                        </>
                    )}
                </div>

                <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {isOpen && (
                <div className="mobile-menu glass-card">
                    <a href="/#home" onClick={() => setIsOpen(false)}>Home</a>
                    <a href="/#features" onClick={() => setIsOpen(false)}>Features</a>
                    <a href="/#marketplace" onClick={() => setIsOpen(false)}>Marketplace</a>
                    <a href="/#history" onClick={() => setIsOpen(false)}>History</a>
                    <a href="/#achievements" onClick={() => setIsOpen(false)}>Achievements</a>
                    <a href="/#contact" onClick={() => setIsOpen(false)}>Contact</a>
                    <hr />
                    <button className="theme-toggle flex items-center gap-2" onClick={toggleTheme} style={{ textAlign: 'left', padding: '10px 0' }}>
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        <span>Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode</span>
                    </button>

                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="login-btn" onClick={() => setIsOpen(false)}>Dashboard</Link>
                            <button className="glass-btn" onClick={() => { setIsOpen(false); handleLogout(); }}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/auth/login" className="login-btn" onClick={() => setIsOpen(false)}>Login</Link>
                            <Link to="/auth/signup" className="glass-btn" onClick={() => setIsOpen(false)}>Get Started</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
