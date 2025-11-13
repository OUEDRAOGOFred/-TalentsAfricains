/**
 * Page de connexion
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Lightbulb, Rocket } from 'lucide-react';
import './Auth.css';

const Login = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      navigate('/discover');
    } catch (err) {
      setError(err.response?.data?.message || t('auth.error.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-header">
            <h1 className="auth-title">{t('auth.login.welcome')}</h1>
            <p className="auth-subtitle">{t('auth.login.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

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

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? t('auth.login.loading') : t('auth.login.button')}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              {t('auth.login.noAccount')}{' '}
              <Link to="/register" className="auth-link">
                {t('auth.login.signupLink')}
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-visual">
          <div className="visual-content">
            <h2 className="visual-title">{t('auth.visual.title')}</h2>
            <p className="visual-text">
              {t('auth.visual.text')}
            </p>
            <div className="visual-decoration">
              <span className="decoration-emoji"><Globe size={40} strokeWidth={1.5} /></span>
              <span className="decoration-emoji"><Lightbulb size={40} strokeWidth={1.5} /></span>
              <span className="decoration-emoji"><Rocket size={40} strokeWidth={1.5} /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
