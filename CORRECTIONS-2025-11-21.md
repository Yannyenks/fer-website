# Corrections apportées - Système de candidats et votes

## Date : 21 novembre 2025

## Problèmes identifiés et corrigés

### 1. ❌ Problème : Les votes ne sont pas sauvegardés correctement
**Cause** : Le système de votes était correct côté backend, mais il y avait une désynchronisation possible entre la colonne `votes` et la table `votes`.

**Solution** :
- ✅ Ajout d'un endpoint `/api/votes/stats` pour vérifier la synchronisation
- ✅ Ajout d'un endpoint `/api/votes/sync` pour resynchroniser les votes depuis la table `votes`
- ✅ Création d'une page admin `/admin/votes` pour visualiser et corriger les incohérences
- ✅ Script de migration SQL (`server/migrate-votes.sql`) pour synchroniser les données existantes

### 2. ❌ Problème : Les informations ne se réaffichent pas lors de la modification d'un candidat
**Cause** : Le système ne gérait pas correctement la fusion des données `extra` (slug, age, origin, domain, gallery) lors des mises à jour.

**Solution** :
- ✅ **Backend (`server/index.php`)** : Modification du endpoint `PUT /api/candidate/:id`
  - Récupère d'abord les données actuelles du candidat
  - Parse le champ JSON `extra` existant
  - Fusionne avec les nouvelles données
  - Retourne le candidat mis à jour
  
- ✅ **Frontend (`candidateService.ts`)** : Correction de `updateCandidate()`
  - Récupère d'abord le candidat actuel via `GET /api/candidate/:id`
  - Fusionne les champs extra avec les données existantes
  - Envoie toutes les données (existantes + modifications)
  - Préserve les champs non modifiés
  
- ✅ **Interface Admin (`CandidatesAdmin.tsx`)** :
  - Ajout du champ `votes` dans le state du formulaire
  - Affichage des votes lors de l'édition (en lecture seule)
  - Chargement complet de toutes les données lors du clic sur "Modifier"

## Structure de données mise à jour

### Table `candidates`
```sql
CREATE TABLE candidates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category_id INT DEFAULT NULL,
  bio TEXT,
  image VARCHAR(255) DEFAULT NULL,
  votes INT DEFAULT 0,              -- ✅ Compteur synchronisé
  extra JSON DEFAULT NULL,          -- ✅ {slug, age, origin, domain, gallery}
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

### Champ `extra` (JSON)
```json
{
  "slug": "candidate-name",
  "age": 25,
  "origin": "Ville, Pays",
  "domain": "Domaine d'expertise",
  "gallery": ["url1.jpg", "url2.jpg"]
}
```

## Nouveaux endpoints API

### `GET /api/votes/stats` (Admin)
Retourne les statistiques de votes avec comparaison DB vs réalité :
```json
{
  "total_votes": 150,
  "candidates": [
    {
      "id": 1,
      "name": "Candidat A",
      "votes": 45,           // Valeur dans candidates.votes
      "actual_votes": 45     // Nombre réel depuis la table votes
    }
  ]
}
```

### `POST /api/votes/sync` (Admin)
Resynchronise tous les compteurs de votes depuis la table `votes` :
```sql
UPDATE candidates c 
SET votes = (
  SELECT COUNT(*) 
  FROM votes v 
  WHERE v.candidate_id = c.id
)
```

### `PUT /api/candidate/:id` (Admin) - Amélioré
- Fusionne intelligemment le champ `extra` au lieu de l'écraser
- Retourne le candidat complet mis à jour
- Préserve les données non modifiées

## Nouvelles pages

### `/admin/votes` - Statistiques des votes
- Vue d'ensemble du nombre total de votes
- Liste des candidats avec votes DB vs réels
- Indicateur visuel de synchronisation (✓ Sync / ⚠ Désync)
- Bouton "Synchroniser les votes" pour corriger les incohérences
- Accessible depuis le tableau de bord admin

## Fichiers modifiés

### Backend
- ✅ `server/index.php` - Endpoints vote stats, sync, et PUT candidate amélioré
- ✅ `server/migrate-votes.sql` - Script de migration (nouveau)

### Frontend
- ✅ `src/concours/services/candidateService.ts` - Logique de fusion des données
- ✅ `src/pages/admin/CandidatesAdmin.tsx` - Affichage des votes, formulaire complet
- ✅ `src/pages/admin/VotesAdmin.tsx` - Page de statistiques (nouveau)
- ✅ `src/App.tsx` - Route `/admin/votes`
- ✅ `src/pages/admin/AdminDashboard.tsx` - Lien vers statistiques des votes

## Instructions de mise en production

### 1. Exécuter la migration SQL
```bash
# Se connecter à MySQL
mysql -u root -p

# Sélectionner la base de données
USE fer_website;

# Exécuter le script de migration
source server/migrate-votes.sql;
```

### 2. Tester la synchronisation
1. Aller sur `/admin/votes`
2. Vérifier que tous les compteurs sont synchronisés
3. Si des désynchronisations apparaissent, cliquer sur "Synchroniser les votes"

### 3. Vérifier l'édition des candidats
1. Aller sur `/admin/candidates`
2. Cliquer sur "Modifier" pour un candidat
3. Vérifier que tous les champs sont remplis (nom, slug, âge, origine, domaine, bio, votes)
4. Modifier un champ et sauvegarder
5. Vérifier que seul le champ modifié a changé

## Prévention des problèmes futurs

### ✅ Le système garantit maintenant :
1. **Votes** : Incrémentés atomiquement via transaction SQL
2. **Données candidats** : Fusion intelligente préservant les champs non modifiés
3. **Monitoring** : Page admin pour détecter et corriger les incohérences
4. **Traçabilité** : Tous les votes sont enregistrés dans la table `votes` avec IP et timestamp

### ⚠️ Points d'attention :
- Ne jamais modifier manuellement la colonne `votes` dans la DB
- Utiliser uniquement l'endpoint `/api/vote` pour voter
- En cas de désynchronisation, utiliser `/api/votes/sync` (page admin)
- Le champ `extra` doit toujours être un JSON valide

## Test des corrections

### Test 1 : Édition d'un candidat
```
1. Créer un candidat avec tous les champs remplis
2. Cliquer sur "Modifier"
3. ✅ Vérifier que tous les champs sont pré-remplis
4. Modifier uniquement le "domaine"
5. ✅ Vérifier que les autres champs restent inchangés
```

### Test 2 : Système de votes
```
1. Voter pour un candidat
2. Aller sur /admin/votes
3. ✅ Vérifier que "Votes (DB)" et "Votes (Réels)" sont identiques
4. Voter plusieurs fois pour différents candidats
5. ✅ Vérifier que le total est correct
```

### Test 3 : Synchronisation des votes
```
1. Modifier manuellement la colonne votes dans la DB (pour simulation)
2. Aller sur /admin/votes
3. ✅ Observer le statut "⚠ Désync"
4. Cliquer sur "Synchroniser les votes"
5. ✅ Vérifier que le statut devient "✓ Sync"
```

## Contact & Support

Pour toute question concernant ces modifications :
- Voir le code source dans `server/index.php` (lignes 373-426)
- Consulter `src/concours/services/candidateService.ts` (fonction updateCandidate)
- Tester avec la page `/admin/votes`
