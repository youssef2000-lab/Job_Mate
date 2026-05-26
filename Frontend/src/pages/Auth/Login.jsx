import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../../store/authSlice';
import { Mail, Lock, ChevronRight, AlertCircle } from 'lucide-react';
import { useToast } from '../../hooks/useToast.jsx';
import './Auth.css';

const Login = () => {
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error: authError, isLoggedIn } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  // Clear any existing auth errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (authError) {
      setError(authError);
      showToast(authError, 'error');
    }
  }, [authError, showToast]);

  useEffect(() => {
    if (isLoggedIn) {
      showToast('Connexion réussie !');
      navigate('/');
    }
  }, [isLoggedIn, navigate, showToast]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
    if (authError) dispatch(clearError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="auth-page section-padding">
      <div className="container auth-container">
        <div className="auth-card glass fade-in">
          <div className="auth-header">
            <h2>Bon retour !</h2>
            <p>Connectez-vous à votre compte JobMate.</p>
          </div>

          {error && (
            <div className="auth-error fade-in">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="jean@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mot de passe</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--primary)', textAlign: 'right', display: 'block', marginTop: '5px' }}>
                Mot de passe oublié ?
              </Link>
            </div>

            <button type="submit" className="btn-primary btn-block">
              Se connecter <ChevronRight size={18} />
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
