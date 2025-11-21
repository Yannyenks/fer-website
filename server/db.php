<?php
require_once __DIR__ . '/env.php';

function db_connect(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;
    
    $host = env('DB_HOST', '127.0.0.1');
    $port = env('DB_PORT', '3306');
    $name = env('DB_NAME', 'jvepi');
    $user = env('DB_USER', 'root');
    $pass = env('DB_PASS', '');
    $dsn = "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];

    try {
        $pdo = new PDO($dsn, $user, $pass, $options);
        return $pdo;
    } catch (PDOException $e) {
        // If database does not exist (SQLSTATE 42000 / code 1049), try to create it
        $msg = $e->getMessage();
        if (str_contains($msg, 'Unknown database') || $e->getCode() === '1049') {
            try {
                // connect without db to create
                $dsnNoDb = "mysql:host={$host};port={$port};charset=utf8mb4";
                $tmp = new PDO($dsnNoDb, $user, $pass, $options);
                $tmp->exec("CREATE DATABASE IF NOT EXISTS `{$name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
                // try reconnect
                $pdo = new PDO($dsn, $user, $pass, $options);
                return $pdo;
            } catch (PDOException $e2) {
                // In production, don't expose connection details
                if (is_production()) {
                    http_response_code(503);
                    die(json_encode(['error' => 'Service temporarily unavailable']));
                }
                throw $e2;
            }
        }
        
        // In production, hide detailed error messages
        if (is_production()) {
            http_response_code(503);
            die(json_encode(['error' => 'Database connection failed']));
        }
        
        throw $e;
    }
}
