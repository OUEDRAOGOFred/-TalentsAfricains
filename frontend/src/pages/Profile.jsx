/**
 * Page de profil utilisateur
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import projectService from '../services/projectService';
import ProjectCard from '../components/ProjectCard';
import './Profile.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [editing, setEditing] = useState(false);
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    bio: user?.bio || '',
    competences: user?.competences || '',
    pays: user?.pays || '',
    linkedin: user?.linkedin || '',
    twitter: user?.twitter || '',
    website: user?.website || ''
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user?.role === 'porteur_projet') {
      loadMyProjects();
    }
  }, [user]);

  const loadMyProjects = async () => {
    try {
      const response = await projectService.getMyProjects();
      setMyProjects(response.data.projects);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      if (photoFile) {
        data.append('photo_profil', photoFile);
      }

      const response = await authService.updateProfile(data);
      updateUser(response.data.user);
      setSuccess('Profil mis à jour avec succès !');
      setEditing(false);
      setPhotoFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const photoUrl = user?.photo_profil 
    ? `${API_URL.replace('/api', '')}/uploads/${user.photo_profil}`
    : null;

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-layout">
          {/* Sidebar profil */}
          <aside className="profile-sidebar">
            <div className="profile-card">
              <div className="profile-photo-wrapper">
                {photoUrl ? (
                  <img src={photoUrl} alt={user?.first_name} className="profile-photo" />
                ) : (
                  <div className="profile-photo-placeholder">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </div>
                )}
                {editing && (
                  <label htmlFor="photo_profil" className="photo-upload-btn">
                    📷
                    <input
                      type="file"
                      id="photo_profil"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>

              <h2 className="profile-name">{user?.first_name} {user?.last_name}</h2>
              <p className="profile-email">{user?.email}</p>
              <span className="profile-role badge badge-primary">
                {user?.role === 'porteur_projet' ? '💼 Porteur de projet' : '👤 Visiteur'}
              </span>

              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%', marginTop: 'var(--spacing-md)' }}
                >
                  Modifier le profil
                </button>
              )}
            </div>
          </aside>

          {/* Contenu principal */}
          <main className="profile-main">
            {(error || success) && (
              <div className={`alert ${error ? 'alert-error' : 'alert-success'}`}>
                {error || success}
              </div>
            )}

            {editing ? (
              <div className="edit-section">
                <h2>Modifier le profil</h2>
                <form onSubmit={handleSubmit} className="profile-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Prénom</label>
                      <input
                        type="text"
                        name="first_name"
                        className="form-input"
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Nom</label>
                      <input
                        type="text"
                        name="last_name"
                        className="form-input"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Pays</label>
                    <input
                      type="text"
                      name="pays"
                      className="form-input"
                      placeholder="Ex: Sénégal, Ghana, etc."
                      value={formData.pays}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea
                      name="bio"
                      className="form-textarea"
                      placeholder="Parlez-nous de vous..."
                      value={formData.bio}
                      onChange={handleChange}
                      rows="4"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Compétences</label>
                    <input
                      type="text"
                      name="competences"
                      className="form-input"
                      placeholder="Ex: React, Design, Marketing"
                      value={formData.competences}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">LinkedIn</label>
                    <input
                      type="url"
                      name="linkedin"
                      className="form-input"
                      placeholder="https://linkedin.com/in/..."
                      value={formData.linkedin}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Twitter</label>
                    <input
                      type="url"
                      name="twitter"
                      className="form-input"
                      placeholder="https://twitter.com/..."
                      value={formData.twitter}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Site web</label>
                    <input
                      type="url"
                      name="website"
                      className="form-input"
                      placeholder="https://..."
                      value={formData.website}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setPhotoFile(null);
                        setError('');
                        setSuccess('');
                      }}
                      className="btn btn-outline"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <div className="info-section">
                  <h2>Informations</h2>
                  <div className="info-grid">
                    {user?.pays && (
                      <div className="info-item">
                        <strong>📍 Pays</strong>
                        <span>{user.pays}</span>
                      </div>
                    )}
                    {user?.bio && (
                      <div className="info-item">
                        <strong>✍️ Bio</strong>
                        <p>{user.bio}</p>
                      </div>
                    )}
                    {user?.competences && (
                      <div className="info-item">
                        <strong>💼 Compétences</strong>
                        <span>{user.competences}</span>
                      </div>
                    )}
                  </div>

                  {(user?.linkedin || user?.twitter || user?.website) && (
                    <div className="social-links">
                      {user.linkedin && (
                        <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="social-btn">
                          💼 LinkedIn
                        </a>
                      )}
                      {user.twitter && (
                        <a href={user.twitter} target="_blank" rel="noopener noreferrer" className="social-btn">
                          🐦 Twitter
                        </a>
                      )}
                      {user.website && (
                        <a href={user.website} target="_blank" rel="noopener noreferrer" className="social-btn">
                          🌐 Website
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {user?.role === 'porteur_projet' && (
                  <div className="projects-section">
                    <div className="section-header-row">
                      <h2>Mes projets ({myProjects.length})</h2>
                      <button
                        onClick={() => navigate('/add-project')}
                        className="btn btn-primary btn-sm"
                      >
                        + Nouveau projet
                      </button>
                    </div>

                    {myProjects.length > 0 ? (
                      <div className="projects-grid">
                        {myProjects.map(project => (
                          <ProjectCard key={project.id} project={project} />
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <p>Vous n'avez pas encore de projet publié.</p>
                        <button
                          onClick={() => navigate('/add-project')}
                          className="btn btn-primary"
                        >
                          Créer mon premier projet
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
