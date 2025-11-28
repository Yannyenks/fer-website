# 🔐 Guide : Créer le Super-Administrateur

## 📋 Vue d'ensemble

Il existe **3 méthodes** pour créer le premier administrateur (super-admin) :

| Méthode | Difficulté | Usage |
|---------|------------|-------|
| **1. Script CLI** | ⭐ Facile | Recommandé pour le premier admin |
| **2. Via invitation** | ⭐⭐ Moyen | Pour les admins suivants |
| **3. Insertion SQL directe** | ⭐⭐⭐ Avancé | Dépannage uniquement |

---

## ✅ Méthode 1 : Script CLI (RECOMMANDÉ)

### Avantages
- ✅ Pas besoin d'invitation
- ✅ Processus interactif guidé
- ✅ Validation automatique des données
- ✅ Génération automatique de l'API Key

### Étapes

1. **Ouvrir un terminal PowerShell**
   ```powershell
   cd C:\Users\Admin\Desktop\computer science\projets concrets\website\fer-website
   ```

2. **Exécuter le script**
   ```powershell
   php server/create-first-admin.php
   ```

3. **Suivre les instructions**
   ```
   === Création du premier administrateur ===

   Nom d'utilisateur : superadmin
   Email : admin@fer.com
   Mot de passe (min 6 caractères) : ********
   
   ✅ Administrateur créé avec succès !
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ID       : 1
   Username : superadmin
   Email    : admin@fer.com
   API Key  : a1b2c3d4e5f6...
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

4. **Se connecter**
   - Aller sur `http://localhost:3001/login`
   - Cocher **"Mode admin"**
   - Username : `superadmin`
   - Mot de passe : celui que vous avez saisi

### Vérifier les admins existants

```powershell
php server/check-admins.php
```

Sortie :
```
=== Liste des administrateurs ===

✅ 1 administrateur(s) trouvé(s) :

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ID        : 1
Username  : superadmin
Email     : admin@fer.com
Créé le   : 2025-11-28 19:30:00
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎫 Méthode 2 : Via Invitation (Pour les admins suivants)

### Prérequis
- ✅ Un admin existe déjà
- ✅ L'admin est connecté

### Étapes

1. **L'admin connecté crée une invitation**
   - Aller sur `/admin/invitations`
   - Saisir l'email du futur admin
   - Copier le token généré

2. **Le futur admin s'inscrit**
   - Aller sur `/admin-register`
   - Saisir username, email, mot de passe
   - Coller le token d'invitation
   - Cliquer sur "S'inscrire"

3. **Vérification**
   ```powershell
   php server/check-admins.php
   ```

---

## 🔧 Méthode 3 : Insertion SQL Directe (DÉPANNAGE)

### ⚠️ À utiliser uniquement si les autres méthodes échouent

### Via phpMyAdmin

1. Ouvrir phpMyAdmin
2. Sélectionner votre base de données (`jvepi`)
3. Onglet SQL
4. Exécuter :

```sql
-- Générer un mot de passe hashé (ex: "password123")
-- Hash bcrypt de "password123" : $2y$10$...

INSERT INTO admins (username, password, email, api_key, created_at)
VALUES (
    'superadmin',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- "password123"
    'admin@fer.com',
    'a1b2c3d4e5f6789012345678901234567890123456789012345678901234',
    NOW()
);
```

### Via Terminal MySQL

```bash
mysql -u root -p jvepi
```

```sql
INSERT INTO admins (username, password, email, api_key, created_at)
VALUES (
    'superadmin',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'admin@fer.com',
    CONCAT(MD5(RAND()), MD5(RAND())),
    NOW()
);
```

**Note :** Le mot de passe hashé ci-dessus correspond à `"password123"`. Changez-le immédiatement après connexion.

---

## 🔍 Diagnostic et Résolution de Problèmes

### Problème : "Aucun admin trouvé"

```powershell
php server/check-admins.php
```

Si aucun admin, utilisez la **Méthode 1**.

### Problème : "Username already exists"

Vérifier les admins existants :
```powershell
php server/check-admins.php
```

Utiliser un autre username ou supprimer l'admin existant :
```sql
DELETE FROM admins WHERE username = 'superadmin';
```

### Problème : "Database connection failed"

Vérifier le fichier `.env` :
```ini
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=jvepi
DB_USER=root
DB_PASS=
```

Tester la connexion :
```powershell
php -r "require 'server/db.php'; db_connect(); echo 'OK';"
```

### Problème : "Table 'admins' doesn't exist"

Initialiser la base de données :
```powershell
php server/init-db.php
```

---

## 📊 Workflow Complet

```
┌─────────────────────────────────────┐
│  1. Créer le Super-Admin            │
│     php server/create-first-admin.php│
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  2. Vérifier la création             │
│     php server/check-admins.php      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  3. Se connecter                     │
│     http://localhost:3001/login      │
│     ✓ Mode admin                     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  4. Créer des invitations            │
│     /admin/invitations               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  5. Les autres admins s'inscrivent   │
│     /admin-register (avec token)     │
└─────────────────────────────────────┘
```

---

## 🎯 Recommandations de Sécurité

### ✅ À FAIRE
- Utiliser un mot de passe fort (12+ caractères)
- Conserver l'API Key en lieu sûr
- Ne pas partager les identifiants
- Créer un admin par personne (pas de comptes partagés)
- Révoquer les invitations non utilisées

### ❌ À ÉVITER
- Mots de passe faibles ("admin123", "password")
- Stocker les mots de passe en clair
- Utiliser le même mot de passe partout
- Laisser les tokens d'invitation expirer sans surveillance

---

## 📞 Support

En cas de problème :

1. **Vérifier les logs PHP**
   ```powershell
   # Terminal où tourne le serveur PHP
   # Les erreurs s'affichent en direct
   ```

2. **Tester la connexion DB**
   ```powershell
   php -r "require 'server/db.php'; try { db_connect(); echo 'OK'; } catch (Exception $e) { echo $e->getMessage(); }"
   ```

3. **Réinitialiser complètement** (⚠️ ATTENTION : supprime TOUTES les données)
   ```sql
   DROP TABLE IF EXISTS admin_invitations;
   DROP TABLE IF EXISTS admins;
   ```
   Puis :
   ```powershell
   php server/init-db.php
   php server/create-first-admin.php
   ```

---

## ✅ Checklist Post-Installation

- [ ] Super-admin créé avec succès
- [ ] Connexion testée sur `/login` (mode admin)
- [ ] Accès à `/admin/candidates` confirmé
- [ ] Système d'invitation fonctionnel
- [ ] API Key sauvegardée en lieu sûr
- [ ] Mot de passe fort utilisé
- [ ] Email de récupération configuré

---

**Date de création :** 28 novembre 2025  
**Version :** 1.0
