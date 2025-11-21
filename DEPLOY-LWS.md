# Guide de Déploiement sur LWS

## 📦 Préparation du Projet

### 1. Build du Frontend
```bash
# En local, avant d'uploader
npm run build
```
Cela crée le dossier `dist/` avec les fichiers statiques.

### 2. Fichiers à Uploader sur LWS

Via FTP/SFTP, uploadez ces dossiers/fichiers :
```
/
├── dist/                    # Fichiers frontend compilés
├── server/                  # Backend PHP
│   ├── .env.production     # Configuration production
│   ├── index.php
│   ├── db.php
│   ├── env.php
│   ├── helpers.php
│   ├── schema.sql
│   └── ...
├── storage/                 # Dossier pour images uploadées
├── init-server.php         # Script d'initialisation
└── .htaccess              # Configuration Apache (à créer)
```

## 🔧 Configuration sur LWS

### 1. Créer le fichier .htaccess à la racine

Créez `/public_html/.htaccess` (ou à la racine de votre domaine) :

```apache
# Activer le moteur de réécriture
RewriteEngine On
RewriteBase /

# Servir les fichiers statiques du dossier dist
RewriteCond %{REQUEST_URI} !^/api
RewriteCond %{REQUEST_URI} !^/storage
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ dist/$1 [L]

# Si le fichier n'existe pas dans dist, servir index.html (SPA)
RewriteCond %{REQUEST_URI} !^/api
RewriteCond %{REQUEST_URI} !^/storage
RewriteCond %{DOCUMENT_ROOT}/dist/%{REQUEST_URI} !-f
RewriteCond %{DOCUMENT_ROOT}/dist/%{REQUEST_URI} !-d
RewriteRule ^(.*)$ dist/index.html [L]

# Routes API vers le backend PHP
RewriteRule ^api/(.*)$ server/index.php [QSA,L]

# Servir les images du dossier storage
RewriteRule ^storage/(.*)$ server/index.php [QSA,L]

# Swagger
RewriteRule ^swagger$ server/index.php [QSA,L]
RewriteRule ^api/swagger.json$ server/swagger.json [L]

# Sécurité: Bloquer l'accès direct aux fichiers .env
<FilesMatch "^\.env">
    Order allow,deny
    Deny from all
</FilesMatch>

# Permissions pour le dossier storage
<Directory "storage">
    Options -Indexes
    AllowOverride None
    Require all granted
</Directory>
```

### 2. Configuration de la Base de Données

Dans votre espace client LWS :

1. **Créer une base MySQL** (si pas déjà fait)
2. **Noter les informations** :
   - Host: `185.98.131.161` (ou celui fourni par LWS)
   - Database: `jvepi2701058`
   - Username: `jvepi2701058`
   - Password: `xnbjzhqtcy`

3. **Mettre à jour `server/.env.production`** avec ces infos

### 3. Initialisation Automatique

Via SSH (si disponible sur LWS) ou via l'interface PHP de LWS :

```bash
# Se connecter en SSH
ssh votre-user@votre-domaine.lws-hosting.com

# Aller dans le dossier
cd public_html  # ou htdocs selon LWS

# Rendre le script exécutable
chmod +x init-server.sh
chmod +x init-server.php

# Exécuter l'initialisation
php init-server.php
```

**Ou via navigateur** :
- Visitez `https://jvepi.com/init-server.php` (une seule fois)
- Le script va automatiquement :
  - ✅ Détecter l'environnement production
  - ✅ Charger `.env.production`
  - ✅ Tester la connexion DB
  - ✅ Créer le schéma (tables) si nécessaire
  - ✅ Configurer le dossier storage

### 4. Sécurité Post-Installation

**Important** : Après la première initialisation, éditez `server/.env` :

```bash
# Changer ces valeurs !
APP_SECRET=votre_secret_tres_aleatoire_ici_2025
ADMIN_USER=votre_admin
ADMIN_PASS=votre_mot_de_passe_securise

# Vérifier
APP_DEBUG=false
APP_ENV=production
```

**Supprimer le script d'init** (ou le protéger) :
```bash
rm init-server.php
# OU créer un .htaccess pour le bloquer
```

## 🔍 Vérifications

### 1. Tester l'API
```bash
curl https://jvepi.com/api/candidates
```

### 2. Tester le Frontend
Visitez `https://jvepi.com` dans votre navigateur

### 3. Vérifier les Logs
Dans LWS, consultez les logs PHP pour voir les erreurs éventuelles.

## 🐛 Dépannage LWS

### Erreur 500
- Vérifier les permissions : `chmod 755` pour dossiers, `chmod 644` pour fichiers
- Vérifier le `.htaccess`
- Consulter les logs d'erreur PHP dans votre espace LWS

### Images ne se chargent pas
```bash
# Vérifier les permissions du dossier storage
chmod 755 storage
chmod 644 storage/*
```

### Base de données inaccessible
- Vérifier que l'IP du serveur LWS a accès à la DB
- Vérifier les credentials dans `.env.production`
- Contacter le support LWS si nécessaire

### CORS Errors
Le backend est déjà configuré pour accepter `https://jvepi.com`.
Si problème, vérifier `FRONTEND_URL` dans `.env.production`.

## 📱 Gestion Continue

### Déployer une mise à jour

1. **Local** :
```bash
npm run build
git add .
git commit -m "Update"
git push
```

2. **Sur LWS** (via FTP) :
- Uploader le nouveau dossier `dist/`
- Uploader les fichiers `server/` modifiés si nécessaire

### Backup Base de Données
Via phpMyAdmin dans votre espace LWS :
- Export > SQL > Télécharger

## ✅ Checklist de Déploiement

- [ ] Build frontend (`npm run build`)
- [ ] Upload des fichiers via FTP
- [ ] `.htaccess` créé et configuré
- [ ] Base de données créée sur LWS
- [ ] `.env.production` mis à jour avec bonnes credentials
- [ ] Exécuter `init-server.php` (une fois)
- [ ] Changer APP_SECRET, ADMIN_USER, ADMIN_PASS
- [ ] Supprimer/protéger `init-server.php`
- [ ] Tester le site : https://jvepi.com
- [ ] Tester l'API : https://jvepi.com/api/candidates
- [ ] Vérifier que les images s'uploadent
- [ ] Vérifier que les votes fonctionnent

## 🆘 Support

Si problème avec LWS :
1. Consulter la documentation LWS
2. Contacter le support technique LWS
3. Vérifier les logs dans votre espace client
