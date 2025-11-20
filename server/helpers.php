<?php
require_once __DIR__ . '/env.php';
require_once __DIR__ . '/db.php';

function send_cors() {
    $origin = env('FRONTEND_URL', '*');
    
    // Get the actual origin from the request
    $requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? null;
    
    if ($origin === '*') {
        header('Access-Control-Allow-Origin: *');
    } elseif ($requestOrigin === 'null' || $requestOrigin === null) {
        // Allow file:// protocol (origin is 'null')
        header('Access-Control-Allow-Origin: *');
    } else {
        // Check if the request origin matches the configured origin
        $allowedOrigins = explode(',', $origin);
        if (in_array($requestOrigin, $allowedOrigins)) {
            header('Access-Control-Allow-Origin: ' . $requestOrigin);
        } else {
            // Fallback to configured origin
            header('Access-Control-Allow-Origin: ' . $origin);
        }
    }
    
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, X-ADMIN-KEY');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
}

function json_response($data, $status = 200) {
    header('Content-Type: application/json');
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function get_raw_input() {
    $body = file_get_contents('php://input');
    $data = json_decode($body, true);
    return is_array($data) ? $data : [];
}

function get_visitor_id() {
    if (!empty($_COOKIE['visitor_id'])) return $_COOKIE['visitor_id'];
    $id = bin2hex(random_bytes(16));
    // Set cookie for 5 years
    setcookie('visitor_id', $id, [
        'expires' => time() + 60*60*24*365*5,
        'path' => '/',
        'httponly' => false,
        'samesite' => 'Lax'
    ]);
    return $id;
}

function hash_ip($ip) {
    $secret = env('APP_SECRET', 'secret');
    return hash('sha256', $ip . '|' . $secret);
}

function require_admin() {
    $key = $_SERVER['HTTP_X_ADMIN_KEY'] ?? null;
    if (!$key) {
        json_response(['error' => 'Unauthorized'], 401);
    }
    
    // Check if it's the env admin password
    $adminPass = env('ADMIN_PASS', 'admin_password');
    if ($key === $adminPass) {
        return;
    }
    
    // Check if it's a valid API key from DB
    try {
        $pdo = db_connect();
        $stmt = $pdo->prepare('SELECT id FROM admins WHERE api_key = ? LIMIT 1');
        $stmt->execute([$key]);
        if ($stmt->fetch()) {
            return;
        }
    } catch (Exception $e) {
        // Continue to unauthorized
    }
    
    json_response(['error' => 'Unauthorized'], 401);
}

function get_or_create_general_category() {
    $pdo = db_connect();
    
    // Check if 'General' category exists
    $stmt = $pdo->prepare('SELECT id FROM categories WHERE name = ? LIMIT 1');
    $stmt->execute(['General']);
    $category = $stmt->fetch();
    
    if ($category) {
        return (int)$category['id'];
    }
    
    // Create 'General' category with id = 1 if possible
    try {
        // Try to insert with specific id
        $stmt = $pdo->prepare('INSERT INTO categories (name, image) VALUES (?, ?)');
        $stmt->execute(['General', null]);
        return (int)$pdo->lastInsertId();
    } catch (Exception $e) {
        // If fails, just return 1 as fallback
        return 1;
    }
}

/**
 * Upload an image to the storage folder
 * @param array $file The $_FILES array element
 * @param string $prefix Optional prefix for the filename
 * @return array Result with 'success', 'url', 'path', or 'error'
 */
function upload_image($file, $prefix = 'img') {
    // Check for upload errors
    if (!isset($file['error']) || is_array($file['error'])) {
        return ['success' => false, 'error' => 'Invalid file upload'];
    }
    
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $errors = [
            UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize',
            UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE',
            UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
            UPLOAD_ERR_NO_FILE => 'No file was uploaded',
            UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
            UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
            UPLOAD_ERR_EXTENSION => 'File upload stopped by extension'
        ];
        $errorMsg = $errors[$file['error']] ?? 'Unknown upload error';
        return ['success' => false, 'error' => $errorMsg];
    }
    
    // Validate file size (10MB max)
    $maxSize = 10 * 1024 * 1024; // 10MB
    if ($file['size'] > $maxSize) {
        return ['success' => false, 'error' => 'File size exceeds 10MB limit'];
    }
    
    // Validate file type
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mimeType, $allowedTypes)) {
        return ['success' => false, 'error' => 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed'];
    }
    
    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = $prefix . '_' . uniqid() . '_' . time() . '.' . $extension;
    
    // Define storage path
    $storageDir = __DIR__ . '/../storage';
    if (!is_dir($storageDir)) {
        mkdir($storageDir, 0755, true);
    }
    
    $filePath = $storageDir . '/' . $filename;
    
    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $filePath)) {
        return ['success' => false, 'error' => 'Failed to move uploaded file'];
    }
    
    // Generate URL for the client
    $baseUrl = env('API_URL', '');
    if (empty($baseUrl)) {
        // Try to construct from request
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        $baseUrl = $protocol . '://' . $host;
    }
    
    $imageUrl = $baseUrl . '/storage/' . $filename;
    
    return [
        'success' => true,
        'url' => $imageUrl,
        'filename' => $filename,
        'path' => '/storage/' . $filename
    ];
}
