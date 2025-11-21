<?php
/**
 * Database initialization script
 * Run this once to set up the database schema and initial data
 */

require_once __DIR__ . '/env.php';

echo "🗄️  Initializing FER database...\n";

// Database connection parameters
$host = env('DB_HOST', '127.0.0.1');
$port = env('DB_PORT', '3306');
$dbName = env('DB_NAME', 'jvepi');
$user = env('DB_USER', 'root');
$pass = env('DB_PASS', '');

try {
    // First, connect without specifying database to create it
    echo "📡 Connecting to MySQL server...\n";
    $pdo = new PDO("mysql:host={$host};port={$port};charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    // Create database if not exists
    echo "🏗️  Creating database '{$dbName}'...\n";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    
    // Switch to our database
    $pdo->exec("USE `{$dbName}`");
    echo "✅ Connected to database '{$dbName}'\n";
    
    // Read and execute schema
    echo "📋 Creating tables from schema.sql...\n";
    $schema = file_get_contents(__DIR__ . '/schema.sql');
    $pdo->exec($schema);
    echo "✅ Tables created successfully\n";
    
    // Insert initial data
    echo "🌱 Seeding initial data...\n";
    
    // Create default categories
    $pdo->exec("INSERT IGNORE INTO categories (id, name) VALUES (1, 'Miss'), (2, 'Master'), (3, 'General')");
    
    // Create sample events
    $sampleEvents = [
        [1, 'FER 2025', '2025-02-15 09:00:00', '2025-02-16 18:00:00', null, 'Foire de l\'Employabilité Rurale 2025', 3],
        [2, 'Concours Miss FER 2025', '2025-02-15 20:00:00', '2025-02-15 23:00:00', null, 'Élection Miss FER 2025', 1],
        [3, 'Concours Master FER 2025', '2025-02-16 20:00:00', '2025-02-16 23:00:00', null, 'Élection Master FER 2025', 2]
    ];
    
    $stmt = $pdo->prepare("INSERT IGNORE INTO events (id, name, start_date, end_date, cover_image, description, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
    foreach ($sampleEvents as $event) {
        $stmt->execute($event);
    }
    
    // Create sample candidates
    $sampleCandidates = [
        ['Marie Dubois', 1, 'Étudiante en agronomie, passionnée par le développement rural durable.', null, 0, json_encode(['age' => 22, 'instagram' => '@marie.dubois'])],
        ['Sophie Martin', 1, 'Ingénieure agricole, militante pour l\'égalité des genres en milieu rural.', null, 0, json_encode(['age' => 24, 'instagram' => '@sophie.martin'])],
        ['Pierre Dupont', 2, 'Entrepreneur agricole, fondateur d\'une startup AgriTech.', null, 0, json_encode(['age' => 26, 'instagram' => '@pierre.dupont'])],
        ['Jean Durand', 2, 'Vétérinaire rural, défenseur du bien-être animal.', null, 0, json_encode(['age' => 28, 'instagram' => '@jean.durand'])],
    ];
    
    $stmt = $pdo->prepare("INSERT IGNORE INTO candidates (name, category_id, bio, image, votes, extra) VALUES (?, ?, ?, ?, ?, ?)");
    foreach ($sampleCandidates as $candidate) {
        $stmt->execute($candidate);
    }
    
    echo "✅ Sample data inserted successfully\n";
    echo "\n🎉 Database initialization complete!\n";
    echo "\n📊 Summary:\n";
    echo "- Database: {$dbName}\n";
    echo "- Host: {$host}:{$port}\n";
    echo "- Categories: " . $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn() . "\n";
    echo "- Events: " . $pdo->query("SELECT COUNT(*) FROM events")->fetchColumn() . "\n";
    echo "- Candidates: " . $pdo->query("SELECT COUNT(*) FROM candidates")->fetchColumn() . "\n";
    echo "\n🔑 To create an admin account, visit:\n";
    echo "   POST http://localhost:8000/api/admin/register\n";
    echo "   Or use the frontend registration form.\n";
    echo "\n🚀 Start the development server with: npm run dev:all\n";

} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
    echo "\n💡 Make sure MySQL is running and credentials in .env are correct.\n";
    exit(1);
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}