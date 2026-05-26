// src/pages/CheckoutPage.jsx
// ─────────────────────────────────────────────────────────────
// Calls the real backend to mark payment_status = 'paid'.
// After payment, provider_phone + client_phone are returned.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Shield, Lock, CreditCard, Check } from 'lucide-react';
import { updateBookingStatus } from '../store/bookingSlice';
import { useToast } from '../hooks/useToast';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const dispatch   = useDispatch();
  const { showToast } = useToast();

  const { bookings, loading } = useSelector((s) => s.bookings);
  const booking = bookings.find((b) => String(b.id) === String(id));

  const [step, setStep]         = useState(1);
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    if (!booking) {
      showToast('Réservation non trouvée', 'error');
      navigate('/dashboard');
    }
  }, [booking, navigate, showToast]);

  // Auto-redirect after success
  useEffect(() => {
    if (step === 3) {
      const t = setTimeout(() => navigate('/dashboard'), 3500);
      return () => clearTimeout(t);
    }
  }, [step, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();

    const resultAction = await dispatch(
      updateBookingStatus({ bookingId: booking.id, payment_status: 'paid' })
    );

    if (updateBookingStatus.fulfilled.match(resultAction)) {
      const updated = resultAction.payload;
      // Backend returns provider_phone + client_phone after paid
      setContactInfo({
        providerPhone: updated.provider_phone,
        clientPhone  : updated.client_phone,
      });
      showToast('Paiement réussi !');
      setStep(3);
    } else {
      showToast(resultAction.payload ?? 'Erreur paiement.', 'error');
    }
  };

  if (!booking) return null;

  const commission = (booking.amount * 0.25).toFixed(2);

  return (
    <div className="checkout-page section-padding">
      <div className="container checkout-container">

        {step === 1 && (
          <div className="checkout-form-layout scale-in">
            <div className="checkout-main">
              <div className="glass checkout-card">
                <h3>Déblocage du Contact Client</h3>
                <p className="checkout-desc">
                  Pour accéder aux coordonnées complètes de votre futur client,
                  une commission de service de 25% est requise.
                </p>

                <form onSubmit={handlePayment} className="payment-form">
                  <div className="form-group">
                    <label>Titulaire de la carte</label>
                    <input type="text" placeholder="Nom complet" required />
                  </div>
                  <div className="form-group">
                    <label>Numéro de carte</label>
                    <div className="input-with-icon">
                      <CreditCard size={18} className="icon" />
                      <input type="text" placeholder="#### #### #### ####" required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Date d'expiration</label>
                      <input type="text" placeholder="MM/YY" required />
                    </div>
                    <div className="form-group">
                      <label>CVC</label>
                      <input type="text" placeholder="123" required />
                    </div>
                  </div>

                  <div className="security-info">
                    <Lock size={16} />
                    <span>Paiement sécurisé crypté SSL</span>
                  </div>

                  <button className="btn-primary btn-block" disabled={loading}>
                    {loading ? 'Traitement...' : `Payer la commission (${commission}€)`}
                  </button>
                </form>
              </div>
            </div>

            <aside className="checkout-summary">
              <div className="glass summary-card">
                <h4>Récapitulatif</h4>
                <div className="summary-item">
                  <span>Prestation</span><span>{booking.service_title}</span>
                </div>
                <div className="summary-item">
                  <span>Client</span><span>{booking.client_name}</span>
                </div>
                <div className="summary-item">
                  <span>Date de demande</span>
                  <span>{new Date(booking.created_at).toLocaleDateString()}</span>
                </div>
                <hr />
                <div className="summary-item">
                  <span>Prix total du service</span><span>{booking.amount}€</span>
                </div>
                <div className="summary-item" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  <span>Frais de déblocage (25%)</span><span>{commission}€</span>
                </div>
                <hr />
                <div className="summary-total">
                  <span>Total à régler</span><strong>{commission}€</strong>
                </div>
                <div className="escrow-notice">
                  <Shield size={24} />
                  <div>
                    <strong>Engagement JobMate</strong>
                    <p>Accès immédiat aux coordonnées après paiement.</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {step === 3 && (
          <div className="final-confirmation-step text-center bounce-in">
            <div className="success-circle"><Check size={80} /></div>
            <h1 className="confirmation-msg">Paiement Réussi !</h1>

            {contactInfo && (
              <div className="contact-info-revealed glass">
                <h3>Coordonnées débloquées</h3>
                {contactInfo.clientPhone && (
                  <p>📞 Client : <strong>{contactInfo.clientPhone}</strong></p>
                )}
              </div>
            )}

            <p>Vous pouvez contacter votre client dès maintenant.</p>

            <div className="redirect-notice">
              <p>Redirection vers votre tableau de bord...</p>
              <div className="loading-bar">
                <div className="loading-progress"></div>
              </div>
            </div>

            <button className="btn-primary" onClick={() => navigate('/dashboard')}>
              Voir mon tableau de bord
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CheckoutPage;
