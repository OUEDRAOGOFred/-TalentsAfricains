/**
 * Page de découverte des projets avec filtres
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import projectService from '../services/projectService';
import { useLanguage } from '../context/LanguageContext';
import './Discover.css';

const Discover = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    categorie: searchParams.get('categorie') || '',
    localisation: searchParams.get('localisation') || '',
    sort: searchParams.get('sort') || 'recent'
  });
  const [pagination, setPagination] = useState({ total: 0, hasMore: false });

  useEffect(() => {
    loadProjects();
  }, [filters]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const response = await projectService.getAll({ ...filters, limit: 12, offset: 0 });
      setProjects(response.data.projects);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Mettre à jour l'URL
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach(k => {
      if (newFilters[k]) params.set(k, newFilters[k]);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ search: '', categorie: '', localisation: '', sort: 'recent' });
    setSearchParams({});
  };

  return (
    <div className="discover-page">
      <section className="discover-hero">
        <div className="container">
          <h1 className="discover-title">{t('discover.title')}</h1>
          <p className="discover-subtitle">
            {t('discover.subtitle')}
          </p>
        </div>
      </section>

      <section className="discover-content">
        <div className="container">
          {/* Barre de recherche et filtres */}
          <div className="filters-section">
            <div className="search-bar">
              <input
                type="text"
                className="search-input"
                placeholder={t('discover.search')}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
              <button className="search-btn">
                <Search size={20} />
              </button>
            </div>

            <div className="filters-grid">
              <div className="filter-group">
                <label className="filter-label">{t('discover.category')}</label>
                <select
                  className="filter-select"
                  value={filters.categorie}
                  onChange={(e) => handleFilterChange('categorie', e.target.value)}
                >
                  <option value="">{t('discover.all')}</option>
                  <option value="technologie">{t('category.tech')}</option>
                  <option value="art">{t('category.art')}</option>
                  <option value="entrepreneuriat">{t('category.entrepreneurship')}</option>
                  <option value="innovation">{t('category.innovation')}</option>
                  <option value="education">{t('category.education')}</option>
                  <option value="sante">{t('category.sante')}</option>
                  <option value="agriculture">{t('category.agriculture')}</option>
                  <option value="autre">{t('category.autre')}</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">{t('discover.location')}</label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder={t('discover.location.placeholder')}
                  value={filters.localisation}
                  onChange={(e) => handleFilterChange('localisation', e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">{t('discover.sort')}</label>
                <select
                  className="filter-select"
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                >
                  <option value="recent">{t('discover.sort.recent')}</option>
                  <option value="popular">{t('discover.sort.popular')}</option>
                  <option value="oldest">{t('discover.sort.oldest')}</option>
                </select>
              </div>

              <div className="filter-group">
                <button className="btn btn-outline btn-sm" onClick={clearFilters}>
                  {t('discover.reset')}
                </button>
              </div>
            </div>
          </div>

          {/* Résultats */}
          <div className="results-section">
            <div className="results-header">
              <p className="results-count">
                {pagination.total} {pagination.total > 1 ? t('discover.projectsFound') : t('discover.projectFound')}
              </p>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>{t('common.loading')}</p>
              </div>
            ) : projects.length > 0 ? (
              <div className="projects-grid">
                {projects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon"><Search size={48} strokeWidth={1.5} /></div>
                <h3>{t('discover.noResults')}</h3>
                <p>{t('discover.noResults.hint')}</p>
                <button className="btn btn-primary" onClick={clearFilters}>
                  {t('home.categories.viewAll')}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Discover;
