#!/usr/bin/env php
<?php
/**
 * Script d'initialisation de la table admin_invitations
 * Execute: php server/init-admin-invitations.php
 */

require_once __DIR__ . '/db.php';

echo "=== Initialisation de la table admin_invitations ===\n\n";

try {
    // Connexion à la base de données
    $pdo = db_connect();
    
    // Créer la table si elle n'existe pas
    $sql = file_get_contents(__DIR__ . '/admin-invitations.sql');
    $pdo->exec($sql);
    echo "✅ Table admin_invitations créée avec succès\n\n";
    
    // Vérifier le nombre d'admins existants
    $stmt = $pdo->query('SELECT COUNT(*) as count FROM admins');
    $result = $stmt->fetch();
    $adminCount = $result['count'];
    
    echo "📊 Nombre d'administrateurs existants : $adminCount\n\n";
    
    if ($adminCount === 0) {
        echo "⚠️  ATTENTION : Aucun administrateur n'existe !\n";
        echo "Pour créer votre premier administrateur :\n\n";
        echo "Option 1 - Via SQL direct :\n";
        echo "--------------------------\n";
        $hashedPassword = password_hash('ChangeMe123!', PASSWORD_BCRYPT);
        $apiKey = bin2hex(random_bytes(32));
        echo "INSERT INTO admins (username, password, email, api_key, created_at)\n";
        echo "VALUES (\n";
        echo "  'admin',\n";
        echo "  '$hashedPassword',\n";
        echo "  'admin@fer2025.com',\n";
        echo "  '$apiKey',\n";
        echo "  NOW()\n";
        echo ");\n\n";
        
        echo "Option 2 - Via script interactif :\n";
        echo "----------------------------------\n";
        echo "Voulez-vous créer un administrateur maintenant ? (o/n) : ";
        $handle = fopen("php://stdin", "r");
        $line = fgets($handle);
        
        if (trim(strtolower($line)) === 'o') {
            echo "\n=== Création d'un administrateur ===\n";
            
            echo "Nom d'utilisateur : ";
            $username = trim(fgets($handle));
            
            echo "Email : ";
            $email = trim(fgets($handle));
            
            echo "Mot de passe : ";
            $password = trim(fgets($handle));
            
            if (strlen($password) < 6) {
                echo "❌ Le mot de passe doit contenir au moins 6 caractères\n";
                exit(1);
            }
            
            // Créer l'admin
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
            $apiKey = bin2hex(random_bytes(32));
            
            $stmt = $pdo->prepare('INSERT INTO admins (username, password, email, api_key, created_at) VALUES (?, ?, ?, ?, NOW())');
            $stmt->execute([$username, $hashedPassword, $email, $apiKey]);
            
            echo "\n✅ Administrateur créé avec succès !\n";
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            echo "Username: $username\n";
            echo "Email: $email\n";
            echo "API Key: $apiKey\n";
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
            echo "⚠️  IMPORTANT : Conservez ces informations en lieu sûr !\n\n";
        }
        
        fclose($handle);
    } else {
        echo "✅ Il existe déjà $adminCount administrateur(s)\n";
        echo "Vous pouvez maintenant créer des invitations via l'interface admin\n\n";
    }
    
    // Afficher les statistiques des invitations
    $stmt = $pdo->query('SELECT COUNT(*) as total FROM admin_invitations');
    $result = $stmt->fetch();
    $totalInvitations = $result['total'];
    
    $stmt = $pdo->query('SELECT COUNT(*) as used FROM admin_invitations WHERE used_at IS NOT NULL');
    $result = $stmt->fetch();
    $usedInvitations = $result['used'];
    
    $stmt = $pdo->query('SELECT COUNT(*) as active FROM admin_invitations WHERE used_at IS NULL AND expires_at > NOW()');
    $result = $stmt->fetch();
    $activeInvitations = $result['active'];
    
    echo "📈 Statistiques des invitations :\n";
    echo "  - Total : $totalInvitations\n";
    echo "  - Utilisées : $usedInvitations\n";
    echo "  - Actives : $activeInvitations\n\n";
    
    echo "🎉 Initialisation terminée avec succès !\n\n";
    echo "Prochaines étapes :\n";
    echo "1. Connectez-vous en tant qu'admin : /login (mode admin)\n";
    echo "2. Accédez à la gestion des invitations : /admin/invitations\n";
    echo "3. Créez une invitation et partagez le lien\n\n";
    
} catch (PDOException $e) {
    echo "❌ Erreur : " . $e->getMessage() . "\n";
    exit(1);
}
