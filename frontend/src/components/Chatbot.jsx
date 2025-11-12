/**
 * Composant Chatbot - Assistant virtuel pour Rayonnement
 */

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot } from 'lucide-react';
import { api } from '../services/api';
import projectService from '../services/projectService';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour ! Je suis l'assistant virtuel de Rayonnement. Comment puis-je vous aider aujourd'hui ?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [allProjects, setAllProjects] = useState([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Charger tous les projets pour le contexte de Gemini
  useEffect(() => {
    const loadAllProjects = async () => {
      try {
        const response = await projectService.getAll({ limit: 100 }); // Charger jusqu'à 100 projets
        setAllProjects(response.projects || []);
        setProjectsLoaded(true);
      } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
        setProjectsLoaded(true); // Marquer comme chargé même en cas d'erreur
      }
    };

    loadAllProjects();
  }, []);

  // Récupérer les projets au montage du composant
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
      }
    };
    fetchProjects();
  }, []);

  const quickReplies = [
    "Comment créer un projet ?",
    "Comment trouver des investisseurs ?",
    "Comment rejoindre la communauté ?",
    "Quelles sont les catégories disponibles ?",
    "Comment contacter le support ?"
  ];

  const botResponses = {
    "comment créer un projet": "Pour créer un projet, connectez-vous à votre compte, puis cliquez sur 'Ajouter un projet'. Remplissez les informations requises : titre, description, catégorie, et ajoutez des images de votre projet.",
    
    "comment trouver des investisseurs": "Notre plateforme met en relation les porteurs de projets avec des investisseurs. Assurez-vous que votre profil et vos projets sont complets et attractifs. Utilisez la section 'Découvrir' pour voir comment d'autres projets se présentent.",
    
    "comment rejoindre la communauté": "Créez simplement un compte gratuit sur Rayonnement ! Choisissez votre rôle (visiteur, porteur de projet, investisseur) et complétez votre profil pour commencer à interagir avec la communauté.",
    
    "quelles sont les catégories disponibles": "Nous avons 7 catégories principales : Technologie, Art & Culture, Entrepreneuriat, Innovation, Éducation, Santé, et Agriculture. Chaque projet peut être classé dans l'une de ces catégories.",
    
    "comment contacter le support": "Vous pouvez nous contacter via ce chat, ou envoyer un email à support@rayonnement.com. Nous répondons généralement sous 24h.",
    
    "default": "🌟 Merci de votre intérêt pour Rayonnement ! Découvrez nos incroyables projets africains dans la section 'Découvrir', créez votre compte pour partager vos idées, ou explorez nos catégories pour trouver l'inspiration. Comment puis-je vous aider à commencer votre voyage avec nous ?"
  };

  const generateBotResponse = async (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Recherche de mots-clés dans le message pour les réponses prédéfinies
    for (const [key, response] of Object.entries(botResponses)) {
      if (key !== 'default' && message.includes(key.split(' ')[0])) {
        return response;
      }
    }
    
    // Attendre que les projets soient chargés
    if (!projectsLoaded) {
      return "Je charge les informations sur les projets... Une petite seconde !";
    }
    
    // Si aucune réponse prédéfinie, utiliser Gemini AI
    try {
      const geminiResponse = await callGeminiAPI(userMessage, allProjects);
      return geminiResponse;
    } catch (error) {
      console.error('Erreur avec Gemini:', error);
      return botResponses.default;
    }
  };

  const callGeminiAPI = async (message, projectsData) => {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return "Désolé, le service d'IA n'est pas disponible pour le moment. " + botResponses.default;
    }

    try {
      // Utiliser l'API Google AI (Gemini) avec le modèle disponible
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Tu es Rayonnement, l'assistant virtuel intelligent d'une plateforme africaine innovante dédiée à la mise en avant des talents et projets du continent africain.

## À PROPOS DE RAYONNEMENT :
Rayonnement est une plateforme web moderne qui connecte les porteurs de projets africains avec des investisseurs, mentors et la communauté internationale. Notre mission est de valoriser l'innovation africaine et de créer des opportunités pour les talents du continent.

## FONCTIONNALITÉS PRINCIPALES :
- **Découverte de projets** : Explorez des projets innovants dans toutes les catégories
- **Création de profils** : Présentez vos compétences et expériences
- **Publication de projets** : Partagez vos idées avec la communauté
- **Réseautage** : Connectez-vous avec investisseurs et mentors
- **Système d'interactions** : Likes, commentaires, partages

## CATÉGORIES DISPONIBLES :
1. **Technologie** : Innovation digitale, apps, IA, blockchain
2. **Art & Culture** : Créativité, musique, cinéma, design africain
3. **Entrepreneuriat** : Business, startups, commerce
4. **Innovation** : Solutions créatives, produits innovants
5. **Éducation** : Formation, e-learning, pédagogie
6. **Santé** : Solutions médicales, bien-être, biotech
7. **Agriculture** : AgriTech, innovations agricoles, alimentation

## TYPES D'UTILISATEURS :
- **Visiteurs** : Découvrent les projets et s'inspirent
- **Porteurs de projets** : Créent et gèrent leurs projets
- **Investisseurs** : Trouvent des opportunités d'investissement
- **Mentors** : Accompagnent les porteurs de projets

## COMMENT UTILISER LA PLATEFORME :
1. **S'inscrire** : Créez un compte gratuit
2. **Compléter son profil** : Ajoutez vos compétences et expériences
3. **Explorer** : Découvrez des projets dans la section "Découvrir"
4. **Créer** : Publiez vos propres projets innovants
5. **Interagir** : Likez, commentez, partagez les projets qui vous intéressent
6. **Réseauter** : Connectez-vous avec d'autres membres de la communauté

## OBJECTIFS DE LA PLATEFORME :
- Promouvoir l'innovation africaine à l'échelle mondiale
- Créer des opportunités d'investissement pour les projets africains
- Favoriser le networking entre talents africains
- Accompagner le développement économique du continent
- Valoriser la créativité et l'entrepreneuriat africain

## SUPPORT ET CONTACT :
- Email : support@rayonnement.com
- Réponse sous 24h en moyenne

## PROJETS DISPONIBLES SUR LA PLATEFORME :
${projectsData && projectsData.length > 0 ? projectsData.map(project => 
  `- **${project.titre}** (${project.categorie}) : ${project.description.substring(0, 150)}... 
    *Auteur: ${project.first_name} ${project.last_name}*
    *Localisation: ${project.localisation || 'Non spécifiée'}*
    *Likes: ${project.likes_count}, Commentaires: ${project.comments_count}, Vues: ${project.views_count}*
    *Créé le: ${new Date(project.created_at).toLocaleDateString('fr-FR')}*
    ${project.lien_externe ? `*Lien externe: ${project.lien_externe}*` : ''}`
).join('\n\n') : 'Aucun projet disponible pour le moment.'}

## INSTRUCTIONS SPÉCIFIQUES POUR LES PROJETS :
- **Recherche par auteur** : Si l'utilisateur mentionne un nom, recherche dans les projets de cet auteur
- **Recherche par catégorie** : Oriente vers les bonnes catégories selon les intérêts
- **Recherche par mots-clés** : Analyse les descriptions pour trouver des projets pertinents
- **Recommandations** : Suggère des projets similaires ou complémentaires
- **Détails complets** : Fournis titre, description, auteur, statistiques, date de création
- **Liens externes** : Mentionne les liens externes quand disponibles

INSTRUCTION IMPORTANTE : Tu as accès à la liste complète des projets publiés sur Rayonnement. Utilise ces informations pour :
- Répondre aux questions spécifiques sur les projets existants
- Recommander des projets pertinents selon les intérêts de l'utilisateur
- Fournir des détails complets sur les auteurs et leurs projets
- Aider les utilisateurs à découvrir des projets dans leurs domaines d'intérêt
- Comparer des projets similaires
- Expliquer les statistiques (likes, vues, commentaires)

Réponds TOUJOURS en français, de manière helpful, engageante et professionnelle. Si la question n'est pas liée à Rayonnement, redirige gentiment vers nos fonctionnalités. Utilise les informations ci-dessus pour donner des réponses précises et complètes.

Question de l'utilisateur : "${message}"`
            }]
          }]
        })
      });

      if (!response.ok) {
        // Si l'API échoue, essayer avec un modèle alternatif ou gérer l'erreur
        console.error('Erreur API Gemini:', response.status, response.statusText);
        return "Désolé, le service d'IA rencontre un problème technique. " + botResponses.default;
      }

      const data = await response.json();

      // Vérifier si la réponse contient du contenu
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error('Réponse API inattendue:', data);
        return "Désolé, je n'ai pas pu traiter votre demande. " + botResponses.default;
      }
    } catch (error) {
      console.error('Erreur lors de l\'appel à Gemini:', error);
      return "Désolé, je rencontre un problème technique. " + botResponses.default;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    // Ajouter le message utilisateur
    const userMessage = {
      id: Date.now(),
      text: currentMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Générer la réponse du bot (maintenant async)
      const botResponseText = await generateBotResponse(currentMessage);

      const botResponse = {
        id: Date.now() + 1,
        text: botResponseText,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Erreur lors de la génération de la réponse:', error);
      const errorResponse = {
        id: Date.now() + 1,
        text: "Désolé, une erreur s'est produite. " + botResponses.default,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (reply) => {
    setInputMessage(reply);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="chatbot-container">
      {/* Bouton pour ouvrir/fermer le chat */}
      <button 
        className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Ouvrir le chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Fenêtre du chat */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <Bot size={20} />
              <div>
                <h4>Assistant Rayonnement</h4>
                <span className="status">En ligne</span>
              </div>
            </div>
            <button 
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Fermer le chat"
            >
              <X size={18} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.isBot ? 'bot' : 'user'}`}
              >
                <div className="message-avatar">
                  {message.isBot ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="message-time">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message bot">
                <div className="message-avatar">
                  <Bot size={16} />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Réponses rapides */}
          {messages.length <= 1 && (
            <div className="quick-replies">
              <p>Questions fréquentes :</p>
              <div className="quick-replies-buttons">
                {quickReplies.map((reply, index) => (
                  <button 
                    key={index}
                    className="quick-reply-btn"
                    onClick={() => handleQuickReply(reply)}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="chatbot-input">
            <div className="input-container">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                rows={1}
                disabled={isTyping}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="send-btn"
                aria-label="Envoyer le message"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;