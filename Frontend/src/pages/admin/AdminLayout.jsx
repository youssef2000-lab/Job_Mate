// src/pages/admin/AdminLayout.jsx

import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  LayoutDashboard, Users, Briefcase,
  Calendar, LogOut, ChevronRight, Shield,
} from 'lucide-react';
import { logoutThunk } from '../../store/authSlice';
import './Admin.css';

const NAV = [
  { to: '/admin',          icon: LayoutDashboard, label: 'Dashboard',    end: true },
  { to: '/admin/users',    icon: Users,           label: 'Utilisateurs'           },
  { to: '/admin/services', icon: Briefcase,       label: 'Services'               },
  { to: '/admin/bookings', icon: Calendar,        label: 'Réservations'           },
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate('/');
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <Shield size={24} />
          <span>Admin Panel</span>
        </div>

        <nav className="admin-nav">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
              <ChevronRight size={14} className="chevron" />
            </NavLink>
          ))}
        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
