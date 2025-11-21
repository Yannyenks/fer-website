# Guide de Déploiement Production - FER Website

## 🚀 Déploiement Rapide (Production Ready)

### Pré-requis
- Hébergeur PHP (OVH, Hostinger, SiteGround, etc.)
- Base de données MySQL
- Domaine (optionnel mais recommandé)

### 1. Préparer le Frontend

```bash
# Construire la version production
npm run build:prod

# Le dossier dist/ contient les fichiers à uploader
```

### 2. Configurer le Backend PHP

1. **Uploader les fichiers server/** vers votre hébergement
2. **Créer la base de données** via votre panel d'hébergement
3. **Configurer server/.env** :
```env
DB_HOST=your-db-host
DB_PORT=3306
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASS=your-db-password

FRONTEND_URL=https://your-domain.com
API_URL=https://your-domain.com

ADMIN_USER=admin
ADMIN_PASS=your-strong-password

APP_SECRET=your-random-secret-key-change-this
```

4. **Initialiser la DB** (une seule fois) :
```bash
php init-db.php
```

### 3. Hébergeurs Recommandés

#### Option A: Hébergement Mutualisé PHP (Facile)
- **OVH** (~3€/mois) : PHP + MySQL inclus
- **Hostinger** (~2€/mois) : Très bon rapport qualité/prix  
- **O2Switch** (~5€/mois) : Support français excellent

#### Option B: VPS/Cloud (Plus flexible)
- **DigitalOcean** (~5$/mois) : Droplet LAMP
- **Render** (gratuit) : Deploy automatique via Git
- **Railway** (~5$/mois) : Simple et rapide

### 4. Configuration HTTPS/SSL

La plupart des hébergeurs incluent SSL gratuit (Let's Encrypt). Activez-le dans votre panel.

### 5. Variables d'Environnement Frontend

Créer `.env.production` :
```env
VITE_API_URL=https://your-domain.com/api
```

### 6. Scripts NPM Disponibles

```bash
npm run dev:all      # Dev complet (PHP + React)
npm run build:prod   # Build production
npm run preview:prod # Test build local
```

## 🔧 Configuration Avancée

### Base de données en production
- Utilisez des mots de passe forts
- Configurez des sauvegardes automatiques
- Limitez les connexions par IP si possible

### Sécurité API
- Changez `APP_SECRET` en production
- Utilisez des clés API complexes
- Configurez un firewall si disponible

### Performance
- Activez la compression gzip (souvent incluse)
- Configurez le cache des images (headers HTTP)
- Utilisez un CDN pour les assets statiques

## 🚨 Checklist Déploiement

- [ ] Frontend build et uploadé
- [ ] Backend PHP uploadé  
- [ ] Base de données créée et configurée
- [ ] `.env` configuré avec vraies valeurs
- [ ] `init-db.php` exécuté une fois
- [ ] HTTPS activé
- [ ] Test complet de l'application
- [ ] Compte admin créé
- [ ] Sauvegarde configurée

## 🔍 Tests Post-Déploiement

1. **Frontend** : Accéder à votre domaine
2. **API** : Tester `https://your-domain.com/api/candidates`
3. **Admin** : Se connecter et créer un candidat
4. **Vote** : Tester le vote public
5. **Images** : Uploader une image test

## 🆘 Dépannage

### Erreur 500
- Vérifier les logs du serveur
- Vérifier les permissions (755 pour dossiers, 644 pour fichiers)
- Vérifier la configuration .env

### CORS Errors
- Vérifier `FRONTEND_URL` dans .env
- Certains hébergeurs bloquent les headers - contacter le support

### Base de données
- Vérifier les identifiants dans .env
- S'assurer que la DB existe
- Vérifier que l'utilisateur DB a les bonnes permissions

## 📞 Support

En cas de problème, vérifier :
1. Logs de l'hébergeur
2. Console navigateur (F12)
3. Test des endpoints API individuellement

---

**Le projet est maintenant prêt pour la production !** 🎉