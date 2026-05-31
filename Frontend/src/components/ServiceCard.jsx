// src/components/ServiceCard.jsx
// FIXES:
// • Added onError handler for broken images → shows placeholder
// • Guard against null provider.service before calling .toLowerCase()
// • Added provider avatar display with initials fallback
// • Fixed: provider.image might be null → default placeholder shown

import { Star, CheckCircle, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import './ServiceCard.css';

// Inline SVG placeholder — no external dependency, never breaks
const PLACEHOLDER_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Crect width='800' height='450' fill='%23f1f5f9'/%3E%3Ctext x='400' y='225' font-family='sans-serif' font-size='48' text-anchor='middle' dominant-baseline='middle' fill='%23cbd5e1'%3E📷%3C/text%3E%3C/svg%3E`;

const ProviderAvatar = ({ avatar, name, size = 65 }) => {
  const initial = name?.charAt(0)?.toUpperCase() ?? '?';

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className="provider-avatar"
        style={{ width: size, height: size }}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    );
  }
  return null;
};

const ServiceCard = ({ provider }) => {
  const isStructured = provider.videoUrl ||
    (provider.certifications && provider.certifications.length > 0);

  const hasAvatar  = !!provider.avatar;
  const initial    = provider.name?.charAt(0)?.toUpperCase() ?? '?';
  const imageUrl   = provider.image ?? null;

  // Location string
  const locationStr = provider.city && provider.country
    ? `${provider.city}, ${provider.country}`
    : provider.location || null;

  return (
    <Link to={`/profile/${provider.id}`} className="service-card">
      {isStructured && (
        <div className="structured-badge">
          <CheckCircle size={12} /> Annonce Structurée
        </div>
      )}

      <div className="card-header">
        {/* Avatar with fallback */}
        <div className="avatar-wrapper">
          {hasAvatar ? (
            <img
              src={provider.avatar}
              alt={provider.name}
              className="provider-avatar"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className="provider-avatar-circle"
            style={{ display: hasAvatar ? 'none' : 'flex' }}
          >
            {initial}
          </div>
        </div>

        <div className="provider-info-header">
          <div className="name-row">
            <h3 className="provider-name">{provider.name}</h3>
            <span className="badge-type">{provider.type || 'Particulier'}</span>
          </div>
          <div className="rating-location">
            <div className="rating-val">
              <Star size={14} fill={provider.rating > 0 ? '#f59e0b' : 'none'} color="#f59e0b" />
              <span>{provider.rating > 0 ? `${provider.rating}/5` : 'Nouveau'}</span>
            </div>
            {locationStr && (
              <span className="location">
                <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} />
                {locationStr}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="card-body">
        <p className="service-description">
          {provider.description ||
            `Professionnel expérimenté proposant des services de ${(provider.service ?? 'qualité').toLowerCase()}.`}
        </p>
      </div>

      <div className="card-images">
        <img
          src={imageUrl || PLACEHOLDER_SVG}
          alt={provider.service ?? 'Service'}
          className="content-img"
          onError={(e) => { e.currentTarget.src = PLACEHOLDER_SVG; }}
          loading="lazy"
        />
      </div>

      <div className="card-footer">
        <span className="time-posted">Récemment publié</span>
        <span className="price-display">{provider.price}€/h</span>
      </div>
    </Link>
  );
};

export default ServiceCard;
