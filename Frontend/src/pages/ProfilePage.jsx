// src/pages/ProfilePage.jsx
// ─────────────────────────────────────────────────────────────
// Loads a service + its reviews from the real API.
// Booking creation dispatches to real backend.
// Phone number is NEVER shown — only revealed after payment.
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Star, MapPin, Shield, Play, CheckCircle,
  Calendar, MessageCircle, Send, ChevronRight,
} from 'lucide-react';
import { fetchService } from '../store/serviceSlice';
import { fetchProviderReviews } from '../store/reviewSlice';
import { requestBooking } from '../store/bookingSlice';
import { useAuthModal } from '../context/AuthModalContext';
import { useToast } from '../hooks/useToast';
import './ProfilePage.css';

export default function ProfilePage() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const dispatch     = useDispatch();
  const { showToast } = useToast();
  const { openLogin } = useAuthModal();

  const { currentService: service, loading } = useSelector((s) => s.services);
  const { byProvider } = useSelector((s) => s.reviews);
  const { currentUser, isLoggedIn }  = useSelector((s) => s.auth);
  const { loading: bookingLoading }  = useSelector((s) => s.bookings);

  const [message, setMessage] = useState('');
  const [booked,  setBooked]  = useState(false);

  const reviews    = byProvider[service?.provider_id ?? id] ?? [];
  const avgRating  = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : service?.rating ?? 0;

  // Load service + reviews
  useEffect(() => {
    dispatch(fetchService(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (service?.provider_id) {
      dispatch(fetchProviderReviews(service.provider_id));
    }
  }, [dispatch, service?.provider_id]);

  const handleBook = async () => {
    if (!isLoggedIn) { openLogin(); return; }
    if (currentUser?.role !== 'client') {
      showToast('Seuls les clients peuvent faire une réservation.', 'error');
      return;
    }

    const result = await dispatch(requestBooking({
      service_id    : service.id,
      client_message: message,
    }));

    if (requestBooking.fulfilled.match(result)) {
      setBooked(true);
      showToast('Demande envoyée ! Le prestataire va examiner votre demande.');
      setTimeout(() => navigate('/dashboard'), 2000);
    } else {
      showToast(result.payload ?? 'Erreur lors de la réservation.', 'error');
    }
  };

  if (loading || !service) {
    return (
      <div className="profile-page section-padding">
        <div className="container">
          <div className="profile-skeleton">
            {[1,2,3].map((n) => (
              <div key={n} className="skeleton-block" style={{ height: n === 1 ? 280 : 120 }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page section-padding">
      <div className="container profile-layout">

        {/* ── LEFT: service details ─────────────────── */}
        <div className="profile-main">

          {/* Hero image */}
          {service.gallery?.[0] && (
            <div className="profile-hero">
              <img src={service.gallery[0]} alt={service.title} />
            </div>
          )}

          {/* Provider info */}
          <div className="glass profile-card">
            <div className="profile-header">
              {service.provider_avatar
                ? <img src={service.provider_avatar} alt={service.provider_name} className="provider-avatar-lg" />
                : <div className="provider-avatar-initials">{service.provider_name?.[0]}</div>
              }
              <div>
                <h1>{service.provider_name}</h1>
                <h2 className="service-title-sub">{service.title}</h2>
                <div className="profile-meta">
                  {avgRating > 0 && (
                    <span className="rating-badge">
                      <Star size={14} fill="#f59e0b" color="#f59e0b" />
                      {avgRating} ({reviews.length} avis)
                    </span>
                  )}
                  {(service.city || service.country) && (
                    <span className="location-badge">
                      <MapPin size={14} />
                      {[service.city, service.country].filter(Boolean).join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {service.description && (
              <div className="profile-description">
                <h3>Description</h3>
                <p>{service.description}</p>
              </div>
            )}
          </div>

          {/* Gallery */}
          {service.gallery?.length > 1 && (
            <div className="glass profile-card">
              <h3>Galerie</h3>
              <div className="gallery-grid">
                {service.gallery.map((url, i) => (
                  <img key={i} src={url} alt={`gallery-${i}`} className="gallery-thumb" />
                ))}
              </div>
            </div>
          )}

          {/* Certificates */}
          {service.certificates?.length > 0 && (
            <div className="glass profile-card">
              <h3><CheckCircle size={18} /> Diplômes & Certifications</h3>
              <div className="cert-grid">
                {service.certificates.map((url, i) => (
                  <img key={i} src={url} alt={`cert-${i}`} className="cert-thumb" />
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="glass profile-card">
            <h3><Star size={18} /> Avis clients ({reviews.length})</h3>
            {reviews.length === 0 ? (
              <p className="no-reviews">Aucun avis pour l'instant.</p>
            ) : (
              <div className="reviews-list">
                {reviews.map((r) => (
                  <motion.div key={r.id} className="review-item"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="review-header">
                      <strong>{r.creator_name}</strong>
                      <div className="stars">
                        {[1,2,3,4,5].map((n) => (
                          <Star key={n} size={13}
                            fill={n <= r.rating ? '#f59e0b' : 'none'}
                            color="#f59e0b" />
                        ))}
                      </div>
                      <span className="review-date">{r.date}</span>
                    </div>
                    {r.comment && <p className="review-comment">{r.comment}</p>}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: booking sidebar ────────────────── */}
        <aside className="profile-sidebar">
          <div className="glass booking-panel sticky-panel">
            <div className="booking-price">
              <span className="price-amount">{service.price}€</span>
              <span className="price-unit">/heure</span>
            </div>

            {booked ? (
              <div className="booked-confirmation">
                <CheckCircle size={32} className="booked-icon" />
                <p>Demande envoyée ! Redirection en cours...</p>
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label><MessageCircle size={14} /> Message (optionnel)</label>
                  <textarea
                    placeholder="Décrivez votre besoin en quelques mots..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <button
                  className="btn-primary btn-block"
                  onClick={handleBook}
                  disabled={bookingLoading || currentUser?.id === service.provider_id}>
                  {bookingLoading ? 'Envoi...' : (
                    <>
                      <Calendar size={16} /> Envoyer une demande
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>

                {!isLoggedIn && (
                  <p className="login-hint">
                    <button className="btn-link" onClick={openLogin}>Connectez-vous</button>
                    {' '}pour réserver
                  </p>
                )}

                <div className="booking-guarantee">
                  <Shield size={16} />
                  <span>Paiement sécurisé après acceptation</span>
                </div>
              </>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
}
