import { Shield, Search, CheckCircle, Smartphone } from 'lucide-react';
import './HowItWorks.css';

const HowItWorks = () => {
  return (
    <div className="how-it-works section-padding">
      <div className="container">
        <div className="section-header">
          <h1>Comment fonctionne <span>JobMate</span> ?</h1>
          <p>La manière la plus simple et la plus sûre de faire appel à des professionnels.</p>
        </div>

        <div className="steps-container">
          <div className="hiw-step fade-in">
            <div className="hiw-icon">
              <Search size={40} />
            </div>
            <h3>1. Cherchez un service</h3>
            <p>Parcourez nos catégories ou utilisez la barre de recherche pour trouver l'expert dont vous avez besoin.</p>
          </div>

          <div className="hiw-step fade-in" style={{animationDelay: '0.2s'}}>
            <div className="hiw-icon">
              <Shield size={40} />
            </div>
            <h3>2. Payez en Escrow</h3>
            <p>Réservez votre créneau en payant à l'avance. Vos fonds sont bloqués en toute sécurité par JobMate.</p>
          </div>

          <div className="hiw-step fade-in" style={{animationDelay: '0.4s'}}>
            <div className="hiw-icon">
              <Smartphone size={40} />
            </div>
            <h3>3. Service effectué</h3>
            <p>Le prestataire intervient chez vous et réalise la mission demandée selon vos critères.</p>
          </div>

          <div className="hiw-step fade-in" style={{animationDelay: '0.6s'}}>
            <div className="hiw-icon">
              <CheckCircle size={40} />
            </div>
            <h3>4. Validez & Libérez</h3>
            <p>Une fois satisfait du résultat, validez la fin de mission pour que le prestataire reçoive son paiement.</p>
          </div>
        </div>

        <div className="hiw-cta glass">
          <h2>Prêt à commencer ?</h2>
          <p>Rejoignez des milliers d'utilisateurs satisfaits dès aujourd'hui.</p>
          <div className="cta-buttons">
            <a href="/browse" className="btn-primary">Trouver un pro</a>
            <a href="/register" className="btn-secondary">Devenir prestataire</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
