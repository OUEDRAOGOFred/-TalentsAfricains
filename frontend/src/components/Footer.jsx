/**
 * Composant Footer
 */

import { Link } from 'react-router-dom';
import { Globe, Twitter, Linkedin, Instagram, Facebook, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <Globe size={24} className="logo-icon" />
              <span className="logo-text">Rayonnement</span>
            </div>
            <p className="footer-description">
              Plateforme dédiée à la mise en avant des talents et projets innovants africains. 
              Connectons les porteurs de projets avec les investisseurs et le grand public.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/discover">Découvrir</Link></li>
              <li><Link to="/register">S'inscrire</Link></li>
              <li><Link to="/login">Connexion</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Catégories</h4>
            <ul className="footer-links">
              <li><Link to="/discover?categorie=technologie">Technologie</Link></li>
              <li><Link to="/discover?categorie=art">Art</Link></li>
              <li><Link to="/discover?categorie=entrepreneuriat">Entrepreneuriat</Link></li>
              <li><Link to="/discover?categorie=innovation">Innovation</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">À propos</h4>
            <p className="footer-text">
              Rayonnement est une plateforme qui célèbre l'innovation, 
              la créativité et l'entrepreneuriat en Afrique.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="#" className="social-link" aria-label="LinkedIn"><Linkedin size={20} /></a>
              <a href="#" className="social-link" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" className="social-link" aria-label="Facebook"><Facebook size={20} /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Rayonnement. Tous droits réservés.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
            Fait avec <Heart size={16} fill="currentColor" /> pour l'Afrique
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
