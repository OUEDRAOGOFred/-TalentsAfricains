-- =====================================================
-- Base de données TalentsAfricains
-- Plateforme de mise en avant des talents africains
-- =====================================================

CREATE DATABASE IF NOT EXISTS talentsafricains CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE talentsafricains;

-- =====================================================
-- Table des utilisateurs
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('visiteur', 'porteur_projet', 'admin') DEFAULT 'visiteur',
    bio TEXT,
    competences TEXT,
    pays VARCHAR(100),
    photo_profil VARCHAR(255),
    linkedin VARCHAR(255),
    twitter VARCHAR(255),
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- =====================================================
-- Table des projets
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    categorie ENUM('technologie', 'art', 'entrepreneuriat', 'innovation', 'education', 'sante', 'agriculture', 'autre') NOT NULL,
    localisation VARCHAR(150),
    lien_externe VARCHAR(255),
    image_principale VARCHAR(255),
    galerie_images TEXT,
    user_id INT NOT NULL,
    likes_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    status ENUM('brouillon', 'publie', 'archive') DEFAULT 'publie',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_categorie (categorie),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- =====================================================
-- Table des likes
-- =====================================================
CREATE TABLE IF NOT EXISTS likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_like (user_id, project_id),
    INDEX idx_project (project_id)
) ENGINE=InnoDB;

-- =====================================================
-- Table des commentaires
-- =====================================================
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_project (project_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB;

-- =====================================================
-- Table des notifications
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('like', 'comment', 'follow', 'system') NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_project_id INT,
    related_user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (related_user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, is_read),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- =====================================================
-- Données de test (optionnel)
-- =====================================================
-- Mot de passe pour tous les utilisateurs de test : "Password123!"
-- Hash bcrypt du mot de passe

INSERT INTO users (first_name, last_name, email, password, role, bio, competences, pays) VALUES
('Admin', 'TalentsAfricains', 'admin@talentsafricains.com', '$2a$10$8K1p/a0dL3AMJz7JH8S08.l3nMz/8BQhHk3qZpvW8J.zQQN.h9Cw6', 'admin', 'Administrateur de la plateforme TalentsAfricains', 'Gestion, Supervision, Analytics', 'Afrique'),
('Amina', 'Diallo', 'amina.diallo@example.com', '$2a$10$8K1p/a0dL3AMJz7JH8S08.l3nMz/8BQhHk3qZpvW8J.zQQN.h9Cw6', 'porteur_projet', 'Développeuse passionnée par l\'innovation technologique en Afrique', 'React, Node.js, UI/UX Design', 'Sénégal'),
('Kwame', 'Mensah', 'kwame.mensah@example.com', '$2a$10$8K1p/a0dL3AMJz7JH8S08.l3nMz/8BQhHk3qZpvW8J.zQQN.h9Cw6', 'porteur_projet', 'Entrepreneur social et innovateur dans le domaine de l\'éducation', 'Education, Management, Innovation', 'Ghana'),
('Fatou', 'Kone', 'fatou.kone@example.com', '$2a$10$8K1p/a0dL3AMJz7JH8S08.l3nMz/8BQhHk3qZpvW8J.zQQN.h9Cw6', 'visiteur', 'Investisseuse à la recherche de projets innovants', 'Finance, Investissement', 'Côte d\'Ivoire');

INSERT INTO projects (titre, description, categorie, localisation, user_id) VALUES
('AgriTech Solution', 'Plateforme digitale pour connecter agriculteurs et acheteurs en temps réel', 'agriculture', 'Sénégal', 1),
('EduLearn Africa', 'Application d\'apprentissage mobile pour l\'éducation de qualité en zones rurales', 'education', 'Ghana', 2);
