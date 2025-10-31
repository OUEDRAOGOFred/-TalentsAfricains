# 🔑 Identifiants Administrateur - TalentsAfricains

## ⚠️ CONFIDENTIEL - À USAGE INTERNE UNIQUEMENT

---

## 👤 Compte Administrateur Principal

### Identifiants de Connexion

- **Email:** `admin@talentsafricains.com`
- **Mot de passe:** `Password123!`

### Accès au Panel Administrateur

1. Se rendre sur : `http://localhost:3000`
2. Cliquer sur **"Connexion"** dans le menu
3. Entrer les identifiants ci-dessus
4. Accéder au **"Dashboard Admin"** depuis le menu

---

## 👥 Comptes de Test

### Porteur de Projet 1
- **Nom:** Amina Diallo
- **Email:** `amina.diallo@example.com`
- **Mot de passe:** `Password123!`
- **Rôle:** Porteur de projet

### Porteur de Projet 2
- **Nom:** Kwame Mensah
- **Email:** `kwame.mensah@example.com`
- **Mot de passe:** `Password123!`
- **Rôle:** Porteur de projet

### Visiteur
- **Nom:** Fatou Kone
- **Email:** `fatou.kone@example.com`
- **Mot de passe:** `Password123!`
- **Rôle:** Visiteur

---

## 🔒 Sécurité - Actions Recommandées

### ⚠️ IMPORTANT - À FAIRE IMMÉDIATEMENT

1. **Changer le mot de passe administrateur**
   - Se connecter avec le compte admin
   - Aller dans "Mon profil"
   - Modifier le mot de passe
   - Utiliser un mot de passe fort (min. 12 caractères)

2. **Supprimer les comptes de test en production**
   - Ces comptes sont uniquement pour les tests
   - Les supprimer via le panel admin avant le lancement

3. **Modifier le JWT_SECRET**
   - Générer une nouvelle clé secrète aléatoire
   - Mettre à jour le fichier `.env` du backend

4. **Activer HTTPS en production**
   - Obtenir un certificat SSL (Let's Encrypt)
   - Configurer Nginx avec SSL

---

## 📊 Permissions par Rôle

| Action | Visiteur | Porteur | Admin |
|--------|----------|---------|-------|
| Voir les projets | ✅ | ✅ | ✅ |
| Liker/Commenter | ✅ | ✅ | ✅ |
| Publier un projet | ❌ | ✅ | ✅ |
| Modifier ses projets | ❌ | ✅ | ✅ |
| Gérer les utilisateurs | ❌ | ❌ | ✅ |
| Modérer le contenu | ❌ | ❌ | ✅ |
| Accès au dashboard | ❌ | ❌ | ✅ |

---

## 🗄️ Accès à la Base de Données

### Identifiants MySQL

- **Host:** `localhost`
- **Port:** `3306`
- **Database:** `talentsafricains`
- **User:** `root`
- **Password:** *(Votre mot de passe MySQL)*

### Commande de connexion

```bash
mysql -u root -p talentsafricains
```

---

## 🚀 URLs de la Plateforme

### Environnement de Développement

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Documentation API:** http://localhost:5000/api-docs (si configuré)

### Environnement de Production

- **Frontend:** https://votre-domaine.com
- **Backend API:** https://api.votre-domaine.com

---

## 📞 Support Technique

Pour toute question ou problème :

- **Développeur:** Freddy OUEDRAOGO
- **Email:** contact@freddyouedraogo.dev
- **GitHub:** https://github.com/OUEDRAOGOFred

---

## 📝 Notes Importantes

1. **Ne JAMAIS partager ces identifiants publiquement**
2. **Changer tous les mots de passe par défaut**
3. **Faire des sauvegardes régulières de la base de données**
4. **Surveiller les logs pour détecter les activités suspectes**
5. **Mettre à jour régulièrement les dépendances npm**

---

**Document créé le:** 31 octobre 2025  
**Dernière mise à jour:** 31 octobre 2025  
**Version:** 1.0

---

© 2025 TalentsAfricains - Développé par Freddy OUEDRAOGO
