-- Mettre à jour la table users pour supporter le rôle admin
ALTER TABLE users MODIFY COLUMN role ENUM('visiteur', 'porteur_projet', 'admin') NOT NULL DEFAULT 'visiteur';
