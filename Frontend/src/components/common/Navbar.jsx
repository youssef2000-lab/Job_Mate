// src/components/common/Navbar.jsx
// ─────────────────────────────────────────────────────────────
// FIX E — Imported { logout } which doesn't exist in the new authSlice.
//   The new authSlice only exports the async logoutThunk.
//   dispatch(logout()) dispatched undefined → state never cleared,
//   user appeared permanently logged in after clicking logout.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutThunk } from '../../store/authSlice'; // FIX E: was `logout`
import { Menu, X, User, LogOut, Briefcase } from 'lucide-react';
import { useAuthModal } from '../../context/AuthModalContext';
import './Navbar.css';

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

  // FIX E: async dispatch of logoutThunk — calls API, clears token + state
  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="navbar scrolled glass">
      <div className="container nav-container">
        <Link to="/" className="logo">
          <Briefcase className="logo-icon" size={28} />
          <span>JobMate</span>
        </Link>

        {/* Desktop Menu */}
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
                <Link to="/admin" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  Admin
                </Link>
              )}
              <Link to="/dashboard" className="nav-user">
                <User size={18} />
                <span>{currentUser?.name}</span>
              </Link>
              <button onClick={handleLogout} className="btn-logout">
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

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
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
              <Link to="/dashboard" onClick={() => setIsOpen(false)}>Tableau de bord</Link>
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
