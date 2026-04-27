import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/projects', label: 'Projects' },
    { to: '/match', label: '✨ Smart Match' },
    { to: '/hackathons', label: 'Hackathons' },
    { to: '/messages', label: 'Messages' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-dark-800/80 backdrop-blur-md border-b border-dark-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="TeamVerse Logo"
              className="w-9 h-9 rounded-lg object-contain transition-transform duration-200 group-hover:scale-110"
            />
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-white">Team</span>
              <span className="text-amber-400">Verse</span>
            </span>
          </Link>

          {/* Desktop links */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    isActive(link.to)
                      ? 'bg-primary-600/20 text-primary-400'
                      : 'text-slate-400 hover:text-white hover:bg-dark-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {user.is_staff && (
                  <a href="http://localhost:8000/admin/" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:text-amber-300 bg-amber-900/20 px-3 py-1.5 rounded-lg border border-amber-700/30 transition-colors">
                    ⚙️ Admin
                  </a>
                )}
                <Link to="/profile" className="hidden md:flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center text-white font-semibold text-xs">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{user.username}</span>
                </Link>
                <button onClick={handleLogout} className="btn-secondary text-sm !px-3 !py-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="http://localhost:8000/admin/" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:text-amber-300 px-2 py-2 transition-colors mr-2">
                  ⚙️ Admin Login
                </a>
                <Link to="/login" className="btn-secondary text-sm !px-4 !py-2">Login</Link>
                <Link to="/register" className="btn-primary text-sm !px-4 !py-2">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
