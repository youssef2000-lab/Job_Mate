import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../store/authSlice';
import { useToast } from '../../hooks/useToast.jsx';
import { User, Mail, Lock, Briefcase, ChevronRight, AlertCircle, Phone } from 'lucide-react';
import './Auth.css';

const Register = () => {
  const { showToast } = useToast();
  // ... existing form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'client',
    avatar: null
  });
  const { users } = useSelector(state => state.auth);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if user already exists
    const userExists = users.find(u => u.email === formData.email);
    if (userExists) {
      setError('Cet email est déjà utilisé.');
      showToast('Cet email est déjà lié à un compte.', 'error');
      return;
    }

    dispatch(register(formData));
    showToast('Compte créé avec succès ! Bienvenue sur JobMate.');
    navigate('/');
  };

  return (
    <div className="auth-page section-padding">
      <div className="container auth-container">
        <div className="auth-card glass fade-in">
          <div className="auth-header">
            <h2>Rejoignez JobMate</h2>
            <p>Créez votre compte pour commencer.</p>
          </div>

          {error && (
            <div className="auth-error fade-in">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="role-selector">
              <button
                type="button"
                className={formData.role === 'client' ? 'active' : ''}
                onClick={() => setFormData({ ...formData, role: 'client' })}
              >
                <User size={20} />
                <span>Client</span>
              </button>
              <button
                type="button"
                className={formData.role === 'provider' ? 'active' : ''}
                onClick={() => setFormData({ ...formData, role: 'provider' })}
              >
                <Briefcase size={20} />
                <span>Prestataire</span>
              </button>
            </div>

            <div className="form-group">
              <label>Nom complet</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  name="name"
                  placeholder="Jean Dupont"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

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
              <label>Numéro de téléphone</label>
              <div className="input-wrapper">
                <Phone className="input-icon" size={18} />
                <input
                  type="tel"
                  name="phone"
                  placeholder="06 12 34 56 78"
                  required
                  value={formData.phone}
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
            </div>

            <div className="form-group">
              <label>Photo de profil</label>
              <div className="input-wrapper file-input-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  id="avatar-upload"
                  className="file-input"
                />
                <label htmlFor="avatar-upload" className="file-label">
                  {formData.avatar ? "Image sélectionnée" : "Choisir une photo"}
                </label>
              </div>
            </div>

            <button type="submit" className="btn-primary btn-block">
              Créer mon compte <ChevronRight size={18} />
            </button>
          </form>

          <p className="auth-footer">
            Déjà inscrit ? <Link to="/login">Connectez-vous</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
