# Guide de Configuration des Environnements

## 📁 Structure des fichiers

```
server/
├── .env                    # Fichier actif (auto-généré, gitignored)
├── .env.development        # Configuration développement
├── .env.production         # Configuration production
├── .env.local             # Overrides locaux (optionnel, gitignored)
└── env.php                # Chargeur intelligent d'environnement
```

## 🔄 Switcher entre environnements

### Windows (PowerShell)
```powershell
# Passer en développement
.\switch-env.ps1 development

# Passer en production
.\switch-env.ps1 production
```

### Linux/Mac (Bash)
```bash
# Rendre le script exécutable
chmod +x switch-env.sh

# Passer en développement
./switch-env.sh development

# Passer en production
./switch-env.sh production
```

### Manuel
```bash
# Copier le fichier d'environnement souhaité
cp server/.env.development server/.env
# OU
cp server/.env.production server/.env

# Définir la variable d'environnement
export APP_ENV=development  # ou production
```

## ⚙️ Configuration Frontend

Créez les fichiers `.env` à la racine du projet :

**`.env.development`**
```env
VITE_API_URL=http://localhost:8000/api
```

**`.env.production`**
```env
VITE_API_URL=https://jvepi.com/api
```

Vite chargera automatiquement le bon fichier selon le mode de build.

## 🔧 Fonctions utiles (PHP)

```php
// Dans votre code PHP
env('DB_HOST')              // Récupère une valeur
env('DB_HOST', 'localhost') // Avec valeur par défaut

is_production()             // true si APP_ENV=production
is_development()            // true si APP_ENV=development
is_debug_enabled()          // true si APP_DEBUG=true
```

## 📝 Ordre de priorité des fichiers

1. `.env.local` (overrides locaux, jamais commité)
2. `.env.{APP_ENV}` (spécifique à l'environnement)
3. `.env` (base, gitignored)

## 🔒 Sécurité

### Fichiers à commiter
- ✅ `.env.development` (sans secrets sensibles)
- ✅ `.env.production` (template, changer les mots de passe)
- ❌ `.env` (généré automatiquement)
- ❌ `.env.local` (overrides personnels)

### À faire en production
1. Changer `APP_SECRET` dans `.env.production`
2. Changer `ADMIN_USER` et `ADMIN_PASS`
3. Définir `APP_DEBUG=false`
4. Configurer les credentials email si nécessaire

## 🚀 Démarrage rapide

### Développement
```bash
# 1. Switcher en dev
.\switch-env.ps1 development

# 2. Démarrer le backend
php -S localhost:8000 -t server server/index.php

# 3. Démarrer le frontend
npm run dev
```

### Production
```bash
# 1. Switcher en prod
.\switch-env.ps1 production

# 2. Build le frontend
npm run build

# 3. Configurer le serveur web (Apache/Nginx)
# Pointer vers le dossier dist/
```

## 🐛 Dépannage

### La base de données ne se connecte pas
- Vérifiez que le fichier `.env` existe
- Vérifiez les credentials dans `.env.{environment}`
- Vérifiez que `APP_ENV` est correctement défini

### Les changements ne sont pas pris en compte
- Redémarrez le serveur PHP
- Videz le cache si vous utilisez un système de cache
- Vérifiez que le bon fichier `.env` est chargé

### Variables non définies
- Utilisez toujours `env()` avec une valeur par défaut
- Vérifiez l'ordre de priorité des fichiers
