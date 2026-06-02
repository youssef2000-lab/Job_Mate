// src/pages/admin/AdminUsers.jsx

import { useEffect, useState } from 'react';
import { getAdminUsersApi, deleteAdminUserApi } from '../../api/adminApi';
import { Trash2, Search } from 'lucide-react';
import './Admin.css';

export default function AdminUsers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [role,    setRole]    = useState('');

  const load = () => {
    setLoading(true);
    getAdminUsersApi({ search, role })
      .then(({ data }) => setUsers(data.data ?? data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, role]);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    await deleteAdminUserApi(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };



  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Utilisateurs</h1>

      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} />
          <input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="admin-select"
        >
          <option value="">Tous les rôles</option>
          <option value="client">Clients</option>
          <option value="provider">Prestataires</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {loading ? (
        <div className="admin-loading">Chargement...</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Rôle</th>
                <th>Inscrit le</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="user-cell">
                      {u.avatar_url ? (
                        <img src={u.avatar_url} alt={u.name} className="admin-avatar" />
                      ) : (
                        <div className="admin-avatar-fallback">{u.name[0]}</div>
                      )}
                      <span>{u.name}</span>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.phone ?? '—'}</td>
                  <td>
                    <span className={`role-badge role-${u.role}`}>{u.role}</span>
                  </td>

                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    {u.role !== 'admin' && (
                      <button
                        className="btn-icon danger"
                        onClick={() => handleDelete(u.id)}
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="empty-state">Aucun utilisateur trouvé.</p>
          )}
        </div>
      )}
    </div>
  );
}
