<?php
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/db.php';

send_cors();

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Swagger UI route (before API check)
if ($path === '/swagger' && $method === 'GET') {
    $spec_url = '/api/swagger.json';
    ?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FER API - Swagger UI</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.10.0/swagger-ui.css">
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.10.0/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.10.0/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            SwaggerUIBundle({
                url: "<?= $spec_url ?>",
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                layout: "StandaloneLayout"
            });
        };
    </script>
</body>
</html>
    <?php
    exit;
}

// Serve swagger.json spec
if ($path === '/api/swagger.json' && $method === 'GET') {
    header('Content-Type: application/json');
    readfile(__DIR__ . '/swagger.json');
    exit;
}

// Serve uploaded images from storage/
if (preg_match('#^/storage/(.+)$#', $path, $m) && $method === 'GET') {
    $filename = basename($m[1]); // Security: prevent directory traversal
    $filePath = __DIR__ . '/../storage/' . $filename;
    
    if (!file_exists($filePath)) {
        http_response_code(404);
        echo "Image not found";
        exit;
    }
    
    // Determine content type
    $mimeType = mime_content_type($filePath);
    header('Content-Type: ' . $mimeType);
    header('Content-Length: ' . filesize($filePath));
    header('Cache-Control: public, max-age=31536000'); // Cache for 1 year
    readfile($filePath);
    exit;
}

// Simple router: /api/...
if (strpos($path, '/api/') !== 0) {
    echo "OK";
    exit;
}

$pdo = db_connect();
$route = substr($path, strlen('/api/'));

// ROUTES
if ($route === 'upload' && $method === 'POST') {
    require_admin();
    
    if (!isset($_FILES['image'])) {
        json_response(['error' => 'No image file provided'], 400);
    }
    
    $prefix = $_POST['prefix'] ?? 'img';
    $result = upload_image($_FILES['image'], $prefix);
    
    if ($result['success']) {
        json_response([
            'success' => true,
            'url' => $result['url'],
            'path' => $result['path'],
            'filename' => $result['filename']
        ]);
    } else {
        json_response(['error' => $result['error']], 400);
    }
}

if ($route === 'admin/register' && $method === 'POST') {
    $data = get_raw_input();
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';
    $email = $data['email'] ?? null;
    
    if (empty($username) || empty($password)) {
        json_response(['error' => 'username and password required'], 400);
    }
    
    if (strlen($password) < 6) {
        json_response(['error' => 'password must be at least 6 characters'], 400);
    }
    
    // Check if username exists
    $stmt = $pdo->prepare('SELECT id FROM admins WHERE username = ? LIMIT 1');
    $stmt->execute([$username]);
    if ($stmt->fetch()) {
        json_response(['error' => 'username already exists'], 409);
    }
    
    // Hash password and generate API key
    $hashed = password_hash($password, PASSWORD_BCRYPT);
    $api_key = bin2hex(random_bytes(32));
    $stmt = $pdo->prepare('INSERT INTO admins (username, password, email, api_key, created_at) VALUES (?, ?, ?, ?, NOW())');
    $stmt->execute([$username, $hashed, $email, $api_key]);
    
    json_response(['ok' => true, 'id' => $pdo->lastInsertId(), 'api_key' => $api_key]);
}

if ($route === 'admin/login' && $method === 'POST') {
    $data = get_raw_input();
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        json_response(['error' => 'username and password required'], 400);
    }
    
    // Try DB auth first
    $stmt = $pdo->prepare('SELECT * FROM admins WHERE username = ? LIMIT 1');
    $stmt->execute([$username]);
    $admin = $stmt->fetch();
    
    if ($admin && password_verify($password, $admin['password'])) {
        json_response(['ok' => true, 'admin' => ['id' => $admin['id'], 'username' => $admin['username'], 'email' => $admin['email'], 'api_key' => $admin['api_key']]]);
    }
    
    // Fallback to env credentials
    if ($username === env('ADMIN_USER') && $password === env('ADMIN_PASS')) {
        json_response(['ok' => true, 'admin' => ['username' => $username]]);
    }
    
    json_response(['ok' => false, 'error' => 'invalid credentials'], 401);
}

if ($route === 'events' && $method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM events ORDER BY start_date DESC');
    $events = $stmt->fetchAll();
    json_response(['events' => $events]);
}

