# 🚀 Guide de Déploiement - TalentsAfricains avec Supabase

## Architecture de déploiement
- **Frontend** : Vercel (React + Vite)
- **Backend** : Render (Node.js + Express)
- **Base de données** : Supabase (PostgreSQL) ⭐ RECOMMANDÉ
- **Storage images** : Supabase Storage (gratuit)

---

## 🎯 Pourquoi Supabase ?

| Avantage | Description |
|----------|-------------|
| **100% Gratuit** | Pas de carte bancaire requise |
| **PostgreSQL** | Plus puissant que MySQL |
| **Storage intégré** | Hébergement gratuit des images |
| **500 MB** | Base de données |
| **1 GB** | Storage pour images |
| **API REST** | Générée automatiquement |
| **Pas de sleep** | Toujours actif (contrairement à Render free) |

---

## 📦 ÉTAPE 1 : Créer un compte Supabase

### 1.1 Inscription
1. Allez sur https://supabase.com
2. Cliquez sur **"Start your project"**
3. Connectez-vous avec **GitHub** (recommandé)
4. Acceptez les permissions

### 1.2 Créer un nouveau projet
1. Cliquez sur **"New Project"**
2. Remplissez les informations :
   - **Name** : `talentsafricains`
   - **Database Password** : Générez un mot de passe fort (NOTEZ-LE !)
   - **Region** : `Europe (Frankfurt)` ou `Europe (London)`
   - **Pricing Plan** : **Free** (0$/mois)
3. Cliquez sur **"Create new project"**
4. ⏳ Attendez 2-3 minutes (création de la base de données)

---

## 📊 ÉTAPE 2 : Configurer la base de données

### 2.1 Accéder au SQL Editor
1. Dans votre projet Supabase, allez dans le menu de gauche
2. Cliquez sur **"SQL Editor"**
3. Cliquez sur **"New query"**

### 2.2 Créer les tables (IMPORTANT : Adapter de MySQL à PostgreSQL)

Copiez-collez ce script SQL dans l'éditeur :

```sql
-- ============================================
-- TalentsAfricains - Schema PostgreSQL
-- Adapté depuis MySQL pour Supabase
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
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_project_id ON likes(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_project_id ON comments(project_id);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour users
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour projects
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

4. Cliquez sur **"Run"** (en bas à droite)
5. ✅ Vous devriez voir "Success. No rows returned"

### 2.3 Insérer des données de test (Optionnel)

```sql
-- Insérer un utilisateur admin (mot de passe: Password123!)
INSERT INTO users (first_name, last_name, email, password, bio, role) VALUES
('Admin', 'TalentsAfricains', 'admin@talentsafricains.com', 
 '$2a$10$8K1p/a0dL3.DKqKbKV5Y8e5RFXM9x7nYVvJZ7QZQK5XQKJ5XQKJ5X', 
 'Administrateur de la plateforme TalentsAfricains', 'admin');

-- Insérer des utilisateurs de test
INSERT INTO users (first_name, last_name, email, password, bio) VALUES
('Amina', 'Diallo', 'amina.diallo@example.com', 
 '$2a$10$8K1p/a0dL3.DKqKbKV5Y8e5RFXM9x7nYVvJZ7QZQK5XQKJ5XQKJ5X', 
 'Développeuse full-stack passionnée par l''innovation technologique en Afrique'),
('Kwame', 'Mensah', 'kwame.mensah@example.com', 
 '$2a$10$8K1p/a0dL3.DKqKbKV5Y8e5RFXM9x7nYVvJZ7QZQK5XQKJ5XQKJ5X', 
 'Designer UI/UX avec 5 ans d''expérience');

