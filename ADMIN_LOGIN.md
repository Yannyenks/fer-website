# 🔑 Guide de Connexion Admin - FER Website

## 🚀 CONNEXIONS ADMIN DISPONIBLES

### 1. **Compte Admin Principal (Recommandé)**
```
Utilisateur: admin
Mot de passe: password123
API Key: 0769492badcd95e569da5932c745e7f7bef3a29efff075675ac9a4700bb26d7a
```

### 2. **Connexion via l'Interface Web**
1. Ouvre ton navigateur sur `http://localhost:3000`
2. Va dans le menu ou clique sur "Admin" 
3. Utilise les identifiants ci-dessus
4. Une fois connecté, tu auras accès au dashboard admin

### 3. **Connexion via API (pour tests)**
```bash
# PowerShell
$body = @{username="admin"; password="password123"} | ConvertTo-Json
$headers = @{"Content-Type"="application/json"}
Invoke-WebRequest -Uri "http://localhost:8000/api/admin/login" -Method POST -Body $body -Headers $headers
```

### 4. **Créer un Nouvel Admin**
```bash
# PowerShell - Créer ton propre compte
$newAdmin = @{
    username="monnom"
    password="monmotdepasse123"
    email="monemail@example.com"
} | ConvertTo-Json

$headers = @{"Content-Type"="application/json"}
Invoke-WebRequest -Uri "http://localhost:8000/api/admin/register" -Method POST -Body $newAdmin -Headers $headers
```

## 🖥️ ACCÈS AUX FONCTIONS ADMIN

Une fois connecté, tu peux :

### **Via Interface Web** (`http://localhost:3000`)
- ✅ **Dashboard Admin** : Vue d'ensemble
- ✅ **Gestion Candidats** : Ajouter, modifier, supprimer des candidats
- ✅ **Gestion Images** : Upload et gestion des images de sections
- ✅ **Statistiques** : Voir les votes et performances

### **Via API Directe** (avec ta clé API)
```bash
# Lister tous les candidats
Invoke-WebRequest -Uri "http://localhost:8000/api/candidates" -Headers @{"X-ADMIN-KEY"="ta_cle_api"}

# Créer un candidat
$candidat = @{name="Nouveau Candidat"; bio="Description"; category_id=1} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8000/api/candidate" -Method POST -Body $candidat -Headers @{"Content-Type"="application/json"; "X-ADMIN-KEY"="ta_cle_api"}

# Upload une image
# (nécessite multipart/form-data, plus complexe en PowerShell)
```

## 🛠️ DÉPANNAGE CONNEXION

### **Erreur "Invalid credentials"**
```bash
# Vérifier les identifiants avec le compte par défaut depuis .env
$envAdmin = @{username="admin"; password="admin_password"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8000/api/admin/login" -Method POST -Body $envAdmin -Headers @{"Content-Type"="application/json"}
```

### **Backend non accessible**
```bash
# Vérifier si le serveur PHP tourne
Invoke-WebRequest -Uri "http://localhost:8000" -TimeoutSec 5

# Si pas de réponse, démarrer le serveur
cd server
php -S localhost:8000
```

### **Frontend non accessible**  
```bash
# Vérifier si Vite tourne
Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5

# Si pas de réponse, démarrer Vite
npm run dev
```

## 🔐 SÉCURITÉ PRODUCTION

⚠️ **IMPORTANT** : En production, change ces identifiants !

1. **Modifier le fichier `.env`** :
```env
ADMIN_USER=ton_nom_admin_secret
ADMIN_PASS=ton_mot_de_passe_tres_fort_123
```

2. **Créer de nouveaux comptes admin** via l'API avec des mots de passe forts

3. **Supprimer les comptes de test** après déploiement

## 🎯 ACCÈS RAPIDE

**Pour te connecter maintenant** :
1. Assure-toi que le backend tourne : `php -S localhost:8000` dans le dossier `server/`
2. Assure-toi que le frontend tourne : `npm run dev`
3. Va sur `http://localhost:3000`
4. Utilise `admin` / `password123`

**Ou teste directement l'API** :
```bash
$test = @{username="admin"; password="password123"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8000/api/admin/login" -Method POST -Body $test -Headers @{"Content-Type"="application/json"}
```

---

🎉 **Tu es prêt à administrer le site !**