/**
 * Page d'inscription
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Check } from 'lucide-react';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'visiteur',
    pays: '',
    bio: '',
    competences: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validatePassword = () => {
    if (formData.password.length < 8) {
      return 'Le mot de passe doit contenir au moins 8 caractères';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      return 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Les mots de passe ne correspondent pas';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const passwordError = validatePassword();
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...dataToSend } = formData;
      await register(dataToSend);
      navigate('/discover');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box auth-box-wide">
          <div className="auth-header">
            <h1 className="auth-title">Créer un compte</h1>
            <p className="auth-subtitle">Rejoignez la communauté des talents africains</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name" className="form-label required">Prénom</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  className="form-input"
                  placeholder="Votre prénom"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="last_name" className="form-label required">Nom</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  className="form-input"
                  placeholder="Votre nom"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label required">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="votre.email@exemple.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password" className="form-label required">Mot de passe</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label required">Confirmer</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="role" className="form-label required">Je suis</label>
                <select
                  id="role"
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="visiteur">Visiteur / Investisseur</option>
                  <option value="porteur_projet">Porteur de projet</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="pays" className="form-label">Pays</label>
                <input
                  type="text"
                  id="pays"
                  name="pays"
                  className="form-input"
                  placeholder="Ex: Sénégal, Ghana, etc."
                  value={formData.pays}
                  onChange={handleChange}
                />
              </div>
            </div>

            {formData.role === 'porteur_projet' && (
              <>
                <div className="form-group">
                  <label htmlFor="competences" className="form-label">Compétences</label>
                  <input
                    type="text"
                    id="competences"
                    name="competences"
                    className="form-input"
                    placeholder="Ex: Développement web, Design, Marketing"
                    value={formData.competences}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bio" className="form-label">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    className="form-textarea"
                    placeholder="Parlez-nous de vous et de vos projets..."
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="auth-link">
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-visual">
          <div className="visual-content">
            <h2 className="visual-title">Partagez votre vision</h2>
            <p className="visual-text">
              Créez votre profil, publiez vos projets innovants et connectez-vous avec 
              une communauté de talents et d'investisseurs passionnés.
            </p>
            <ul className="visual-benefits">
              <li><Check size={20} strokeWidth={2.5} style={{ marginRight: '8px', color: '#4ade80' }} /> Présentez vos projets</li>
              <li><Check size={20} strokeWidth={2.5} style={{ marginRight: '8px', color: '#4ade80' }} /> Trouvez des investisseurs</li>
              <li><Check size={20} strokeWidth={2.5} style={{ marginRight: '8px', color: '#4ade80' }} /> Rejoignez une communauté</li>
              <li><Check size={20} strokeWidth={2.5} style={{ marginRight: '8px', color: '#4ade80' }} /> Développez votre réseau</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
