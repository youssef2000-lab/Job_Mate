// src/components/auth/AuthModal.jsx
// ─────────────────────────────────────────────────────────────
// FIX D — Three bugs in the original file:
//
//   D1. Imported { login, register } — these don't exist in the
//       new authSlice. Only loginThunk / registerThunk exist.
//       dispatch(login(...)) dispatches undefined → no-op, no error
//       shown, but auth never works.
//
//   D2. Read state.auth.users — field removed from new authSlice.
//       users is undefined → users.find(...) throws TypeError
//       "Cannot read properties of undefined" → crash on submit.
//
//   D3. Used FileReader/base64 for avatar → should use FormData
//       with the raw File object for the multipart API endpoint.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Mail, Lock, User, Briefcase,
  Phone, ChevronRight, AlertCircle, LogIn, UserPlus,
} from 'lucide-react';
import { loginThunk, registerThunk, clearError } from '../../store/authSlice'; // FIX D1
import { useToast } from '../../hooks/useToast';
import { useAuthModal } from '../../context/AuthModalContext';
import './AuthModal.css';

const AuthModal = () => {
  const { isOpen, modalMode, closeModal, toggleMode } = useAuthModal();
  const { showToast } = useToast();
  const dispatch = useDispatch();

  // FIX D2: removed `users` — doesn't exist in new authSlice
  const { error: authError, isLoggedIn, loading } = useSelector((s) => s.auth);

  const [localError, setLocalError] = useState('');
  const [avatarFile, setAvatarFile] = useState(null); // FIX D3: File, not base64
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', role: 'client',
  });

  // Reset on open / mode change
  useEffect(() => {
    if (isOpen) {
      setLocalError('');
      setAvatarFile(null);
      setFormData({ name: '', email: '', password: '', phone: '', role: 'client' });
      dispatch(clearError());
    }
  }, [isOpen, modalMode, dispatch]);

  // Close on successful auth
  useEffect(() => {
    if (isLoggedIn && isOpen) {
      showToast(modalMode === 'login' ? 'Connexion réussie !' : 'Compte créé avec succès !');
      closeModal();
    }
  }, [isLoggedIn, isOpen, modalMode, closeModal, showToast]);

  // Surface Redux errors
  useEffect(() => {
    if (authError && isOpen) setLocalError(authError);
  }, [authError, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
    if (authError) dispatch(clearError());
  };

  // FIX D3: just hold the File object — no FileReader / no base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatarFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (modalMode === 'login') {
      // FIX D1: loginThunk (was `login` which doesn't exist)
      dispatch(loginThunk({ email: formData.email, password: formData.password }));
    } else {
      // FIX D1: registerThunk (was `register` which doesn't exist)
      // FIX D2: duplicate-email check is done server-side — no local users.find()
      // FIX D3: FormData for multipart upload
      const fd = new FormData();
      fd.append('name',     formData.name);
      fd.append('email',    formData.email);
      fd.append('password', formData.password);
      fd.append('phone',    formData.phone);
      fd.append('role',     formData.role);
      if (avatarFile) fd.append('avatar', avatarFile);

      dispatch(registerThunk(fd));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="auth-modal-overlay" onClick={closeModal}>
        <motion.div
          className="auth-modal-container glass"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close" onClick={closeModal}>
            <X size={24} />
          </button>

          <div className="modal-tabs">
            <button
              className={`modal-tab ${modalMode === 'login' ? 'active' : ''}`}
              onClick={() => { if (modalMode !== 'login') toggleMode(); }}
            >
              <LogIn size={18} /><span>Connexion</span>
            </button>
            <button
              className={`modal-tab ${modalMode === 'register' ? 'active' : ''}`}
              onClick={() => { if (modalMode !== 'register') toggleMode(); }}
            >
              <UserPlus size={18} /><span>Inscription</span>
            </button>
          </div>

          <div className="modal-header">
            <h2>{modalMode === 'login' ? 'Bon retour !' : 'Bienvenue !'}</h2>
            <p>{modalMode === 'login' ? 'Veuillez vous authentifier' : 'Créez votre compte JobMate'}</p>
          </div>

          {localError && (
            <motion.div
              className="modal-error"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <AlertCircle size={18} /><span>{localError}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group-modal">
              <label>Email</label>
              <div className="input-field">
                <Mail className="input-icon" size={18} />
                <input type="email" name="email" placeholder="example@mail.com"
                  required value={formData.email} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group-modal">
              <label>Mot de passe</label>
              <div className="input-field">
                <Lock className="input-icon" size={18} />
                <input type="password" name="password" placeholder="••••••••"
                  required value={formData.password} onChange={handleChange} />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {modalMode === 'register' && (
                <motion.div
                  key="register-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="role-selector-mini">
                    <button type="button"
                      className={formData.role === 'client' ? 'active' : ''}
                      onClick={() => setFormData({ ...formData, role: 'client' })}>
                      <User size={16} /> Client
                    </button>
                    <button type="button"
                      className={formData.role === 'provider' ? 'active' : ''}
                      onClick={() => setFormData({ ...formData, role: 'provider' })}>
                      <Briefcase size={16} /> Prestataire
                    </button>
                  </div>

                  <div className="form-group-modal">
                    <label>Nom complet</label>
                    <div className="input-field">
                      <User className="input-icon" size={18} />
                      <input type="text" name="name" placeholder="Jean Dupont"
                        required value={formData.name} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="form-group-modal">
                    <label>Téléphone</label>
                    <div className="input-field">
                      <Phone className="input-icon" size={18} />
                      <input type="tel" name="phone" placeholder="06 00 00 00 00"
                        required value={formData.phone} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="form-group-modal">
                    <label>Photo de profil (optionnel)</label>
                    <div className="file-input-modal">
                      <input type="file" id="modal-avatar" accept="image/*"
                        onChange={handleFileChange} className="hidden-file-input" />
                      <label htmlFor="modal-avatar" className="file-label-modal">
                        {/* FIX D3: show file name instead of "Image sélectionnée" */}
                        {avatarFile ? avatarFile.name : 'Choisir un fichier'}
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" className="btn-modal-submit btn-primary" disabled={loading}>
              {loading
                ? 'Chargement...'
                : modalMode === 'login' ? 'Se connecter' : 'Créer un compte'}
              {!loading && <ChevronRight size={18} />}
            </button>
          </form>

          <div className="modal-footer">
            <p>
              {modalMode === 'login' ? 'Nouveau sur JobMate ?' : 'Déjà un compte ?'}
              <button type="button" className="btn-link" onClick={toggleMode}>
                {modalMode === 'login' ? 'Inscrivez-vous' : 'Connectez-vous'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
