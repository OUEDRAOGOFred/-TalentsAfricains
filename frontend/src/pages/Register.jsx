/**
 * Page d'inscription
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Check } from 'lucide-react';
import './Auth.css';

const Register = () => {
  const { t } = useLanguage();
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
      return t('auth.error.passwordTooShort');
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      return t('auth.error.passwordWeak');
    }
    if (formData.password !== formData.confirmPassword) {
      return t('auth.error.passwordMismatch');
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
      setError(err.response?.data?.message || t('auth.error.registerFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box auth-box-wide">
          <div className="auth-header">
            <h1 className="auth-title">{t('auth.register.title')}</h1>
            <p className="auth-subtitle">{t('auth.register.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name" className="form-label required">{t('auth.field.firstName')}</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  className="form-input"
                  placeholder={t('auth.placeholder.firstName')}
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="last_name" className="form-label required">{t('auth.field.lastName')}</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  className="form-input"
                  placeholder={t('auth.placeholder.lastName')}
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label required">{t('auth.field.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder={t('auth.placeholder.email')}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password" className="form-label required">{t('auth.field.password')}</label>
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
                <label htmlFor="confirmPassword" className="form-label required">{t('auth.field.confirmPassword')}</label>
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
                <label htmlFor="role" className="form-label required">{t('auth.field.role')}</label>
                <select
                  id="role"
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="visiteur">{t('auth.role.visitor')}</option>
                  <option value="porteur_projet">{t('auth.role.projectOwner')}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="pays" className="form-label">{t('auth.field.country')}</label>
                <input
                  type="text"
                  id="pays"
                  name="pays"
                  className="form-input"
                  placeholder={t('auth.placeholder.country')}
                  value={formData.pays}
                  onChange={handleChange}
                />
              </div>
            </div>

            {formData.role === 'porteur_projet' && (
              <>
                <div className="form-group">
                  <label htmlFor="competences" className="form-label">{t('auth.field.skills')}</label>
                  <input
                    type="text"
                    id="competences"
                    name="competences"
                    className="form-input"
                    placeholder={t('auth.placeholder.skills')}
                    value={formData.competences}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bio" className="form-label">{t('auth.field.bio')}</label>
                  <textarea
                    id="bio"
                    name="bio"
                    className="form-textarea"
                    placeholder={t('auth.placeholder.bio')}
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
              {loading ? t('auth.register.loading') : t('auth.register.button')}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              {t('auth.register.hasAccount')}{' '}
              <Link to="/login" className="auth-link">
                {t('auth.register.loginLink')}
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-visual">
          <div className="visual-content">
            <h2 className="visual-title">{t('auth.visual.registerTitle')}</h2>
            <p className="visual-text">
              {t('auth.visual.registerText')}
            </p>
            <ul className="visual-benefits">
              <li><Check size={20} strokeWidth={2.5} style={{ marginRight: '8px', color: '#4ade80' }} /> {t('auth.benefit.showcase')}</li>
              <li><Check size={20} strokeWidth={2.5} style={{ marginRight: '8px', color: '#4ade80' }} /> {t('auth.benefit.investors')}</li>
              <li><Check size={20} strokeWidth={2.5} style={{ marginRight: '8px', color: '#4ade80' }} /> {t('auth.benefit.community')}</li>
              <li><Check size={20} strokeWidth={2.5} style={{ marginRight: '8px', color: '#4ade80' }} /> {t('auth.benefit.network')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
