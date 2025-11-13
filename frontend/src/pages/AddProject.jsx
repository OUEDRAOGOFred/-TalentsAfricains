/**
 * Page d'ajout/modification de projet
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import projectService from '../services/projectService';
import './AddProject.css';

const AddProject = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  
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
        <h2>{t('addProject.unauthorized')}</h2>
        <p>{t('addProject.unauthorizedText')}</p>
        <button onClick={() => navigate('/discover')} className="btn btn-primary">
          {t('project.backToProjects')}
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
      setError(err.response?.data?.message || t('addProject.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-project-page">
      <div className="container">
        <div className="page-header">
          <h1>{t('addProject.title')}</h1>
          <p>{t('addProject.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="project-form">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="form-section">
            <h2 className="section-title">{t('addProject.section.general')}</h2>

            <div className="form-group">
              <label htmlFor="titre" className="form-label required">{t('addProject.form.title')}</label>
              <input
                type="text"
                id="titre"
                name="titre"
                className="form-input"
                placeholder={t('addProject.placeholder.title')}
                value={formData.titre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label required">{t('addProject.form.description')}</label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                placeholder={t('addProject.placeholder.description')}
                value={formData.description}
                onChange={handleChange}
                rows="8"
                required
              />
              <small className="form-hint">{t('addProject.hint.description')}</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="categorie" className="form-label required">{t('addProject.form.category')}</label>
                <select
                  id="categorie"
                  name="categorie"
                  className="form-select"
                  value={formData.categorie}
                  onChange={handleChange}
                  required
                >
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

              <div className="form-group">
                <label htmlFor="localisation" className="form-label">{t('addProject.form.location')}</label>
                <input
                  type="text"
                  id="localisation"
                  name="localisation"
                  className="form-input"
                  placeholder={t('addProject.placeholder.location')}
                  value={formData.localisation}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="lien_externe" className="form-label">{t('addProject.form.externalLink')}</label>
              <input
                type="url"
                id="lien_externe"
                name="lien_externe"
                className="form-input"
                placeholder={t('addProject.placeholder.externalLink')}
                value={formData.lien_externe}
                onChange={handleChange}
              />
              <small className="form-hint">{t('addProject.hint.externalLink')}</small>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">{t('addProject.section.visuals')}</h2>

            <div className="form-group">
              <label htmlFor="image_principale" className="form-label">{t('addProject.form.mainImage')}</label>
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
              <label htmlFor="galerie_images" className="form-label">{t('addProject.form.gallery')}</label>
              <input
                type="file"
                id="galerie_images"
                accept="image/*"
                multiple
                onChange={handleGalerieImages}
                className="form-file"
              />
              <small className="form-hint">{t('addProject.hint.gallery')}</small>
              {galerieImages.length > 0 && (
                <div className="file-preview">
                  ✅ {galerieImages.length} {t('addProject.imagesSelected')}
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
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? t('addProject.publishing') : t('addProject.form.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
