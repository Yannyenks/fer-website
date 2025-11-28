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
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Image not found', 'path' => $filePath]);
        exit;
    }
    
    // Determine content type
    $mimeType = mime_content_type($filePath);
    if (!$mimeType) {
        // Fallback based on extension
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        $mimeTypes = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp'
        ];
        $mimeType = $mimeTypes[$ext] ?? 'application/octet-stream';
    }
    
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

// Admin registration with invitation token (secured)
if ($route === 'admin/register' && $method === 'POST') {
    $data = get_raw_input();
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';
    $email = $data['email'] ?? null;
    $token = $data['invitation_token'] ?? '';
    
    if (empty($username) || empty($password) || empty($token)) {
        json_response(['error' => 'username, password and invitation_token required'], 400);
    }
    
    if (strlen($password) < 6) {
        json_response(['error' => 'password must be at least 6 characters'], 400);
    }
    
    // Verify invitation token
    $stmt = $pdo->prepare('SELECT * FROM admin_invitations WHERE token = ? AND used_at IS NULL AND expires_at > NOW() LIMIT 1');
    $stmt->execute([$token]);
    $invitation = $stmt->fetch();
    
    if (!$invitation) {
        json_response(['error' => 'Invalid or expired invitation token'], 403);
    }
    
    // If email is provided, verify it matches invitation
    if ($invitation['email'] && $email && $invitation['email'] !== $email) {
        json_response(['error' => 'Email does not match invitation'], 403);
    }
    
    // Use invitation email if not provided
    if (!$email && $invitation['email']) {
        $email = $invitation['email'];
    }
    
    // Check if username exists
    $stmt = $pdo->prepare('SELECT id FROM admins WHERE username = ? LIMIT 1');
    $stmt->execute([$username]);
    if ($stmt->fetch()) {
        json_response(['error' => 'username already exists'], 409);
    }
    
    // Check if email exists
    if ($email) {
        $stmt = $pdo->prepare('SELECT id FROM admins WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            json_response(['error' => 'email already exists'], 409);
        }
    }
    
    // Hash password and generate API key
    $hashed = password_hash($password, PASSWORD_BCRYPT);
    $api_key = bin2hex(random_bytes(32));
    
    try {
        $pdo->beginTransaction();
        
        // Insert admin
        $stmt = $pdo->prepare('INSERT INTO admins (username, password, email, api_key, created_at) VALUES (?, ?, ?, ?, NOW())');
        $stmt->execute([$username, $hashed, $email, $api_key]);
        $adminId = $pdo->lastInsertId();
        
        // Mark invitation as used
        $stmt = $pdo->prepare('UPDATE admin_invitations SET used_at = NOW(), used_by = ? WHERE id = ?');
        $stmt->execute([$adminId, $invitation['id']]);
        
        $pdo->commit();
        
        json_response(['ok' => true, 'id' => $adminId, 'api_key' => $api_key]);
    } catch (Exception $e) {
        $pdo->rollBack();
        json_response(['error' => 'Registration failed', 'message' => $e->getMessage()], 500);
    }
}

// Create admin invitation (requires admin auth)
if ($route === 'admin/invitations' && $method === 'POST') {
    require_admin();
    $data = get_raw_input();
    $email = $data['email'] ?? null;
    $expiresInHours = (int)($data['expires_in_hours'] ?? 48); // Default 48h
    
    if ($expiresInHours < 1 || $expiresInHours > 168) { // Max 7 days
        json_response(['error' => 'expires_in_hours must be between 1 and 168'], 400);
    }
    
    // Generate unique token
    $token = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', time() + ($expiresInHours * 3600));
    
    // Get admin ID from API key
    $adminKey = $_SERVER['HTTP_X_ADMIN_KEY'] ?? '';
    $stmt = $pdo->prepare('SELECT id FROM admins WHERE api_key = ? LIMIT 1');
    $stmt->execute([$adminKey]);
    $admin = $stmt->fetch();
    
    if (!$admin) {
        json_response(['error' => 'Admin not found'], 404);
    }
    
    try {
        $stmt = $pdo->prepare('INSERT INTO admin_invitations (token, created_by, email, expires_at) VALUES (?, ?, ?, ?)');
        $stmt->execute([$token, $admin['id'], $email, $expiresAt]);
        
        $invitationId = $pdo->lastInsertId();
        
        json_response([
            'ok' => true,
            'id' => $invitationId,
            'token' => $token,
            'expires_at' => $expiresAt,
            'invitation_link' => '/admin-register?token=' . $token
        ]);
    } catch (PDOException $e) {
        json_response(['error' => 'Failed to create invitation', 'message' => $e->getMessage()], 500);
    }
}

