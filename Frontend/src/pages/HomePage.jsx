// src/pages/HomePage.jsx
// FIXES:
// • Replaced s.providerName → s.provider_name  (backend returns snake_case)
// • Replaced s.image → s.gallery?.[0]          (backend returns gallery array)
// • Replaced s.createdAt → s.created_at        (snake_case from API)
// • Removed `reviews` from useSelector (new reviewSlice has no top-level reviews array)
// • Added null-safety on ServiceCard provider props

import { useEffect } from 'react';
import { Search, Shield, Zap, Star, CheckCircle, Calendar, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchServices } from '../store/serviceSlice';
import ServiceCard from '../components/ServiceCard';
import './HomePage.css';

const Typewriter = ({ text }) => {
  const characters = Array.from(text);
  const container = {
    hidden : { opacity: 0 },
    visible: (i = 1) => ({ opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.04 * i } }),
  };
  const child = {
    visible: { opacity: 1, y: 0,  transition: { type: 'spring', damping: 12, stiffness: 200 } },
    hidden:  { opacity: 0, y: 20, transition: { type: 'spring', damping: 12, stiffness: 200 } },
  };
  return (
    <motion.div
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
      variants={container} initial="hidden" whileInView="visible" viewport={{ once: false }}
    >
      {characters.map((char, i) => (
        <motion.span variants={child} key={i}>{char === ' ' ? '\u00A0' : char}</motion.span>
      ))}
    </motion.div>
  );
};

const HomePage = () => {
  const dispatch = useDispatch();
  const { services } = useSelector((state) => state.services);
  // ← removed `reviews` from selector — reviewSlice no longer has a top-level array

  // Fetch latest services on mount if empty
  useEffect(() => {
    if (services.length === 0) {
      dispatch(fetchServices({}));
    }
  }, [dispatch, services.length]);

  // Map 3 most recent services using CORRECT API field names
  const latestProviders = [...services]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // ← was s.createdAt
    .slice(0, 3)
    .map((s) => ({
      id         : s.id,
      name       : s.provider_name   ?? 'Prestataire',        // ← was s.providerName
      service    : s.title,
      price      : s.price,
      rating     : s.rating          ?? 0,
      reviews    : s.reviews_count   ?? 0,
      image      : s.gallery?.[0]    ?? null,                  // ← was s.image
      category   : s.category,
      description: s.description     ?? '',
      city       : s.city,
      country    : s.country,
      certifications: s.certificates ?? [],
      videoUrl   : s.video_url,
      avatar     : s.provider_avatar ?? null,
      type       : 'Pro',
    }));

  return (
    <div className="home-page">
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="hero">
        <video className="hero-video-bg" autoPlay loop muted playsInline poster="/hero-fallback.png">
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" />

        <div className="container hero-container">
          <div className="hero-content centered-hero">
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              Trouvez le <span>professionnel idéal</span> pour tous vos projets.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            >
              De la plomberie au design, JobMate vous connecte instantanément avec des experts locaux vérifiés.
            </motion.p>

            <motion.div className="hero-actions"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            >
              <Link to="/browse" className="btn-primary btn-lg glow">Démarrer maintenant</Link>
              <a href="#how-it-works" className="btn-secondary btn-lg">Voir comment ça marche</a>
            </motion.div>

            <motion.div className="hero-trust-badges"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <div className="badge"><Shield size={18} /><span>Sûr & Sécurisé</span></div>
              <div className="badge"><CheckCircle size={18} /><span>Garanti satisfaction</span></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Top providers ────────────────────────────── */}
      <section className="top-providers section-padding">
        <div className="container">
          <div className="section-header centered-header">
            <h2 className="premium-title">
              <Typewriter text="Nos Experts " /><span className="premium-highlight">Recommandés</span>
            </h2>
          </div>

          <div className="providers-grid">
            {latestProviders.map((provider, index) => (
              <motion.div key={provider.id}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }} transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ServiceCard provider={provider} />
              </motion.div>
            ))}
          </div>

          {latestProviders.length === 0 && (
            <div className="no-providers-home glass">
              <p>Soyez le premier à proposer vos services !</p>
              <Link to="/dashboard" className="btn-primary btn-sm">Créer une annonce</Link>
            </div>
          )}

          <div className="discover-more-wrapper">
            <Link to="/browse" className="discover-more-link">
              Découvrir plus d'experts <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why us ───────────────────────────────────── */}
      <section className="why-choose-us section-padding">
        <div className="container">
          <div className="section-header centered-header">
            <motion.h2 className="premium-title"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }} transition={{ duration: 0.8 }}
            >
              Pourquoi <span className="premium-highlight">nous</span> choisir ?
            </motion.h2>
          </div>

          <div className="why-grid">
            {[
              { icon: Shield, title: 'Sécurité Maximale',  text: 'Vos transactions sont protégées par notre système de séquestre intelligent.', delay: 0    },
              { icon: Star,   title: 'Qualité Certifiée',  text: 'Tous nos experts sont rigoureusement vérifiés et évalués par la communauté.',  delay: 0.1  },
              { icon: Zap,    title: 'Rapidité Éclair',    text: 'Trouvez le prestataire idéal et commencez votre projet en moins de 10 min.',   delay: 0.2  },
              { icon: Award,  title: 'Support 24/7',       text: "Une équipe dédiée à votre satisfaction, disponible à tout moment.",            delay: 0.3  },
            ].map(({ icon: Icon, title, text, delay }) => (
              <motion.div key={title} className="why-card glass-3d"
                whileHover={{ y: -10, scale: 1.02 }}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }} transition={{ delay }}
              >
                <div className="why-icon-wrapper stylized-lucide"><Icon size={48} /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────── */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-header centered-header">
            <motion.h2 className="premium-title"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }} transition={{ duration: 0.8 }}
            >
              Comment ça <span className="premium-highlight">marche</span> ?
            </motion.h2>
          </div>

          <div className="how-steps">
            {[
              { icon: Search,      tag: 'Step 01', title: 'Sélectionnez', text: "Parcourez les profils et choisissez l'expert qui correspond le mieux à vos besoins." },
              { icon: Calendar,    tag: 'Step 02', title: 'Réservez',     text: 'Planifiez une intervention en quelques clics via notre interface simplifiée.' },
              { icon: CheckCircle, tag: 'Step 03', title: 'Profitez',     text: 'Recevez votre service, validez la prestation et évaluez votre expert.' },
            ].map(({ icon: Icon, tag, title, text }, i) => (
              <div key={tag} className={`how-step-item ${i % 2 === 1 ? 'reverse' : ''}`}>
                <motion.div className="how-illustration"
                  initial={{ opacity: 0, x: i % 2 === 1 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }}
                >
                  <div className="icon-container"><Icon size={64} /><div className="ripple" /></div>
                </motion.div>
                <motion.div className="how-content"
                  initial={{ opacity: 0, x: i % 2 === 1 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }}
                >
                  <span className="step-tag">{tag}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;