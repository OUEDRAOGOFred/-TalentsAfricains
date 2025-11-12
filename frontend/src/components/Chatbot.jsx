/**
 * Composant Chatbot - Assistant virtuel pour TalentsAfricains
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
    
    "comment contacter le support": "Vous pouvez nous contacter via ce chat, ou envoyer un email à support@talentsafricains.com. Nous répondons généralement sous 24h.",
    
    "default": "Je comprends votre question. Pour une assistance personnalisée, n'hésitez pas à contacter notre équipe à support@talentsafricains.com ou explorez notre section d'aide."
  };

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Recherche de mots-clés dans le message
    for (const [key, response] of Object.entries(botResponses)) {
      if (key !== 'default' && message.includes(key.split(' ')[0])) {
        return response;
      }
    }
    
    return botResponses.default;
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Ajouter le message utilisateur
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simuler le délai de frappe du bot
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: generateBotResponse(inputMessage),
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
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