// src/pages/admin/AdminDashboard.jsx

import { useEffect, useState } from 'react';
import { getDashboardStatsApi } from '../../api/adminApi';
import {
  Users, Briefcase, Calendar,
  DollarSign, Clock, CheckCircle,
} from 'lucide-react';

const STAT_CARDS = [
  { key: 'total_users',          label: 'Utilisateurs',  icon: Users,       color: '#6366f1' },
  { key: 'total_providers',      label: 'Prestataires',  icon: Briefcase,   color: '#10b981' },
  { key: 'total_services',       label: 'Services',      icon: Briefcase,   color: '#f59e0b' },
  { key: 'total_bookings',       label: 'Réservations',  icon: Calendar,    color: '#3b82f6' },
  { key: 'total_revenue',        label: 'Revenus (€)',   icon: DollarSign,  color: '#ec4899', suffix: '€' },
  { key: 'pending_bookings',     label: 'En attente',    icon: Clock,       color: '#f97316' },
];

export default function AdminDashboard() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    getDashboardStatsApi()
      .then(({ data }) => setStats(data))
      .catch(() => setError('Impossible de charger les statistiques.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-loading">Chargement...</div>;
  if (error)   return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Tableau de bord</h1>

      <div className="stat-grid">
        {STAT_CARDS.map(({ key, label, icon: Icon, color, suffix }) => (
          <div key={key} className="stat-card glass">
            <div className="stat-icon" style={{ background: color + '22', color }}>
              <Icon size={24} />
            </div>
            <div className="stat-body">
              <span className="stat-value">{stats[key] ?? 0}{suffix ?? ''}</span>
              <span className="stat-label">{label}</span>
            </div>
          </div>
        ))}
      </div>

      {stats?.unverified_providers > 0 && (
        <div className="admin-alert">
          <CheckCircle size={18} />
          <span>
            {stats.unverified_providers} prestataire
            {stats.unverified_providers > 1 ? 's' : ''} en attente de vérification.
          </span>
        </div>
      )}
    </div>
  );
}
