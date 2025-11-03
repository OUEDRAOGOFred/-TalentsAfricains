/**
 * Page de découverte des projets avec filtres
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import projectService from '../services/projectService';
import './Discover.css';

const Discover = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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
          <h1 className="discover-title">Découvrez les Talents</h1>
          <p className="discover-subtitle">
            Explorez des projets innovants de toute l'Afrique
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
                placeholder="Rechercher un projet..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
              <button className="search-btn">
                🔍
              </button>
            </div>

            <div className="filters-grid">
              <div className="filter-group">
                <label className="filter-label">Catégorie</label>
                <select
                  className="filter-select"
                  value={filters.categorie}
                  onChange={(e) => handleFilterChange('categorie', e.target.value)}
                >
                  <option value="">Toutes les catégories</option>
                  <option value="technologie">Technologie</option>
                  <option value="art">Art</option>
                  <option value="entrepreneuriat">Entrepreneuriat</option>
                  <option value="innovation">Innovation</option>
                  <option value="education">Éducation</option>
                  <option value="sante">Santé</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Localisation</label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="Pays ou ville..."
                  value={filters.localisation}
                  onChange={(e) => handleFilterChange('localisation', e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">Trier par</label>
                <select
                  className="filter-select"
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                >
                  <option value="recent">Plus récents</option>
                  <option value="popular">Plus populaires</option>
                  <option value="oldest">Plus anciens</option>
                </select>
              </div>

              <div className="filter-group">
                <button className="btn btn-outline btn-sm" onClick={clearFilters}>
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>

          {/* Résultats */}
          <div className="results-section">
            <div className="results-header">
              <p className="results-count">
                {pagination.total} projet{pagination.total > 1 ? 's' : ''} trouvé{pagination.total > 1 ? 's' : ''}
              </p>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Chargement des projets...</p>
              </div>
            ) : projects.length > 0 ? (
              <div className="projects-grid">
                {projects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>Aucun projet trouvé</h3>
                <p>Essayez de modifier vos filtres de recherche</p>
                <button className="btn btn-primary" onClick={clearFilters}>
                  Voir tous les projets
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
