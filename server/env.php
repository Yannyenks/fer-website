<?php
/**
 * Smart .env loader with environment switching support
 * 
 * Usage:
 * - By default loads .env
 * - Set APP_ENV environment variable to switch: 
 *   - APP_ENV=development -> loads .env.development
 *   - APP_ENV=production -> loads .env.production
 * - Can also create .env.local to override any value
 */

function env_load(): array {
    static $env = null;
    if ($env !== null) return $env;
    
    $env = [];
    
    // 1. Déterminer l'environnement automatiquement
    // Production si on détecte un serveur de production (LWS, hébergeur, etc.)
    $autoEnv = 'development';
    
    // Détection automatique de production
    if (
        (isset($_SERVER['HTTP_HOST']) && 
         (strpos($_SERVER['HTTP_HOST'], 'jvepi.com') !== false || 
          strpos($_SERVER['HTTP_HOST'], '.lws-hosting.com') !== false)) ||
        (is_dir('/home') && !is_dir('C:\\')) || // Serveur Linux (pas Windows)
        file_exists(__DIR__ . '/.production-marker') // Marqueur manuel
    ) {
        $autoEnv = 'production';
    }
    
    // Variable d'environnement peut override la détection auto
    $appEnv = getenv('APP_ENV') ?: $autoEnv;
    
    // Priority order: .env.{APP_ENV} > .env > .env.local (for local overrides)
    $envFiles = [
        __DIR__ . '/.env',                    // Base file
        __DIR__ . "/.env.{$appEnv}",         // Environment-specific
        __DIR__ . '/.env.local'               // Local overrides (gitignored)
    ];
    
    foreach ($envFiles as $path) {
        if (!file_exists($path)) continue;
        
        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || $line[0] === '#') continue;
            if (!strpos($line, '=')) continue;
            
            [$k, $v] = explode('=', $line, 2);
            $key = trim($k);
            $value = trim($v);
            
            // Remove quotes if present
            if ((substr($value, 0, 1) === '"' && substr($value, -1) === '"') ||
                (substr($value, 0, 1) === "'" && substr($value, -1) === "'")) {
                $value = substr($value, 1, -1);
            }
            
            $env[$key] = $value;
        }
    }
    
    // S'assurer que APP_ENV est défini
    if (!isset($env['APP_ENV'])) {
        $env['APP_ENV'] = $appEnv;
    }
    
    return $env;
}

function env(string $key, $default = null) {
    $e = env_load();
    return array_key_exists($key, $e) ? $e[$key] : $default;
}

function is_production(): bool {
    return env('APP_ENV', 'development') === 'production';
}

function is_development(): bool {
    return env('APP_ENV', 'development') === 'development';
}

function is_debug_enabled(): bool {
    $debug = env('APP_DEBUG', 'true');
    return in_array(strtolower($debug), ['true', '1', 'yes', 'on'], true);
}

