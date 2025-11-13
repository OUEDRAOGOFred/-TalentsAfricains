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
    'home.hero.subtitle': 'Une Afrique qui se lève, crée et innove',
    'home.hero.description': 'Une plateforme dédiée aux porteurs de projets innovants, aux entrepreneurs et aux créateurs du continent africain. Connectez-vous avec des investisseurs et partagez votre vision.',
    'home.hero.cta': 'Explorer les projets',
    'home.stats.projects': 'Projets innovants',
    'home.stats.talents': 'Talents',
    'home.stats.countries': 'Pays représentés',
    'home.stats.investors': 'Investisseurs actifs',
    'home.stats.categories': 'Catégories',
    'home.featured.title': 'Projets mis en avant',
    'home.featured.subtitle': 'Découvrez les projets les plus populaires et innovants de notre communauté',
    'home.categories.title': 'Explorer par catégorie',
    'home.categories.subtitle': 'Trouvez des projets dans votre domaine d\'intérêt',
    'home.categories.viewAll': 'Voir tous les projets →',
    'home.cta.title': 'Prêt à partager votre projet ?',
    'home.cta.text': 'Rejoignez des milliers de talents qui utilisent notre plateforme pour présenter leurs projets innovants et connecter avec des investisseurs.',
    'home.cta.button': 'Commencer maintenant',
    
    // Categories
    'category.technologie': 'Technologie',
    'category.tech.desc': 'Innovation digitale et tech',
    'category.art': 'Art & Culture',
    'category.art.desc': 'Créativité et expression',
    'category.entrepreneuriat': 'Entrepreneuriat',
    'category.innovation': 'Innovation',
    'category.education': 'Éducation',
    'category.sante': 'Santé',
    'category.agriculture': 'Agriculture',
    'category.autre': 'Autres',
    'category.others': 'Autres',
    'category.others.desc': 'Entrepreneuriat et plus',
    
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
    'discover.noResults.hint': 'Essayez de modifier vos filtres de recherche',
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
    'project.gallery': 'Galerie d\'images',
    'project.notFound': 'Projet non trouvé',
    'project.backToProjects': 'Retour aux projets',
    'project.addComment': 'Ajoutez un commentaire...',
    'project.submitComment': 'Publier le commentaire',
    'project.login': 'Connectez-vous',
    'project.loginToComment': 'pour laisser un commentaire',
    'project.noComments': 'Aucun commentaire pour le moment. Soyez le premier à commenter!',
    'project.comments.title': 'Commentaires',
    'project.comments.add': 'Ajouter un commentaire',
    'project.comments.placeholder': 'Votre commentaire...',
    'project.comments.send': 'Envoyer',
    'project.comments.login': 'Connectez-vous pour commenter',
    'project.comments.empty': 'Aucun commentaire pour le moment',
    'project.author.title': 'Porteur du projet',
    'project.author.contact': 'Contacter par email',
    
    // Authentication
    'auth.field.email': 'Email',
    'auth.field.password': 'Mot de passe',
    'auth.field.confirmPassword': 'Confirmer',
    'auth.field.firstName': 'Prénom',
    'auth.field.lastName': 'Nom',
    'auth.field.role': 'Je suis',
    'auth.field.country': 'Pays',
    'auth.field.skills': 'Compétences',
    'auth.field.bio': 'Bio',
    'auth.placeholder.email': 'votre.email@exemple.com',
    'auth.placeholder.firstName': 'Votre prénom',
    'auth.placeholder.lastName': 'Votre nom',
    'auth.placeholder.country': 'Ex: Sénégal, Ghana, etc.',
    'auth.placeholder.skills': 'Ex: Développement web, Design, Marketing',
    'auth.placeholder.bio': 'Parlez-nous de vous et de vos projets...',
    'auth.role.visitor': 'Visiteur / Investisseur',
    'auth.role.projectOwner': 'Porteur de projet',
    
    // Login
    'auth.login.welcome': 'Bienvenue !',
    'auth.login.subtitle': 'Connectez-vous pour découvrir le rayonnement',
    'auth.login.button': 'Se connecter',
    'auth.login.loading': 'Connexion...',
    'auth.login.noAccount': 'Vous n\'avez pas de compte ?',
    'auth.login.signupLink': 'S\'inscrire',
    
    // Register
    'auth.register.title': 'Créer un compte',
    'auth.register.subtitle': 'Rejoignez la communauté du rayonnement',
    'auth.register.button': 'S\'inscrire',
    'auth.register.loading': 'Inscription...',
    'auth.register.hasAccount': 'Vous avez déjà un compte ?',
    'auth.register.loginLink': 'Se connecter',
    
    // Auth Errors
    'auth.error.loginFailed': 'Une erreur est survenue lors de la connexion',
    'auth.error.registerFailed': 'Une erreur est survenue lors de l\'inscription',
    'auth.error.passwordTooShort': 'Le mot de passe doit contenir au moins 8 caractères',
    'auth.error.passwordWeak': 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
    'auth.error.passwordMismatch': 'Les mots de passe ne correspondent pas',
    
    // Auth Visual
    'auth.visual.title': 'Découvrez l\'innovation africaine',
    'auth.visual.text': 'Rejoignez une communauté dynamique de talents, porteurs de projets et investisseurs qui façonnent l\'avenir du continent.',
    'auth.visual.registerTitle': 'Partagez votre vision',
    'auth.visual.registerText': 'Créez votre profil, publiez vos projets innovants et connectez-vous avec une communauté de talents et d\'investisseurs passionnés.',
    'auth.benefit.showcase': 'Présentez vos projets',
    'auth.benefit.investors': 'Trouvez des investisseurs',
    'auth.benefit.community': 'Rejoignez une communauté',
    'auth.benefit.network': 'Développez votre réseau',
    
    // Add Project
    'addProject.title': 'Créer un nouveau projet',
    'addProject.subtitle': 'Partagez votre projet innovant avec la communauté',
    'addProject.unauthorized': 'Accès non autorisé',
    'addProject.unauthorizedText': 'Seuls les porteurs de projet peuvent ajouter des projets.',
    'addProject.error': 'Une erreur est survenue lors de la création du projet',
    'addProject.section.general': 'Informations générales',
    'addProject.section.visuals': 'Visuels',
    'addProject.form.title': 'Titre du projet',
    'addProject.form.description': 'Description',
    'addProject.form.category': 'Catégorie',
    'addProject.form.location': 'Localisation',
    'addProject.form.externalLink': 'Lien externe',
    'addProject.form.mainImage': 'Image principale',
    'addProject.form.gallery': 'Galerie d\'images',
    'addProject.form.submit': 'Publier le projet',
    'addProject.form.cancel': 'Annuler',
    'addProject.placeholder.title': 'Ex: Application mobile pour l\'agriculture',
    'addProject.placeholder.description': 'Décrivez votre projet en détail...',
    'addProject.placeholder.location': 'Ex: Dakar, Sénégal',
    'addProject.placeholder.externalLink': 'https://votre-site.com',
    'addProject.hint.description': 'Minimum 50 caractères',
    'addProject.hint.externalLink': 'Site web, prototype, démo, etc.',
    'addProject.hint.gallery': 'Maximum 5 images',
    'addProject.imagesSelected': 'image(s) sélectionnée(s)',
    'addProject.publishing': 'Publication...',
    'addProject.success': 'Projet publié avec succès !',
    
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
    'home.hero.subtitle': 'An Africa Rising, Creating and Innovating',
    'home.hero.description': 'A platform dedicated to innovative project leaders, entrepreneurs and creators from the African continent. Connect with investors and share your vision.',
    'home.hero.cta': 'Explore Projects',
    'home.stats.projects': 'Innovative Projects',
    'home.stats.talents': 'Talents',
    'home.stats.countries': 'Countries Represented',
    'home.stats.investors': 'Active Investors',
    'home.stats.categories': 'Categories',
    'home.featured.title': 'Featured Projects',
    'home.featured.subtitle': 'Discover the most popular and innovative projects from our community',
    'home.categories.title': 'Explore by Category',
    'home.categories.subtitle': 'Find projects in your area of interest',
    'home.categories.viewAll': 'View all projects →',
    'home.cta.title': 'Ready to share your project?',
    'home.cta.text': 'Join thousands of talents using our platform to showcase their innovative projects and connect with investors.',
    'home.cta.button': 'Get Started Now',
    
    // Categories
    'category.technologie': 'Technology',
    'category.tech.desc': 'Digital innovation and tech',
    'category.art': 'Art & Culture',
    'category.art.desc': 'Creativity and expression',
    'category.entrepreneuriat': 'Entrepreneurship',
    'category.innovation': 'Innovation',
    'category.education': 'Education',
    'category.sante': 'Health',
    'category.agriculture': 'Agriculture',
    'category.autre': 'Others',
    'category.others': 'Others',
    'category.others.desc': 'Entrepreneurship and more',
    
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
    'discover.noResults.hint': 'Try adjusting your search filters',
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
    'project.gallery': 'Image gallery',
    'project.notFound': 'Project not found',
    'project.backToProjects': 'Back to projects',
    'project.addComment': 'Add a comment...',
    'project.submitComment': 'Post comment',
    'project.login': 'Log in',
    'project.loginToComment': 'to leave a comment',
    'project.noComments': 'No comments yet. Be the first to comment!',
    'project.comments.title': 'Comments',
    'project.comments.add': 'Add a comment',
    'project.comments.placeholder': 'Your comment...',
    'project.comments.send': 'Send',
    'project.comments.login': 'Log in to comment',
    'project.comments.empty': 'No comments yet',
    'project.author.title': 'Project Owner',
    'project.author.contact': 'Contact by email',
    
    // Authentication
    'auth.field.email': 'Email',
    'auth.field.password': 'Password',
    'auth.field.confirmPassword': 'Confirm',
    'auth.field.firstName': 'First Name',
    'auth.field.lastName': 'Last Name',
    'auth.field.role': 'I am',
    'auth.field.country': 'Country',
    'auth.field.skills': 'Skills',
    'auth.field.bio': 'Bio',
    'auth.placeholder.email': 'your.email@example.com',
    'auth.placeholder.firstName': 'Your first name',
    'auth.placeholder.lastName': 'Your last name',
    'auth.placeholder.country': 'E.g: Senegal, Ghana, etc.',
    'auth.placeholder.skills': 'E.g: Web development, Design, Marketing',
    'auth.placeholder.bio': 'Tell us about yourself and your projects...',
    'auth.role.visitor': 'Visitor / Investor',
    'auth.role.projectOwner': 'Project Owner',
    
    // Login
    'auth.login.welcome': 'Welcome!',
    'auth.login.subtitle': 'Log in to discover excellence',
    'auth.login.button': 'Log in',
    'auth.login.loading': 'Logging in...',
    'auth.login.noAccount': 'Don\'t have an account?',
    'auth.login.signupLink': 'Sign up',
    
    // Register
    'auth.register.title': 'Create an account',
    'auth.register.subtitle': 'Join the excellence community',
    'auth.register.button': 'Sign up',
    'auth.register.loading': 'Signing up...',
    'auth.register.hasAccount': 'Already have an account?',
    'auth.register.loginLink': 'Log in',
    
    // Auth Errors
    'auth.error.loginFailed': 'An error occurred during login',
    'auth.error.registerFailed': 'An error occurred during registration',
    'auth.error.passwordTooShort': 'Password must contain at least 8 characters',
    'auth.error.passwordWeak': 'Password must contain at least one uppercase, one lowercase and one number',
    'auth.error.passwordMismatch': 'Passwords do not match',
    
    // Auth Visual
    'auth.visual.title': 'Discover African innovation',
    'auth.visual.text': 'Join a dynamic community of talents, project leaders and investors shaping the future of the continent.',
    'auth.visual.registerTitle': 'Share your vision',
    'auth.visual.registerText': 'Create your profile, publish your innovative projects and connect with a community of passionate talents and investors.',
    'auth.benefit.showcase': 'Showcase your projects',
    'auth.benefit.investors': 'Find investors',
    'auth.benefit.community': 'Join a community',
    'auth.benefit.network': 'Grow your network',
    
    // Add Project
    'addProject.title': 'Create a new project',
    'addProject.subtitle': 'Share your innovative project with the community',
    'addProject.unauthorized': 'Unauthorized access',
    'addProject.unauthorizedText': 'Only project owners can add projects.',
    'addProject.error': 'An error occurred while creating the project',
    'addProject.section.general': 'General information',
    'addProject.section.visuals': 'Visuals',
    'addProject.form.title': 'Project title',
    'addProject.form.description': 'Description',
    'addProject.form.category': 'Category',
    'addProject.form.location': 'Location',
    'addProject.form.externalLink': 'External link',
    'addProject.form.mainImage': 'Main image',
    'addProject.form.gallery': 'Image gallery',
    'addProject.form.submit': 'Publish project',
    'addProject.form.cancel': 'Cancel',
    'addProject.placeholder.title': 'E.g: Mobile app for agriculture',
    'addProject.placeholder.description': 'Describe your project in detail...',
    'addProject.placeholder.location': 'E.g: Dakar, Senegal',
    'addProject.placeholder.externalLink': 'https://your-site.com',
    'addProject.hint.description': 'Minimum 50 characters',
    'addProject.hint.externalLink': 'Website, prototype, demo, etc.',
    'addProject.hint.gallery': 'Maximum 5 images',
    'addProject.imagesSelected': 'image(s) selected',
    'addProject.publishing': 'Publishing...',
    'addProject.success': 'Project published successfully!',
    
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
