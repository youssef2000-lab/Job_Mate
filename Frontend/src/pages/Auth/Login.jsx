// src/pages/Auth/Login.jsx
// FIXES:
// • Replaced `login` (doesn't exist) with `loginThunk`
// • Replaced `clearError` — still valid, kept
// • Removed stale isLoggedIn redirect (modal handles this; page version navigates on success)

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginThunk, clearError } from '../../store/authSlice'; // ← was `login` (undefined)
import { Mail, Lock, ChevronRight, AlertCircle } from 'lucide-react';
import { useToast } from '../../hooks/useToast.jsx';
import './Auth.css';

const Login = () => {
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error: authError, isLoggedIn, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [localError, setLocalError] = useState('');

  useEffect(() => { dispatch(clearError()); }, [dispatch]);

  useEffect(() => {
    if (authError) { setLocalError(authError); showToast(authError, 'error'); }
  }, [authError, showToast]);

  useEffect(() => {
    if (isLoggedIn) {
      showToast('Connexion réussie !');
      navigate('/');
    }
  }, [isLoggedIn, navigate, showToast]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (localError) setLocalError('');
    if (authError)  dispatch(clearError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginThunk(formData)); // ← was dispatch(login(formData)) — dispatched undefined
  };

  return (
    <div className="auth-page section-padding">
      <div className="container auth-container">
        <div className="auth-card glass fade-in">
          <div className="auth-header">
            <h2>Bon retour !</h2>
            <p>Connectez-vous à votre compte JobMate.</p>
          </div>

          {localError && (
            <div className="auth-error fade-in">
              <AlertCircle size={18} />
              <span>{localError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input type="email" name="email" placeholder="jean@example.com"
                  required value={formData.email} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label>Mot de passe</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input type="password" name="password" placeholder="••••••••"
                  required value={formData.password} onChange={handleChange} />
              </div>
            </div>

            <button type="submit" className="btn-primary btn-block" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'} {!loading && <ChevronRight size={18} />}
            </button>
          </form>

          <p className="auth-footer">
            Nouveau sur JobMate ? <Link to="/register">Inscrivez-vous</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