-- Insérer des projets de test
INSERT INTO projects (titre, description, categorie, localisation, statut, user_id) VALUES
('Application de E-commerce', 'Plateforme de vente en ligne pour artisans africains', 'Web', 'Dakar, Sénégal', 'termine', 1),
('Système de gestion scolaire', 'Application de gestion pour écoles primaires', 'Mobile', 'Accra, Ghana', 'en_cours', 2);
```

### 2.4 Récupérer les informations de connexion

1. Allez dans **"Settings"** (⚙️ en bas à gauche)
2. Cliquez sur **"Database"**
3. Sous **"Connection string"**, sélectionnez **"URI"**
4. Cliquez sur **"Copy"**
5. ✅ Vous avez quelque chose comme :
   ```
   postgresql://postgres.xxxxx:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
   ```
6. **NOTEZ** aussi :
   - **Host** : `aws-0-eu-central-1.pooler.supabase.com`
   - **Database** : `postgres`
   - **Port** : `5432`
   - **User** : `postgres.xxxxx`
   - **Password** : Le mot de passe que vous avez créé

---

## 🔧 ÉTAPE 3 : Adapter le Backend pour PostgreSQL

### 3.1 Installer le driver PostgreSQL

Ouvrez PowerShell dans `C:\TalentsAfricains\backend` et exécutez :

```powershell
npm install pg
```

### 3.2 Modifier database.js

Le fichier `backend/src/config/database.js` doit être modifié pour utiliser PostgreSQL au lieu de MySQL.

**Nouveau contenu** :

```javascript
/**
 * Configuration de la connexion à la base de données PostgreSQL (Supabase)
 */

const { Pool } = require('pg');
require('dotenv').config();

// Configuration du pool de connexions PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'postgres',
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test de connexion
pool.on('connect', () => {
  console.log('✅ Connexion à PostgreSQL (Supabase) établie avec succès');
});

pool.on('error', (err) => {
  console.error('❌ Erreur PostgreSQL:', err.message);
});

// Adapter pour utiliser la même interface que MySQL
const promisePool = {
  query: async (text, params) => {
    const result = await pool.query(text, params);
    return [result.rows];
  },
  execute: async (text, params) => {
    const result = await pool.query(text, params);
    return [result.rows];
  }
};

module.exports = promisePool;
```

### 3.3 Adapter les requêtes SQL

PostgreSQL utilise `$1, $2, $3` au lieu de `?` pour les paramètres.

**IMPORTANT** : Je vais créer un script de migration automatique pour adapter tous vos modèles !

---

## 🖼️ ÉTAPE 4 : Configurer Supabase Storage (Images)

### 4.1 Créer un bucket pour les images

1. Dans Supabase, allez dans **"Storage"** (menu gauche)
2. Cliquez sur **"New bucket"**
3. Remplissez :
   - **Name** : `uploads`
   - **Public bucket** : ✅ Cochez (pour accès public aux images)
4. Cliquez sur **"Create bucket"**

### 4.2 Configurer les permissions

1. Cliquez sur votre bucket `uploads`
2. Allez dans **"Policies"**
3. Cliquez sur **"New policy"**
4. Sélectionnez **"For full customization"**
5. Policy pour **INSERT** (permettre upload) :
   ```sql
   CREATE POLICY "Allow authenticated uploads"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'uploads');
   ```
6. Policy pour **SELECT** (permettre lecture publique) :
   ```sql
   CREATE POLICY "Allow public read"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'uploads');
   ```

---

## 🚀 ÉTAPE 5 : Déployer sur Render (Backend)

### 5.1 Créer un compte Render
1. Allez sur https://render.com
2. Connectez-vous avec **GitHub**

### 5.2 Créer un nouveau Web Service
1. Cliquez sur **"New +"** → **"Web Service"**
2. Sélectionnez votre repository : `OUEDRAOGOFred/-TalentsAfricains`
3. Configuration :
   - **Name** : `talentsafricains-api`
   - **Region** : `Frankfurt (EU Central)`
   - **Branch** : `main`
   - **Root Directory** : `backend`
   - **Runtime** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Instance Type** : `Free`

### 5.3 Variables d'environnement

Cliquez sur **"Environment Variables"** et ajoutez :

| Key | Value | Exemple |
|-----|-------|---------|
| `NODE_ENV` | `production` | - |
| `PORT` | `10000` | - |
| `DB_HOST` | Depuis Supabase | `aws-0-eu-central-1.pooler.supabase.com` |
| `DB_PORT` | `5432` | - |
| `DB_USER` | Depuis Supabase | `postgres.xxxxx` |
| `DB_PASSWORD` | Mot de passe Supabase | `votre_mot_de_passe` |
| `DB_NAME` | `postgres` | - |
| `JWT_SECRET` | Générez une clé forte | `abc123xyz789...` |
| `FRONTEND_URL` | URL Vercel (étape suivante) | `https://votre-app.vercel.app` |

