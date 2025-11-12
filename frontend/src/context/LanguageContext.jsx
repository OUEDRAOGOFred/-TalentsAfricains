/**
 * Context de langue pour la traduction de l'application
 */

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Récupérer la langue sauvegardée ou utiliser français par défaut
    return localStorage.getItem('language') || 'fr';
  });

  useEffect(() => {
    // Sauvegarder la langue choisie
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Toutes les traductions de l'application
const translations = {
  fr: {
    // Header
    'nav.home': 'Accueil',
    'nav.discover': 'Découvrir',
    'nav.addProject': 'Ajouter un projet',
    'nav.profile': 'Profil',
    'nav.login': 'Connexion',
    'nav.register': 'Inscription',
    'nav.logout': 'Déconnexion',
    'nav.admin': 'Admin',
    
    // Home
    'home.hero.title': 'Rayonnement',
    'home.hero.subtitle': 'Plateforme de mise en avant des talents africains',
    'home.hero.description': 'Découvrez des projets innovants, connectez-vous avec des talents et des investisseurs à travers toute l\'Afrique',
    'home.hero.cta': 'Découvrir les projets',
    'home.stats.projects': 'Projets',
    'home.stats.talents': 'Talents',
    'home.stats.categories': 'Catégories',
    'home.categories.title': 'Catégories Principales',
    'home.categories.subtitle': 'Explorez les projets par domaine',
    'home.categories.viewAll': 'Voir tous les projets',
    
    // Categories
    'category.technologie': 'Technologie',
    'category.art': 'Art & Culture',
    'category.entrepreneuriat': 'Entrepreneuriat',
    'category.innovation': 'Innovation',
    'category.education': 'Éducation',
    'category.sante': 'Santé',
    'category.agriculture': 'Agriculture',
    'category.autre': 'Autres',
    'category.others': 'Autres Catégories',
    'category.others.desc': 'Entrepreneuriat, Innovation, Éducation, Santé, Agriculture et plus',
    
    // Discover
    'discover.title': 'Découvrir les Projets',
    'discover.subtitle': 'Explorez les talents et innovations d\'Afrique',
    'discover.search': 'Rechercher un projet...',
    'discover.filters': 'Filtres',
    'discover.category': 'Catégorie',
    'discover.all': 'Toutes',
    'discover.location': 'Localisation',
    'discover.sort': 'Trier par',
    'discover.sort.recent': 'Plus récents',
    'discover.sort.popular': 'Plus populaires',
    'discover.sort.oldest': 'Plus anciens',
    'discover.noResults': 'Aucun projet trouvé',
    'discover.loading': 'Chargement...',
    
    // Project Card
    'project.by': 'Par',
    'project.likes': 'J\'aime',
    'project.views': 'Vues',
    'project.comments': 'Commentaires',
    'project.viewDetails': 'Voir les détails',
    
    // Project Details
    'project.description': 'Description',
    'project.author': 'Auteur',
    'project.location': 'Localisation',
    'project.externalLink': 'Lien externe',
    'project.visit': 'Visiter',
    'project.like': 'J\'aime',
    'project.share': 'Partager',
    'project.comments.title': 'Commentaires',
    'project.comments.add': 'Ajouter un commentaire',
    'project.comments.placeholder': 'Votre commentaire...',
    'project.comments.send': 'Envoyer',
    'project.comments.login': 'Connectez-vous pour commenter',
    'project.comments.empty': 'Aucun commentaire pour le moment',
    
    // Add Project
    'addProject.title': 'Ajouter un Projet',
    'addProject.subtitle': 'Partagez votre projet avec la communauté',
    'addProject.form.title': 'Titre du projet',
    'addProject.form.description': 'Description',
    'addProject.form.category': 'Catégorie',
    'addProject.form.location': 'Localisation',
    'addProject.form.externalLink': 'Lien externe (optionnel)',
    'addProject.form.mainImage': 'Image principale',
    'addProject.form.submit': 'Publier le projet',
    'addProject.form.cancel': 'Annuler',
    'addProject.success': 'Projet publié avec succès !',
    'addProject.error': 'Erreur lors de la publication',
    
    // Profile
    'profile.title': 'Mon Profil',
    'profile.edit': 'Modifier',
    'profile.save': 'Enregistrer',
    'profile.cancel': 'Annuler',
    'profile.firstName': 'Prénom',
    'profile.lastName': 'Nom',
    'profile.email': 'Email',
    'profile.bio': 'Bio',
    'profile.skills': 'Compétences',
    'profile.country': 'Pays',
    'profile.linkedin': 'LinkedIn',
    'profile.twitter': 'Twitter',
    'profile.website': 'Site web',
    'profile.myProjects': 'Mes Projets',
    'profile.noProjects': 'Aucun projet pour le moment',
    'profile.addProject': 'Ajouter un projet',
    
    // Auth
    'auth.login': 'Connexion',
    'auth.register': 'Inscription',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.confirmPassword': 'Confirmer le mot de passe',
    'auth.firstName': 'Prénom',
    'auth.lastName': 'Nom',
    'auth.submit': 'Se connecter',
    'auth.submitRegister': 'S\'inscrire',
    'auth.noAccount': 'Pas encore de compte ?',
    'auth.hasAccount': 'Déjà un compte ?',
    'auth.forgotPassword': 'Mot de passe oublié ?',
    
    // Footer
    'footer.about': 'À propos',
    'footer.about.text': 'Rayonnement est une plateforme dédiée à la mise en avant des talents et projets africains innovants.',
    'footer.quickLinks': 'Liens rapides',
    'footer.contact': 'Contact',
    'footer.rights': 'Tous droits réservés',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.view': 'Voir',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.discover': 'Discover',
    'nav.addProject': 'Add Project',
    'nav.profile': 'Profile',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'nav.admin': 'Admin',
    
    // Home
    'home.hero.title': 'Rayonnement',
    'home.hero.subtitle': 'Showcasing African Talents Platform',
    'home.hero.description': 'Discover innovative projects, connect with talents and investors across Africa',
    'home.hero.cta': 'Discover Projects',
    'home.stats.projects': 'Projects',
    'home.stats.talents': 'Talents',
    'home.stats.categories': 'Categories',
    'home.categories.title': 'Main Categories',
    'home.categories.subtitle': 'Explore projects by domain',
    'home.categories.viewAll': 'View all projects',
    
    // Categories
    'category.technologie': 'Technology',
    'category.art': 'Art & Culture',
    'category.entrepreneuriat': 'Entrepreneurship',
    'category.innovation': 'Innovation',
    'category.education': 'Education',
    'category.sante': 'Health',
    'category.agriculture': 'Agriculture',
    'category.autre': 'Others',
    'category.others': 'Other Categories',
    'category.others.desc': 'Entrepreneurship, Innovation, Education, Health, Agriculture and more',
    
    // Discover
    'discover.title': 'Discover Projects',
    'discover.subtitle': 'Explore talents and innovations from Africa',
    'discover.search': 'Search for a project...',
    'discover.filters': 'Filters',
    'discover.category': 'Category',
    'discover.all': 'All',
    'discover.location': 'Location',
    'discover.sort': 'Sort by',
    'discover.sort.recent': 'Most recent',
    'discover.sort.popular': 'Most popular',
    'discover.sort.oldest': 'Oldest',
    'discover.noResults': 'No projects found',
    'discover.loading': 'Loading...',
    
    // Project Card
    'project.by': 'By',
    'project.likes': 'Likes',
    'project.views': 'Views',
    'project.comments': 'Comments',
    'project.viewDetails': 'View details',
    
    // Project Details
    'project.description': 'Description',
    'project.author': 'Author',
    'project.location': 'Location',
    'project.externalLink': 'External link',
    'project.visit': 'Visit',
    'project.like': 'Like',
    'project.share': 'Share',
    'project.comments.title': 'Comments',
    'project.comments.add': 'Add a comment',
    'project.comments.placeholder': 'Your comment...',
    'project.comments.send': 'Send',
    'project.comments.login': 'Login to comment',
    'project.comments.empty': 'No comments yet',
    
    // Add Project
    'addProject.title': 'Add a Project',
    'addProject.subtitle': 'Share your project with the community',
    'addProject.form.title': 'Project title',
    'addProject.form.description': 'Description',
    'addProject.form.category': 'Category',
    'addProject.form.location': 'Location',
    'addProject.form.externalLink': 'External link (optional)',
    'addProject.form.mainImage': 'Main image',
    'addProject.form.submit': 'Publish project',
    'addProject.form.cancel': 'Cancel',
    'addProject.success': 'Project published successfully!',
    'addProject.error': 'Error publishing project',
    
    // Profile
    'profile.title': 'My Profile',
    'profile.edit': 'Edit',
    'profile.save': 'Save',
    'profile.cancel': 'Cancel',
    'profile.firstName': 'First name',
    'profile.lastName': 'Last name',
    'profile.email': 'Email',
    'profile.bio': 'Bio',
    'profile.skills': 'Skills',
    'profile.country': 'Country',
    'profile.linkedin': 'LinkedIn',
    'profile.twitter': 'Twitter',
    'profile.website': 'Website',
    'profile.myProjects': 'My Projects',
    'profile.noProjects': 'No projects yet',
    'profile.addProject': 'Add a project',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm password',
    'auth.firstName': 'First name',
    'auth.lastName': 'Last name',
    'auth.submit': 'Login',
    'auth.submitRegister': 'Register',
    'auth.noAccount': 'Don\'t have an account?',
    'auth.hasAccount': 'Already have an account?',
    'auth.forgotPassword': 'Forgot password?',
    
    // Footer
    'footer.about': 'About',
    'footer.about.text': 'Rayonnement is a platform dedicated to showcasing innovative African talents and projects.',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.rights': 'All rights reserved',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
  }
};
