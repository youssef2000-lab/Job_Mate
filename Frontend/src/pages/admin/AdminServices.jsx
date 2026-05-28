// src/pages/admin/AdminServices.jsx

import { useEffect, useState } from 'react';
import {
  getAdminServicesApi,
  deleteAdminServiceApi,
  updateServiceStatusApi,
} from '../../api/adminApi';
import { Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Admin.css';

const STATUS_OPTIONS = [
  { value: 'active',   label: 'Actif'      },
  { value: 'pending',  label: 'En attente' },
  { value: 'rejected', label: 'Rejeté'     },
];

const STATUS_COLORS = {
  active  : '#10b981',
  pending : '#f59e0b',
  rejected: '#ef4444',
};

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('');

  const load = () => {
    setLoading(true);
    getAdminServicesApi(filter ? { status: filter } : {})
      .then(({ data }) => setServices(data.data ?? data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce service ?')) return;
    await deleteAdminServiceApi(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateServiceStatusApi(id, newStatus);
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Services</h1>

      <div className="admin-toolbar">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="admin-select"
        >
          <option value="">Tous les statuts</option>
          {STATUS_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="admin-loading">Chargement...</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Prestataire</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Ville</th>
                <th>Statut</th>
                <th>Créé le</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="service-title-cell">
                      <span>{s.title}</span>
                      <Link
                        to={`/profile/${s.id}`}
                        target="_blank"
                        className="btn-icon"
                        title="Voir l'annonce"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    </div>
                  </td>
                  <td>{s.provider?.name ?? '—'}</td>
                  <td>{s.category}</td>
                  <td>{s.price}€/h</td>
                  <td>{s.city ?? '—'}</td>
                  <td>
                    <select
                      value={s.status}
                      onChange={(e) => handleStatusChange(s.id, e.target.value)}
                      className="status-select"
                      style={{ color: STATUS_COLORS[s.status] }}
                    >
                      {STATUS_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td>{new Date(s.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn-icon danger"
                      onClick={() => handleDelete(s.id)}
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {services.length === 0 && (
            <p className="empty-state">Aucun service trouvé.</p>
          )}
        </div>
      )}
    </div>
  );
}
