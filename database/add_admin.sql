-- Ajouter l'utilisateur administrateur
-- Email: admin@talentsafricains.com
-- Mot de passe: Password123!

-- Désactiver les contraintes de clé étrangère
SET FOREIGN_KEY_CHECKS = 0;

-- D'abord, supprimer les anciennes données de test
TRUNCATE TABLE comments;
TRUNCATE TABLE likes;
TRUNCATE TABLE notifications;
TRUNCATE TABLE projects;
TRUNCATE TABLE users;

-- Réactiver les contraintes de clé étrangère
SET FOREIGN_KEY_CHECKS = 1;

-- Réinsérer les utilisateurs avec l'admin
INSERT INTO users (first_name, last_name, email, password, role, bio, competences, pays) VALUES
('Admin', 'TalentsAfricains', 'admin@talentsafricains.com', '$2a$10$8K1p/a0dL3AMJz7JH8S08.l3nMz/8BQhHk3qZpvW8J.zQQN.h9Cw6', 'admin', 'Administrateur de la plateforme TalentsAfricains', 'Gestion, Supervision, Analytics', 'Afrique'),
('Amina', 'Diallo', 'amina.diallo@example.com', '$2a$10$8K1p/a0dL3AMJz7JH8S08.l3nMz/8BQhHk3qZpvW8J.zQQN.h9Cw6', 'porteur_projet', 'Développeuse passionnée par l\'innovation technologique en Afrique', 'React, Node.js, UI/UX Design', 'Sénégal'),
('Kwame', 'Mensah', 'kwame.mensah@example.com', '$2a$10$8K1p/a0dL3AMJz7JH8S08.l3nMz/8BQhHk3qZpvW8J.zQQN.h9Cw6', 'porteur_projet', 'Entrepreneur social et innovateur dans le domaine de l\'éducation', 'Education, Management, Innovation', 'Ghana'),
('Fatou', 'Kone', 'fatou.kone@example.com', '$2a$10$8K1p/a0dL3AMJz7JH8S08.l3nMz/8BQhHk3qZpvW8J.zQQN.h9Cw6', 'visiteur', 'Investisseuse à la recherche de projets innovants', 'Finance, Investissement', 'Côte d\'Ivoire');

-- Réinsérer les projets de test
INSERT INTO projects (user_id, titre, description, categorie, status) VALUES
(2, 'Plateforme d\'apprentissage en ligne pour l\'Afrique', 'Une plateforme éducative innovante adaptée au contexte africain, offrant des cours en ligne accessibles même avec une connexion internet limitée.', 'education', 'publie'),
(3, 'Système de paiement mobile pour les zones rurales', 'Solution de paiement mobile simple et sécurisée pour faciliter les transactions dans les zones rurales africaines sans accès bancaire traditionnel.', 'technologie', 'publie');
