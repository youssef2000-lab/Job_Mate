import { Briefcase, Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="logo">
            <Briefcase className="logo-icon" size={28} />
            <span>JobMate</span>
          </div>
          <p className="footer-desc">
            Connecter les meilleurs prestataires de services avec ceux qui en ont besoin. Simple, rapide et sécurisé.
          </p>
          <div className="social-links">
            <a href="#"><Facebook size={20} /></a>
            <a href="#"><Twitter size={20} /></a>
            <a href="#"><Instagram size={20} /></a>
            <a href="#"><Linkedin size={20} /></a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Plateforme</h4>
          <ul>
            <li><a href="#">Trouver un service</a></li>
            <li><a href="#">Devenir prestataire</a></li>
            <li><a href="#">Comment ça marche</a></li>
            <li><a href="#">Tarifs</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Centre d'aide</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Confidentialité</a></li>
            <li><a href="#">Conditions</a></li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h4>Newsletter</h4>
          <p>Recevez les meilleures offres directement par email.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Votre email" />
            <button className="btn-primary">Ok</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom container">
        <p>&copy; 2026 JobMate. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
