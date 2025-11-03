/**
 * Page de détails d'un projet
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  Eye, 
  MapPin,
  ExternalLink,
  Send,
  Mail,
  Linkedin,
  Twitter as TwitterIcon,
  Globe,
  User,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import projectService from '../services/projectService';
import interactionService from '../services/interactionService';
import './ProjectDetails.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const response = await projectService.getById(id);
      const projectData = response.data.project;
      console.log('Projet chargé:', projectData); // Debug: voir les données
      setProject(projectData);
      setComments(response.data.comments || []);
      setLiked(projectData.hasLiked || false);
      setLikesCount(projectData.likes_count || 0);
    } catch (error) {
      console.error('Erreur lors du chargement du projet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await interactionService.toggleLike(id);
      setLiked(response.data.liked);
      setLikesCount(response.data.likesCount);
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!newComment.trim()) return;

    try {
      const response = await interactionService.addComment(id, newComment);
      setComments(response.data.comments);
      setNewComment('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
    }
  };

  const handleContactEmail = async (e) => {
    e.preventDefault();
    const email = project.user_email || project.email;
    
    try {
      // Copier l'email dans le presse-papiers
      await navigator.clipboard.writeText(email);
      alert(`Email copié dans le presse-papiers !\n\n${email}\n\nVous pouvez maintenant coller cet email dans votre client de messagerie.`);
    } catch (error) {
      // Si la copie échoue, afficher l'email
      alert(`Email du porteur de projet :\n\n${email}\n\nVeuillez copier cet email manuellement.`);
    }
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '80vh' }}>
        <div className="spinner"></div>
        <p>Chargement du projet...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="empty-state" style={{ minHeight: '80vh' }}>
        <h2>Projet non trouvé</h2>
        <Link to="/discover">
          <button className="btn btn-primary">Retour aux projets</button>
        </Link>
      </div>
    );
  }

  const imageUrl = project.image_principale 
    ? `${API_URL.replace('/api', '')}/uploads/${project.image_principale}`
    : null;

  const galerieImages = project.galerie_images
    ? JSON.parse(project.galerie_images)
    : [];

  return (
    <div className="project-details-page">
      <div className="project-hero">
        {imageUrl && (
          <div className="project-hero-image">
            <img src={imageUrl} alt={project.titre} />
            <div className="project-hero-overlay"></div>
          </div>
        )}
      </div>

      <div className="container">
        <div className="project-content">
          <div className="project-main">
            <div className="project-header">
              <div className="project-meta-tags">
                <span className="badge badge-primary">{project.categorie}</span>
                {project.localisation && (
                  <span className="location-badge">
                    <MapPin size={16} /> {project.localisation}
                  </span>
                )}
              </div>

              <h1 className="project-title">{project.titre}</h1>

              <div className="project-stats-bar">
                <button 
                  className={`like-btn ${liked ? 'liked' : ''}`}
                  onClick={handleLike}
                >
                  <Heart size={18} className="like-icon" fill={liked ? 'currentColor' : 'none'} />
                  <span className="like-count">{likesCount}</span>
                </button>
                <span className="stat">
                  <MessageCircle size={18} /> {comments.length} commentaires
                </span>
                <span className="stat">
                  <Eye size={18} /> {project.views_count || 0} vues
                </span>
              </div>
            </div>

            <div className="project-description">
              <h2>Description du projet</h2>
              <p>{project.description}</p>
            </div>

            {project.lien_externe && (
              <div className="project-link">
                <h3>Lien externe</h3>
                <a href={project.lien_externe} target="_blank" rel="noopener noreferrer" className="external-link">
                  <ExternalLink size={18} /> {project.lien_externe}
                </a>
              </div>
            )}

            {galerieImages.length > 0 && (
              <div className="project-gallery">
                <h3>Galerie d'images</h3>
                <div className="gallery-grid">
                  {galerieImages.map((img, index) => (
                    <img
                      key={index}
                      src={`${API_URL.replace('/api', '')}/uploads/${img}`}
                      alt={`${project.titre} ${index + 1}`}
                      className="gallery-image"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Section commentaires */}
            <div className="comments-section">
              <h2>
                <MessageCircle size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Commentaires ({comments.length})
              </h2>

              {isAuthenticated && (
                <form onSubmit={handleCommentSubmit} className="comment-form">
                  <textarea
                    className="comment-input"
                    placeholder="Ajoutez un commentaire..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows="3"
                    required
                  />
                  <button type="submit" className="btn btn-primary">
                    <Send size={18} style={{ marginRight: '6px' }} />
                    Publier le commentaire
                  </button>
                </form>
              )}

              {!isAuthenticated && (
                <div className="login-prompt" style={{ 
                  padding: '1rem', 
                  background: '#f0f7ff', 
                  borderRadius: '8px', 
                  textAlign: 'center',
                  marginBottom: '1rem'
                }}>
                  <p style={{ margin: 0, color: '#666' }}>
                    <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                      Connectez-vous
                    </Link> pour laisser un commentaire
                  </p>
                </div>
              )}

              <div className="comments-list">
                {comments.length === 0 ? (
                  <div className="no-comments" style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: '#999',
                    fontStyle: 'italic'
                  }}>
                    Aucun commentaire pour le moment. Soyez le premier à commenter!
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-avatar">
                        {comment.photo_profil ? (
                          <img src={`${API_URL.replace('/api', '')}/uploads/${comment.photo_profil}`} alt={comment.first_name} />
                        ) : (
                          <div className="avatar-placeholder">
                            {comment.first_name?.[0]}{comment.last_name?.[0]}
                          </div>
                        )}
                      </div>
                      <div className="comment-content">
                        <div className="comment-header">
                          <strong>{comment.first_name} {comment.last_name}</strong>
                          <span className="comment-date">
                            {new Date(comment.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="comment-text">{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar auteur */}
          <aside className="project-sidebar">
            <div className="author-card">
              <h3>Porteur du projet</h3>
              <div className="author-info">
                {project.author_photo ? (
                  <img
                    src={`${API_URL.replace('/api', '')}/uploads/${project.author_photo}`}
                    alt={project.first_name}
                    className="author-photo"
                  />
                ) : (
                  <div className="author-photo-placeholder">
                    {project.first_name?.[0]}{project.last_name?.[0]}
                  </div>
                )}
                <h4>{project.first_name} {project.last_name}</h4>
                {project.bio && <p className="author-bio">{project.bio}</p>}
              </div>

              {/* Bouton de contact par email */}
              {(project.user_email || project.email) && (
                <button 
                  onClick={handleContactEmail}
                  className="btn btn-primary btn-contact"
                  style={{ width: '100%', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Mail size={18} />
                  Contacter par email
                </button>
              )}

              {(project.linkedin || project.twitter || project.website) && (
                <div className="author-social">
                  {project.linkedin && (
                    <a href={project.linkedin} target="_blank" rel="noopener noreferrer" className="social-btn">
                      <Linkedin size={18} /> LinkedIn
                    </a>
                  )}
                  {project.twitter && (
                    <a href={project.twitter} target="_blank" rel="noopener noreferrer" className="social-btn">
                      <TwitterIcon size={18} /> Twitter
                    </a>
                  )}
                  {project.website && (
                    <a href={project.website} target="_blank" rel="noopener noreferrer" className="social-btn">
                      <Globe size={18} /> Website
                    </a>
                  )}
                </div>
              )}

              <Link to={`/discover`}>
                <button className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                  Voir plus de projets
                </button>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;