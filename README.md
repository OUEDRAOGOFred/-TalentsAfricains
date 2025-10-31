# 🌍 TalentsAfricains

**Plateforme de mise en avant des talents et projets innovants africains**

Une application web élégante et moderne qui connecte les porteurs de projets africains avec des investisseurs et le grand public.

---

## ✨ Fonctionnalités

### 👥 Utilisateurs
- **Inscription / Connexion** avec authentification JWT sécurisée
- **Deux rôles** : Visiteur et Porteur de projet
- **Profil personnalisable** avec photo, bio, compétences, localisation
- **Liens sociaux** : LinkedIn, Twitter, Site web

### 💼 Projets
- **CRUD complet** pour les porteurs de projet
- **Upload d'images** : Image principale + Galerie (jusqu'à 5 images)
- **Catégorisation** : Technologie, Art, Entrepreneuriat, Innovation, etc.
- **Localisation** géographique
- **Liens externes** vers prototypes, sites, etc.

### 🔍 Découverte
- **Liste des projets** avec pagination
- **Filtres avancés** : Catégorie, Localisation, Recherche textuelle
- **Tri** : Plus récents, Plus populaires, Plus anciens
- **Page de détails** complète pour chaque projet

### 💬 Interactions
- **Système de likes** sur les projets
- **Commentaires** avec fil de discussion
- **Statistiques** : Likes, Commentaires, Vues

---

## 🛠️ Stack Technique

### Backend
- **Node.js** avec Express.js
- **MySQL** (base de données relationnelle)
- **JWT** pour l'authentification
- **Bcrypt** pour le hachage des mots de passe
- **Multer** pour l'upload de fichiers
- **Express Validator** pour la validation des données

### Frontend
- **React 18** avec Vite
- **React Router** pour la navigation
- **Axios** pour les appels API
- **Context API** pour la gestion d'état globale
- **CSS pur** - Design élégant et responsive

### Design
- 🎨 **Palette africaine moderne** : Or, Vert, Terre cuite, Noir
- ✨ **Animations subtiles** et transitions fluides
- 📱 **Responsive** : Mobile, Tablette, Desktop
- 🌐 **Polices** : Poppins, Montserrat

---

## 📦 Installation

### Prérequis
- Node.js (v16+)
- MySQL (v8+)
- npm ou yarn

### 1. Cloner le repository
```bash
git clone https://github.com/votre-username/TalentsAfricains.git
cd TalentsAfricains
```

### 2. Configuration de la base de données

#### Créer la base de données MySQL
```bash
mysql -u root -p
```

```sql
CREATE DATABASE talentsafricains;
exit;
```

#### Importer le schéma
```bash
mysql -u root -p talentsafricains < database/talentsafricains.sql
```

### 3. Installation du Backend

```bash
cd backend
npm install
```

#### Configuration des variables d'environnement
```bash
copy .env.example .env
```

Modifiez le fichier `.env` :
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=talentsafricains

JWT_SECRET=votre_secret_jwt_tres_securise

