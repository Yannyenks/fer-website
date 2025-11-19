<?php
// Simple .env loader for this server
function env_load(): array {
    static $env = null;
    if ($env !== null) return $env;
    $path = __DIR__ . '/.env';
    $env = [];
    if (!file_exists($path)) return $env;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') continue;
        if (!strpos($line, '=')) continue;
        [$k, $v] = explode('=', $line, 2);
        $env[trim($k)] = trim($v);
    }
    return $env;
}

function env(string $key, $default = null) {
    $e = env_load();
    return array_key_exists($key, $e) ? $e[$key] : $default;
}
