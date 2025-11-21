<?php
/**
 * Production Server Configuration Check
 * Run this script to verify your production environment is ready
 */

echo "🔍 Checking FER Production Environment...\n\n";

$errors = [];
$warnings = [];

// Check PHP version
if (version_compare(PHP_VERSION, '7.4.0', '<')) {
    $errors[] = "PHP version too old: " . PHP_VERSION . " (minimum: 7.4.0)";
} else {
    echo "✅ PHP version: " . PHP_VERSION . "\n";
}

// Check required extensions
$required_extensions = ['pdo', 'pdo_mysql', 'json', 'fileinfo'];
foreach ($required_extensions as $ext) {
    if (!extension_loaded($ext)) {
        $errors[] = "Missing PHP extension: $ext";
    } else {
        echo "✅ Extension $ext loaded\n";
    }
}

// Check .env file
if (!file_exists(__DIR__ . '/.env')) {
    $errors[] = ".env file not found - copy from .env.example and configure";
} else {
    echo "✅ .env file found\n";
}

// Check write permissions for storage
$storage_dir = __DIR__ . '/../storage';
if (!is_dir($storage_dir)) {
    if (!mkdir($storage_dir, 0755, true)) {
        $errors[] = "Cannot create storage directory: $storage_dir";
    }
}

if (!is_writable($storage_dir)) {
    $errors[] = "Storage directory not writable: $storage_dir";
} else {
    echo "✅ Storage directory writable\n";
}

// Check database connection
if (file_exists(__DIR__ . '/.env')) {
    require_once __DIR__ . '/env.php';
    require_once __DIR__ . '/db.php';
    
    try {
        $pdo = db_connect();
        echo "✅ Database connection successful\n";
        
        // Check if tables exist
        $tables = ['categories', 'events', 'candidates', 'votes', 'admins'];
        foreach ($tables as $table) {
            $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
            if ($stmt->rowCount() === 0) {
                $warnings[] = "Table '$table' not found - run init-db.php";
            } else {
                echo "✅ Table '$table' exists\n";
            }
        }
        
    } catch (Exception $e) {
        $errors[] = "Database connection failed: " . $e->getMessage();
    }
}

// Check security configurations
if (env('ADMIN_PASS') === 'admin_password') {
    $warnings[] = "Default admin password detected - change it in .env";
}

if (env('APP_SECRET') === 'change_me_to_a_random_string') {
    $warnings[] = "Default APP_SECRET detected - change it in .env";
}

// Results
echo "\n";
if (empty($errors) && empty($warnings)) {
    echo "🎉 Production environment is ready!\n";
    echo "✅ All checks passed\n";
    echo "\n📋 Next steps:\n";
    echo "1. Upload frontend build to web root\n";
    echo "2. Test the application\n";
    echo "3. Create admin account via /api/admin/register\n";
} else {
    if (!empty($errors)) {
        echo "❌ Critical errors found:\n";
        foreach ($errors as $error) {
            echo "   • $error\n";
        }
        echo "\n";
    }
    
    if (!empty($warnings)) {
        echo "⚠️  Warnings:\n";
        foreach ($warnings as $warning) {
            echo "   • $warning\n";
        }
        echo "\n";
    }
    
    if (!empty($errors)) {
        echo "❌ Please fix errors before deploying to production.\n";
        exit(1);
    } else {
        echo "✅ Ready for production (with warnings above)\n";
    }
}

echo "\n🔗 Test URLs:\n";
echo "   Frontend: " . env('FRONTEND_URL', 'https://your-domain.com') . "\n";
echo "   API: " . env('API_URL', 'https://your-domain.com') . "/api/candidates\n";
echo "   Swagger: " . env('API_URL', 'https://your-domain.com') . "/swagger\n";