// src/pages/admin/AdminBookings.jsx

import { useEffect, useState } from 'react';
import { getAdminBookingsApi } from '../../api/adminApi';
import './Admin.css';

const STATUS_META = {
  pending  : { label: 'En attente', className: 'status-pending'   },
  accepted : { label: 'Accepté',    className: 'status-accepted'  },
  declined : { label: 'Refusé',     className: 'status-declined'  },
  completed: { label: 'Terminé',    className: 'status-completed' },
};

const PAYMENT_META = {
  unpaid  : { label: 'Non payé', className: 'status-unpaid'   },
  paid    : { label: 'Payé',     className: 'status-paid'     },
  refunded: { label: 'Remboursé',className: 'status-refunded' },
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('');
  const [page,     setPage]     = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const load = (p = 1) => {
    setLoading(true);
    getAdminBookingsApi({ ...(filter && { status: filter }), page: p })
      .then(({ data }) => {
        setBookings(data.data ?? data);
        setLastPage(data.last_page ?? 1);
        setPage(p);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(1); }, [filter]);

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Réservations</h1>

      <div className="admin-toolbar">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="admin-select"
        >
          <option value="">Tous les statuts</option>
          {Object.entries(STATUS_META).map(([value, { label }]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="admin-loading">Chargement...</div>
      ) : (
        <>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Service</th>
                  <th>Client</th>
                  <th>Prestataire</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>Paiement</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  const statusMeta  = STATUS_META[b.status]  ?? { label: b.status,         className: '' };
                  const paymentMeta = PAYMENT_META[b.payment_status] ?? { label: b.payment_status, className: '' };

                  return (
                    <tr key={b.id}>
                      <td className="muted">#{b.id}</td>
                      <td>{b.service?.title ?? '—'}</td>
                      <td>
                        <div className="user-cell">
                          <div className="admin-avatar-fallback">
                            {b.client?.name?.[0] ?? '?'}
                          </div>
                          <div>
                            <div>{b.client?.name ?? '—'}</div>
                            <div className="muted small">{b.client?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="user-cell">
                          <div className="admin-avatar-fallback">
                            {b.provider?.name?.[0] ?? '?'}
                          </div>
                          <div>
                            <div>{b.provider?.name ?? '—'}</div>
                            <div className="muted small">{b.provider?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><strong>{b.amount}€</strong></td>
                      <td>
                        <span className={`status-badge ${statusMeta.className}`}>
                          {statusMeta.label}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${paymentMeta.className}`}>
                          {paymentMeta.label}
                        </span>
                      </td>
                      <td className="muted">
                        {new Date(b.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {bookings.length === 0 && (
              <p className="empty-state">Aucune réservation trouvée.</p>
            )}
          </div>

          {/* Pagination */}
          {lastPage > 1 && (
            <div className="admin-pagination">
              <button
                className="btn-page"
                disabled={page === 1}
                onClick={() => load(page - 1)}
              >
                ← Précédent
              </button>
              <span className="page-info">Page {page} / {lastPage}</span>
              <button
                className="btn-page"
                disabled={page === lastPage}
                onClick={() => load(page + 1)}
              >
                Suivant →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
