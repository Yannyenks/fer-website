#!/usr/bin/env php
<?php
/**
 * Script pour créer le tout premier administrateur
 * Execute: php server/create-first-admin.php
 */

require_once __DIR__ . '/db.php';

echo "=== Création du premier administrateur ===\n\n";

try {
    $pdo = db_connect();
    
    // Vérifier s'il existe déjà des admins
    $stmt = $pdo->query('SELECT COUNT(*) as count FROM admins');
    $result = $stmt->fetch();
    
    if ($result['count'] > 0) {
        echo "⚠️  Il existe déjà " . $result['count'] . " administrateur(s)\n";
        echo "Pour voir la liste : php server/check-admins.php\n\n";
        echo "Voulez-vous créer un administrateur supplémentaire ? (o/n) : ";
        $handle = fopen("php://stdin", "r");
        $line = fgets($handle);
        
        if (trim(strtolower($line)) !== 'o') {
            echo "Opération annulée.\n";
            exit(0);
        }
        fclose($handle);
        echo "\n";
    }
    
    // Demander les informations
    $handle = fopen("php://stdin", "r");
    
    echo "Nom d'utilisateur : ";
    $username = trim(fgets($handle));
    
    if (empty($username)) {
        echo "❌ Le nom d'utilisateur ne peut pas être vide\n";
        exit(1);
    }
    
    // Vérifier si l'username existe déjà
    $stmt = $pdo->prepare('SELECT COUNT(*) as count FROM admins WHERE username = ?');
    $stmt->execute([$username]);
    if ($stmt->fetch()['count'] > 0) {
        echo "❌ Ce nom d'utilisateur existe déjà\n";
        exit(1);
    }
    
    echo "Email : ";
    $email = trim(fgets($handle));
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "❌ Email invalide\n";
        exit(1);
    }
    
    // Vérifier si l'email existe déjà
    $stmt = $pdo->prepare('SELECT COUNT(*) as count FROM admins WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()['count'] > 0) {
        echo "❌ Cet email existe déjà\n";
        exit(1);
    }
    
    echo "Mot de passe (min 6 caractères) : ";
    $password = trim(fgets($handle));
    
    if (strlen($password) < 6) {
        echo "❌ Le mot de passe doit contenir au moins 6 caractères\n";
        exit(1);
    }
    
    fclose($handle);
    
    // Créer l'admin
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $apiKey = bin2hex(random_bytes(32));
    
    $stmt = $pdo->prepare('INSERT INTO admins (username, password, email, api_key, created_at) VALUES (?, ?, ?, ?, NOW())');
    $stmt->execute([$username, $hashedPassword, $email, $apiKey]);
    
    echo "\n✅ Administrateur créé avec succès !\n";
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    echo "ID       : " . $pdo->lastInsertId() . "\n";
    echo "Username : $username\n";
    echo "Email    : $email\n";
    echo "API Key  : $apiKey\n";
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    echo "⚠️  IMPORTANT : Conservez l'API Key en lieu sûr !\n\n";
    echo "🎯 Prochaines étapes :\n";
    echo "1. Connectez-vous sur /login (cochez \"Mode admin\")\n";
    echo "   - Username: $username\n";
    echo "   - Mot de passe: [celui que vous avez saisi]\n\n";
    echo "2. Accédez à /admin/invitations pour créer des invitations\n\n";
    
} catch (PDOException $e) {
    echo "❌ Erreur : " . $e->getMessage() . "\n";
    exit(1);
}
