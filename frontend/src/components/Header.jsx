/**
 * Composant Header - Navigation principale
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Globe, Shield } from 'lucide-react';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <Link to="/" className="logo" onClick={closeMobileMenu}>
            <Globe className="logo-icon" size={32} />
            <span className="logo-text">TalentsAfricains</span>
          </Link>

          <button 
            className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
            <Link to="/discover" className="nav-link" onClick={closeMobileMenu}>
              Découvrir
            </Link>
            
            {isAuthenticated ? (
              <>
                {user?.role === 'porteur_projet' && (
                  <Link to="/add-project" className="nav-link" onClick={closeMobileMenu}>
                    Ajouter un projet
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin" className="nav-link admin-link" onClick={closeMobileMenu}>
                    <Shield size={18} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Dashboard Admin
                  </Link>
                )}
                <Link to="/profile" className="nav-link" onClick={closeMobileMenu}>
                  Mon profil
                </Link>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link" onClick={closeMobileMenu}>
                  Connexion
                </Link>
                <Link to="/register" onClick={closeMobileMenu}>
                  <button className="btn btn-primary btn-sm">
                    S'inscrire
                  </button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
