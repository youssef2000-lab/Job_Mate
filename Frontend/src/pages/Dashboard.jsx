// src/pages/Dashboard.jsx
// ADDITIONS:
// • Profile sidebar with user avatar, name, role tag
// • Avatar upload (calls /upload/avatar API)
// • Full booking cards with client/provider avatar
// • Review submission for completed bookings

import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusCircle, Briefcase, Calendar, CheckCircle,
  XCircle, CreditCard, ChevronRight, Trash2, User,
  Camera, Star, MessageCircle, Edit2,
} from 'lucide-react';
import { fetchBookings, updateBookingStatus } from '../store/bookingSlice';
import { fetchServices, deleteService }       from '../store/serviceSlice';
import { addReview }                          from '../store/reviewSlice';
import { setAvatar }                          from '../store/authSlice';
import { uploadAvatarApi }                    from '../api/authApi';
import { useToast } from '../hooks/useToast';
import ServiceFormModal from '../components/ServiceFormModal';
import './Dashboard.css';

const PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23e2e8f0'/%3E%3Ctext x='100' y='100' font-size='80' text-anchor='middle' dominant-baseline='middle' fill='%2394a3b8'%3E👤%3C/text%3E%3C/svg%3E`;

// Reusable avatar component
const Avatar = ({ src, name, size = 48, className = '' }) => {
  const [broken, setBroken] = useState(false);
  const initial = name?.charAt(0)?.toUpperCase() ?? '?';

  if (!src || broken) {
    return (
      <div
        className={`avatar-fallback ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {initial}
      </div>
    );
  }
  return (
    <img
      src={src} alt={name}
      className={`avatar-img ${className}`}
      style={{ width: size, height: size }}
      onError={() => setBroken(true)}
    />
  );
};

// Status badge
const STATUS_LABELS = {
  pending  : { label: 'En attente',  cls: 'pending'   },
  accepted : { label: 'Accepté',     cls: 'accepted'  },
  declined : { label: 'Refusé',      cls: 'declined'  },
  completed: { label: 'Terminé',     cls: 'completed' },
  paid     : { label: 'Payé',        cls: 'paid'      },
  unpaid   : { label: 'Non payé',    cls: 'unpaid'    },
};

const StatusBadge = ({ value }) => {
  const meta = STATUS_LABELS[value] ?? { label: value, cls: '' };
  return <span className={`status-tag ${meta.cls}`}>{meta.label}</span>;
};

// Inline review form
const ReviewForm = ({ booking, onSubmit, onCancel }) => {
  const [rating,  setRating]  = useState(5);
  const [comment, setComment] = useState('');
  const [hover,   setHover]   = useState(0);

  return (
    <div className="review-form-inline">
      <h4><Star size={14} /> Laisser un avis</h4>
      <div className="star-row">
        {[1,2,3,4,5].map((n) => (
          <button key={n} type="button"
            className={`star-btn ${n <= (hover || rating) ? 'active' : ''}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(n)}
          >
            <Star size={20} fill={n <= (hover || rating) ? '#f59e0b' : 'none'} color="#f59e0b" />
          </button>
        ))}
      </div>
      <textarea
        className="review-textarea"
        placeholder="Décrivez votre expérience..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />
      <div className="review-form-actions">
        <button className="btn-secondary btn-sm" onClick={onCancel}>Annuler</button>
        <button className="btn-primary btn-sm" onClick={() => onSubmit(booking.id, rating, comment)}>
          Soumettre
        </button>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const dispatch      = useDispatch();
  const { showToast } = useToast();
  const avatarRef     = useRef(null);

  const { currentUser }                    = useSelector((s) => s.auth);
  const { bookings, loading: bLoading }    = useSelector((s) => s.bookings);
  const { services, loading: sLoading }    = useSelector((s) => s.services);

  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editTarget,      setEditTarget]      = useState(null);
  const [reviewingId,     setReviewingId]     = useState(null);
  const [avatarLoading,   setAvatarLoading]   = useState(false);

  const isProvider = currentUser?.role === 'provider';
  const isClient   = currentUser?.role === 'client';

  useEffect(() => {
    dispatch(fetchBookings());
    if (isProvider) dispatch(fetchServices());
  }, [dispatch, isProvider]);

  const myServices = services.filter((s) => s.provider_id === currentUser?.id);

  // ── Booking actions ──────────────────────────────────────────
  const handleStatus = async (bookingId, status) => {
    const res = await dispatch(updateBookingStatus({ bookingId, status }));
    if (updateBookingStatus.fulfilled.match(res)) {
      showToast(status === 'accepted' ? 'Réservation acceptée !' :
                status === 'declined' ? 'Réservation refusée.'   :
                'Prestation terminée !');
    }
  };

  // ── Avatar upload ────────────────────────────────────────────
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarLoading(true);
    try {
      const { data } = await uploadAvatarApi(file);
      dispatch(setAvatar(data.avatar_url));
      showToast('Photo de profil mise à jour !');
    } catch {
      showToast('Erreur upload photo.', 'error');
    } finally {
      setAvatarLoading(false);
    }
  };

  // ── Review submit ────────────────────────────────────────────
  const handleReviewSubmit = async (bookingId, rating, comment) => {
    const res = await dispatch(addReview({ booking_id: bookingId, rating, comment }));
    if (addReview.fulfilled.match(res)) {
      showToast('Avis publié !');
      setReviewingId(null);
    } else {
      showToast(res.payload ?? 'Erreur publication avis.', 'error');
    }
  };

  // ── Service actions ──────────────────────────────────────────
  const handleDeleteService = async (id) => {
    if (!window.confirm('Supprimer ce service ?')) return;
    await dispatch(deleteService(id));
    showToast('Service supprimé.');
  };

  return (
    <div className="dashboard section-padding">
      <div className="container">
        <div className="dashboard-layout">

          {/* ── LEFT: Profile sidebar ─────────────────── */}
          <aside className="dashboard-sidebar">
            <div className="sidebar-profile glass">
              {/* Avatar with upload button */}
              <div className="profile-avatar-wrap">
                <div className="profile-avatar-container">
                  <Avatar
                    src={currentUser?.avatar_url}
                    name={currentUser?.name}
                    size={90}
                    className="profile-avatar"
                  />
                  <button
                    className="avatar-upload-btn"
                    onClick={() => avatarRef.current?.click()}
                    title="Changer la photo"
                    disabled={avatarLoading}
                  >
                    {avatarLoading ? '...' : <Camera size={14} />}
                  </button>
                </div>
                <input
                  ref={avatarRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <h3 className="profile-name">{currentUser?.name}</h3>
              <p className="profile-email">{currentUser?.email}</p>
              <span className={`role-tag role-${currentUser?.role}`}>
                {currentUser?.role === 'provider' ? '🔧 Prestataire' :
                 currentUser?.role === 'admin'    ? '🛡️ Admin'        :
                                                    '👤 Client'}
              </span>
            </div>

            {/* Quick stats */}
            <div className="sidebar-stats glass">
              <div className="stat-row">
                <span>Réservations</span>
                <strong>{bookings.length}</strong>
              </div>
              {isProvider && (
                <div className="stat-row">
                  <span>Services actifs</span>
                  <strong>{myServices.length}</strong>
                </div>
              )}
              <div className="stat-row">
                <span>Statut</span>
                <strong className="text-green">Actif</strong>
              </div>
            </div>

            {isProvider && (
              <button className="btn-primary btn-block"
                onClick={() => { setEditTarget(null); setShowServiceForm(true); }}>
                <PlusCircle size={16} /> Nouvelle annonce
              </button>
            )}
          </aside>

          {/* ── RIGHT: Main content ───────────────────── */}
          <div className="dashboard-main">

            {/* Provider: services */}
            {isProvider && (
              <section className="dash-section">
                <div className="section-head">
                  <h2><Briefcase size={20} /> Mes annonces</h2>
                  <span className="count-badge">{myServices.length}</span>
                </div>

                {sLoading ? (
                  <div className="loading-rows">
                    {[1,2].map(n => <div key={n} className="skeleton-row" />)}
                  </div>
                ) : myServices.length === 0 ? (
                  <div className="empty-card glass">
                    <p>Aucune annonce publiée.</p>
                    <button className="btn-primary btn-sm"
                      onClick={() => { setEditTarget(null); setShowServiceForm(true); }}>
                      Créer une annonce
                    </button>
                  </div>
                ) : (
                  <div className="service-rows">
                    {myServices.map((s) => (
                      <motion.div key={s.id} className="service-row glass"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="service-row-left">
                          <div className="service-row-img">
                            <img src={s.gallery?.[0] || PLACEHOLDER} alt={s.title}
                              onError={(e) => { e.currentTarget.src = PLACEHOLDER; }} />
                          </div>
                          <div>
                            <h4>{s.title}</h4>
                            <div className="row-tags">
                              <span className="tag-cat">{s.category}</span>
                              <span className="tag-price">{s.price}€/h</span>
                              <StatusBadge value={s.status} />
                            </div>
                          </div>
                        </div>
                        <div className="service-row-actions">
                          <button className="btn-icon-sm edit" onClick={() => { setEditTarget(s); setShowServiceForm(true); }}>
                            <Edit2 size={14} />
                          </button>
                          <button className="btn-icon-sm danger" onClick={() => handleDeleteService(s.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Bookings */}
            <section className="dash-section">
              <div className="section-head">
                <h2>
                  <Calendar size={20} />
                  {isProvider ? ' Réservations reçues' : ' Mes réservations'}
                </h2>
                <span className="count-badge">{bookings.length}</span>
              </div>

              {bLoading ? (
                <div className="loading-rows">
                  {[1,2,3].map(n => <div key={n} className="skeleton-row tall" />)}
                </div>
              ) : bookings.length === 0 ? (
                <div className="empty-card glass">
                  <p>{isClient ? "Aucune réservation en cours." : "Aucune réservation reçue."}</p>
                  {isClient && <Link to="/browse" className="btn-primary btn-sm">Trouver un service</Link>}
                </div>
              ) : (
                <AnimatePresence>
                  {bookings.map((b) => (
                    <motion.div key={b.id} className="booking-card glass"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>

                      <div className="booking-card-top">
                        <div className="booking-who">
                          <Avatar
                            src={isProvider ? b.client_avatar : b.provider_avatar}
                            name={isProvider ? b.client_name  : b.provider_name}
                            size={40}
                          />
                          <div>
                            <p className="booking-title">{b.service_title}</p>
                            <p className="booking-sub">
                              {isProvider ? `Client : ${b.client_name}` : `Prestataire : ${b.provider_name}`}
                              {' · '}{new Date(b.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="booking-right">
                          <strong className="booking-amount">{b.amount}€</strong>
                          <StatusBadge value={b.status} />
                        </div>
                      </div>

                      {b.client_message && (
                        <p className="booking-message">
                          <MessageCircle size={13} /> {b.client_message}
                        </p>
                      )}

                      {/* Provider actions */}
                      {isProvider && b.status === 'pending' && (
                        <div className="booking-actions">
                          <button className="btn-success btn-sm" onClick={() => handleStatus(b.id, 'accepted')}>
                            <CheckCircle size={14} /> Accepter
                          </button>
                          <button className="btn-danger btn-sm" onClick={() => handleStatus(b.id, 'declined')}>
                            <XCircle size={14} /> Refuser
                          </button>
                        </div>
                      )}

                      {isProvider && b.status === 'accepted' && b.payment_status === 'unpaid' && (
                        <div className="booking-actions">
                          <Link to={`/checkout/${b.id}`} className="btn-primary btn-sm">
                            <CreditCard size={14} /> Débloquer les coordonnées <ChevronRight size={13} />
                          </Link>
                        </div>
                      )}

                      {isProvider && b.status === 'paid' && (
                        <div className="booking-actions">
                          <button className="btn-primary btn-sm" onClick={() => handleStatus(b.id, 'completed')}>
                            <CheckCircle size={14} /> Marquer terminé
                          </button>
                        </div>
                      )}

                      {isProvider && b.payment_status === 'paid' && b.client_phone && (
                        <p className="contact-revealed">📞 {b.client_phone}</p>
                      )}

                      {/* Client: review completed booking */}
                      {isClient && b.status === 'completed' && !b.has_review && (
                        reviewingId === b.id ? (
                          <ReviewForm
                            booking={b}
                            onSubmit={handleReviewSubmit}
                            onCancel={() => setReviewingId(null)}
                          />
                        ) : (
                          <button className="btn-review" onClick={() => setReviewingId(b.id)}>
                            <Star size={14} /> Laisser un avis
                          </button>
                        )
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </section>
          </div>
        </div>
      </div>

      {showServiceForm && (
        <ServiceFormModal
          editTarget={editTarget}
          onClose={() => { setShowServiceForm(false); setEditTarget(null); }}
          onSuccess={() => {
            setShowServiceForm(false);
            setEditTarget(null);
            dispatch(fetchServices());
            showToast(editTarget ? 'Service mis à jour !' : 'Service créé !');
          }}
        />
      )}
    </div>
  );
}
