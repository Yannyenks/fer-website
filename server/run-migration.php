<?php
require_once __DIR__ . '/db.php';

echo "🔄 Application de la migration pour ajouter le champ 'type' aux candidats...\n";

try {
    $pdo = db_connect();
    
    // Lire le fichier SQL
    $sql = file_get_contents(__DIR__ . '/add-candidate-type.sql');
    
    // Nettoyer le SQL (supprimer les commentaires)
    $lines = explode("\n", $sql);
    $cleanedLines = [];
    foreach ($lines as $line) {
        $line = trim($line);
        // Ignorer les lignes vides et les commentaires
        if (empty($line) || substr($line, 0, 2) === '--') {
            continue;
        }
        $cleanedLines[] = $line;
    }
    $sql = implode("\n", $cleanedLines);
    
    // Séparer les requêtes par point-virgule
    $statements = array_filter(
        array_map('trim', explode(';', $sql)),
        function($stmt) { 
            return !empty($stmt); 
        }
    );
    
    echo "📝 Exécution de " . count($statements) . " requêtes...\n\n";
    
    foreach ($statements as $statement) {
        if (empty($statement)) continue;
        try {
            $pdo->exec($statement);
            echo "✅ Requête exécutée avec succès\n";
        } catch (PDOException $e) {
            // Ignorer si la colonne existe déjà
            if (strpos($e->getMessage(), 'Duplicate column') !== false) {
                echo "⚠️  La colonne 'type' existe déjà\n";
            } else {
                throw $e;
            }
        }
    }
    
    echo "\n✅ Migration appliquée avec succès !\n\n";
    
    // Vérifier la structure de la table
    $stmt = $pdo->query("DESCRIBE candidates");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "📋 Structure de la table 'candidates' :\n";
    foreach ($columns as $column) {
        echo "  - {$column['Field']} ({$column['Type']})";
        if ($column['Field'] === 'type') {
            echo " ← NOUVEAU ✨";
        }
        echo "\n";
    }
    
    // Compter les candidats par type
    $stmt = $pdo->query("SELECT type, COUNT(*) as count FROM candidates GROUP BY type");
    $counts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "\n📊 Répartition des candidats :\n";
    foreach ($counts as $row) {
        $icon = $row['type'] === 'miss' ? '👑' : '🏆';
        echo "  $icon {$row['type']}: {$row['count']} candidat(s)\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Erreur lors de la migration : " . $e->getMessage() . "\n";
    exit(1);
}

echo "\n🎉 Migration terminée ! Vous pouvez maintenant gérer les candidats Miss et Awards séparément.\n";
