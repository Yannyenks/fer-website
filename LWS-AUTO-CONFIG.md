# 🚀 Configuration Automatique pour LWS

## Détection Automatique de l'Environnement

Le système détecte automatiquement si vous êtes en **développement** (local) ou en **production** (LWS) selon ces critères :

### ✅ Vous êtes en PRODUCTION si :

1. **Marqueur de production existe** : `server/.production-marker`
   ```bash
   # Sur le serveur LWS, créer ce fichier :
   touch server/.production-marker
   ```

2. **Variable d'environnement système** : `APP_ENV=production`
   - Définie automatiquement via `server/.htaccess` sur LWS
   - Le fichier `.htaccess` contient : `SetEnv APP_ENV production`

3. **Domaine de production détecté** :
   - `jvepi.com` ✅
   - `*.lws-hosting.com` ✅
   - `*.lws.fr` ✅

4. **Serveur Linux** avec structure d'hébergement
   - Détection du dossier `/home/jvepi` ou `/home/username`

### ✅ Vous êtes en DÉVELOPPEMENT si :

1. **Windows** : automatiquement en développement (sauf si `.production-marker`)
2. **localhost** ou **127.0.0.1** dans l'URL
3. Pas de marqueur de production

---

## 📦 Configuration Rapide sur LWS

### Option 1 : Automatique (Recommandé)

Le fichier `server/.htaccess` est déjà configuré et définit automatiquement `APP_ENV=production` :

```apache
<IfModule mod_env.c>
    SetEnv APP_ENV production
</IfModule>
```

**C'est tout ! Le serveur LWS comprendra automatiquement.**

### Option 2 : Marqueur Explicite

Si la méthode 1 ne fonctionne pas, créez simplement un fichier vide :

```bash
# Via SSH sur LWS :
cd /home/votre-user/public_html/server
touch .production-marker
```

Ou via FTP : uploadez un fichier vide nommé `.production-marker` dans le dossier `server/`.

---

## 🔍 Vérifier l'Environnement Actuel

### Sur votre machine locale (Windows) :

```powershell
.\check-env.ps1
```

Résultat attendu :
```
🟢 Running in DEVELOPMENT mode
   - Using local database
   - Debug mode should be ON
```

### Sur le serveur LWS :

Visitez : `https://jvepi.com/api/check-env` (à créer, voir ci-dessous)

---

## 🛠️ Endpoint de Diagnostic (Optionnel)

Ajoutez cette route dans `server/index.php` pour vérifier l'environnement :

```php
if ($route === 'check-env' && $method === 'GET') {
    require_admin(); // ou commentez pour test public temporaire
    
    $info = [
        'environment' => env('APP_ENV'),
        'is_production' => is_production(),
        'is_development' => is_development(),
        'debug_enabled' => is_debug_enabled(),
        'php_os' => PHP_OS_FAMILY,
        'http_host' => $_SERVER['HTTP_HOST'] ?? 'unknown',
        'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'unknown',
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown',
        'has_production_marker' => file_exists(__DIR__ . '/.production-marker'),
        'env_vars' => [
            'APP_ENV' => getenv('APP_ENV'),
            'DB_HOST' => env('DB_HOST'),
            'DB_NAME' => env('DB_NAME'),
            'API_URL' => env('API_URL'),
        ]
    ];
    
    json_response($info);
}
```

---

## 📝 Checklist pour LWS

### Avant le déploiement :

- [ ] Fichier `server/.env.production` avec les bonnes credentials LWS
- [ ] Fichier `server/.htaccess` contient `SetEnv APP_ENV production`
- [ ] Build frontend : `npm run build`

### Après l'upload sur LWS :

- [ ] Vérifier que `server/.htaccess` est bien uploadé
- [ ] Tester l'API : `https://jvepi.com/api/candidates`
- [ ] Si besoin, créer `server/.production-marker` manuellement

### En cas de doute :

```bash
# Via SSH LWS, afficher l'environnement détecté :
php -r "require 'server/env.php'; echo 'ENV: ' . env('APP_ENV') . PHP_EOL;"
```

---

## 🚨 Sécurité Importante

### Sur votre machine locale (Windows) :

- ⚠️ **NE JAMAIS** créer `server/.production-marker`
- ⚠️ **NE JAMAIS** mettre `APP_ENV=production` dans `server/.env` local
- ✅ Toujours utiliser `server/.env.development` ou `server/.env` en mode dev

### Sur le serveur LWS :

- ✅ Le fichier `server/.htaccess` force automatiquement `APP_ENV=production`
- ✅ Le fichier `server/.env` devrait être une copie de `.env.production`
- ⚠️ **NE JAMAIS** exposer `.env` publiquement (protégé par `.htaccess`)

---

## 🐛 Dépannage

### Le serveur LWS n'utilise pas le bon environnement

**Solution 1** : Créer le marqueur
```bash
touch server/.production-marker
```

**Solution 2** : Vérifier le `.htaccess`
```bash
cat server/.htaccess | grep APP_ENV
# Doit afficher : SetEnv APP_ENV production
```

**Solution 3** : Forcer dans le code
Dans `server/index.php`, tout en haut après les `require` :
```php
putenv('APP_ENV=production');
```

### Les URLs pointent vers localhost:8000 en production

- Vérifiez que `server/.env` (ou `.env.production`) contient :
  ```
  API_URL=https://jvepi.com/api
  APP_URL=https://jvepi.com
  ```
- Le système détecte maintenant automatiquement l'URL depuis `$_SERVER['HTTP_HOST']`

---

## ✅ Résumé

**Sur LWS, le serveur comprendra automatiquement qu'il est en production grâce à :**

1. La variable `SetEnv APP_ENV production` dans `server/.htaccess` ✅
2. La détection du domaine `jvepi.com` ✅
3. La détection du système Linux ✅

**Aucune configuration manuelle supplémentaire n'est nécessaire !** 🎉
