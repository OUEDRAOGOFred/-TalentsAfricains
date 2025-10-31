# 🚀 Guide de Démarrage Rapide - TalentsAfricains

## ⚡ Installation en 5 minutes

### Étape 1 : Configuration MySQL
```powershell
# Ouvrir MySQL
mysql -u root -p

# Créer la base de données
CREATE DATABASE talentsafricains;
exit;

# Importer le schéma
mysql -u root -p talentsafricains < C:\TalentsAfricains\database\talentsafricains.sql
```

### Étape 2 : Backend
```powershell
cd C:\TalentsAfricains\backend

# Installer les dépendances
npm install

# Créer le fichier .env
copy .env.example .env

# Modifier .env avec vos credentials MySQL
# DB_PASSWORD=votre_mot_de_passe_mysql
# JWT_SECRET=un_secret_securise_aleatoire

# Créer le dossier uploads
mkdir uploads

# Démarrer le serveur
npm run dev
```

**✅ Backend ready sur http://localhost:5000**

### Étape 3 : Frontend
```powershell
# Ouvrir un nouveau terminal
cd C:\TalentsAfricains\frontend

# Installer les dépendances
npm install

# Démarrer le frontend
npm run dev
```

**✅ Frontend ready sur http://localhost:3000**

---

## 🎉 Accès à l'application

Ouvrez votre navigateur : **http://localhost:3000**

### Comptes de test

**Porteur de projet :**
- Email : `amina.diallo@example.com`
- Password : `Password123!`

**Porteur de projet 2 :**
- Email : `kwame.mensah@example.com`
- Password : `Password123!`

**Visiteur :**
- Email : `fatou.kone@example.com`
- Password : `Password123!`

---

## 🔧 Dépannage

### Erreur de connexion MySQL
```powershell
# Vérifier que MySQL est démarré
# Services > MySQL > Démarrer
```

### Port déjà utilisé
```powershell
# Backend (port 5000)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Frontend (port 3000)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Erreur JWT_SECRET
Générez un secret sécurisé :
```javascript
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copiez le résultat dans votre `.env` :
```env
JWT_SECRET=votre_secret_genere_ici
```

---

## 📋 Checklist de vérification

- [ ] MySQL installé et démarré
- [ ] Base de données `talentsafricains` créée
- [ ] Schéma SQL importé
- [ ] `backend/.env` configuré
- [ ] `npm install` dans backend
- [ ] Backend démarré (port 5000)
- [ ] `npm install` dans frontend
- [ ] Frontend démarré (port 3000)
- [ ] Navigation vers http://localhost:3000

---

## 🎯 Prochaines étapes

1. **Créer votre compte** sur http://localhost:3000/register
2. **Se connecter** et explorer l'application
3. **Ajouter un projet** si vous êtes porteur de projet
4. **Découvrir les projets** existants
5. **Liker et commenter** les projets qui vous intéressent

---

## 💡 Commandes utiles

```powershell
# Backend - Mode développement avec auto-reload
cd backend
npm run dev

# Frontend - Mode développement
cd frontend
npm run dev

# Build frontend pour production
cd frontend
npm run build

# Démarrer backend en production
cd backend
npm start
```

---

## 📞 Besoin d'aide ?

- Vérifiez le fichier `README.md` principal
- Consultez les logs dans la console
- Assurez-vous que tous les services sont démarrés

---

**Bon développement ! 🌍✨**
