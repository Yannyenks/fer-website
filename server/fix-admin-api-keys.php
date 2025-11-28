#!/usr/bin/env php
<?php
/**
 * Script pour régénérer les API keys des admins existants
 * Execute: php server/fix-admin-api-keys.php
 */

require_once __DIR__ . '/db.php';

echo "=== Réparation des API keys admin ===\n\n";

try {
    $pdo = db_connect();
    
    // Trouver les admins sans API key
    $stmt = $pdo->query('SELECT id, username, email, api_key FROM admins');
    $admins = $stmt->fetchAll();
    
    if (count($admins) === 0) {
        echo "❌ Aucun administrateur trouvé\n";
        exit(1);
    }
    
    $updated = 0;
    
    foreach ($admins as $admin) {
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "Admin ID: {$admin['id']}\n";
        echo "Username: {$admin['username']}\n";
        echo "Email: {$admin['email']}\n";
        
        if (empty($admin['api_key'])) {
            echo "Status: ❌ Pas d'API key\n";
            
            // Générer une nouvelle API key
            $newApiKey = bin2hex(random_bytes(32));
            
            $updateStmt = $pdo->prepare('UPDATE admins SET api_key = ? WHERE id = ?');
            $updateStmt->execute([$newApiKey, $admin['id']]);
            
            echo "✅ Nouvelle API key générée: $newApiKey\n";
            $updated++;
        } else {
            echo "Status: ✅ API key présente\n";
            echo "API Key: {$admin['api_key']}\n";
        }
    }
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    
    if ($updated > 0) {
        echo "✅ $updated administrateur(s) mis à jour\n\n";
        echo "⚠️  IMPORTANT : Vous devez vous reconnecter pour obtenir la nouvelle API key\n";
        echo "   1. Déconnectez-vous de l'application\n";
        echo "   2. Allez sur /login\n";
        echo "   3. Cochez 'Mode admin'\n";
        echo "   4. Connectez-vous avec vos identifiants\n\n";
    } else {
        echo "✅ Tous les admins ont déjà une API key\n\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Erreur : " . $e->getMessage() . "\n";
    exit(1);
}
