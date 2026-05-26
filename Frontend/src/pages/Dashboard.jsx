// src/pages/Dashboard.jsx
// ─────────────────────────────────────────────────────────────
// Fetches real bookings and services from backend on mount.
// Provider: sees incoming bookings + their services.
// Client:   sees their outgoing bookings.
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlusCircle, Briefcase, Calendar, Star, Clock,
  CheckCircle, XCircle, CreditCard, ChevronRight, Trash2,
} from 'lucide-react';
import { fetchBookings, updateBookingStatus } from '../store/bookingSlice';
import { fetchServices, deleteService }       from '../store/serviceSlice';
import { useToast } from '../hooks/useToast';
import ServiceFormModal from '../components/ServiceFormModal';
import './Dashboard.css';

const STATUS_ICONS = {
  pending   : <Clock   size={16} className="status-icon pending"   />,
  paid      : <CreditCard size={16} className="status-icon paid"   />,
  accepted  : <CheckCircle size={16} className="status-icon accepted" />,
  declined  : <XCircle size={16} className="status-icon declined"  />,
  completed : <CheckCircle size={16} className="status-icon completed" />,
};

export default function Dashboard() {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const { showToast } = useToast();

  const { currentUser }    = useSelector((s) => s.auth);
  const { bookings, loading: bLoading } = useSelector((s) => s.bookings);
  const { services, loading: sLoading } = useSelector((s) => s.services);

  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editTarget,      setEditTarget]      = useState(null);

  const isProvider = currentUser?.role === 'provider';
  const isClient   = currentUser?.role === 'client';

  // Load data on mount
  useEffect(() => {
    dispatch(fetchBookings());
    if (isProvider) {
      dispatch(fetchServices({ provider_id: currentUser.id }));
    }
  }, [dispatch, isProvider, currentUser?.id]);

  // ── Booking actions ────────────────────────────────────────
  const handleAccept = async (bookingId) => {
    const result = await dispatch(updateBookingStatus({ bookingId, status: 'accepted' }));
    if (updateBookingStatus.fulfilled.match(result)) showToast('Réservation acceptée !');
  };

  const handleDecline = async (bookingId) => {
    const result = await dispatch(updateBookingStatus({ bookingId, status: 'declined' }));
    if (updateBookingStatus.fulfilled.match(result)) showToast('Réservation refusée.', 'error');
  };

  const handleComplete = async (bookingId) => {
    const result = await dispatch(updateBookingStatus({ bookingId, status: 'completed' }));
    if (updateBookingStatus.fulfilled.match(result)) showToast('Prestation marquée comme terminée !');
  };

  // ── Service actions ────────────────────────────────────────
  const handleDeleteService = async (id) => {
    if (!window.confirm('Supprimer ce service ?')) return;
    const result = await dispatch(deleteService(id));
    if (deleteService.fulfilled.match(result)) showToast('Service supprimé.');
  };

  const handleEditService = (service) => {
    setEditTarget(service);
    setShowServiceForm(true);
  };

  // ── My services (provider) ────────────────────────────────
  const myServices = services.filter((s) => s.provider_id === currentUser?.id);

  return (
    <div className="dashboard section-padding">
      <div className="container">

        {/* ── Header ──────────────────────────────────── */}
        <div className="dashboard-header">
          <div>
            <h1>Tableau de bord</h1>
            <p className="dashboard-sub">
              Bonjour, <strong>{currentUser?.name}</strong> 👋
            </p>
          </div>
          {isProvider && (
            <button className="btn-primary" onClick={() => { setEditTarget(null); setShowServiceForm(true); }}>
              <PlusCircle size={18} /> Nouvelle annonce
            </button>
          )}
        </div>

        {/* ── Provider: My Services ─────────────────── */}
        {isProvider && (
          <section className="dashboard-section">
            <h2><Briefcase size={20} /> Mes annonces ({myServices.length})</h2>

            {sLoading ? (
              <p className="loading-text">Chargement...</p>
            ) : myServices.length === 0 ? (
              <div className="empty-state glass">
                <p>Vous n'avez pas encore d'annonce.</p>
                <button className="btn-primary btn-sm"
                  onClick={() => { setEditTarget(null); setShowServiceForm(true); }}>
                  Créer une annonce
                </button>
              </div>
            ) : (
              <div className="services-list">
                {myServices.map((s) => (
                  <motion.div key={s.id} className="service-row glass"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}>
                    <div className="service-row-info">
                      <h4>{s.title}</h4>
                      <span className="tag">{s.category}</span>
                      <span className="price">{s.price}€/h</span>
                      <span className={`status-pill status-${s.status}`}>{s.status}</span>
                    </div>
                    <div className="service-row-actions">
                      <button className="btn-icon-sm" onClick={() => handleEditService(s)}>
                        Modifier
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

        {/* ── Bookings section ───────────────────────── */}
        <section className="dashboard-section">
          <h2>
            <Calendar size={20} />
            {isProvider ? ' Réservations reçues' : ' Mes réservations'}
            {' '}({bookings.length})
          </h2>

          {bLoading ? (
            <p className="loading-text">Chargement...</p>
          ) : bookings.length === 0 ? (
            <div className="empty-state glass">
              <p>
                {isClient
                  ? "Vous n'avez pas encore de réservation."
                  : "Aucune réservation reçue pour l'instant."}
              </p>
              {isClient && (
                <Link to="/browse" className="btn-primary btn-sm">
                  Trouver un service
                </Link>
              )}
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <motion.div key={booking.id} className="booking-card glass"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}>

                  <div className="booking-card-header">
                    {STATUS_ICONS[booking.payment_status] || STATUS_ICONS[booking.status]}
                    <div className="booking-info">
                      <h4>{booking.service_title}</h4>
                      <p className="booking-meta">
                        {isProvider
                          ? `Client : ${booking.client_name}`
                          : `Prestataire : ${booking.provider_name}`}
                        {' · '}{new Date(booking.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="booking-amount">{booking.amount}€</div>
                  </div>

                  {booking.client_message && (
                    <p className="booking-message">"{booking.client_message}"</p>
                  )}

                  {/* Provider actions */}
                  {isProvider && booking.status === 'pending' && (
                    <div className="booking-actions">
                      <button className="btn-success btn-sm" onClick={() => handleAccept(booking.id)}>
                        <CheckCircle size={14} /> Accepter
                      </button>
                      <button className="btn-danger btn-sm" onClick={() => handleDecline(booking.id)}>
                        <XCircle size={14} /> Refuser
                      </button>
                    </div>
                  )}

                  {/* Provider: mark complete */}
                  {isProvider && booking.status === 'paid' && (
                    <div className="booking-actions">
                      <button className="btn-primary btn-sm" onClick={() => handleComplete(booking.id)}>
                        <CheckCircle size={14} /> Marquer comme terminé
                      </button>
                    </div>
                  )}

                  {/* Provider: accepted → needs payment */}
                  {isProvider && booking.status === 'accepted' && booking.payment_status === 'unpaid' && (
                    <div className="booking-actions">
                      <Link to={`/checkout/${booking.id}`} className="btn-primary btn-sm">
                        <CreditCard size={14} /> Débloquer les coordonnées
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  )}

                  {/* Client: contact visible after completion */}
                  {isProvider && booking.payment_status === 'paid' && booking.client_phone && (
                    <div className="contact-revealed">
                      📞 Client : <strong>{booking.client_phone}</strong>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Service form modal */}
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