PORT=5000
NODE_ENV=development
```

#### Démarrer le serveur backend
```bash
npm run dev
```

Le serveur démarre sur : **http://localhost:5000**

### 4. Installation du Frontend

Ouvrez un nouveau terminal :

```bash
cd frontend
npm install
```

#### Configuration (optionnel)
Créez un fichier `.env` dans `/frontend` :
```env
VITE_API_URL=http://localhost:5000/api
```

#### Démarrer le serveur frontend
```bash
npm run dev
```

Le frontend démarre sur : **http://localhost:3000**

---

## 🚀 Démarrage rapide

### Terminal 1 - Backend
```powershell
cd backend
npm install
npm run dev
```

### Terminal 2 - Frontend
```powershell
cd frontend
npm install
npm run dev
```

### Terminal 3 - MySQL (si nécessaire)
```powershell
mysql -u root -p
```

Puis importez le schéma :
```sql
source C:/TalentsAfricains/database/talentsafricains.sql
```

---

## 📂 Structure du projet

```
TalentsAfricains/
│
├── backend/                  # Backend Node.js / Express
│   ├── src/
│   │   ├── config/          # Configuration (DB, etc.)
│   │   ├── controllers/     # Contrôleurs
│   │   ├── middleware/      # Middlewares (auth, upload)
│   │   ├── models/          # Modèles de données
│   │   ├── routes/          # Routes API
│   │   └── server.js        # Point d'entrée
│   ├── uploads/             # Dossier des images uploadées
│   ├── .env                 # Variables d'environnement
│   └── package.json
│
├── frontend/                # Frontend React
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   ├── context/         # Context API (Auth)
│   │   ├── pages/           # Pages de l'application
│   │   ├── services/        # Services API
│   │   ├── styles/          # Styles CSS globaux
│   │   ├── App.jsx          # Composant principal
│   │   └── main.jsx         # Point d'entrée
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── database/                # Schéma MySQL
│   └── talentsafricains.sql
│
└── README.md               # Ce fichier
```

---

## 🎯 Utilisation

### 1. Créer un compte
- Visitez **http://localhost:3000/register**
- Choisissez votre rôle : **Visiteur** ou **Porteur de projet**
- Remplissez vos informations

### 2. Se connecter
- Email : `amina.diallo@example.com` (compte de test)
- Mot de passe : `Password123!`

### 3. Ajouter un projet (Porteur de projet uniquement)
- Cliquez sur **"Ajouter un projet"**
- Remplissez les informations
- Ajoutez des images
- Publiez !

### 4. Explorer les projets
- Visitez la page **"Découvrir"**
- Utilisez les filtres (catégorie, localisation, recherche)
- Cliquez sur un projet pour voir les détails

### 5. Interagir
- **Liker** un projet
- **Commenter** pour échanger avec les porteurs de projet
- **Partager** vos réflexions

---

## 🔐 Sécurité

- ✅ **Mots de passe hachés** avec bcrypt (10 rounds)
- ✅ **Authentification JWT** avec tokens expirables (7 jours)
- ✅ **Validation des entrées** côté serveur (Express Validator)
- ✅ **Protection CORS** configurée
- ✅ **Upload sécurisé** avec validation des types de fichiers
- ✅ **SQL Injection** prévenue avec requêtes préparées

---

## 🎨 Design

### Palette de couleurs
- **Primaire** : `#d4a574` (Or/Bronze)
- **Secondaire** : `#2d5f3f` (Vert profond)
- **Accent** : `#c97d5d` (Terre cuite)
- **Sombre** : `#1a1a1a`
- **Clair** : `#f5f5f5`

### Typographie
- **Titres** : Montserrat (600-700)
- **Corps** : Poppins (300-600)

---

## 📱 Responsive Design

L'application est entièrement responsive et optimisée pour :
- 📱 **Mobile** : 320px - 640px
- 📱 **Tablette** : 641px - 968px
- 💻 **Desktop** : 969px+

---

## 🌐 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil (auth requis)
- `PUT /api/auth/profile` - Modifier profil (auth requis)
- `GET /api/auth/user/:id` - Profil public

### Projets
- `GET /api/projects` - Liste des projets
- `GET /api/projects/:id` - Détails d'un projet
- `POST /api/projects` - Créer un projet (auth + porteur requis)
- `PUT /api/projects/:id` - Modifier un projet (auth + propriétaire)
- `DELETE /api/projects/:id` - Supprimer un projet (auth + propriétaire)
- `GET /api/projects/my` - Mes projets (auth requis)

### Interactions
- `POST /api/interactions/like/:projectId` - Liker/Unliker (auth requis)
- `GET /api/interactions/likes/:projectId` - Liste des likes
- `POST /api/interactions/comment/:projectId` - Ajouter un commentaire (auth requis)
- `GET /api/interactions/comments/:projectId` - Liste des commentaires
- `DELETE /api/interactions/comment/:commentId` - Supprimer un commentaire (auth + propriétaire)

---

## 🚧 Production

### Build Frontend
```bash
cd frontend
npm run build
```

### Variables d'environnement production
```env
NODE_ENV=production
DB_HOST=votre-db-host
JWT_SECRET=secret-super-securise
FRONTEND_URL=https://votre-domaine.com
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT.

---

## 👨‍💻 Auteur

Créé avec ❤️ pour l'Afrique

---

## 🙏 Remerciements

Merci à tous les talents africains qui font avancer le continent !

**Made in Africa 🌍**
