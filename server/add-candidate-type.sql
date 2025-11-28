-- Migration pour ajouter le champ 'type' aux candidats (Miss / Awards)
-- Date: 2025-11-28

-- Ajouter la colonne 'type' à la table candidates
ALTER TABLE candidates 
ADD COLUMN type ENUM('miss', 'awards') DEFAULT 'miss' 
AFTER name;

-- Créer un index pour optimiser les requêtes par type
CREATE INDEX idx_candidate_type ON candidates(type);

-- Mettre à jour les candidats existants (par défaut 'miss')
UPDATE candidates SET type = 'miss' WHERE type IS NULL;
