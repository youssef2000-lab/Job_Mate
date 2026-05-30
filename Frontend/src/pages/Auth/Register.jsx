// src/pages/Auth/Register.jsx
// FIXES:
// • Replaced `register` (doesn't exist) with `registerThunk`
// • Removed `state.auth.users` reference (field removed from new authSlice)
//   → duplicate email check now happens server-side
// • Replaced FileReader/base64 with direct File reference + FormData
// • Added loading state and proper error display

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerThunk, clearError } from '../../store/authSlice'; // ← was `register` (undefined)
import { useToast } from '../../hooks/useToast.jsx';
import { User, Mail, Lock, Briefcase, ChevronRight, AlertCircle, Phone } from 'lucide-react';
import './Auth.css';

const Register = () => {
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // ← removed `users` from selector — field no longer exists in new authSlice
  const { error: authError, isLoggedIn, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', role: 'client',
  });
  // ← avatarFile stores a File object, not a base64 string
  const [avatarFile,  setAvatarFile]  = useState(null);
  const [localError,  setLocalError]  = useState('');

  useEffect(() => { dispatch(clearError()); }, [dispatch]);

  useEffect(() => {
    if (authError) { setLocalError(authError); }
  }, [authError]);

  useEffect(() => {
    if (isLoggedIn) {
      showToast('Compte créé avec succès ! Bienvenue sur JobMate.');
      navigate('/');
    }
  }, [isLoggedIn, navigate, showToast]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
    if (authError) dispatch(clearError());
  };

  // ← Store File directly; no FileReader / base64 needed
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatarFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ← Build FormData for multipart upload
    const fd = new FormData();
    fd.append('name',     formData.name);
    fd.append('email',    formData.email);
    fd.append('password', formData.password);
    fd.append('phone',    formData.phone);
    fd.append('role',     formData.role);
    if (avatarFile) fd.append('avatar', avatarFile);

    // ← was dispatch(register(formData)) — `register` action doesn't exist
    dispatch(registerThunk(fd));
  };

  return (
    <div className="auth-page section-padding">
      <div className="container auth-container">
        <div className="auth-card glass fade-in">
          <div className="auth-header">
            <h2>Rejoignez JobMate</h2>
            <p>Créez votre compte pour commencer.</p>
          </div>

          {localError && (
            <div className="auth-error fade-in">
              <AlertCircle size={18} />
              <span>{localError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Role selector */}
            <div className="role-selector">
              <button type="button"
                className={formData.role === 'client' ? 'active' : ''}
                onClick={() => setFormData({ ...formData, role: 'client' })}>
                <User size={20} /><span>Client</span>
              </button>
              <button type="button"
                className={formData.role === 'provider' ? 'active' : ''}
                onClick={() => setFormData({ ...formData, role: 'provider' })}>
                <Briefcase size={20} /><span>Prestataire</span>
              </button>
            </div>

            <div className="form-group">
              <label>Nom complet</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input type="text" name="name" placeholder="Jean Dupont"
                  required value={formData.name} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input type="email" name="email" placeholder="jean@example.com"
                  required value={formData.email} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label>Numéro de téléphone</label>
              <div className="input-wrapper">
                <Phone className="input-icon" size={18} />
                <input type="tel" name="phone" placeholder="06 12 34 56 78"
                  required value={formData.phone} onChange={handleChange} />
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

            {/* Avatar upload — File stored directly, no base64 */}
            <div className="form-group">
              <label>Photo de profil (optionnel)</label>
              <div className="input-wrapper file-input-wrapper">
                <input type="file" accept="image/*"
                  onChange={handleFileChange}
                  id="avatar-upload" className="file-input" />
                <label htmlFor="avatar-upload" className="file-label">
                  {avatarFile ? avatarFile.name : 'Choisir une photo'}
                </label>
              </div>
            </div>

            <button type="submit" className="btn-primary btn-block" disabled={loading}>
              {loading ? 'Création...' : 'Créer mon compte'} {!loading && <ChevronRight size={18} />}
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
