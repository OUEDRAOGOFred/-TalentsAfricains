/**
 * Composant Chatbot - Assistant virtuel pour Rayonnement
 */

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot } from 'lucide-react';
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
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    
    // Si aucune réponse prédéfinie, utiliser Gemini AI
    try {
      const geminiResponse = await callGeminiAPI(userMessage);
      return geminiResponse;
    } catch (error) {
      console.error('Erreur avec Gemini:', error);
      return botResponses.default;
    }
  };

  const callGeminiAPI = async (message) => {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      return "Désolé, le service d'IA n'est pas disponible pour le moment. " + botResponses.default;
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Tu es Rayonnement, un assistant virtuel pour une plateforme africaine de mise en avant des talents et projets innovants. 

La plateforme Rayonnement permet aux porteurs de projets africains de présenter leurs idées innovantes dans les domaines de la technologie, l'art, l'entrepreneuriat, l'innovation, l'éducation, la santé et l'agriculture.

Réponds de manière helpful, engageante et en français à cette question de l'utilisateur : "${message}"

Si la question n'est pas liée à la plateforme, redirige gentiment vers les fonctionnalités de Rayonnement.`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Erreur API Gemini');
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
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