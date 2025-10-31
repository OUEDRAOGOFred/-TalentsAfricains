# 🚀 Déploiement RAPIDE avec Supabase (15 minutes)

## ⚡ Checklist ultra-rapide

### 1️⃣ Supabase (5 min)
- [ ] Créer compte sur https://supabase.com avec GitHub
- [ ] New Project → `talentsafricains` → Region EU → Free
- [ ] SQL Editor → Copier `database/supabase_schema.sql` → Run
- [ ] Settings → Database → Copier connection string
- [ ] Storage → New bucket `uploads` → Public ✅

### 2️⃣ Render Backend (3 min)
- [ ] Créer compte sur https://render.com avec GitHub
- [ ] New Web Service → Sélectionner repo
- [ ] Root: `backend`, Build: `npm install`, Start: `npm start`
- [ ] Ajouter variables env (DB_HOST, DB_USER, DB_PASSWORD, etc.)
- [ ] Deploy → Copier URL

### 3️⃣ Vercel Frontend (2 min)
- [ ] Créer compte sur https://vercel.com avec GitHub
- [ ] Import project → Sélectionner repo
- [ ] Root: `frontend`, Framework: Vite
- [ ] Variable: `VITE_API_URL` = URL Render
- [ ] Deploy

### 4️⃣ Finaliser (1 min)
- [ ] Render → Modifier `FRONTEND_URL` = URL Vercel
- [ ] Tester l'application !

## 📦 Installer le driver PostgreSQL

```powershell
cd C:\TalentsAfricains\backend
npm install pg
```

## 🔄 Adapter le code pour PostgreSQL

### Option A : Garder MySQL en local, PostgreSQL en prod
Renommez `database.js` en `database.mysql.js` et créez un switch :

```javascript
// backend/src/config/database.js
if (process.env.USE_SUPABASE === 'true') {
  module.exports = require('./database.supabase');
} else {
  module.exports = require('./database.mysql');
}
```

### Option B : Migrer complètement vers PostgreSQL
Remplacez le contenu de `backend/src/config/database.js` par `database.supabase.js`

## 📝 Variables d'environnement Render

```
NODE_ENV=production
PORT=10000
USE_SUPABASE=true
DB_HOST=aws-0-eu-central-1.pooler.supabase.com
DB_PORT=5432
DB_USER=postgres.xxxxx
DB_PASSWORD=votre_mot_de_passe
DB_NAME=postgres
JWT_SECRET=generez_une_cle_aleatoire_32_caracteres
FRONTEND_URL=https://votre-app.vercel.app
```

## ✅ C'est tout !

Votre application est maintenant en ligne avec :
- ✅ Base de données PostgreSQL (Supabase)
- ✅ Backend Node.js (Render)
- ✅ Frontend React (Vercel)
- ✅ 100% GRATUIT

---

**Pour plus de détails, consultez `DEPLOIEMENT_SUPABASE.md`**
