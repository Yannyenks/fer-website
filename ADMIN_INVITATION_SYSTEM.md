# Système d'Inscription Séparée - Utilisateurs vs Administrateurs

## 📋 Vue d'ensemble

Le système d'inscription a été revu pour séparer complètement l'inscription des utilisateurs classiques de celle des administrateurs. Les administrateurs ne peuvent plus s'inscrire directement - ils doivent utiliser un lien d'invitation généré par un autre administrateur.

## 🔒 Sécurité

### Avant
- ❌ N'importe qui pouvait s'inscrire comme admin via une simple checkbox
- ❌ Risque de sécurité majeur en production

### Après
- ✅ Inscription utilisateur normale accessible publiquement (`/register`)
- ✅ Inscription admin uniquement via lien d'invitation (`/admin-register?token=...`)
- ✅ Tokens d'invitation avec expiration et usage unique
- ✅ Possibilité de lier l'invitation à un email spécifique

## 📁 Fichiers Créés/Modifiés

### Backend (PHP)
1. **`server/admin-invitations.sql`** ✨ NOUVEAU
   - Table pour stocker les invitations admin
   - Colonnes : token, created_by, email, expires_at, used_at, used_by

2. **`server/index.php`** ✏️ MODIFIÉ
   - Endpoints ajoutés :
     - `POST /api/admin/invitations` - Créer une invitation
     - `GET /api/admin/invitations` - Lister mes invitations
     - `GET /api/admin/invitations/verify/{token}` - Vérifier un token
     - `DELETE /api/admin/invitations/{id}` - Supprimer une invitation
   - Endpoint modifié :
     - `POST /api/admin/register` - Nécessite maintenant un `invitation_token`

### Frontend (React/TypeScript)
1. **`src/pages/AdminRegister.tsx`** ✨ NOUVEAU
   - Page d'inscription admin avec validation de token
   - Vérification automatique du token au chargement
   - Champ email pré-rempli si spécifié dans l'invitation
   - Interface utilisateur sécurisée

2. **`src/pages/admin/AdminInvitations.tsx`** ✨ NOUVEAU
   - Interface de gestion des invitations
   - Création d'invitations avec email optionnel
   - Durée de validité configurable (1-168 heures)
   - Liste des invitations avec statuts
   - Copie automatique du lien dans le presse-papier

3. **`src/pages/Register.tsx`** ✏️ MODIFIÉ
   - Checkbox admin retirée
   - Message informatif ajouté
   - Inscription uniquement pour utilisateurs classiques

4. **`src/App.tsx`** ✏️ MODIFIÉ
   - Route `/admin-register` ajoutée
   - Route `/admin/invitations` ajoutée
   - Import des nouveaux composants

5. **`src/pages/admin/AdminDashboard.tsx`** ✏️ MODIFIÉ
   - Lien vers la gestion des invitations ajouté

## 🚀 Utilisation

### Pour créer un premier administrateur

**Option 1 : Via base de données directement**
```sql
INSERT INTO admins (username, password, email, api_key, created_at)
VALUES (
  'admin',
  '$2y$10$...', -- Hash bcrypt du mot de passe
  'admin@fer2025.com',
  '...', -- Clé API générée
  NOW()
);
```

**Option 2 : Script PHP temporaire**
Créer `server/create-first-admin.php` :
```php
<?php
require_once 'db.php';

$username = 'admin';
$password = 'ChangeMe123!';
$email = 'admin@fer2025.com';

$hashed = password_hash($password, PASSWORD_BCRYPT);
$api_key = bin2hex(random_bytes(32));

$stmt = $pdo->prepare('INSERT INTO admins (username, password, email, api_key, created_at) VALUES (?, ?, ?, ?, NOW())');
$stmt->execute([$username, $hashed, $email, $api_key]);

echo "Admin créé !\n";
echo "Username: $username\n";
echo "Password: $password\n";
echo "API Key: $api_key\n";
```

### Pour inviter un nouvel administrateur

1. **Connectez-vous en tant qu'admin**
   - URL : `/login`
   - Cochez "Mode Admin"

2. **Accédez à la gestion des invitations**
   - URL : `/admin/invitations`
   - Ou via le dashboard admin

3. **Créez une invitation**
   - Cliquez sur "➕ Nouvelle invitation"
   - Optionnel : Spécifiez un email (recommandé)
   - Choisissez la durée de validité (défaut : 48h)
   - Cliquez sur "🎫 Générer l'invitation"

4. **Partagez le lien**
   - Le lien est automatiquement copié dans le presse-papier
   - Format : `https://votre-site.com/admin-register?token=abc123...`
   - Envoyez ce lien au futur administrateur

5. **Le destinataire s'inscrit**
   - Il clique sur le lien
   - Le système vérifie automatiquement le token
   - Il remplit le formulaire d'inscription
   - Son compte admin est créé et il est connecté automatiquement

## 🔑 Structure de la base de données

```sql
CREATE TABLE admin_invitations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(64) UNIQUE NOT NULL,         -- Token unique
    created_by INT NOT NULL,                   -- ID de l'admin créateur
    email VARCHAR(255),                        -- Email optionnel (restriction)
    expires_at DATETIME NOT NULL,              -- Date d'expiration
    used_at DATETIME NULL,                     -- Date d'utilisation (NULL si non utilisé)
    used_by INT NULL,                          -- ID de l'admin créé
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE CASCADE,
    FOREIGN KEY (used_by) REFERENCES admins(id) ON DELETE SET NULL
);
```

