# Guide de Test Local - Simulation LWS
# Ce fichier simule l'environnement de production LWS en local

## 🔧 Configuration Requise

- Apache avec mod_rewrite activé
- PHP 8.0+
- MySQL

## 📦 Étapes de Test Local

### 1. Configurer Apache

Créer un VirtualHost dans votre configuration Apache (`httpd-vhosts.conf` ou équivalent) :

```apache
<VirtualHost *:80>
    ServerName jvepi.local
    DocumentRoot "C:/Users/Admin/Desktop/computer science/projets concrets/flutter/fer-website"
    
    <Directory "C:/Users/Admin/Desktop/computer science/projets concrets/flutter/fer-website">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Logs
    ErrorLog "logs/jvepi-error.log"
    CustomLog "logs/jvepi-access.log" common
</VirtualHost>
```

### 2. Modifier le fichier hosts

Ajouter dans `C:\Windows\System32\drivers\etc\hosts` :
```
127.0.0.1  jvepi.local
```

### 3. Configurer l'environnement

Créer un fichier `.production-marker` à la racine :
```bash
New-Item -ItemType File -Path ".production-marker"
```

Cela forcera le système à utiliser `.env.production` même en local.

### 4. Build du Frontend

```bash
npm run build -- --mode production
```

### 5. Redémarrer Apache

Redémarrer Apache pour appliquer les changements.

### 6. Tester

Ouvrir dans le navigateur :
- Frontend: `http://jvepi.local`
- API: `http://jvepi.local/api/candidates`
- Swagger: `http://jvepi.local/swagger`

## ✅ Vérifications

### Frontend s'affiche
```bash
curl http://jvepi.local
# Doit retourner le HTML de dist/index.html
```

### API fonctionne
```bash
curl http://jvepi.local/api/candidates
# Doit retourner les candidats JSON
```

### Images accessibles
```bash
curl -I http://jvepi.local/storage/test.jpg
# Doit retourner 200 ou 404 (pas 403)
```

### Routes SPA fonctionnent
```bash
curl http://jvepi.local/concours/candidates
# Doit retourner index.html (pas 404)
```

## 🐛 Dépannage

### Frontend ne s'affiche pas
- Vérifier que `dist/` existe et contient des fichiers
- Vérifier le DocumentRoot dans Apache
- Vérifier que `.htaccess` est bien lu (AllowOverride All)

### API retourne 404
- Vérifier que mod_rewrite est activé dans Apache
- Vérifier le `.htaccess` à la racine
- Consulter les logs Apache

### Images ne se chargent pas
- Vérifier que le dossier `storage/` existe
- Vérifier les permissions
- Vérifier le RewriteRule pour /storage dans .htaccess

## 🚀 Alternative: Test sans Apache (PHP uniquement)

Si vous ne voulez pas configurer Apache, utilisez le serveur PHP intégré :

```bash
# Terminal 1 - Backend API
cd server
php -S localhost:8000

# Terminal 2 - Frontend statique
cd dist
php -S localhost:3000

# Tester
# Frontend: http://localhost:3000
# API: http://localhost:8000/api/candidates
```

**Note**: Cette méthode ne teste pas les RewriteRules du .htaccess.
