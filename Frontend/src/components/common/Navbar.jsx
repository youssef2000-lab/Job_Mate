// src/components/common/Navbar.jsx
// FIXES:
// • logout → logoutThunk  (logout sync action doesn't exist; user was never logged out)
// • Avatar displayed next to user name when available
// • Admin link shown for admin role
// • Async handleLogout so token is revoked before redirect

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutThunk } from '../../store/authSlice'; // ← was `logout` (undefined)
import { Menu, X, User, LogOut, Briefcase, Shield } from 'lucide-react';
import { useAuthModal } from '../../context/AuthModalContext';
import './Navbar.css';

const NavAvatar = ({ user }) => {
  if (user?.avatar_url) {
    return (
      <img
        src={user.avatar_url}
        alt={user.name}
        className="nav-avatar-img"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
    );
  }
  return (
    <div className="nav-avatar-fallback">
      {user?.name?.[0]?.toUpperCase() ?? <User size={14} />}
    </div>
  );
};

const Navbar = () => {
  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, currentUser } = useSelector((state) => state.auth);
  const { openLogin, openRegister } = useAuthModal();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutThunk()); // ← was dispatch(logout()) — undefined action
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className={`navbar glass ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="logo">
          <Briefcase className="logo-icon" size={28} />
          <span>JobMate</span>
        </Link>

        {/* Desktop */}
        <div className="nav-links desktop">
          <Link to="/browse">Trouver un service</Link>
          <Link
            to="/#how-it-works"
            onClick={(e) => {
              if (isHomePage) {
                e.preventDefault();
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Comment ça marche
          </Link>

          {isLoggedIn ? (
            <>
              {currentUser?.role === 'admin' && (
                <Link to="/admin" className="nav-admin-badge">
                  <Shield size={14} /> Admin
                </Link>
              )}
              <Link to="/dashboard" className="nav-user">
                <NavAvatar user={currentUser} />
                <span>{currentUser?.name}</span>
              </Link>
              <button onClick={handleLogout} className="btn-logout" title="Déconnexion">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <button onClick={openLogin}    className="btn-login">Connexion</button>
              <button onClick={openRegister} className="btn-primary">S'inscrire</button>
            </>
          )}
        </div>

        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="mobile-menu glass fade-in">
          <Link to="/browse" onClick={() => setIsOpen(false)}>Trouver un service</Link>
          <Link
            to="/#how-it-works"
            onClick={(e) => {
              setIsOpen(false);
              if (isHomePage) {
                e.preventDefault();
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Comment ça marche
          </Link>

          {isLoggedIn ? (
            <>
              <div className="mobile-user-info">
                <NavAvatar user={currentUser} />
                <span>{currentUser?.name}</span>
              </div>
              <Link to="/dashboard" onClick={() => setIsOpen(false)}>Tableau de bord</Link>
              {currentUser?.role === 'admin' && (
                <Link to="/admin" onClick={() => setIsOpen(false)}>Admin Panel</Link>
              )}
              <button onClick={handleLogout} className="btn-logout-mobile">Déconnexion</button>
            </>
          ) : (
            <>
              <button onClick={() => { setIsOpen(false); openLogin();    }} className="mobile-nav-btn">Connexion</button>
              <button onClick={() => { setIsOpen(false); openRegister(); }} className="btn-primary mobile-nav-btn">S'inscrire</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
