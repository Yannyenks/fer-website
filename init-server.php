<?php
/**
 * Script d'initialisation automatique pour LWS
 * À exécuter via: php init-server.php
 */

// Couleurs pour le terminal
function colorize($text, $color) {
    $colors = [
        'green' => "\033[32m",
        'yellow' => "\033[33m",
        'red' => "\033[31m",
        'blue' => "\033[34m",
        'reset' => "\033[0m"
    ];
    return $colors[$color] . $text . $colors['reset'];
}

echo colorize("🚀 Initialisation du serveur JVEPI...\n", 'blue');

// 1. Détection de l'environnement
$isProduction = (
    isset($_SERVER['HTTP_HOST']) && 
    (strpos($_SERVER['HTTP_HOST'], 'jvepi.com') !== false || 
     strpos($_SERVER['HTTP_HOST'], 'lws') !== false)
) || (
    // Détection basée sur le système de fichiers
    is_dir('/home') && !is_dir('C:\\')
);

$env = $isProduction ? 'production' : 'development';
echo colorize("✅ Environnement détecté: $env\n", 'green');

// 2. Configuration de l'environnement
$serverDir = __DIR__ . '/server';
$envFile = $serverDir . '/.env';
$sourceEnv = $serverDir . '/.env.' . $env;

if (!file_exists($sourceEnv)) {
    echo colorize("❌ Erreur: $sourceEnv n'existe pas\n", 'red');
    exit(1);
}

// Backup si .env existe déjà
if (file_exists($envFile)) {
    copy($envFile, $serverDir . '/.env.backup');
    echo colorize("📦 Backup de .env créé\n", 'yellow');
}

// Copie du fichier d'environnement
copy($sourceEnv, $envFile);
echo colorize("✅ Fichier .env.$env copié vers .env\n", 'green');

// Définir la variable d'environnement
putenv("APP_ENV=$env");
$_ENV['APP_ENV'] = $env;

// 3. Test de connexion à la base de données
echo colorize("🗄️  Test de connexion à la base de données...\n", 'blue');
require_once $serverDir . '/db.php';

try {
    $pdo = db_connect();
    echo colorize("✅ Connexion à la base de données réussie\n", 'green');
    
    // Afficher les infos de connexion (en développement uniquement)
    if (!is_production()) {
        $host = env('DB_HOST', 'N/A');
        $name = env('DB_NAME', 'N/A');
        echo "   Host: $host\n";
        echo "   Database: $name\n";
    }
} catch (Exception $e) {
    echo colorize("❌ Erreur de connexion: " . $e->getMessage() . "\n", 'red');
    exit(1);
}

// 4. Initialisation du schéma si nécessaire
echo colorize("📊 Vérification du schéma de base de données...\n", 'blue');

try {
    // Vérifier si la table candidates existe
    $result = $pdo->query("SHOW TABLES LIKE 'candidates'");
    
    if ($result->rowCount() === 0) {
        echo colorize("⚙️  Création du schéma de base de données...\n", 'yellow');
        
        $schemaFile = $serverDir . '/schema.sql';
        if (!file_exists($schemaFile)) {
            throw new Exception("schema.sql introuvable");
        }
        
        $schema = file_get_contents($schemaFile);
        
        // Exécuter chaque instruction SQL séparément
        $statements = array_filter(
            array_map('trim', explode(';', $schema)),
            function($stmt) { return !empty($stmt); }
        );
        
        foreach ($statements as $statement) {
            if (!empty($statement)) {
                $pdo->exec($statement);
            }
        }
        
        echo colorize("✅ Schéma créé avec succès\n", 'green');
    } else {
        echo colorize("✅ Schéma déjà existant\n", 'green');
    }
} catch (Exception $e) {
    echo colorize("❌ Erreur lors de la création du schéma: " . $e->getMessage() . "\n", 'red');
    exit(1);
}

// 5. Vérification et création du dossier storage
$storageDir = __DIR__ . '/storage';
if (!is_dir($storageDir)) {
    echo colorize("📁 Création du dossier storage...\n", 'yellow');
    mkdir($storageDir, 0755, true);
    file_put_contents($storageDir . '/.gitkeep', '');
}
echo colorize("✅ Dossier storage configuré\n", 'green');

// 6. Vérification des permissions
if (is_writable($storageDir)) {
    echo colorize("✅ Permissions storage OK\n", 'green');
} else {
    echo colorize("⚠️  Warning: Le dossier storage n'est pas accessible en écriture\n", 'yellow');
}

// 7. Résumé de la configuration
echo "\n";
echo colorize("✨ Initialisation terminée avec succès!\n", 'green');
echo "\n";
echo colorize("📋 Configuration actuelle:\n", 'blue');
echo "   - Environnement: $env\n";
echo "   - PHP: " . PHP_VERSION . "\n";
echo "   - Base de données: Connectée\n";
echo "   - Storage: Configuré\n";
echo "\n";

if ($isProduction) {
    echo colorize("🔒 IMPORTANT - Sécurité Production:\n", 'yellow');
    echo "   1. Changez APP_SECRET dans server/.env\n";
    echo "   2. Changez ADMIN_USER et ADMIN_PASS dans server/.env\n";
    echo "   3. Vérifiez que APP_DEBUG=false dans server/.env\n";
    echo "\n";
    echo colorize("🌐 Configuration LWS:\n", 'blue');
    echo "   - DocumentRoot: " . __DIR__ . "/dist\n";
    echo "   - API: Disponible via /api/*\n";
    echo "   - PHP Version requise: 8.0+\n";
} else {
    echo colorize("🛠️  Pour démarrer en développement:\n", 'blue');
    echo "   Backend:  php -S localhost:8000 -t server server/index.php\n";
    echo "   Frontend: npm run dev\n";
}

echo "\n";
echo colorize("✅ Le serveur est prêt à être utilisé!\n", 'green');
