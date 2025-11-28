# Système de Vote par Catégorie

## 📋 Règles de Vote

Le système permet maintenant **un vote par catégorie** :

- ✅ **1 vote pour la catégorie Miss** (type: 'miss')
- ✅ **1 vote pour la catégorie Awards** (type: 'awards')
- ✅ **Total : 2 votes maximum par utilisateur** (un par catégorie)

## 🔐 Vérifications

### Backend (server/index.php)

Le serveur vérifie :
1. Le type du candidat (miss ou awards)
2. Si l'utilisateur a déjà voté dans **cette catégorie spécifique**
3. Empêche les votes multiples dans la même catégorie

```php
// Vérification par catégorie
SELECT v.id, v.candidate_id, c.name, c.type 
FROM votes v 
INNER JOIN candidates c ON v.candidate_id = c.id 
WHERE (v.visitor_id = ? OR v.ip_hash = ?) AND c.type = ?
```

### Frontend

Le frontend stocke les votes séparément :
- `user_voted_miss_${user.id}` → Vote Miss
- `user_voted_awards_${user.id}` → Vote Awards

## 🎯 Scénarios

### Scénario 1 : Vote Miss puis Awards ✅
```
1. User vote pour "Candidate A" (Miss) → ✅ OK
2. User vote pour "Candidate B" (Awards) → ✅ OK
Résultat : 2 votes enregistrés (1 par catégorie)
```

### Scénario 2 : Double vote même catégorie ❌
```
1. User vote pour "Candidate A" (Miss) → ✅ OK
2. User essaie de voter pour "Candidate C" (Miss) → ❌ REFUSÉ
Message : "Vous avez déjà voté pour Candidate A dans la catégorie Miss"
```

### Scénario 3 : Nouveau vote après Awards ✅
```
1. User vote pour "Nominé X" (Awards) → ✅ OK
2. User peut encore voter pour une Miss → ✅ OK
```

## 🔄 Migration

### Base de données
- La colonne `type` a été ajoutée à la table `candidates`
- Les candidats existants sont automatiquement définis comme 'miss'
- Les votes existants restent valides

### LocalStorage
Les anciennes clés de vote (`user_has_voted_${user.id}`) sont obsolètes.
Nouvelles clés :
- `user_voted_miss_${user.id}` → ID du candidat Miss voté
- `user_voted_awards_${user.id}` → ID du candidat Awards voté

## 📊 Statistiques Admin

L'interface admin affiche maintenant :
- Filtre par type (Miss / Awards)
- Badge de catégorie sur chaque candidat
- Compteurs séparés par catégorie

## 🔧 API

### POST /api/vote

**Request:**
```json
{
  "candidate_id": 123
}
```

**Response Success:**
```json
{
  "ok": true,
  "category": "miss"
}
```

**Response Error (déjà voté):**
```json
{
  "ok": false,
  "error": "already_voted",
  "voted_for": 456,
  "voted_for_name": "Candidate A",
  "category": "miss"
}
```

## ✅ Tests recommandés

1. Voter pour un candidat Miss
2. Vérifier qu'on peut encore voter pour Awards
3. Essayer de voter à nouveau pour Miss → Doit être bloqué
4. Voter pour un candidat Awards
5. Essayer de voter à nouveau pour Awards → Doit être bloqué

## 🚀 Déploiement

1. Appliquer la migration SQL :
   ```bash
   php server/run-migration.php
   ```

2. Vérifier la structure :
   ```sql
   DESCRIBE candidates;
   -- Doit afficher la colonne 'type'
   ```

3. Redémarrer les serveurs :
   ```bash
   # Backend
   cd server && php -S localhost:8000
   
   # Frontend
   npm run dev
   ```
