-- Mettre à jour les mots de passe des utilisateurs
-- Mot de passe pour tous: Password123!
-- Hash: $2a$10$gUrWfCYLAjoXRLRgvAEcveOzOBFOApfMScWLiLSW5yvU0fp2Map1q

UPDATE users SET password = '$2a$10$gUrWfCYLAjoXRLRgvAEcveOzOBFOApfMScWLiLSW5yvU0fp2Map1q' WHERE email = 'admin@talentsafricains.com';
UPDATE users SET password = '$2a$10$gUrWfCYLAjoXRLRgvAEcveOzOBFOApfMScWLiLSW5yvU0fp2Map1q' WHERE email = 'amina.diallo@example.com';
UPDATE users SET password = '$2a$10$gUrWfCYLAjoXRLRgvAEcveOzOBFOApfMScWLiLSW5yvU0fp2Map1q' WHERE email = 'kwame.mensah@example.com';
UPDATE users SET password = '$2a$10$gUrWfCYLAjoXRLRgvAEcveOzOBFOApfMScWLiLSW5yvU0fp2Map1q' WHERE email = 'fatou.kone@example.com';

SELECT email, role FROM users;
