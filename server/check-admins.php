#!/usr/bin/env php
<?php
require_once __DIR__ . '/db.php';

echo "=== Liste des administrateurs ===\n\n";

try {
    $pdo = db_connect();
    $stmt = $pdo->query('SELECT id, username, email, created_at FROM admins ORDER BY id');
    $admins = $stmt->fetchAll();
    
    if (count($admins) === 0) {
        echo "❌ Aucun administrateur trouvé !\n\n";
        echo "Pour créer le premier administrateur, utilisez :\n";
        echo "php server/create-first-admin.php\n\n";
    } else {
        echo "✅ " . count($admins) . " administrateur(s) trouvé(s) :\n\n";
        foreach ($admins as $admin) {
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            echo "ID        : " . $admin['id'] . "\n";
            echo "Username  : " . $admin['username'] . "\n";
            echo "Email     : " . $admin['email'] . "\n";
            echo "Créé le   : " . $admin['created_at'] . "\n";
        }
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        
        echo "✅ Vous pouvez vous connecter avec ces identifiants\n";
        echo "   sur /login (cochez \"Mode admin\")\n\n";
    }
} catch (PDOException $e) {
    echo "❌ Erreur : " . $e->getMessage() . "\n";
    exit(1);
}
