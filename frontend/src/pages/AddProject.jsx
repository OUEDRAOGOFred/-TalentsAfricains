/**
 * Page d'ajout/modification de projet
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import projectService from '../services/projectService';
import './AddProject.css';

const AddProject = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    categorie: 'technologie',
    localisation: '',
    lien_externe: ''
  });
  
  const [imagePrincipale, setImagePrincipale] = useState(null);
  const [galerieImages, setGalerieImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Vérifier que l'utilisateur est un porteur de projet
  if (user?.role !== 'porteur_projet') {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Accès non autorisé</h2>
        <p>Seuls les porteurs de projet peuvent ajouter des projets.</p>
        <button onClick={() => navigate('/discover')} className="btn btn-primary">
          Retour aux projets
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleImagePrincipale = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImagePrincipale(e.target.files[0]);
    }
  };

  const handleGalerieImages = (e) => {
    if (e.target.files) {
      setGalerieImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('titre', formData.titre);
      data.append('description', formData.description);
      data.append('categorie', formData.categorie);
      data.append('localisation', formData.localisation);
      data.append('lien_externe', formData.lien_externe);

      if (imagePrincipale) {
        data.append('image_principale', imagePrincipale);
      }

      galerieImages.forEach((image) => {
        data.append('galerie_images', image);
      });

      const response = await projectService.create(data);
      navigate(`/project/${response.data.project.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la création du projet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-project-page">
      <div className="container">
        <div className="page-header">
          <h1>Créer un nouveau projet</h1>
          <p>Partagez votre projet innovant avec la communauté</p>
        </div>

        <form onSubmit={handleSubmit} className="project-form">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="form-section">
            <h2 className="section-title">Informations générales</h2>

            <div className="form-group">
              <label htmlFor="titre" className="form-label required">Titre du projet</label>
              <input
                type="text"
                id="titre"
                name="titre"
                className="form-input"
                placeholder="Ex: Application mobile pour l'agriculture"
                value={formData.titre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label required">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                placeholder="Décrivez votre projet en détail..."
                value={formData.description}
                onChange={handleChange}
                rows="8"
                required
              />
              <small className="form-hint">Minimum 50 caractères</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="categorie" className="form-label required">Catégorie</label>
                <select
                  id="categorie"
                  name="categorie"
                  className="form-select"
                  value={formData.categorie}
                  onChange={handleChange}
                  required
                >
                  <option value="technologie">💻 Technologie</option>
                  <option value="art">🎨 Art</option>
                  <option value="entrepreneuriat">💼 Entrepreneuriat</option>
                  <option value="innovation">💡 Innovation</option>
                  <option value="education">📚 Éducation</option>
                  <option value="sante">🏥 Santé</option>
                  <option value="agriculture">🌾 Agriculture</option>
                  <option value="autre">🔹 Autre</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="localisation" className="form-label">Localisation</label>
                <input
                  type="text"
                  id="localisation"
                  name="localisation"
                  className="form-input"
                  placeholder="Ex: Dakar, Sénégal"
                  value={formData.localisation}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="lien_externe" className="form-label">Lien externe</label>
              <input
                type="url"
                id="lien_externe"
                name="lien_externe"
                className="form-input"
                placeholder="https://votre-site.com"
                value={formData.lien_externe}
                onChange={handleChange}
              />
              <small className="form-hint">Site web, prototype, démo, etc.</small>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Visuels</h2>

            <div className="form-group">
              <label htmlFor="image_principale" className="form-label">Image principale</label>
              <input
                type="file"
                id="image_principale"
                accept="image/*"
                onChange={handleImagePrincipale}
                className="form-file"
              />
              {imagePrincipale && (
                <div className="file-preview">
                  ✅ {imagePrincipale.name}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="galerie_images" className="form-label">Galerie d'images</label>
              <input
                type="file"
                id="galerie_images"
                accept="image/*"
                multiple
                onChange={handleGalerieImages}
                className="form-file"
              />
              <small className="form-hint">Maximum 5 images</small>
              {galerieImages.length > 0 && (
                <div className="file-preview">
                  ✅ {galerieImages.length} image(s) sélectionnée(s)
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-outline btn-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? 'Publication...' : 'Publier le projet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
