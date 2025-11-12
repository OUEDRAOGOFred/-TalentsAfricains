/**
 * Composant Chatbot - Assistant virtuel pour Rayonnement
 */

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot } from 'lucide-react';
import { api } from '../services/api';
import projectService from '../services/projectService';
import authService from '../services/authService';
import { buildGeminiContext } from '../utils/geminiContext';
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
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [platformStats, setPlatformStats] = useState({});
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

  // Charger les données complètes de la plateforme
  useEffect(() => {
    const loadPlatformData = async () => {
      try {
        // Charger tous les projets
        const projectsResponse = await projectService.getAll({ limit: 100 });
        console.log('Response complète:', projectsResponse); // Debug
        const projects = projectsResponse.data?.projects || projectsResponse.projects || [];
        console.log('Projets chargés:', projects.length); // Debug
        setAllProjects(projects);
        
        // Obtenir l'utilisateur connecté
        const user = authService.getCurrentUser();
        setCurrentUser(user);
        
        // Calculer les statistiques de la plateforme
        const stats = {
          totalProjects: projects.length,
          totalLikes: projects.reduce((sum, p) => sum + (p.likes_count || 0), 0),
          totalViews: projects.reduce((sum, p) => sum + (p.views_count || 0), 0),
          totalComments: projects.reduce((sum, p) => sum + (p.comments_count || 0), 0),
          categoriesCount: {
            technologie: projects.filter(p => p.categorie === 'technologie').length,
            art: projects.filter(p => p.categorie === 'art').length,
            entrepreneuriat: projects.filter(p => p.categorie === 'entrepreneuriat').length,
            innovation: projects.filter(p => p.categorie === 'innovation').length,
            education: projects.filter(p => p.categorie === 'education').length,
            sante: projects.filter(p => p.categorie === 'sante').length,
            agriculture: projects.filter(p => p.categorie === 'agriculture').length
          },
          topProjects: projects
            .sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0))
            .slice(0, 5),
          recentProjects: projects
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5),
          uniqueAuthors: [...new Set(projects.map(p => `${p.first_name} ${p.last_name}`))].length
        };
        
        console.log('Statistiques calculées:', stats); // Debug
        setPlatformStats(stats);
        setProjectsLoaded(true);
        
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setProjectsLoaded(true);
      }
    };

    loadPlatformData();
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
      const platformData = {
        projects: allProjects,
        stats: platformStats,
        user: currentUser
      };
      const geminiResponse = await callGeminiAPI(userMessage, platformData);
      return geminiResponse;
    } catch (error) {
      console.error('Erreur avec Gemini:', error);
      return botResponses.default;
    }
  };

  const callGeminiAPI = async (message, platformData) => {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return "Désolé, le service d'IA n'est pas disponible pour le moment. " + botResponses.default;
    }

    try {
      // Préparer les données complètes de la plateforme
      const { projects, stats, user } = platformData;
      
      // Construire le contexte avec la fonction helper
      const contextText = buildGeminiContext(platformData);
      
      // Utiliser l'API Google AI (Gemini) avec le modèle disponible
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${contextText}\n\nQuestion de l'utilisateur : "${message}"`
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