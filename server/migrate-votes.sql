-- Migration script to ensure votes column exists and is properly set up
-- Run this if you're upgrading from an older schema

-- Check if votes column exists, if not add it
ALTER TABLE candidates 
  MODIFY COLUMN votes INT DEFAULT 0;

-- Sync votes count with actual votes in votes table
UPDATE candidates c 
SET votes = (
  SELECT COUNT(*) 
  FROM votes v 
  WHERE v.candidate_id = c.id
)
WHERE EXISTS (
  SELECT 1 FROM votes v WHERE v.candidate_id = c.id
);

-- Set votes to 0 for candidates with no votes
UPDATE candidates 
SET votes = 0 
WHERE votes IS NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_candidates_votes ON candidates(votes DESC);
CREATE INDEX IF NOT EXISTS idx_votes_candidate ON votes(candidate_id);

SELECT 'Migration completed successfully' AS status;
