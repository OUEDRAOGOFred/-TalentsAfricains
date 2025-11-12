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
import './Home.css';

const Home = () => {
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
            Rayonnement <span className="highlight">Une Afrique qui se lève , crée et innove</span>
          </h1>
          <p className="hero-subtitle fade-in">
            Une plateforme dédiée aux porteurs de projets innovants, 
            aux entrepreneurs et aux créateurs du continent africain. 
            Connectez-vous avec des investisseurs et partagez votre vision.
          </p>
          <div className="hero-actions fade-in">
            <Link to="/discover">
              <button className="btn btn-primary btn-lg">
                Explorer les projets
              </button>
            </Link>
            <Link to="/register">
              <button className="btn btn-outline btn-lg">
                Créer un compte
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
              <div className="stat-label">Pays représentés</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Lightbulb size={36} strokeWidth={1.5} /></div>
              <div className="stat-number">1000+</div>
              <div className="stat-label">Projets innovants</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Users size={36} strokeWidth={1.5} /></div>
              <div className="stat-number">5000+</div>
              <div className="stat-label">Talents africains</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Briefcase size={36} strokeWidth={1.5} /></div>
              <div className="stat-number">200+</div>
              <div className="stat-label">Investisseurs actifs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Projets mis en avant */}
      <section className="section featured-projects">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Projets mis en avant</h2>
            <p className="section-subtitle">
              Découvrez les projets les plus populaires et innovants de notre communauté
            </p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Chargement des projets...</p>
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
                    Voir tous les projets →
                  </button>
                </Link>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>Aucun projet disponible pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Section Catégories */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Explorer par catégorie</h2>
            <p className="section-subtitle">
              Trouvez des projets dans votre domaine d'intérêt
            </p>
          </div>

          <div className="categories-grid">
            <Link to="/discover?categorie=technologie" className="category-card">
              <div className="category-icon"><Laptop size={32} strokeWidth={1.5} /></div>
              <h3 className="category-name">Technologie</h3>
              <p className="category-description">Innovation digitale et tech</p>
            </Link>
            <Link to="/discover?categorie=art" className="category-card">
              <div className="category-icon"><Palette size={32} strokeWidth={1.5} /></div>
              <h3 className="category-name">Art & Culture</h3>
              <p className="category-description">Créativité et expression</p>
            </Link>
            <Link to="/discover?categorie=entrepreneuriat" className="category-card">
              <div className="category-icon"><Briefcase size={32} strokeWidth={1.5} /></div>
              <h3 className="category-name">Entrepreneuriat</h3>
              <p className="category-description">Business et startups</p>
            </Link>
            <Link to="/discover?categorie=innovation" className="category-card">
              <div className="category-icon"><Lightbulb size={32} strokeWidth={1.5} /></div>
              <h3 className="category-name">Innovation</h3>
              <p className="category-description">Solutions créatives</p>
            </Link>
            <Link to="/discover?categorie=education" className="category-card">
              <div className="category-icon"><GraduationCap size={32} strokeWidth={1.5} /></div>
              <h3 className="category-name">Éducation</h3>
              <p className="category-description">Formation et apprentissage</p>
            </Link>
            <Link to="/discover?categorie=sante" className="category-card">
              <div className="category-icon"><HeartPulse size={32} strokeWidth={1.5} /></div>
              <h3 className="category-name">Santé</h3>
              <p className="category-description">Solutions de santé</p>
            </Link>
            <Link to="/discover?categorie=agriculture" className="category-card">
              <div className="category-icon"><Sprout size={32} strokeWidth={1.5} /></div>
              <h3 className="category-name">Agriculture</h3>
              <p className="category-description">AgriTech et innovations</p>
            </Link>
            <Link to="/discover?categorie=autre" className="category-card">
              <div className="category-icon"><ArrowRight size={32} strokeWidth={1.5} /></div>
              <h3 className="category-name">Autres</h3>
              <p className="category-description">Projets divers</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Prêt à partager votre projet ?</h2>
            <p className="cta-text">
              Rejoignez des milliers de talents africains qui utilisent notre plateforme 
              pour présenter leurs projets innovants et connecter avec des investisseurs.
            </p>
            <Link to="/register">
              <button className="btn btn-primary btn-lg">
                Commencer maintenant
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
