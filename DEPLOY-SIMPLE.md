# 🚀 DÉPLOIEMENT SUR LWS - GUIDE SIMPLE

## ✅ Pré-requis Terminés

- ✅ Frontend build avec chemins relatifs (`/api`, `/storage`)
- ✅ Backend configuré pour détecter automatiquement la production
- ✅ `.htaccess` prêt pour servir `dist/` et router l'API

## 📦 Fichiers à Uploader sur LWS

Via FTP (FileZilla, WinSCP, ou FTP LWS), uploadez UNIQUEMENT ces dossiers :

```
📁 Racine de votre site LWS (public_html ou www)
│
├── 📁 dist/                    ✅ OBLIGATOIRE - Frontend compilé
│   ├── index.html
│   ├── assets/
│   └── .htaccess
│
├── 📁 server/                  ✅ OBLIGATOIRE - Backend PHP
│   ├── .env.production        ✅ Sera utilisé automatiquement
│   ├── index.php
│   ├── db.php
│   ├── env.php
│   ├── helpers.php
│   ├── schema.sql
│   └── swagger.json
│
├── 📁 storage/                 ✅ OBLIGATOIRE - Images uploadées
│   └── (vide au départ)
│
├── 📄 .htaccess               ✅ OBLIGATOIRE - Configuration Apache
└── 📄 init-server.php         ⚠️  Pour initialisation (à supprimer après)
```

## 🔧 Étapes de Déploiement

### 1️⃣ Build Local
```bash
npm run build -- --mode production
```

### 2️⃣ Upload FTP
- Connectez-vous à votre FTP LWS
- Uploadez les dossiers listés ci-dessus
- **Important** : Ne PAS uploader `node_modules`, `src`, `.git`

### 3️⃣ Initialisation Base de Données

Visitez **UNE SEULE FOIS** :
```
https://jvepi.com/init-server.php
```

Ce script va :
- ✅ Détecter automatiquement l'environnement production
- ✅ Charger `.env.production`
- ✅ Connecter à la base de données (185.98.131.161)
- ✅ Créer les tables si nécessaire
- ✅ Configurer le dossier `storage/`

### 4️⃣ Sécurité POST-Installation

**IMPORTANT** : Après l'initialisation, connectez-vous en FTP et :

1. **Supprimez** `init-server.php`
2. **Éditez** `server/.env` et changez :
   ```env
   APP_SECRET=votre_secret_aleatoire_tres_long
   ADMIN_USER=votre_nom_admin
   ADMIN_PASS=votre_mot_de_passe_securise
   ```

### 5️⃣ Test du Site

Ouvrez votre navigateur :
- ✅ Frontend : https://jvepi.com
- ✅ Candidats : https://jvepi.com/concours/candidates  
- ✅ API : https://jvepi.com/api/candidates
- ✅ Swagger : https://jvepi.com/swagger

## 🎯 Vérifications Automatiques

Le système détecte automatiquement la production si :
- Le domaine contient `jvepi.com` ✅
- OU le domaine contient `.lws-hosting.com` ✅
- OU c'est un serveur Linux (détecté via `/home`) ✅

**Aucune configuration manuelle nécessaire !**

## 📝 Structure du .htaccess (Déjà Configuré)

Le fichier `.htaccess` à la racine fait automatiquement :
```apache
/ → dist/index.html (frontend)
/api/* → server/index.php (backend)
/storage/* → server/index.php (images)
/concours/* → dist/index.html (SPA routing)
```

## 🐛 Dépannage Rapide

### Site affiche erreur 500
→ Vérifiez les permissions : `chmod 755` dossiers, `chmod 644` fichiers

### API ne répond pas
→ Vérifiez que `server/.env` existe (copie de `.env.production`)

### Images ne chargent pas
→ Vérifiez permissions du dossier `storage/` : `chmod 755`

### Base de données inaccessible
→ Vérifiez les credentials dans `server/.env.production`
→ Contactez support LWS si l'IP n'a pas accès

## 📊 Configuration Base de Données (Dans .env.production)

```env
DB_HOST=185.98.131.161
DB_NAME=jvepi2701058
DB_USER=jvepi2701058
DB_PASS=xnbjzhqtcy
```

Ces valeurs sont déjà dans `server/.env.production` !

## ✨ Mises à Jour Futures

Pour mettre à jour le site :
1. Modifier le code local
2. `npm run build -- --mode production`
3. Upload du nouveau dossier `dist/` via FTP
4. Upload des fichiers `server/` modifiés si nécessaire

**Pas besoin de refaire l'init-server.php !**

## 🆘 Support

En cas de problème :
1. Vérifiez les logs Apache dans l'espace client LWS
2. Vérifiez que tous les fichiers sont bien uploadés
3. Contactez le support LWS si nécessaire
