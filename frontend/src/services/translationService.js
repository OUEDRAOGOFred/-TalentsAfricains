/**
 * Service de traduction automatique avec Google Translate API
 */

const GOOGLE_TRANSLATE_API = 'https://translation.googleapis.com/language/translate/v2';
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Cache pour éviter de traduire plusieurs fois le même texte
const translationCache = new Map();

/**
 * Traduit un texte du français vers l'anglais
 * @param {string} text - Texte à traduire
 * @returns {Promise<string>} - Texte traduit
 */
export const translateText = async (text) => {
  if (!text || typeof text !== 'string') return text;
  
  // Vérifier le cache
  const cacheKey = `fr-en:${text}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    const response = await fetch(`${GOOGLE_TRANSLATE_API}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: 'fr',
        target: 'en',
        format: 'text'
      })
    });

    if (!response.ok) {
      console.error('Translation API error:', response.status);
      return text; // Retourner le texte original en cas d'erreur
    }

    const data = await response.json();
    const translated = data.data.translations[0].translatedText;
    
    // Mettre en cache
    translationCache.set(cacheKey, translated);
    
    return translated;
  } catch (error) {
    console.error('Error translating text:', error);
    return text; // Retourner le texte original en cas d'erreur
  }
};

/**
 * Traduit un objet projet complet
 * @param {Object} project - Projet à traduire
 * @returns {Promise<Object>} - Projet traduit
 */
export const translateProject = async (project) => {
  if (!project) return project;

  try {
    const [title, description, location] = await Promise.all([
      translateText(project.title),
      translateText(project.description),
      translateText(project.location)
    ]);

    return {
      ...project,
      title,
      description,
      location
    };
  } catch (error) {
    console.error('Error translating project:', error);
    return project;
  }
};

/**
 * Traduit un tableau de projets
 * @param {Array} projects - Tableau de projets
 * @returns {Promise<Array>} - Tableau de projets traduits
 */
export const translateProjects = async (projects) => {
  if (!Array.isArray(projects)) return projects;

  try {
    return await Promise.all(projects.map(project => translateProject(project)));
  } catch (error) {
    console.error('Error translating projects:', error);
    return projects;
  }
};

/**
 * Traduit un commentaire
 * @param {Object} comment - Commentaire à traduire
 * @returns {Promise<Object>} - Commentaire traduit
 */
export const translateComment = async (comment) => {
  if (!comment) return comment;

  try {
    const content = await translateText(comment.content);
    
    return {
      ...comment,
      content
    };
  } catch (error) {
    console.error('Error translating comment:', error);
    return comment;
  }
};

/**
 * Traduit un tableau de commentaires
 * @param {Array} comments - Tableau de commentaires
 * @returns {Promise<Array>} - Tableau de commentaires traduits
 */
export const translateComments = async (comments) => {
  if (!Array.isArray(comments)) return comments;

  try {
    return await Promise.all(comments.map(comment => translateComment(comment)));
  } catch (error) {
    console.error('Error translating comments:', error);
    return comments;
  }
};

/**
 * Traduit les informations d'un utilisateur
 * @param {Object} user - Utilisateur à traduire
 * @returns {Promise<Object>} - Utilisateur traduit
 */
export const translateUser = async (user) => {
  if (!user) return user;

  try {
    const translatedFields = {};
    
    if (user.bio) {
      translatedFields.bio = await translateText(user.bio);
    }
    
    if (user.skills) {
      translatedFields.skills = await translateText(user.skills);
    }

    return {
      ...user,
      ...translatedFields
    };
  } catch (error) {
    console.error('Error translating user:', error);
    return user;
  }
};

/**
 * Vide le cache de traduction (utile pour libérer la mémoire)
 */
export const clearTranslationCache = () => {
  translationCache.clear();
};