// Get admin invitations list (requires admin auth)
if ($route === 'admin/invitations' && $method === 'GET') {
    require_admin();
    
    // Get admin ID from API key
    $adminKey = $_SERVER['HTTP_X_ADMIN_KEY'] ?? '';
    $stmt = $pdo->prepare('SELECT id FROM admins WHERE api_key = ? LIMIT 1');
    $stmt->execute([$adminKey]);
    $admin = $stmt->fetch();
    
    if (!$admin) {
        json_response(['error' => 'Admin not found'], 404);
    }
    
    // Get all invitations created by this admin
    $stmt = $pdo->prepare('
        SELECT 
            ai.*,
            a_used.username as used_by_username
        FROM admin_invitations ai
        LEFT JOIN admins a_used ON ai.used_by = a_used.id
        WHERE ai.created_by = ?
        ORDER BY ai.created_at DESC
    ');
    $stmt->execute([$admin['id']]);
    $invitations = $stmt->fetchAll();
    
    json_response(['invitations' => $invitations]);
}

// Verify invitation token (public endpoint)
if (preg_match('#^admin/invitations/verify/([a-f0-9]+)$#', $route, $m) && $method === 'GET') {
    $token = $m[1];
    
    $stmt = $pdo->prepare('SELECT id, email, expires_at, used_at FROM admin_invitations WHERE token = ? LIMIT 1');
    $stmt->execute([$token]);
    $invitation = $stmt->fetch();
    
    if (!$invitation) {
        json_response(['valid' => false, 'error' => 'Invalid token'], 404);
    }
    
    if ($invitation['used_at']) {
        json_response(['valid' => false, 'error' => 'Token already used'], 400);
    }
    
    if (strtotime($invitation['expires_at']) < time()) {
        json_response(['valid' => false, 'error' => 'Token expired'], 400);
    }
    
    json_response([
        'valid' => true,
        'email' => $invitation['email'],
        'expires_at' => $invitation['expires_at']
    ]);
}

// Delete invitation (requires admin auth)
if (preg_match('#^admin/invitations/(\d+)$#', $route, $m) && $method === 'DELETE') {
    require_admin();
    $id = (int)$m[1];
    
    // Get admin ID from API key
    $adminKey = $_SERVER['HTTP_X_ADMIN_KEY'] ?? '';
    $stmt = $pdo->prepare('SELECT id FROM admins WHERE api_key = ? LIMIT 1');
    $stmt->execute([$adminKey]);
    $admin = $stmt->fetch();
    
    if (!$admin) {
        json_response(['error' => 'Admin not found'], 404);
    }
    
    // Only allow deletion of own invitations
    $stmt = $pdo->prepare('DELETE FROM admin_invitations WHERE id = ? AND created_by = ?');
    $stmt->execute([$id, $admin['id']]);
    
    json_response(['ok' => true, 'deleted' => $stmt->rowCount()]);
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
    $type = $_GET['type'] ?? null; // Filter by type (miss/awards)
    
    if ($q) {
        if ($type && in_array($type, ['miss', 'awards'])) {
            $stmt = $pdo->prepare('SELECT * FROM candidates WHERE name LIKE ? AND type = ? ORDER BY name');
            $stmt->execute(['%'.$q.'%', $type]);
        } else {
            $stmt = $pdo->prepare('SELECT * FROM candidates WHERE name LIKE ? ORDER BY name');
            $stmt->execute(['%'.$q.'%']);
        }
    } else {
        if ($type && in_array($type, ['miss', 'awards'])) {
            $stmt = $pdo->prepare('SELECT * FROM candidates WHERE type = ? ORDER BY name');
            $stmt->execute([$type]);
        } else {
            $stmt = $pdo->query('SELECT * FROM candidates ORDER BY name');
        }
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
        $type = $data['type'] ?? 'miss'; // Default to 'miss' if not specified
        
        // Validate type
        if (!in_array($type, ['miss', 'awards'])) {
            $type = 'miss';
        }
        
        $stmt = $pdo->prepare('INSERT INTO candidates (name, type, category_id, bio, image, votes, extra) VALUES (?, ?, ?, ?, ?, 0, ?)');
        $stmt->execute([$data['name'] ?? null, $type, $category_id, $data['bio'] ?? null, $imageUrl, $extra]);
        
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

    // Get the candidate's type (miss or awards)
    $stmt = $pdo->prepare('SELECT type FROM candidates WHERE id = ? LIMIT 1');
    $stmt->execute([$candidate_id]);
    $candidate = $stmt->fetch();
    if (!$candidate) json_response(['error' => 'candidate_not_found'], 404);
    
    $candidate_type = $candidate['type'] ?? 'miss';

    // Prevent duplicate votes: one vote per visitor/IP per CATEGORY (miss or awards)
    // Check if user already voted for a candidate of the same type
    $stmt = $pdo->prepare('
        SELECT v.id, v.candidate_id, c.name, c.type 
        FROM votes v 
        INNER JOIN candidates c ON v.candidate_id = c.id 
        WHERE (v.visitor_id = ? OR v.ip_hash = ?) AND c.type = ?
        LIMIT 1
    ');
    $stmt->execute([$visitor, $ip_hash, $candidate_type]);
    $found = $stmt->fetch();
    
    if ($found) {
        json_response([
            'ok' => false, 
            'error' => 'already_voted', 
            'voted_for' => $found['candidate_id'],
            'voted_for_name' => $found['name'],
            'category' => $candidate_type
        ], 409);
    }

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

    json_response(['ok' => true, 'category' => $candidate_type]);
}

// Get voting statistics (admin)
if ($route === 'votes/stats' && $method === 'GET') {
    require_admin();
    
    // Get total votes
    $stmt = $pdo->query('SELECT COUNT(*) as total FROM votes');
    $totalVotes = $stmt->fetch()['total'];
    
    // Get candidates with vote counts
    $stmt = $pdo->query('SELECT c.id, c.name, c.votes, COUNT(v.id) as actual_votes 
                         FROM candidates c 
                         LEFT JOIN votes v ON c.id = v.candidate_id 
                         GROUP BY c.id 
                         ORDER BY c.votes DESC');
    $candidates = $stmt->fetchAll();
    
    json_response([
        'total_votes' => $totalVotes,
        'candidates' => $candidates
    ]);
}

// Sync vote counts (admin only - use to fix inconsistencies)
if ($route === 'votes/sync' && $method === 'POST') {
    require_admin();
    
    try {
        $pdo->beginTransaction();
        
        // Update all candidates' vote counts based on votes table
        $stmt = $pdo->query('UPDATE candidates c 
                            SET votes = (
                              SELECT COUNT(*) 
                              FROM votes v 
                              WHERE v.candidate_id = c.id
                            )');
        
        $pdo->commit();
        json_response(['ok' => true, 'message' => 'Vote counts synchronized']);
    } catch (Exception $e) {
        $pdo->rollBack();
        json_response(['error' => 'sync_failed', 'message' => $e->getMessage()], 500);
    }
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
    
    // First, get current candidate data to merge with updates
    $stmt = $pdo->prepare('SELECT * FROM candidates WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $current = $stmt->fetch();
    if (!$current) json_response(['error' => 'candidate not found'], 404);
    
    // Parse current extra data
    $currentExtra = [];
    if ($current['extra']) {
        $currentExtra = json_decode($current['extra'], true) ?? [];
    }
    
    // Merge extra data if provided
    if (array_key_exists('extra', $data)) {
        $newExtra = is_string($data['extra']) ? json_decode($data['extra'], true) : $data['extra'];
        $currentExtra = array_merge($currentExtra, $newExtra ?? []);
    }
    
    $fields = [];
    $params = [];
    foreach (['name','type','category_id','bio','image'] as $f) {
        if (array_key_exists($f, $data)) {
            // Validate type if provided
            if ($f === 'type' && !in_array($data[$f], ['miss', 'awards'])) {
                continue; // Skip invalid type values
            }
            $fields[] = "$f = ?";
            $params[] = $data[$f];
        }
    }
    
    // Always update extra with merged data
    $fields[] = "extra = ?";
    $params[] = json_encode($currentExtra);
    
    if (empty($fields)) json_response(['ok' => false, 'error' => 'no_fields'], 400);
    $params[] = $id;
    $sql = 'UPDATE candidates SET ' . implode(', ', $fields) . ' WHERE id = ?';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    // Return updated candidate
    $stmt = $pdo->prepare('SELECT * FROM candidates WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $updated = $stmt->fetch();
    json_response(['ok' => true, 'candidate' => $updated]);
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
    
    // Check if username already exists
    $stmt = $pdo->prepare('SELECT id FROM users WHERE username = ? LIMIT 1');
    $stmt->execute([$username]);
    if ($stmt->fetch()) {
        json_response(['error' => 'username already exists'], 409);
    }
    
    // Check if email already exists
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        json_response(['error' => 'email already exists'], 409);
    }
    
    // Hash password and insert user
    $hashed = password_hash($password, PASSWORD_BCRYPT);
    try {
        $stmt = $pdo->prepare('INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())');
        $stmt->execute([$username, $email, $hashed, 'user']);
        
        $userId = $pdo->lastInsertId();
        
        json_response([
            'ok' => true, 
            'user' => [
                'id' => $userId,
                'username' => $username,
                'email' => $email,
                'role' => 'user',
                'created_at' => date('Y-m-d H:i:s')
            ]
        ]);
    } catch (PDOException $e) {
        json_response(['error' => 'Database error', 'message' => $e->getMessage()], 500);
    }
}

// User login endpoint
if ($route === 'user/login' && $method === 'POST') {
    $data = get_raw_input();
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        json_response(['error' => 'username and password required'], 400);
    }
    
    // Fetch user from database
    $stmt = $pdo->prepare('SELECT * FROM users WHERE username = ? LIMIT 1');
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    
    if (!$user || !password_verify($password, $user['password'])) {
        json_response(['ok' => false, 'error' => 'invalid credentials'], 401);
    }
    
    // Update last login
    $stmt = $pdo->prepare('UPDATE users SET last_login = NOW() WHERE id = ?');
    $stmt->execute([$user['id']]);
    
    json_response([
        'ok' => true,
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'role' => $user['role'],
            'login_at' => date('Y-m-d H:i:s')
        ]
    ]);
}

json_response(['error' => 'Unknown route'], 404);
