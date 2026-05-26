import { createContext, useContext, useState } from 'react';

const AuthModalContext = createContext();

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal simple must be used within an AuthModalProvider');
  }
  return context;
};

export const AuthModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState('login'); // 'login' or 'register'

  const openLogin = () => {
    setModalMode('login');
    setIsOpen(true);
  };

  const openRegister = () => {
    setModalMode('register');
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const toggleMode = () => {
    setModalMode(prev => prev === 'login' ? 'register' : 'login');
  };

  return (
    <AuthModalContext.Provider value={{
      isOpen,
      modalMode,
      openLogin,
      openRegister,
      closeModal,
      toggleMode
    }}>
      {children}
    </AuthModalContext.Provider>
  );
};
