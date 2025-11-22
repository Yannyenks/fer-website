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
    
    // DÉTECTION INTELLIGENTE DE L'ENVIRONNEMENT
    // ==========================================
    $isProduction = false;
    $detectionLog = [];
    
    // Check 1: Marqueur explicite de production (priorité maximale)
    if (file_exists(__DIR__ . '/.production-marker')) {
        $isProduction = true;
        $detectionLog[] = 'production-marker file found';
    }
    
    // Check 2: Variable d'environnement système (priorité haute)
    $envVar = getenv('APP_ENV');
    if ($envVar && $envVar === 'production') {
        $isProduction = true;
        $detectionLog[] = 'APP_ENV system variable = production';
    } elseif ($envVar && $envVar === 'development') {
        $isProduction = false;
        $detectionLog[] = 'APP_ENV system variable = development';
    }
    
    // Check 3: Domaine de production (si pas de variable système)
    if (!$envVar && isset($_SERVER['HTTP_HOST'])) {
        $host = $_SERVER['HTTP_HOST'];
        
        // Liste des domaines/patterns de production
        $productionHosts = ['jvepi.com', '.lws-hosting.com', '.lws.fr'];
        foreach ($productionHosts as $prodHost) {
            if (strpos($host, $prodHost) !== false) {
                $isProduction = true;
                $detectionLog[] = "hostname contains '$prodHost'";
                break;
            }
        }
        
        // Localhost/127.0.0.1 = toujours développement
        if (strpos($host, 'localhost') !== false || strpos($host, '127.0.0.1') !== false) {
            $isProduction = false;
            $detectionLog[] = 'localhost detected';
        }
    }
    
    // Check 4: Système d'exploitation
    if (!$envVar) {
        if (PHP_OS_FAMILY === 'Windows') {
            // Windows = développement (sauf si marqueur ou var env)
            if (!file_exists(__DIR__ . '/.production-marker')) {
                $isProduction = false;
                $detectionLog[] = 'Windows OS = development';
            }
        } elseif (PHP_OS_FAMILY === 'Linux') {
            // Linux avec structure typique d'hébergeur = production
            if (is_dir('/home') && (is_dir('/home/jvepi') || is_dir('/usr/share'))) {
                $isProduction = true;
                $detectionLog[] = 'Linux hosting environment detected';
            }
        }
    }
    
    $autoEnv = $isProduction ? 'production' : 'development';
    
    // Variable d'environnement finale (peut forcer l'override)
    $appEnv = getenv('APP_ENV') ?: $autoEnv;
    
    // Log de détection en mode debug
    if (getenv('APP_ENV_DEBUG') === 'true') {
        error_log('[ENV DETECTION] Environment: ' . $appEnv);
        error_log('[ENV DETECTION] Checks: ' . implode(', ', $detectionLog));
    }
    
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

