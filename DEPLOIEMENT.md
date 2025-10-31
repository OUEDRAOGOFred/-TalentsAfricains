# 🚀 Guide de Déploiement - TalentsAfricains

## Architecture de déploiement
- **Frontend** : Vercel (React + Vite)
- **Backend** : Render (Node.js + Express)
- **Base de données** : PlanetScale (MySQL)

---

## 📦 Étape 1 : Déployer la Base de Données (PlanetScale)

### 1.1 Créer un compte PlanetScale
1. Allez sur https://planetscale.com
2. Cliquez sur "Sign up" et connectez-vous avec GitHub
3. Créez une nouvelle organisation (gratuit)

### 1.2 Créer la base de données
1. Cliquez sur "New database"
2. Nom : `talentsafricains`
3. Region : `AWS eu-west-1` (Paris)
4. Plan : **Hobby** (gratuit)
5. Cliquez sur "Create database"

### 1.3 Importer les données
1. Dans votre dashboard PlanetScale, cliquez sur "Connect"
2. Sélectionnez "Connect with MySQL CLI"
3. Copiez la commande de connexion qui ressemble à :
   ```bash
   mysql -h xxxx.connect.psdb.cloud -u xxxx -p --ssl-mode=REQUIRED
   ```
4. Ouvrez PowerShell et collez la commande
5. Entrez le mot de passe fourni
6. Une fois connecté, copiez-collez le contenu de `database/talentsafricains.sql`

### 1.4 Récupérer les credentials
1. Dans PlanetScale, cliquez sur "Connect"
2. Sélectionnez "Node.js"
3. Notez les informations :
   - **Host** : `xxxx.connect.psdb.cloud`
   - **Username** : `xxxx`
   - **Password** : `xxxx`
   - **Database** : `talentsafricains`

---

## 🖥️ Étape 2 : Déployer le Backend (Render)

### 2.1 Créer un compte Render
1. Allez sur https://render.com
2. Cliquez sur "Get Started"
3. Connectez-vous avec GitHub

### 2.2 Créer un nouveau Web Service
1. Cliquez sur "New +" → "Web Service"
2. Connectez votre repository GitHub : `OUEDRAOGOFred/-TalentsAfricains`
3. Donnez l'accès à Render

### 2.3 Configurer le service
- **Name** : `talentsafricains-api`
- **Region** : `Frankfurt (EU Central)`
- **Branch** : `main`
- **Root Directory** : `backend`
- **Runtime** : `Node`
- **Build Command** : `npm install`
- **Start Command** : `npm start`
- **Instance Type** : `Free`

### 2.4 Ajouter les variables d'environnement
Cliquez sur "Advanced" puis ajoutez :

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `DB_HOST` | Copiez depuis PlanetScale |
| `DB_USER` | Copiez depuis PlanetScale |
| `DB_PASSWORD` | Copiez depuis PlanetScale |
| `DB_NAME` | `talentsafricains` |
| `JWT_SECRET` | Générez une clé aléatoire (32+ caractères) |
| `FRONTEND_URL` | `https://votre-app.vercel.app` (vous l'aurez à l'étape 3) |

### 2.5 Déployer
1. Cliquez sur "Create Web Service"
2. Attendez 2-3 minutes que le déploiement se termine
3. Notez l'URL de votre API : `https://talentsafricains-api.onrender.com`

---

## 🌐 Étape 3 : Déployer le Frontend (Vercel)

### 3.1 Créer un compte Vercel
1. Allez sur https://vercel.com
2. Cliquez sur "Sign Up"
3. Connectez-vous avec GitHub

### 3.2 Importer le projet
1. Cliquez sur "Add New..." → "Project"
2. Sélectionnez votre repository : `OUEDRAOGOFred/-TalentsAfricains`
3. Cliquez sur "Import"

### 3.3 Configurer le projet
- **Framework Preset** : `Vite`
- **Root Directory** : `frontend`
- **Build Command** : `npm run build`
- **Output Directory** : `dist`

### 3.4 Ajouter la variable d'environnement
Cliquez sur "Environment Variables" et ajoutez :

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://talentsafricains-api.onrender.com` |

### 3.5 Déployer
1. Cliquez sur "Deploy"
2. Attendez 1-2 minutes
3. Votre site sera accessible sur : `https://votre-app.vercel.app`

---

## 🔄 Étape 4 : Mettre à jour les URLs

### 4.1 Mettre à jour le Backend
1. Retournez sur Render
2. Allez dans "Environment"
3. Modifiez `FRONTEND_URL` avec l'URL Vercel réelle
4. Cliquez sur "Save Changes"
5. Render redémarrera automatiquement

### 4.2 Vérifier le CORS
Le fichier `backend/src/config/cors.js` est déjà configuré pour accepter votre domaine Vercel.

---

## ✅ Étape 5 : Vérification finale

### 5.1 Tester l'application
1. Ouvrez votre site Vercel
2. Testez l'inscription/connexion
3. Créez un projet
4. Testez les interactions (likes, commentaires)

### 5.2 Vérifier les logs
- **Backend** : Dans Render, allez dans "Logs"
- **Frontend** : Dans Vercel, allez dans "Deployments" → Sélectionnez votre déploiement → "View Function Logs"

---

## 🔧 Maintenance

### Déploiement automatique
- **Git Push** : Chaque fois que vous poussez sur `main`, Vercel et Render redéploient automatiquement
- **Branches** : Vous pouvez créer des branches de développement pour tester avant de merger

### Surveiller les performances
- **Render** : Free tier dort après 15 min d'inactivité (premier chargement peut prendre 30-60 secondes)
- **PlanetScale** : Limite de 1 milliard de lectures/mois (largement suffisant)
- **Vercel** : 100 GB de bande passante/mois

---

## 🆘 Dépannage

### Erreur CORS
Si vous avez des erreurs CORS :
1. Vérifiez que `FRONTEND_URL` dans Render correspond exactement à votre URL Vercel
2. Vérifiez `backend/src/config/cors.js`

### Erreur de connexion base de données
1. Vérifiez les credentials PlanetScale dans Render
2. Assurez-vous que la base de données est en mode "production" dans PlanetScale

### Site lent au démarrage
C'est normal avec Render Free tier. Le serveur dort après 15 min d'inactivité.
Solution : Passer au plan payant ($7/mois) ou utiliser un "cron job" pour le garder actif.

---

## 📊 Coûts

| Service | Plan | Prix |
|---------|------|------|
| PlanetScale | Hobby | **Gratuit** |
| Render | Free | **Gratuit** (avec limitations) |
| Vercel | Hobby | **Gratuit** |
| **TOTAL** | | **0€/mois** |

---

## 🚀 Passage en production payante (optionnel)

Si votre application a du succès :
- **Render** : $7/mois → Pas de mise en veille
- **PlanetScale** : $29/mois → Plus de stockage et de puissance
- **Vercel** : $20/mois → Plus de bande passante

---

**Développé par Freddy OUEDRAOGO**
