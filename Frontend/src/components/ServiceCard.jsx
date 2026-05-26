import { Star, Play, Shield, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import './ServiceCard.css';

const ServiceCard = ({ provider }) => {
  const isStructured = provider.videoUrl || (provider.certifications && provider.certifications.length > 0);

  return (
    <Link to={`/profile/${provider.id}`} className="service-card">
      {isStructured && (
        <div className="structured-badge">
          <CheckCircle size={12} /> Annonce Structurée
        </div>
      )}
      <div className="card-header">
        {provider.avatar ? (
          <img src={provider.avatar} alt={provider.name} className="provider-avatar" />
        ) : (
          <div className="provider-avatar-circle">
            {provider.name.charAt(0)}
          </div>
        )}
        <div className="provider-info-header">
          <div className="name-row">
            <h3 className="provider-name">{provider.name}</h3>
            <span className="badge-type">{provider.type || 'Particulier'}</span>
          </div>
          <div className="rating-location">
            <div className="rating-val">
              <Star size={14} fill={provider.rating > 0 ? "#f59e0b" : "none"} color="#f59e0b" />
              <span>{provider.rating > 0 ? `${provider.rating}/5` : 'Nouveau'}</span>
            </div>
            <span className="location">
              {provider.city && provider.country
                ? `${provider.city}, ${provider.country}`
                : provider.location || 'Paris, France'}
            </span>
          </div>
        </div>
      </div>

      <div className="card-body">
        <p className="service-description">
          {provider.description || `Je suis un professionnel avec plusieurs années d'expérience. Je fais ${provider.service.toLowerCase()}...`}
        </p>
      </div>

      <div className="card-images">
        <img src={provider.image} alt={provider.service} className="content-img" />
      </div>

      <div className="card-footer">
        <span className="time-posted">Hier à 23h</span>
        <span className="price-display">{provider.price}€/h</span>
      </div>
    </Link>
  );
};

export default ServiceCard;
