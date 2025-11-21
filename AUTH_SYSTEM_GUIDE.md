# 🔐 Guide Système d'Authentification JVEPI Centre

## Vue d'ensemble

Le système d'authentification a été complètement refactorisé pour supporter :
- ✅ **Inscription/Connexion utilisateurs** et **administrateurs**
- ✅ **Interface moderne** avec React + TypeScript
- ✅ **API backend PHP** robuste avec validation
- ✅ **Menu utilisateur** avec gestion complète des sessions
- ✅ **Système FER 2025** intégré pour participants et candidats

---

## 🚀 Démarrage Rapide

### 1. Lancer le serveur backend
```powershell
cd server
php -S localhost:8000
```

### 2. Lancer l'interface React
```powershell
npm run dev
# Accès: http://localhost:5173
```

### 3. Tests automatisés
```powershell
# Test API complet
./test-auth-complete.ps1

# Test interface web
# Ouvrir: test-auth-system.html
```

---

## 👥 Comptes de Test

| Type | Utilisateur | Mot de passe |
|------|-------------|--------------|
| **Admin** | `admin` | `admin123` |
| **Utilisateur** | `test_user` | `test123` |

---

## 🏗️ Architecture

### Frontend (React + TypeScript)
```
src/
├── components/
│   ├── AuthProvider.tsx     # 🔑 Gestion auth centrale
│   ├── UserMenu.tsx         # 👤 Menu utilisateur
│   └── Header.tsx           # 🧭 Navigation avec auth
├── pages/
│   ├── Login.tsx            # 🔐 Connexion dual-mode
│   ├── Register.tsx         # ✨ Inscription dual-mode
│   └── Inscription.tsx      # 🎯 FER 2025 système
```

### Backend (PHP)
```
server/
├── index.php               # 🌐 API endpoints
├── db.php                  # 🗄️ Base de données
└── helpers.php             # 🛠️ Utilitaires
```

---

## 🔌 API Endpoints

### Utilisateurs
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/user/register` | Inscription utilisateur |
| `POST` | `/api/user/login` | Connexion utilisateur |

### Administrateurs  
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/admin/register` | Inscription admin |
| `POST` | `/api/admin/login` | Connexion admin + API key |
| `GET` | `/api/admin/candidates` | Liste candidats (auth requis) |

### FER 2025
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/fer/register` | Inscription participant/candidat |

---

## 🔐 Système d'Authentification

### Utilisateurs Standards
- **Stockage**: `localStorage`
- **Session**: Persistante navigateur
- **Accès**: Pages utilisateur, profil, inscription FER

### Administrateurs
- **Stockage**: `localStorage` + `adminApiKey`
- **API Key**: Header `X-ADMIN-KEY`
- **Accès**: Panel admin, gestion candidats, toutes fonctionnalités

---

## 🎯 Fonctionnalités FER 2025

### Types de Participation
1. **Participant** - Accès aux événements
2. **Candidat** - Concours Miss/Master FER 2025

### Catégories Candidats
- 👑 **Miss FER 2025**
- 🤵 **Master FER 2025**

### Workflow
```
Connexion utilisateur → Inscription FER → Sélection type → 
[Si candidat] → Choix catégorie → Upload photo
```

---

## 🎨 Interface Utilisateur

### Menu Utilisateur (`UserMenu.tsx`)
- **Statut en temps réel** avec indicateur couleur
- **Menu déroulant** avec options contextuelles
- **Accès rapide** profil, admin (si applicable)
- **Déconnexion** avec confirmation

### Formulaires
- **Validation temps réel** avec feedback visuel
- **Mode dual** user/admin avec toggle
- **Design moderne** gradients et animations
- **Messages d'erreur** contextuels du backend

---

## 🛠️ Développement

### Technologies
- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Backend**: PHP 8.2, SQLite, CORS headers
- **State**: React Context, localStorage persistence
- **Routing**: React Router v7

### Structure de Données
```typescript
// Utilisateur connecté
interface User {
  id: number;
  name: string;
  email?: string;
  role: 'user' | 'admin';
  apiKey?: string; // Admin seulement
}

// Inscription FER
interface FERRegistration {
  name: string;
  email: string;
  type: 'participant' | 'candidate';
  category?: 'miss' | 'master'; // Candidats seulement
}
```

---

## 🧪 Tests

### Test Automatisé (`test-auth-complete.ps1`)
- ✅ Inscription user/admin
- ✅ Connexion user/admin  
- ✅ Inscription FER participant/candidat
- ✅ Accès admin aux candidats

### Test Interface Web (`test-auth-system.html`)
- 🖱️ Tests interactifs complets
- 📊 Statut utilisateur en temps réel
- 📝 Logs d'activité détaillés
- 🔄 Cycle complet inscription → connexion → déconnexion

### Tests de Validation
```javascript
// Frontend - AuthProvider
const login = async (username, password, isAdmin = false) => {
  const endpoint = isAdmin ? '/admin/login' : '/user/login';
  // Gestion erreurs backend spécifiques
};

// Backend - Validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    throw new Exception("Format d'email invalide");
}
```

---

## 🔍 Débogage

### Problèmes Courants

1. **CORS Error**
   ```php
   // server/index.php - Headers CORS configurés
   header("Access-Control-Allow-Origin: http://localhost:5173");
   ```

2. **API Key Admin manquante**
   ```javascript
   // Vérifier localStorage
   console.log(localStorage.getItem('adminApiKey'));
   ```

3. **Base de données**
   ```powershell
   # Réinitialiser si nécessaire
   rm server/database.sqlite
   php server/init-db.php
   ```

### Logs Backend
```php
// server/index.php - Debugging activé
error_log("Debug: " . json_encode($data));
```

---

## 🚀 Production

### Checklist Déploiement
- [ ] Modifier `API_BASE` urls production
- [ ] Configurer CORS pour domaine production
- [ ] Changer clés API par défaut
- [ ] Activer HTTPS
- [ ] Base de données production (MySQL/PostgreSQL)
- [ ] Backup automatique base de données

### Variables d'Environnement
```php
// server/env.php
define('DB_PATH', $_ENV['DB_PATH'] ?? './database.sqlite');
define('ADMIN_DEFAULT_KEY', $_ENV['ADMIN_KEY'] ?? 'generate-secure-key');
```

---

## 📞 Support

### Structure Fichiers Modifiés
- `src/components/AuthProvider.tsx` - ⚡ Auth centrale
- `src/components/UserMenu.tsx` - 🆕 Menu utilisateur  
- `src/pages/Login.tsx` - ✨ Interface connexion
- `src/pages/Register.tsx` - ✨ Interface inscription
- `src/pages/Inscription.tsx` - 🎯 Système FER
- `server/index.php` - 🔌 API endpoints

### Contact
Pour questions techniques ou améliorations, référez-vous à la documentation dans chaque fichier composant.

---

*Documentation générée le $(Get-Date -Format "dd/MM/yyyy à HH:mm")*
*Système d'Authentification JVEPI Centre v2.0*