if ($route === 'events' && $method === 'POST') {
    require_admin();
    $data = get_raw_input();
    
    // Validate category_id if provided
    $category_id = $data['category_id'] ?? null;
    if ($category_id !== null && $category_id > 0) {
        $stmt = $pdo->prepare('SELECT id FROM categories WHERE id = ? LIMIT 1');
        $stmt->execute([$category_id]);
        if (!$stmt->fetch()) {
            $category_id = get_or_create_general_category();
        }
    } else {
        $category_id = get_or_create_general_category();
    }
    
    try {
        $stmt = $pdo->prepare('INSERT INTO events (name, start_date, end_date, cover_image, description, category_id) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->execute([$data['name'] ?? null, $data['start_date'] ?? null, $data['end_date'] ?? null, $data['cover_image'] ?? null, $data['description'] ?? null, $category_id]);
        json_response(['id' => $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        json_response(['error' => 'Database error', 'message' => $e->getMessage()], 500);
    }
}

if ($route === 'categories' && $method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM categories ORDER BY name');
    json_response(['categories' => $stmt->fetchAll()]);
}

if ($route === 'candidates' && $method === 'GET') {
    $q = $_GET['q'] ?? null;
    if ($q) {
        $stmt = $pdo->prepare('SELECT * FROM candidates WHERE name LIKE ? ORDER BY name');
        $stmt->execute(['%'.$q.'%']);
    } else {
        $stmt = $pdo->query('SELECT * FROM candidates ORDER BY name');
    }
    json_response(['candidates' => $stmt->fetchAll()]);
}

if ($route === 'candidate' && $method === 'POST') {
    require_admin();
    
    // Check if this is a multipart/form-data request with image upload
    $isMultipart = isset($_FILES['image']) && !empty($_FILES['image']['name']);
    
    if ($isMultipart) {
        // Handle multipart form data
        $data = $_POST;
        
        // Upload the image
        $uploadResult = upload_image($_FILES['image'], 'candidate');
        if (!$uploadResult['success']) {
            json_response(['error' => 'Image upload failed', 'message' => $uploadResult['error']], 400);
        }
        
        // Use the uploaded image URL
        $imageUrl = $uploadResult['url'];
    } else {
        // Handle JSON data (legacy support)
        $data = get_raw_input();
        $imageUrl = $data['image'] ?? null;
    }
    
    // Validate category_id if provided
    $category_id = $data['category_id'] ?? null;
    if ($category_id !== null && $category_id > 0) {
        $stmt = $pdo->prepare('SELECT id FROM categories WHERE id = ? LIMIT 1');
        $stmt->execute([$category_id]);
        if (!$stmt->fetch()) {
            $category_id = get_or_create_general_category();
        }
    } else {
        $category_id = get_or_create_general_category();
    }
    
    try {
        $extra = isset($data['extra']) ? (is_string($data['extra']) ? $data['extra'] : json_encode($data['extra'])) : null;
        $stmt = $pdo->prepare('INSERT INTO candidates (name, category_id, bio, image, votes, extra) VALUES (?, ?, ?, ?, 0, ?)');
        $stmt->execute([$data['name'] ?? null, $category_id, $data['bio'] ?? null, $imageUrl, $extra]);
        
        $candidateId = $pdo->lastInsertId();
        
        // Return candidate with image URL
        json_response([
            'id' => $candidateId,
            'image_url' => $imageUrl ?? null
        ]);
    } catch (PDOException $e) {
        json_response(['error' => 'Database error', 'message' => $e->getMessage()], 500);
    }
}

if ($route === 'vote' && $method === 'POST') {
    $data = get_raw_input();
    $candidate_id = $data['candidate_id'] ?? null;
    if (!$candidate_id) json_response(['error' => 'candidate_id required'], 400);

    $visitor = get_visitor_id();
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $ip_hash = hash_ip($ip);

    // Prevent duplicate votes by same visitor or IP for same candidate
    $stmt = $pdo->prepare('SELECT id FROM votes WHERE candidate_id = ? AND (visitor_id = ? OR ip_hash = ?) LIMIT 1');
    $stmt->execute([$candidate_id, $visitor, $ip_hash]);
    $found = $stmt->fetch();
    if ($found) json_response(['ok' => false, 'error' => 'already_voted'], 409);

    try {
        $pdo->beginTransaction();
        $stmt = $pdo->prepare('INSERT INTO votes (candidate_id, visitor_id, ip_hash, created_at) VALUES (?, ?, ?, NOW())');
        $stmt->execute([$candidate_id, $visitor, $ip_hash]);
        $stmt = $pdo->prepare('UPDATE candidates SET votes = votes + 1 WHERE id = ?');
        $stmt->execute([$candidate_id]);
        $pdo->commit();
    } catch (Exception $e) {
        $pdo->rollBack();
        json_response(['error' => 'db_error', 'msg' => $e->getMessage()], 500);
    }

    json_response(['ok' => true]);
}

// Create share token (admin)
if ($route === 'share/create' && $method === 'POST') {
    require_admin();
    $data = get_raw_input();
    $candidate_id = $data['candidate_id'] ?? null;
    if (!$candidate_id) json_response(['error' => 'candidate_id required'], 400);
    $token = bin2hex(random_bytes(12));
    $stmt = $pdo->prepare('INSERT INTO share_links (candidate_id, token, created_at) VALUES (?, ?, NOW())');
    $stmt->execute([$candidate_id, $token]);
    json_response(['token' => $token, 'url' => (env('FRONTEND_URL') ?? '') . '/share/' . $token]);
}

// Resolve share token
if (preg_match('#^share/([a-f0-9]+)$#', $route, $m) && $method === 'GET') {
    $token = $m[1];
    $stmt = $pdo->prepare('SELECT * FROM share_links WHERE token = ? LIMIT 1');
    $stmt->execute([$token]);
    $link = $stmt->fetch();
    if (!$link) json_response(['error' => 'not_found'], 404);
    // Return candidate info for frontend to allow voting
    $stmt = $pdo->prepare('SELECT * FROM candidates WHERE id = ? LIMIT 1');
    $stmt->execute([$link['candidate_id']]);
    $candidate = $stmt->fetch();
    json_response(['candidate' => $candidate]);
}

// Get single event
if (preg_match('#^event/(\d+)$#', $route, $m) && $method === 'GET') {
    $id = (int)$m[1];
    $stmt = $pdo->prepare('SELECT * FROM events WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $event = $stmt->fetch();
    if (!$event) json_response(['error' => 'not_found'], 404);
    json_response(['event' => $event]);
}

// Update event (admin)
if (preg_match('#^event/(\d+)$#', $route, $m) && $method === 'PUT') {
    require_admin();
    $id = (int)$m[1];
    $data = get_raw_input();
    $fields = [];
    $params = [];
    foreach (['name','start_date','end_date','cover_image','description','category_id'] as $f) {
        if (array_key_exists($f, $data)) {
            $fields[] = "$f = ?";
            $params[] = $data[$f];
        }
    }
    if (empty($fields)) json_response(['ok' => false, 'error' => 'no_fields'], 400);
    $params[] = $id;
    $sql = 'UPDATE events SET ' . implode(', ', $fields) . ' WHERE id = ?';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    json_response(['ok' => true]);
}

// Delete event (admin)
if (preg_match('#^event/(\d+)$#', $route, $m) && $method === 'DELETE') {
    require_admin();
    $id = (int)$m[1];
    $stmt = $pdo->prepare('DELETE FROM events WHERE id = ?');
    $stmt->execute([$id]);
    json_response(['ok' => true]);
}

// Get single candidate
if (preg_match('#^candidate/(\d+)$#', $route, $m) && $method === 'GET') {
    $id = (int)$m[1];
    $stmt = $pdo->prepare('SELECT * FROM candidates WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $candidate = $stmt->fetch();
    if (!$candidate) json_response(['error' => 'not_found'], 404);
    json_response(['candidate' => $candidate]);
}

// Update candidate (admin)
if (preg_match('#^candidate/(\d+)$#', $route, $m) && $method === 'PUT') {
    require_admin();
    $id = (int)$m[1];
    $data = get_raw_input();
    $fields = [];
    $params = [];
    foreach (['name','category_id','bio','image','votes'] as $f) {
        if (array_key_exists($f, $data)) {
            $fields[] = "$f = ?";
            $params[] = $data[$f];
        }
    }
    if (array_key_exists('extra', $data)) {
        $fields[] = "extra = ?";
        $params[] = json_encode($data['extra']);
    }
    if (empty($fields)) json_response(['ok' => false, 'error' => 'no_fields'], 400);
    $params[] = $id;
    $sql = 'UPDATE candidates SET ' . implode(', ', $fields) . ' WHERE id = ?';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    json_response(['ok' => true]);
}

// Delete candidate (admin)
if (preg_match('#^candidate/(\d+)$#', $route, $m) && $method === 'DELETE') {
    require_admin();
    $id = (int)$m[1];
    $stmt = $pdo->prepare('DELETE FROM candidates WHERE id = ?');
    $stmt->execute([$id]);
    json_response(['ok' => true]);
}

// User registration endpoint (for regular users, not admins)
if ($route === 'user/register' && $method === 'POST') {
    $data = get_raw_input();
    $username = $data['username'] ?? '';
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    
    if (empty($username) || empty($email) || empty($password)) {
        json_response(['error' => 'username, email and password required'], 400);
    }
    
    if (strlen($password) < 6) {
        json_response(['error' => 'password must be at least 6 characters'], 400);
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        json_response(['error' => 'invalid email format'], 400);
    }
    
    // For MVP, we'll just return success (no database storage for regular users)
    // In production, you'd want to store users in a separate 'users' table
    $user_id = 'user_' . time() . '_' . mt_rand(1000, 9999);
    
    json_response([
        'ok' => true, 
        'user' => [
            'id' => $user_id,
            'username' => $username,
            'email' => $email,
            'role' => 'user',
            'created_at' => date('Y-m-d H:i:s')
        ]
    ]);
}

// User login endpoint
if ($route === 'user/login' && $method === 'POST') {
    $data = get_raw_input();
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        json_response(['error' => 'username and password required'], 400);
    }
    
    // For MVP, accept any non-empty credentials for regular users
    // In production, validate against users table
    $user_id = 'user_' . time() . '_' . mt_rand(1000, 9999);
    
    json_response([
        'ok' => true,
        'user' => [
            'id' => $user_id,
            'username' => $username,
            'role' => 'user',
            'login_at' => date('Y-m-d H:i:s')
        ]
    ]);
}

json_response(['error' => 'Unknown route'], 404);
