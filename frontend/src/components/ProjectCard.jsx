/**
 * Composant ProjectCard - Carte de projet
 * Affichage optimisé avec icônes Lucide React
 */

import { Link } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  Eye, 
  MapPin, 
  Globe,
  Laptop,
  Palette,
  Briefcase,
  Lightbulb,
  GraduationCap,
  HeartPulse,
  Sprout,
  MoreHorizontal,
  ArrowRight
} from 'lucide-react';
import './ProjectCard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ProjectCard = ({ project }) => {
  const imageUrl = project.image_principale 
    ? `${API_URL.replace('/api', '')}/uploads/${project.image_principale}`
    : null;

  const getCategoryIcon = (category) => {
    const icons = {
      technologie: <Laptop size={14} />,
      art: <Palette size={14} />,
      entrepreneuriat: <Briefcase size={14} />,
      innovation: <Lightbulb size={14} />,
      education: <GraduationCap size={14} />,
      sante: <HeartPulse size={14} />,
      agriculture: <Sprout size={14} />,
      autre: <MoreHorizontal size={14} />
    };
    return icons[category] || <MoreHorizontal size={14} />;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      technologie: 'Technologie',
      art: 'Art',
      entrepreneuriat: 'Entrepreneuriat',
      innovation: 'Innovation',
      education: 'Éducation',
      sante: 'Santé',
      agriculture: 'Agriculture',
      autre: 'Autre'
    };
    return labels[category] || category;
  };

  // Limiter la description à 120 caractères
  const shortDescription = project.description?.length > 120
    ? project.description.substring(0, 120) + '...'
    : project.description;

  return (
    <div className="project-card">
      <Link to={`/project/${project.id}`} className="project-card-link">
        <div className="project-card-image-wrapper">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={project.titre}
              className="project-card-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="project-card-placeholder" style={{ display: imageUrl ? 'none' : 'flex' }}>
            <Globe size={48} strokeWidth={1.5} className="placeholder-icon" />
          </div>
          <div className="project-card-overlay">
            <span className="badge badge-primary">
              {getCategoryIcon(project.categorie)}
              <span style={{ marginLeft: '6px' }}>{getCategoryLabel(project.categorie)}</span>
            </span>
          </div>
        </div>

        <div className="project-card-body">
          <h3 className="project-card-title">{project.titre}</h3>
          <p className="project-card-description">{shortDescription}</p>

          <div className="project-card-meta">
            <div className="project-author">
              {project.author_photo ? (
                <img 
                  src={`${API_URL.replace('/api', '')}/uploads/${project.author_photo}`}
                  alt={project.first_name}
                  className="author-avatar"
                  onError={(e) => e.target.style.display = 'none'}
                />
              ) : (
                <div className="author-avatar-placeholder">
                  {project.first_name?.[0]}{project.last_name?.[0]}
                </div>
              )}
              <span className="author-name">
                {project.first_name} {project.last_name}
              </span>
            </div>

            {project.localisation && (
              <div className="project-location">
                <MapPin size={15} strokeWidth={2} className="location-icon" />
                {project.localisation}
              </div>
            )}
          </div>
        </div>

        <div className="project-card-footer">
          <div className="project-stats">
            <span className="stat">
              <Heart size={16} strokeWidth={2} className="stat-icon" fill="none" />
              {project.likes_count || 0}
            </span>
            <span className="stat">
              <MessageCircle size={16} strokeWidth={2} className="stat-icon" fill="none" />
              {project.comments_count || 0}
            </span>
            <span className="stat">
              <Eye size={16} strokeWidth={2} className="stat-icon" fill="none" />
              {project.views_count || 0}
            </span>
          </div>
          <button className="btn-view-more">
            Voir plus
            <ArrowRight size={16} strokeWidth={2} style={{ marginLeft: '4px' }} />
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProjectCard;
