/**
 * Page d'accueil
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, 
  Lightbulb, 
  Users, 
  Briefcase,
  Laptop,
  Palette,
  GraduationCap,
  HeartPulse,
  Sprout,
  ArrowRight
} from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import projectService from '../services/projectService';
import { useLanguage } from '../context/LanguageContext';
import './Home.css';

const Home = () => {
  const { t } = useLanguage();
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProjects();
  }, []);

  const loadFeaturedProjects = async () => {
    try {
      const response = await projectService.getAll({ limit: 6, sort: 'popular' });
      setFeaturedProjects(response.data.projects);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Section Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title fade-in">
            {t('home.hero.title')} <span className="highlight">{t('home.hero.subtitle')}</span>
          </h1>
          <p className="hero-subtitle fade-in">
            {t('home.hero.description')}
          </p>
          <div className="hero-actions fade-in">
            <Link to="/discover">
              <button className="btn btn-primary btn-lg">
                {t('home.hero.cta')}
              </button>
            </Link>
            <Link to="/register">
              <button className="btn btn-outline btn-lg">
                {t('nav.register')}
              </button>
            </Link>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="decoration-circle decoration-1"></div>
          <div className="decoration-circle decoration-2"></div>
          <div className="decoration-circle decoration-3"></div>
        </div>
      </section>

      {/* Section Statistiques */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon"><Globe size={36} strokeWidth={1.5} /></div>
              <div className="stat-number">50+</div>
              <div className="stat-label">{t('home.stats.countries')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Lightbulb size={36} strokeWidth={1.5} /></div>
              <div className="stat-number">1000+</div>
              <div className="stat-label">{t('home.stats.projects')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Users size={36} strokeWidth={1.5} /></div>
              <div className="stat-number">5000+</div>
              <div className="stat-label">{t('home.stats.talents')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Briefcase size={36} strokeWidth={1.5} /></div>
              <div className="stat-number">200+</div>
              <div className="stat-label">{t('home.stats.investors')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Projets mis en avant */}
      <section className="section featured-projects">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('home.featured.title')}</h2>
            <p className="section-subtitle">
              {t('home.featured.subtitle')}
            </p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>{t('common.loading')}</p>
            </div>
          ) : featuredProjects.length > 0 ? (
            <>
              <div className="projects-grid">
                {featuredProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
              <div className="section-footer">
                <Link to="/discover">
                  <button className="btn btn-primary">
                    {t('home.categories.viewAll')}
                  </button>
                </Link>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>{t('discover.noResults')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Section Catégories */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('home.categories.title')}</h2>
            <p className="section-subtitle">
              {t('home.categories.subtitle')}
            </p>
          </div>

          <div className="categories-grid">
            <Link to="/discover?categorie=technologie" className="category-card">
              <div className="category-icon"><Laptop size={32} strokeWidth={1.5} /></div>
              <h3 className="category-name">{t('category.technologie')}</h3>
              <p className="category-description">{t('category.tech.desc')}</p>
            </Link>
            <Link to="/discover?categorie=art" className="category-card">
              <div className="category-icon"><Palette size={32} strokeWidth={1.5} /></div>
              <h3 className="category-name">{t('category.art')}</h3>
              <p className="category-description">{t('category.art.desc')}</p>
            </Link>
            <Link to="/discover" className="category-card">
              <div className="category-icon"><ArrowRight size={32} strokeWidth={1.5} /></div>
              <h3 className="category-name">{t('category.others')}</h3>
              <p className="category-description">{t('category.others.desc')}</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">{t('home.cta.title')}</h2>
            <p className="cta-text">
              {t('home.cta.text')}
            </p>
            <Link to="/register">
              <button className="btn btn-primary btn-lg">
                {t('home.cta.button')}
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
