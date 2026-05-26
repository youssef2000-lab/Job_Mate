import { Search, MapPin, Star, Shield, Clock, Zap, Briefcase, User, CheckCircle, Smartphone, Calendar, Award, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import ServiceCard from '../components/ServiceCard';
import './HomePage.css';

// Typewriter Component
const Typewriter = ({ text }) => {
  const characters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
  };

  return (
    <motion.div
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
    >
      {characters.map((char, index) => (
        <motion.span variants={child} key={index}>
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

const HomePage = () => {
  const { services } = useSelector((state) => state.services);
  const { reviews } = useSelector((state) => state.reviews);
  
  // Get the 3 most recent announcements
  const latestProviders = [...services]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)
    .map(s => ({
      id: s.id,
      name: s.providerName,
      service: s.title,
      price: s.price,
      rating: s.rating || 0,
      reviews: s.reviews || 0,
      image: s.image,
      category: s.category,
      description: s.description || "",
      location: `${s.city || ''} ${s.country ? '(' + s.country + ')' : ''}`.trim() || "Localisation non précisée",
      type: "Pro" // Default for display
    }));

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <video className="hero-video-bg" autoPlay loop muted playsInline poster="/hero-fallback.png">
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>

        <div className="container hero-container">
          <div className="hero-content centered-hero">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Trouvez le <span>professionnel idéal</span> pour tous vos projets.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              De la plomberie au design, JobMate vous connecte instantanément avec des experts locaux vérifiés. Sûr, rapide et sans tracas.
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <Link to="/browse" className="btn-primary btn-lg glow">Démarrer maintenant</Link>
              <a href="#how-it-works" className="btn-secondary btn-lg">Voir comment ça marche</a>
            </motion.div>

            <motion.div
              className="hero-trust-badges"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <div className="badge">
                <Shield size={18} />
                <span>Sûr & Sécurisé</span>
              </div>
              <div className="badge">
                <CheckCircle size={18} />
                <span>Garanti satisfaction</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Top Providers */}
      <section className="top-providers section-padding">
        <div className="container">
          <div className="section-header centered-header">
            <h2 className="premium-title">
              <Typewriter text="Nos Experts " /><span className="premium-highlight">Recommandés</span>
            </h2>
          </div>
          <div className="providers-grid">
            {latestProviders.map((provider, index) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ServiceCard provider={provider} />
              </motion.div>
            ))}
          </div>
          
          {latestProviders.length === 0 && (
            <div className="no-providers-home glass">
              <p>Dégustez notre plateforme ! Soyez le premier à proposer vos services.</p>
              <Link to="/dashboard" className="btn-primary btn-sm">Créer une annonce</Link>
            </div>
          )}

          <div className="discover-more-wrapper">
            <Link to="/browse" className="discover-more-link">
              Découvrir plus d'experts <span className="arrow">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-us section-padding">
        <div className="container">
          <div className="section-header centered-header">
            <motion.h2
              className="premium-title"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Pourquoi <span className="premium-highlight">nous</span> choisir ?
            </motion.h2>
          </div>

          <div className="why-grid">
            <motion.div
              className="why-card glass-3d"
              whileHover={{ y: -10, scale: 1.02 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
            >
              <div className="why-icon-wrapper stylized-lucide">
                <Shield size={48} />
              </div>
              <h3>Sécurité Maximale</h3>
              <p>Vos transactions sont protégées par notre système de séquestre intelligent.</p>
            </motion.div>

            <motion.div
              className="why-card glass-3d"
              whileHover={{ y: -10, scale: 1.02 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.1 }}
            >
              <div className="why-icon-wrapper stylized-lucide">
                <Star size={48} />
              </div>
              <h3>Qualité Certifiée</h3>
              <p>Tous nos experts sont rigoureusement vérifiés et évalués par la communauté.</p>
            </motion.div>

            <motion.div
              className="why-card glass-3d"
              whileHover={{ y: -10, scale: 1.02 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.2 }}
            >
              <div className="why-icon-wrapper stylized-lucide">
                <Zap size={48} />
              </div>
              <h3>Rapidité Éclair</h3>
              <p>Trouvez le prestataire idéal et commencez votre projet en moins de 10 min.</p>
            </motion.div>

            <motion.div
              className="why-card glass-3d"
              whileHover={{ y: -10, scale: 1.02 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.3 }}
            >
              <div className="why-icon-wrapper stylized-lucide">
                <Award size={48} />
              </div>
              <h3>Support 24/7</h3>
              <p>Une équipe dédiée à votre satisfaction, disponible à tout moment.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-header centered-header">
            <motion.h2
              className="premium-title"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Comment ça <span className="premium-highlight">marche</span> ?
            </motion.h2>
          </div>

          <div className="how-steps">
            <div className="how-step-item">
              <motion.div
                className="how-illustration"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
              >
                <div className="icon-container">
                  <Search size={64} />
                  <div className="ripple"></div>
                </div>
              </motion.div>
              <motion.div
                className="how-content"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
              >
                <span className="step-tag">Step 01</span>
                <h3>Sélectionnez</h3>
                <p>Parcourez les profils et choisissez l'expert qui correspond le mieux à vos besoins parmi nos centaines de talents vérifiés.</p>
              </motion.div>
            </div>

            <div className="how-step-item reverse">
              <motion.div
                className="how-illustration"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
              >
                <div className="icon-container">
                  <Calendar size={64} />
                  <div className="ripple"></div>
                </div>
              </motion.div>
              <motion.div
                className="how-content"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
              >
                <span className="step-tag">Step 02</span>
                <h3>Réservez</h3>
                <p>Planifiez une intervention en quelques clics via notre interface simplifiée et sécurisée. Fixez vos conditions en toute liberté.</p>
              </motion.div>
            </div>

            <div className="how-step-item">
              <motion.div
                className="how-illustration"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
              >
                <div className="icon-container">
                  <CheckCircle size={64} />
                  <div className="ripple"></div>
                </div>
              </motion.div>
              <motion.div
                className="how-content"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
              >
                <span className="step-tag">Step 03</span>
                <h3>Profitez</h3>
                <p>Recevez votre service, validez la prestation et évaluez votre expert. Votre satisfaction est notre priorité absolue.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