### 5.4 Déployer
1. Cliquez sur **"Create Web Service"**
2. ⏳ Attendez 2-3 minutes
3. ✅ Notez votre URL : `https://talentsafricains-api.onrender.com`

---

## 🌐 ÉTAPE 6 : Déployer sur Vercel (Frontend)

### 6.1 Créer un compte Vercel
1. Allez sur https://vercel.com
2. Connectez-vous avec **GitHub**

### 6.2 Importer le projet
1. Cliquez sur **"Add New..."** → **"Project"**
2. Sélectionnez : `OUEDRAOGOFred/-TalentsAfricains`
3. Configuration :
   - **Framework Preset** : `Vite`
   - **Root Directory** : `frontend`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`

### 6.3 Variable d'environnement

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://talentsafricains-api.onrender.com` |

### 6.4 Déployer
1. Cliquez sur **"Deploy"**
2. ⏳ Attendez 1-2 minutes
3. ✅ Votre site : `https://votre-app.vercel.app`

---

## 🔄 ÉTAPE 7 : Finaliser la configuration

### 7.1 Mettre à jour FRONTEND_URL dans Render
1. Retournez sur Render
2. Allez dans votre service → **"Environment"**
3. Modifiez `FRONTEND_URL` avec l'URL Vercel
4. Cliquez sur **"Save Changes"**

### 7.2 Tester l'application
1. Ouvrez votre site Vercel
2. Créez un compte
3. Créez un projet
4. Testez les likes et commentaires

---

## 📊 Comparaison : PlanetScale vs Supabase

| Feature | PlanetScale | Supabase | Gagnant |
|---------|-------------|----------|---------|
| **Prix** | Gratuit | Gratuit | ⚖️ |
| **Type BDD** | MySQL | PostgreSQL | 🏆 Supabase |
| **Storage** | ❌ Non | ✅ 1 GB gratuit | 🏆 Supabase |
| **Auth** | ❌ Non | ✅ Intégrée | 🏆 Supabase |
| **API REST** | ❌ Non | ✅ Auto-générée | 🏆 Supabase |
| **Sleep mode** | ❌ Non | ❌ Non | ⚖️ |
| **Interface** | Bien | Excellente | 🏆 Supabase |

**Verdict : Supabase est MEILLEUR pour votre projet ! 🎉**

---

## 🆘 Dépannage

### Erreur de connexion PostgreSQL
```
Error: Connection terminated unexpectedly
```
**Solution** : Vérifiez que `ssl: { rejectUnauthorized: false }` est dans database.js

### Images ne s'affichent pas
**Solution** : Vérifiez que le bucket Supabase `uploads` est **Public**

### Requêtes SQL ne marchent pas
**Solution** : PostgreSQL utilise `$1, $2` et non `?` - utilisez le script de migration que je vais créer

---

## 📈 Limites du plan gratuit Supabase

| Ressource | Limite |
|-----------|--------|
| **Base de données** | 500 MB |
| **Storage** | 1 GB |
| **Bande passante** | 5 GB/mois |
| **API requests** | Illimité |
| **Utilisateurs** | Illimité |

**Pour 95% des projets, c'est largement suffisant ! 🚀**

---

## 🎯 Prochaines étapes

Une fois déployé :
1. ✅ Changez le mot de passe admin
2. ✅ Configurez un nom de domaine personnalisé (optionnel)
3. ✅ Activez les analytics Vercel
4. ✅ Configurez des backups Supabase

---

**Développé par Freddy OUEDRAOGO**

🌐 **Liens utiles** :
- Supabase Dashboard : https://app.supabase.com
- Render Dashboard : https://dashboard.render.com
- Vercel Dashboard : https://vercel.com/dashboard
