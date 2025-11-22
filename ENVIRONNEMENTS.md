# 📋 Résumé : Gestion des Environnements

## ✅ SITUATION ACTUELLE (corrigée)

### Sur votre machine locale (Windows) :
- **Environnement** : 🟢 DEVELOPMENT
- **Base de données** : localhost (MySQL local)
- **API URL** : http://localhost:8000
- **Config** : `server/.env` (copie de `.env.development`)

### Sur le serveur LWS :
- **Environnement** : 🔴 PRODUCTION (détection automatique)
- **Base de données** : 185.98.131.161 (serveur LWS)
- **API URL** : https://jvepi.com/api
- **Config** : `server/.env` (doit être copie de `.env.production`)

---

## 🔧 Comment ça marche

### Détection Automatique

Le système détecte automatiquement l'environnement en **3 niveaux de priorité** :

#### 1️⃣ PRIORITÉ HAUTE : Marqueur explicite
- Fichier `server/.production-marker` existe → **PRODUCTION**
- Fichier absent → vérifier niveau 2

#### 2️⃣ PRIORITÉ MOYENNE : Variable système
- Via `.htaccess` sur LWS : `SetEnv APP_ENV production` → **PRODUCTION**
- Windows sans marqueur → **DEVELOPMENT**

#### 3️⃣ PRIORITÉ BASSE : Détection automatique
- Domaine `jvepi.com` → **PRODUCTION**
- Domaine `localhost` → **DEVELOPMENT**
- Linux + `/home/` → **PRODUCTION**
- Windows → **DEVELOPMENT**

---

## 🎯 LWS Mutualisé : C'est automatique !

**Oui, le serveur LWS comprendra facilement** grâce à :

### 1. Le fichier `.htaccess` ✅
```apache
<IfModule mod_env.c>
    SetEnv APP_ENV production
</IfModule>
```
→ Définit automatiquement `APP_ENV=production` sur le serveur

### 2. La détection du domaine ✅
- URL contient `jvepi.com` → automatiquement en production

### 3. La détection du système ✅  
- Serveur Linux (LWS) → automatiquement en production
- Windows (votre PC) → automatiquement en développement

---

## 🛠️ Commandes Utiles

### En local (Windows)

```powershell
# Vérifier l'environnement actuel
.\check-env.ps1

# Passer en développement (local)
.\switch-env.ps1 development

# Passer en production (pour tester en local)
.\switch-env.ps1 production
```

### Sur LWS (via SSH)

```bash
# Vérifier l'environnement
php -r "require 'server/env.php'; echo env('APP_ENV');"

# Afficher la configuration
cat server/.env | grep APP_ENV

# Créer un marqueur de production (si besoin)
touch server/.production-marker
```

---

## ⚠️ Sécurité Importante

### ❌ À NE JAMAIS FAIRE en local :

```powershell
# NE PAS créer ce fichier en local !
New-Item server/.production-marker

# NE PAS mettre production dans .env local !
# server/.env doit être en development
```

### ✅ Configuration Correcte :

**Local (Windows)** :
- `server/.env` → copie de `.env.development`
- `APP_ENV=development`
- `DB_HOST=127.0.0.1`
- Pas de `.production-marker`

**Serveur LWS** :
- `server/.env` → copie de `.env.production`  
- `APP_ENV=production` (dans le fichier)
- `DB_HOST=185.98.131.161`
- `.htaccess` définit automatiquement l'environnement

---

## 🚀 Déploiement sur LWS

### Étapes simples :

1. **Build local** :
   ```bash
   npm run build
   ```

2. **Upload via FTP** :
   - `dist/` → tout le contenu
   - `server/` → tous les fichiers
   - `.htaccess` → à la racine du domaine

3. **Configurer la DB** :
   - S'assurer que `server/.env` contient les credentials LWS
   - Ou copier `server/.env.production` → `server/.env`

4. **Initialiser** :
   - Visiter `https://jvepi.com/init-server.php` (une seule fois)
   - Ou via SSH : `php init-server.php`

5. **Vérifier** :
   - `https://jvepi.com` → site web
   - `https://jvepi.com/api/candidates` → API

**C'est tout !** Le serveur LWS comprend automatiquement qu'il est en production. ✅

---

## 📚 Documentation Complète

- **LWS-AUTO-CONFIG.md** : Configuration automatique détaillée
- **DEPLOY-LWS.md** : Guide complet de déploiement
- **README-ENV.md** : Gestion des environnements

---

## 🐛 En cas de problème

### L'environnement n'est pas détecté correctement sur LWS

**Solution rapide** : Créer le marqueur explicite
```bash
touch server/.production-marker
```

### Les URLs sont incorrectes

Vérifier `server/.env` sur LWS :
```env
API_URL=https://jvepi.com/api
APP_URL=https://jvepi.com
```

### La base de données n'est pas la bonne

Vérifier que `server/.env` sur LWS contient :
```env
APP_ENV=production
DB_HOST=185.98.131.161
DB_NAME=jvepi2701058
DB_USER=jvepi2701058
DB_PASS=xnbjzhqtcy
```

---

## ✅ Checklist Rapide

### Local (Windows) ✓
- [x] `.\check-env.ps1` affiche "DEVELOPMENT"
- [x] Pas de `.production-marker`
- [x] `APP_ENV=development` dans `.env`
- [x] Base de données locale (127.0.0.1)

### Serveur LWS ✓
- [ ] `.htaccess` uploadé avec `SetEnv APP_ENV production`
- [ ] `.env` contient les credentials de production
- [ ] Domaine pointe vers `jvepi.com`
- [ ] API accessible : `https://jvepi.com/api/candidates`

---

**Conclusion** : Oui, un serveur mutualisé LWS comprendra facilement grâce à la détection automatique ! 🎉
