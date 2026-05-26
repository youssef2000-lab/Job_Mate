import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Briefcase, Phone, ChevronRight, AlertCircle, LogIn, UserPlus } from 'lucide-react';
import { login, register, clearError } from '../../store/authSlice';
import { useToast } from '../../hooks/useToast.jsx';
import { useAuthModal } from '../../context/AuthModalContext';
import './AuthModal.css';

const AuthModal = () => {
  const { isOpen, modalMode, closeModal, toggleMode } = useAuthModal();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const { error: authError, isLoggedIn, users } = useSelector(state => state.auth);

  const [localError, setLocalError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'client',
    avatar: null
  });

  // Reset state when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setLocalError('');
      dispatch(clearError());
    }
  }, [isOpen, modalMode, dispatch]);

  // Handle successful login/register
  useEffect(() => {
    if (isLoggedIn && isOpen) {
      showToast(modalMode === 'login' ? 'Connexion réussie !' : 'Compte créé avec succès !');
      closeModal();
    }
  }, [isLoggedIn, isOpen, modalMode, closeModal, showToast]);

  // Handle auth errors from Redux
  useEffect(() => {
    if (authError && isOpen) {
      setLocalError(authError);
    }
  }, [authError, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
    if (authError) dispatch(clearError());
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
    if (modalMode === 'login') {
      dispatch(login({ email: formData.email, password: formData.password }));
    } else {
      // Check if user already exists (for registration)
      const userExists = users.find(u => u.email === formData.email);
      if (userExists) {
        setLocalError('Cet email est déjà utilisé.');
        showToast('Cet email est déjà lié à un compte.', 'error');
        return;
      }
      dispatch(register(formData));
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
              onClick={() => { if(modalMode !== 'login') toggleMode(); }}
            >
              <LogIn size={18} />
              <span>Connexion</span>
            </button>
            <button 
              className={`modal-tab ${modalMode === 'register' ? 'active' : ''}`}
              onClick={() => { if(modalMode !== 'register') toggleMode(); }}
            >
              <UserPlus size={18} />
              <span>Inscription</span>
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
              <AlertCircle size={18} />
              <span>{localError}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group-modal">
              <label>Email</label>
              <div className="input-field">
                <Mail className="input-icon" size={18} />
                <input 
                  type="email" 
                  name="email" 
                  placeholder="example@mail.com" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group-modal">
              <label>Mot de passe</label>
              <div className="input-field">
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
                    <button
                      type="button"
                      className={formData.role === 'client' ? 'active' : ''}
                      onClick={() => setFormData({ ...formData, role: 'client' })}
                    >
                      <User size={16} /> Client
                    </button>
                    <button
                      type="button"
                      className={formData.role === 'provider' ? 'active' : ''}
                      onClick={() => setFormData({ ...formData, role: 'provider' })}
                    >
                      <Briefcase size={16} /> Prestataire
                    </button>
                  </div>

                  <div className="form-group-modal">
                    <label>Nom complet</label>
                    <div className="input-field">
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

                  <div className="form-group-modal">
                    <label>Téléphone</label>
                    <div className="input-field">
                      <Phone className="input-icon" size={18} />
                      <input 
                        type="tel" 
                        name="phone" 
                        placeholder="06 00 00 00 00" 
                        required 
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <motion.div 
                    className="form-group-modal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <label>Photo de profil (optionnel)</label>
                    <div className="file-input-modal">
                      <input 
                        type="file" 
                        id="modal-avatar"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden-file-input"
                      />
                      <label htmlFor="modal-avatar" className="file-label-modal">
                        {formData.avatar ? "Image sélectionnée" : "Choisir un fichier"}
                      </label>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" className="btn-modal-submit btn-primary">
              {modalMode === 'login' ? 'Se connecter' : 'Créer un compte'}
              <ChevronRight size={18} />
            </button>
          </form>

          <div className="modal-footer">
            <p>
              {modalMode === 'login' 
                ? "Nouveau sur JobMate ?" 
                : "Déjà un compte ?"}
              <button 
                type="button" 
                className="btn-link"
                onClick={toggleMode}
              >
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