## 🎯 Flux d'inscription

### Utilisateur Classique
```
/register → Formulaire simple → API /user/register → Compte créé → Connexion auto
```

### Administrateur
```
Admin existant → /admin/invitations → Génère token
                                    ↓
                         Envoie lien au destinataire
                                    ↓
Destinataire → /admin-register?token=xxx → Vérifie token
                                         ↓
                              Formulaire validé
                                         ↓
                         API /admin/register (avec token)
                                         ↓
                          Compte admin créé → Connexion auto
```

## 📊 Statuts des invitations

- **⏳ Active** : Token valide, non utilisé, non expiré
- **✅ Utilisée** : Token utilisé pour créer un compte
- **⏰ Expirée** : Token dépassé la date d'expiration

## 🔐 Endpoints API

### Créer une invitation (Admin uniquement)
```http
POST /api/admin/invitations
Headers: X-ADMIN-KEY: {api_key}
Body: {
  "email": "nouvel.admin@fer2025.com",  // Optionnel
  "expires_in_hours": 48                 // 1-168
}

Response: {
  "ok": true,
  "id": 1,
  "token": "abc123...",
  "expires_at": "2025-11-25 12:00:00",
  "invitation_link": "/admin-register?token=abc123..."
}
```

### Lister mes invitations (Admin uniquement)
```http
GET /api/admin/invitations
Headers: X-ADMIN-KEY: {api_key}

Response: {
  "invitations": [
    {
      "id": 1,
      "token": "abc123...",
      "email": "admin@example.com",
      "expires_at": "2025-11-25 12:00:00",
      "used_at": null,
      "used_by_username": null,
      "created_at": "2025-11-23 12:00:00"
    }
  ]
}
```

### Vérifier un token (Public)
```http
GET /api/admin/invitations/verify/{token}

Response: {
  "valid": true,
  "email": "admin@example.com",  // Si spécifié
  "expires_at": "2025-11-25 12:00:00"
}

// Ou si invalide
Response: {
  "valid": false,
  "error": "Token expired"
}
```

### Inscription admin avec token
```http
POST /api/admin/register
Body: {
  "username": "nouvel_admin",
  "email": "admin@example.com",
  "password": "motdepasse123",
  "invitation_token": "abc123..."
}

Response: {
  "ok": true,
  "id": 2,
  "api_key": "xyz789..."
}
```

### Supprimer une invitation (Admin uniquement)
```http
DELETE /api/admin/invitations/{id}
Headers: X-ADMIN-KEY: {api_key}

Response: {
  "ok": true,
  "deleted": 1
}
```

## ⚠️ Points importants

1. **Premier admin** : Doit être créé manuellement en base de données ou via script
2. **Sécurité** : Les tokens sont générés avec `random_bytes(32)` (64 caractères hex)
3. **Expiration** : Par défaut 48h, maximum 7 jours (168h)
4. **Usage unique** : Chaque token ne peut être utilisé qu'une seule fois
5. **Email optionnel** : Peut être spécifié pour restreindre l'utilisation
6. **Cascade delete** : Si un admin est supprimé, ses invitations le sont aussi

## 🎨 Interface Utilisateur

### Page d'inscription utilisateur (`/register`)
- Formulaire simple : nom, email, mot de passe
- Message : "Les administrateurs doivent utiliser un lien d'invitation spécial"
- Pas de checkbox admin

### Page d'inscription admin (`/admin-register?token=xxx`)
- Vérification automatique du token au chargement
- Email pré-rempli si spécifié dans l'invitation
- Formulaire complet avec validation
- Message de succès et connexion automatique

### Page de gestion des invitations (`/admin/invitations`)
- Liste des invitations avec statuts
- Formulaire de création
- Copie automatique du lien
- Actions : Copier lien, Supprimer

## 📝 Migration

Pour migrer vers ce système :

1. **Appliquer le schéma SQL**
```bash
mysql -u user -p fer_database < server/admin-invitations.sql
```

2. **Créer le premier admin** (si nécessaire)
```sql
-- Voir section "Pour créer un premier administrateur"
```

3. **Redémarrer l'application**
```bash
npm run build
```

4. **Tester**
- Connexion admin : `/login` (mode admin)
- Créer invitation : `/admin/invitations`
- Tester inscription : `/admin-register?token=...`

## ✅ Avantages

1. **Sécurité** : Impossible de s'auto-promouvoir admin
2. **Traçabilité** : On sait qui a invité qui
3. **Contrôle** : Les admins contrôlent qui peut devenir admin
4. **Flexibilité** : Durée de validité configurable
5. **UX** : Processus clair et séparé

## 🔄 Compatibilité

- ✅ Compatible avec le système d'authentification existant
- ✅ Les utilisateurs existants ne sont pas affectés
- ✅ Les admins existants continuent de fonctionner normalement
- ✅ Aucune migration de données utilisateurs nécessaire

---

**Date de mise à jour** : 23 novembre 2025  
**Version** : 1.0.0  
**Status** : ✅ Prêt pour la production
