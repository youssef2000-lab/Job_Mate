// src/components/ServiceFormModal.jsx
// ─────────────────────────────────────────────────────────────
// Replaces any Base64 FileReader logic with real FormData.
// Used inside Dashboard for create/edit service.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Upload, DollarSign, MapPin, Tag, FileText } from 'lucide-react';
import { createService, updateService } from '../store/serviceSlice';
import './ServiceFormModal.css';

const CATEGORIES = ['Plomberie', 'Design', 'Menuiserie', 'Nettoyage', 'Électricité', 'Bricolage', 'Autre'];

export default function ServiceFormModal({ editTarget, onClose, onSuccess }) {
  const dispatch  = useDispatch();
  const { loading, error } = useSelector((s) => s.services);

  const [form, setForm] = useState({
    title      : '',
    category   : 'Bricolage',
    description: '',
    price      : '',
    city       : '',
    country    : '',
    video_url  : '',
  });

  // Gallery and certificate files (File objects, not base64)
  const [galleryFiles,     setGalleryFiles]     = useState([]);
  const [certificateFiles, setCertificateFiles] = useState([]);

  // Pre-fill when editing
  useEffect(() => {
    if (editTarget) {
      setForm({
        title      : editTarget.title       ?? '',
        category   : editTarget.category    ?? 'Bricolage',
        description: editTarget.description ?? '',
        price      : editTarget.price       ?? '',
        city       : editTarget.city        ?? '',
        country    : editTarget.country     ?? '',
        video_url  : editTarget.video_url   ?? '',
      });
    }
  }, [editTarget]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      gallery     : galleryFiles,
      certificates: certificateFiles,
    };

    let result;
    if (editTarget) {
      result = await dispatch(updateService({ id: editTarget.id, data: payload }));
    } else {
      result = await dispatch(createService(payload));
    }

    if (createService.fulfilled.match(result) || updateService.fulfilled.match(result)) {
      onSuccess?.();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="service-form-modal glass" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top">
          <h3>{editTarget ? 'Modifier le service' : 'Créer une annonce'}</h3>
          <button className="modal-close-btn" onClick={onClose}><X size={22} /></button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="service-form">
          {/* Title */}
          <div className="form-group">
            <label><FileText size={14} /> Titre de l'annonce</label>
            <input name="title" value={form.title} onChange={handleChange}
              placeholder="Ex: Plombier qualifié disponible" required />
          </div>

          {/* Category + Price */}
          <div className="form-row">
            <div className="form-group">
              <label><Tag size={14} /> Catégorie</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label><DollarSign size={14} /> Prix (€/h)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange}
                min="1" max="9999" step="0.5" required />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              rows={4} placeholder="Décrivez votre service en détail..." />
          </div>

          {/* Location */}
          <div className="form-row">
            <div className="form-group">
              <label><MapPin size={14} /> Ville</label>
              <input name="city" value={form.city} onChange={handleChange} placeholder="Paris" />
            </div>
            <div className="form-group">
              <label>Pays</label>
              <input name="country" value={form.country} onChange={handleChange} placeholder="France" />
            </div>
          </div>

          {/* Video URL */}
          <div className="form-group">
            <label>Lien vidéo (optionnel)</label>
            <input name="video_url" value={form.video_url} onChange={handleChange}
              type="url" placeholder="https://youtube.com/..." />
          </div>

          {/* Gallery upload — real File objects */}
          <div className="form-group">
            <label><Upload size={14} /> Photos du service</label>
            <div className="file-drop">
              <input type="file" accept="image/*" multiple
                onChange={(e) => setGalleryFiles(Array.from(e.target.files))}
                id="gallery-upload" className="hidden-input" />
              <label htmlFor="gallery-upload" className="file-drop-label">
                {galleryFiles.length > 0
                  ? `${galleryFiles.length} photo(s) sélectionnée(s)`
                  : 'Choisir des photos'}
              </label>
            </div>
          </div>

          {/* Certificates */}
          <div className="form-group">
            <label><Upload size={14} /> Diplômes / Certifications</label>
            <div className="file-drop">
              <input type="file" accept="image/*,.pdf" multiple
                onChange={(e) => setCertificateFiles(Array.from(e.target.files))}
                id="cert-upload" className="hidden-input" />
              <label htmlFor="cert-upload" className="file-drop-label">
                {certificateFiles.length > 0
                  ? `${certificateFiles.length} fichier(s) sélectionné(s)`
                  : 'Choisir des fichiers (JPG, PNG, PDF)'}
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Enregistrement...' : editTarget ? 'Mettre à jour' : 'Publier l\'annonce'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
