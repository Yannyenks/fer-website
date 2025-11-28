# Guide de migration : Ajout du champ 'type' (Miss/Awards)

## Description

Cette migration ajoute un champ `type` à la table `candidates` pour différencier les candidats **Miss** et **Awards**.

## Champ ajouté

- **type** : ENUM('miss', 'awards') DEFAULT 'miss'
  - Permet de catégoriser les candidats
  - Non visible publiquement (gestion admin uniquement)
  - Index créé pour optimiser les requêtes

## Comment appliquer la migration

### Option 1 : Script PowerShell (Recommandé)

```powershell
cd server
.\migrate-candidate-type.ps1
```

### Option 2 : Manuellement via MySQL

```bash
mysql -u root -p nom_de_votre_base < add-candidate-type.sql
```

### Option 3 : Via phpMyAdmin

1. Ouvrir phpMyAdmin
2. Sélectionner votre base de données
3. Aller dans l'onglet "SQL"
4. Copier-coller le contenu de `add-candidate-type.sql`
5. Cliquer sur "Exécuter"

## Vérification

Après la migration, vérifiez que la colonne a été ajoutée :

```sql
DESCRIBE candidates;
```

Vous devriez voir la colonne `type` avec le type `enum('miss','awards')`.

## Impact

- **Candidats existants** : Seront automatiquement définis comme 'miss'
- **Nouveaux candidats** : Peuvent être créés comme 'miss' ou 'awards'
- **API** : Supporte désormais le paramètre `type` lors de la création/modification
- **Frontend** : Interface admin mise à jour avec sélecteur et filtre par type

## Rollback (en cas de problème)

Si vous devez annuler la migration :

```sql
DROP INDEX idx_candidate_type ON candidates;
ALTER TABLE candidates DROP COLUMN type;
```

## Utilisation dans l'API

### Créer un candidat Miss

```json
POST /api/candidate
{
  "name": "Marie Dupont",
  "type": "miss",
  ...
}
```

### Créer un candidat Awards

```json
POST /api/candidate
{
  "name": "Jean Martin",
  "type": "awards",
  ...
}
```

### Filtrer par type

```
GET /api/candidates?type=miss
GET /api/candidates?type=awards
```
