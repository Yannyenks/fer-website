# 🎯 Mise à jour complète : Catégorie Miss/Awards pour les candidats

## ✅ Modifications effectuées

### 1. Base de données (SQL)
- ✅ Ajout du champ `type` ENUM('miss', 'awards') dans la table `candidates`
- ✅ Index créé pour optimiser les requêtes par type
- ✅ Migration appliquée avec succès
- ✅ Candidats existants automatiquement définis comme 'miss'

**Fichiers créés :**
- `server/add-candidate-type.sql` - Script de migration SQL
- `server/run-migration.php` - Script d'exécution de la migration
- `server/MIGRATION-CANDIDATE-TYPE.md` - Documentation de la migration

### 2. Backend (PHP)
- ✅ `server/schema.sql` - Schéma mis à jour avec le champ `type`
- ✅ `server/index.php` - API mise à jour :
  - `POST /api/candidate` - Accepte le paramètre `type`
  - `PUT /api/candidate/{id}` - Permet de modifier le `type`
  - `GET /api/candidates?type=miss` - Filtre par type
  - `GET /api/candidates?type=awards` - Filtre par type

### 3. Frontend (TypeScript/React)

#### Types
- ✅ `src/concours/types.ts` - Ajout de `CandidateType` et du champ `type` dans `Candidate`

#### Services
- ✅ `src/concours/services/candidateService.ts` - Service mis à jour :
  - `getAllCandidates()` - Récupère le champ `type` depuis le backend
  - `addCandidate()` - Envoie le `type` au backend
  - `updateCandidate()` - Permet de modifier le `type`

#### Interface Admin
- ✅ `src/pages/admin/CandidatesAdmin.tsx` - Interface d'administration complète :
  - **Sélecteur de type** : Dropdown pour choisir Miss/Awards lors de la création/édition
  - **Filtres** : 3 boutons pour filtrer (Tous, Miss, Awards) avec compteurs
  - **Badges visuels** : Badge coloré sur chaque carte (rose pour Miss, doré pour Awards)
  - **État par défaut** : 'miss' si non spécifié

### 4. Interface Publique
- ✅ `src/concours/pages/CandidatesPage.tsx` - Améliorée avec :
  - Gestion de l'état de chargement
  - Message élégant si aucun candidat
  - Support du champ `type` (transparent pour l'utilisateur)

## 🎨 Apparence

### Interface Admin

**Filtres :**
```
┌─────────────────────────────────────────────────────────┐
│  📋 Tous (2)  │  👑 Miss (2)  │  🏆 Awards (0)         │
└─────────────────────────────────────────────────────────┘
```

**Formulaire :**
```
┌─────────────────────────────────────────────────────────┐
│ Type de candidat *                                      │
│ [👑 Miss ▼]                                             │
│   - 👑 Miss                                             │
│   - 🏆 Awards                                           │
│                                                          │
│ (non visible publiquement)                              │
└─────────────────────────────────────────────────────────┘
```

**Cartes candidats :**
```
┌──────────────────────┐
│  [Photo]        👑   │ <- Badge rose (Miss)
│  Nom              │
│  Domaine • Origine   │
│  5 votes             │
│  [Suppr] [Modifier]  │
└──────────────────────┘

┌──────────────────────┐
│  [Photo]        🏆   │ <- Badge doré (Awards)
│  Nom              │
│  Domaine • Origine   │
│  3 votes             │
│  [Suppr] [Modifier]  │
└──────────────────────┘
```

## 📊 État actuel

```
Structure de la table 'candidates' :
  - id (int)
  - name (varchar)
  - type (enum('miss','awards')) ← NOUVEAU ✨
  - category_id (int)
  - bio (text)
  - image (varchar)
  - votes (int)
  - extra (longtext)

Répartition actuelle :
  👑 miss: 2 candidat(s)
  🏆 awards: 0 candidat(s)
```

## 🚀 Utilisation

### Créer un candidat Miss
1. Aller dans l'interface admin `/admin/candidates`
2. Remplir le formulaire
3. Sélectionner "👑 Miss" dans le dropdown
4. Cliquer sur "Ajouter le candidat"

### Créer un candidat Awards
1. Aller dans l'interface admin `/admin/candidates`
2. Remplir le formulaire
3. Sélectionner "🏆 Awards" dans le dropdown
4. Cliquer sur "Ajouter le candidat"

### Filtrer les candidats
- Cliquer sur **📋 Tous** pour voir tous les candidats
- Cliquer sur **👑 Miss** pour voir uniquement les candidats Miss
- Cliquer sur **🏆 Awards** pour voir uniquement les candidats Awards

### Via l'API

**Créer un candidat :**
```bash
POST /api/candidate
Content-Type: application/json

{
  "name": "Marie Dupont",
  "type": "miss",
  "bio": "...",
  "image": "...",
  "extra": {
    "slug": "marie-dupont",
    "age": 25,
    "origin": "Paris",
    "domain": "Musique"
  }
}
```

**Filtrer par type :**
```bash
GET /api/candidates?type=miss
GET /api/candidates?type=awards
```

## 🎯 Avantages

1. **Séparation claire** : Les candidats Miss et Awards sont maintenant clairement séparés
2. **Flexibilité** : Possibilité de créer des pages dédiées pour chaque type
3. **Gestion facilitée** : Filtrage rapide dans l'interface admin
4. **Visibilité** : Badges colorés pour identifier rapidement le type
5. **Évolutivité** : Base solide pour ajouter d'autres types si nécessaire

## 📝 Notes importantes

- Le champ `type` n'est **PAS visible** pour les visiteurs publics
- Il est utilisé uniquement pour l'organisation et la gestion en backend
- Tous les candidats existants sont automatiquement définis comme 'miss'
- Les nouvelles routes API sont rétrocompatibles

## 🔄 Prochaines étapes possibles

1. Créer une page publique séparée pour les Awards : `/concours/awards`
2. Créer une page publique séparée pour Miss : `/concours/miss`
3. Ajouter des statistiques séparées par type dans le dashboard admin
4. Permettre le vote séparé pour chaque catégorie

## ✅ Tests recommandés

- [ ] Créer un candidat Miss via l'interface admin
- [ ] Créer un candidat Awards via l'interface admin
- [ ] Filtrer par type dans l'interface admin
- [ ] Modifier le type d'un candidat existant
- [ ] Vérifier que les votes fonctionnent pour les deux types
- [ ] Tester l'API avec le paramètre `?type=miss` et `?type=awards`
