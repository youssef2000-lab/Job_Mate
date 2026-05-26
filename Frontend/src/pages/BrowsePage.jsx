// src/pages/BrowsePage.jsx
// ─────────────────────────────────────────────────────────────
// Fetches real services from backend with server-side filtering.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import { Search, Tag, MapPin, DollarSign, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchServices } from '../store/serviceSlice';
import ServiceCard from '../components/ServiceCard';
import './BrowsePage.css';

const CATEGORIES = ['Tous', 'Plomberie', 'Design', 'Menuiserie', 'Nettoyage', 'Électricité', 'Bricolage'];

const BrowsePage = () => {
  const dispatch   = useDispatch();
  const { services, loading, pagination } = useSelector((s) => s.services);

  const [searchTerm,      setSearchTerm]      = useState('');
  const [category,        setCategory]        = useState('Tous');
  const [priceRange,      setPriceRange]      = useState(500);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity,    setSelectedCity]    = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Fetch whenever filters change
  const loadServices = useCallback(() => {
    const params = {};
    if (category !== 'Tous') params.category  = category;
    if (debouncedSearch)     params.search     = debouncedSearch;
    if (selectedCountry)     params.country    = selectedCountry;
    if (selectedCity)        params.city       = selectedCity;
    if (priceRange < 500)    params.max_price  = priceRange;

    dispatch(fetchServices(params));
  }, [dispatch, category, debouncedSearch, selectedCountry, selectedCity, priceRange]);

  useEffect(() => { loadServices(); }, [loadServices]);

  const clearFilters = () => {
    setCategory('Tous');
    setSearchTerm('');
    setPriceRange(500);
    setSelectedCountry('');
    setSelectedCity('');
  };

  // Map backend shape → ServiceCard expected props
  const mapped = services.map((s) => ({
    id         : s.id,
    name       : s.provider_name,
    service    : s.title,
    price      : s.price,
    rating     : s.rating ?? 0,
    reviews    : s.reviews_count ?? 0,
    image      : s.gallery?.[0] ?? s.image ?? null,
    category   : s.category,
    description: s.description ?? '',
    city       : s.city,
    country    : s.country,
    certifications: s.certificates ?? [],
    videoUrl   : s.video_url,
    isVerified : s.is_verified,
    avatar     : s.provider_avatar,
  }));

  return (
    <div className="browse-page section-padding">
      <div className="container">
        <div className="browse-layout">

          {/* ── Filters sidebar ────────────────────────────── */}
          <aside className="filters-sidebar glass-3d">
            <div className="filter-section">
              <h3><Tag size={18} /> Catégories</h3>
              <div className="filter-options">
                {CATEGORIES.map((cat) => (
                  <label key={cat} className="filter-option">
                    <input type="radio" name="category"
                      checked={category === cat}
                      onChange={() => setCategory(cat)} />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3><DollarSign size={18} /> Prix Max (€/h)</h3>
              <input type="range" min="20" max="500" value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="price-range" />
              <div className="price-labels">
                <span>20€</span><span>{priceRange}€</span><span>500€</span>
              </div>
            </div>

            <div className="filter-section">
              <h3><MapPin size={18} /> Localisation</h3>
              <input type="text" placeholder="Pays..." className="location-filter-input"
                value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} />
              <input type="text" placeholder="Ville..." className="location-filter-input"
                style={{ marginTop: '10px' }}
                value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} />
            </div>
          </aside>

          {/* ── Main content ───────────────────────────────── */}
          <main className="browse-main">
            <div className="search-bar-container glass">
              <Search size={20} className="search-icon" />
              <input type="text" placeholder="Rechercher un service, un nom..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            {/* Active filter tags */}
            <div className="active-filters">
              {category !== 'Tous' && (
                <span className="filter-tag">{category}
                  <button onClick={() => setCategory('Tous')}>×</button></span>
              )}
              {selectedCountry && (
                <span className="filter-tag">{selectedCountry}
                  <button onClick={() => setSelectedCountry('')}>×</button></span>
              )}
              {selectedCity && (
                <span className="filter-tag">{selectedCity}
                  <button onClick={() => setSelectedCity('')}>×</button></span>
              )}
            </div>

            {/* Results count */}
            {!loading && (
              <p className="results-count">
                {pagination.total} résultat{pagination.total !== 1 ? 's' : ''}
              </p>
            )}

            {/* Loading skeleton */}
            {loading && (
              <div className="results-grid">
                {[1,2,3,4,5,6].map((n) => (
                  <div key={n} className="service-card skeleton" style={{ height: 320 }} />
                ))}
              </div>
            )}

            {/* Results */}
            {!loading && (
              <div className="results-grid">
                <AnimatePresence>
                  {mapped.map((provider, index) => (
                    <motion.div key={provider.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}>
                      <ServiceCard provider={provider} />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {mapped.length === 0 && (
                  <motion.div className="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <AlertCircle size={48} className="no-results-icon" />
                    <p>Aucun prestataire ne correspond à vos critères.</p>
                    <button onClick={clearFilters} className="btn-clear-filters">
                      Effacer tous les filtres
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;
