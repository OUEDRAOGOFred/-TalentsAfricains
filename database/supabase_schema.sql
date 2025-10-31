-- ============================================
-- TalentsAfricains - Schema PostgreSQL pour Supabase
-- Adapté depuis MySQL
-- ============================================

-- Table users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    bio TEXT,
    photo_profil VARCHAR(255),
    linkedin VARCHAR(255),
    twitter VARCHAR(255),
    website VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table projects
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    categorie VARCHAR(100) NOT NULL,
    localisation VARCHAR(150),
    image_principale VARCHAR(255),
    galerie_images TEXT,
    lien_demo VARCHAR(255),
    lien_github VARCHAR(255),
    statut VARCHAR(50) DEFAULT 'en_cours',
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    views INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table likes
CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, project_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Table comments
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_categorie ON projects(categorie);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_project_id ON likes(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_project_id ON comments(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour users
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour projects
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Données de test
-- ============================================

-- Utilisateur admin (mot de passe: Password123!)
-- Hash bcrypt: $2a$10$8K1p/a0dL3.DKqKbKV5Y8e5RFXM9x7nYVvJZ7QZQK5XQKJ5XQKJ5X
INSERT INTO users (first_name, last_name, email, password, bio, role) 
VALUES ('Admin', 'TalentsAfricains', 'admin@talentsafricains.com', 
        '$2a$10$8K1p/a0dL3.DKqKbKV5Y8e5RFXM9x7nYVvJZ7QZQK5XQKJ5XQKJ5X', 
        'Administrateur de la plateforme TalentsAfricains', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Utilisateurs de test (mot de passe: Password123!)
INSERT INTO users (first_name, last_name, email, password, bio) VALUES
('Amina', 'Diallo', 'amina.diallo@example.com', 
 '$2a$10$8K1p/a0dL3.DKqKbKV5Y8e5RFXM9x7nYVvJZ7QZQK5XQKJ5XQKJ5X', 
 'Développeuse full-stack passionnée par l''innovation technologique en Afrique'),
('Kwame', 'Mensah', 'kwame.mensah@example.com', 
 '$2a$10$8K1p/a0dL3.DKqKbKV5Y8e5RFXM9x7nYVvJZ7QZQK5XQKJ5XQKJ5X', 
 'Designer UI/UX avec 5 ans d''expérience'),
('Fatou', 'Koné', 'fatou.kone@example.com', 
 '$2a$10$8K1p/a0dL3.DKqKbKV5Y8e5RFXM9x7nYVvJZ7QZQK5XQKJ5XQKJ5X', 
 'Data scientist spécialisée en IA')
ON CONFLICT (email) DO NOTHING;

-- Projets de test
INSERT INTO projects (titre, description, categorie, localisation, statut, user_id) VALUES
('Application de E-commerce', 
 'Plateforme innovante de vente en ligne pour artisans africains avec système de paiement mobile intégré', 
 'Web', 'Dakar, Sénégal', 'termine', 1),
('Système de gestion scolaire', 
 'Application complète de gestion pour écoles primaires et secondaires', 
 'Mobile', 'Accra, Ghana', 'en_cours', 2),
('Plateforme de formation en ligne', 
 'Système d''e-learning avec cours vidéo et quiz interactifs', 
 'Web', 'Abidjan, Côte d''Ivoire', 'en_cours', 3),
('Application de santé mobile', 
 'Suivi médical et prise de rendez-vous avec téléconsultation', 
 'Mobile', 'Lagos, Nigeria', 'en_developpement', 1),
('Réseau social pour entrepreneurs', 
 'Plateforme de networking pour entrepreneurs africains', 
 'Web', 'Nairobi, Kenya', 'termine', 2)
ON CONFLICT DO NOTHING;

-- Quelques likes de test
INSERT INTO likes (user_id, project_id) VALUES
(2, 1), (3, 1), (1, 2), (3, 2), (1, 3), (2, 3)
ON CONFLICT DO NOTHING;

-- Quelques commentaires de test
INSERT INTO comments (content, user_id, project_id) VALUES
('Excellent projet ! J''adore le concept et l''exécution.', 2, 1),
('Très prometteur. Quand prévoyez-vous le lancement ?', 3, 1),
('Belle interface utilisateur ! Félicitations.', 1, 2),
('Intéressant. Avez-vous pensé à ajouter une fonctionnalité de...', 3, 2),
('Super idée ! Je serais intéressé pour collaborer.', 2, 3);

-- Afficher un résumé
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM projects) as total_projects,
    (SELECT COUNT(*) FROM likes) as total_likes,
    (SELECT COUNT(*) FROM comments) as total_comments;
