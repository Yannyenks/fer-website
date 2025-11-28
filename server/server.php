<?php
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/db.php';

/**
 * Main API handler
 */
function run_api(string $route, string $method)
{
    ob_start(); // buffer output so we can return it

    send_cors();

    // Environment detection debug (TEMPORARY - for production verification)
    $env = env('APP_ENV', 'unknown');
    $dbHost = env('DB_HOST', 'unknown');
    $dbName = env('DB_NAME', 'unknown');
    $dbUser = env('DB_USER', 'unknown');
    $appUrl = env('APP_URL', 'unknown');
    $frontendUrl = env('FRONTEND_URL', 'unknown');
    $apiUrl = env('API_URL', 'unknown');
    $appDebug = env('APP_DEBUG', 'unknown');
    $isProd = is_production() ? 'YES' : 'NO';
    
    // System info
    $phpOs = PHP_OS_FAMILY;
    $httpHost = $_SERVER['HTTP_HOST'] ?? 'unknown';
    $serverSoftware = $_SERVER['SERVER_SOFTWARE'] ?? 'unknown';
    
    // Send as headers
    header("X-Environment: {$env}");
    header("X-DB-Host: {$dbHost}");
    header("X-DB-Name: {$dbName}");
    header("X-DB-User: {$dbUser}");
    header("X-Is-Production: {$isProd}");
    header("X-APP-URL: {$appUrl}");
    header("X-Frontend-URL: {$frontendUrl}");
    header("X-API-URL: {$apiUrl}");
    header("X-Debug-Mode: {$appDebug}");
    header("X-PHP-OS: {$phpOs}");
    header("X-HTTP-Host: {$httpHost}");
    header("X-Server-Software: {$serverSoftware}");
    
    // Also log to console via JSON response wrapper for /api/debug route
    if ($route === 'debug' || $route === '/debug') {
        return json_encode([
            'environment' => [
                'APP_ENV' => $env,
                'IS_PRODUCTION' => $isProd,
                'APP_DEBUG' => $appDebug,
                'APP_URL' => $appUrl,
                'API_URL' => $apiUrl,
                'FRONTEND_URL' => $frontendUrl,
            ],
            'database' => [
                'DB_HOST' => $dbHost,
                'DB_NAME' => $dbName,
                'DB_USER' => $dbUser,
                'DB_PORT' => env('DB_PORT', 'unknown'),
            ],
            'system' => [
                'PHP_OS_FAMILY' => $phpOs,
                'HTTP_HOST' => $httpHost,
                'SERVER_SOFTWARE' => $serverSoftware,
                'PHP_VERSION' => PHP_VERSION,
                'DOCUMENT_ROOT' => $_SERVER['DOCUMENT_ROOT'] ?? 'unknown',
            ]
        ], JSON_PRETTY_PRINT);
    }

    // Handle preflight
    if ($method === 'OPTIONS') {
        http_response_code(204);
        return '';
    }

    $path = '/' . ltrim($route, '/');

    // =============================================
    // SWAGGER UI
    // =============================================
    if (preg_match('#^/?swagger$#', $path) && $method === 'GET') {
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
        return ob_get_clean();
    }

    // =============================================
    // SERVE swagger.json
    // =============================================
    if ($path === '/api/swagger.json' && $method === 'GET') {
        header('Content-Type: application/json');
        return file_get_contents(__DIR__ . '/swagger.json');
    }

    // =============================================
    // SERVE IMAGES
    // =============================================
    if (preg_match('#^/storage/(.+)$#', $path, $m) && $method === 'GET') {
        $filename = basename($m[1]);
        $filePath = __DIR__ . '/../storage/' . $filename;

        if (!file_exists($filePath)) {
            http_response_code(404);
            return json_encode(['error' => 'Image not found', 'path' => $filePath]);
        }

        $mime = mime_content_type($filePath) ?: 'application/octet-stream';
        header('Content-Type: ' . $mime);
        header('Content-Length: ' . filesize($filePath));
        header('Cache-Control: public, max-age=31536000');

        return file_get_contents($filePath);
    }

    // =============================================
    // API ROUTING
    // =============================================
    // Note: .htaccess already stripped /api/ prefix, so $path starts with /
    $pdo = db_connect();
    $route = ltrim($path, '/');

    // =============================================
    // ROUTES
    // =============================================

    // API ROOT - Documentation endpoint
    if (empty($route) || $route === '' || $route === '/') {
        header('Content-Type: application/json');
        $response = json_encode([
            'name' => 'FER API',
            'version' => '1.0',
            'status' => 'ok',
            'message' => 'API is running',
            'documentation' => '/swagger',
            'endpoints' => [
                'GET /api/' => 'API status (this endpoint)',
                'GET /api/swagger' => 'Interactive API documentation',
                'GET /api/debug' => 'Environment and system information',
                'POST /api/admin/login' => 'Admin authentication',
                'POST /api/admin/register' => 'Register new admin (requires invitation)',
                'POST /api/user/login' => 'User authentication',
                'POST /api/user/register' => 'Register new user',
                'GET /api/events' => 'List all events',
                'POST /api/events' => 'Create event (admin)',
                'GET /api/candidates' => 'List all candidates',
                'POST /api/candidate' => 'Create candidate (admin)',
                'POST /api/vote' => 'Vote for a candidate',
                'GET /api/categories' => 'List all categories',
            ]
        ]);
        return ob_get_clean() . $response;
    }

    // UPLOAD
    if ($route === 'upload' && $method === 'POST') {
        require_admin();

        if (!isset($_FILES['image'])) {
            http_response_code(400);
            return json_encode(['error' => 'No image file provided']);
        }

        $prefix = $_POST['prefix'] ?? 'img';
        $result = upload_image($_FILES['image'], $prefix);

        if ($result['success']) {
            return json_encode([
                'success' => true,
                'url' => $result['url'],
                'path' => $result['path'],
                'filename' => $result['filename']
            ]);
        }

        http_response_code(400);
        return json_encode(['error' => $result['error']]);
    }

    // ADMIN REGISTER
    if ($route === 'admin/register' && $method === 'POST') {
        $data = get_raw_input();
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        $email = $data['email'] ?? null;

        if (!$username || !$password) {
            http_response_code(400);
            return json_encode(['error' => 'username and password required']);
        }

        if (strlen($password) < 6) {
            http_response_code(400);
            return json_encode(['error' => 'password must be at least 6 characters']);
        }

        $stmt = $pdo->prepare('SELECT id FROM admins WHERE username = ? LIMIT 1');
        $stmt->execute([$username]);
        if ($stmt->fetch()) {
            http_response_code(409);
            return json_encode(['error' => 'username already exists']);
        }

        $hashed = password_hash($password, PASSWORD_BCRYPT);
        $api_key = bin2hex(random_bytes(32));

        $stmt = $pdo->prepare('INSERT INTO admins (username, password, email, api_key, created_at) VALUES (?, ?, ?, ?, NOW())');
        $stmt->execute([$username, $hashed, $email, $api_key]);

        return json_encode(['ok' => true, 'id' => $pdo->lastInsertId(), 'api_key' => $api_key]);
    }

    // ADMIN LOGIN
    if ($route === 'admin/login' && $method === 'POST') {
        $data = get_raw_input();
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';

        if (!$username || !$password) {
            http_response_code(400);
            return json_encode(['error' => 'username and password required']);
        }

        $stmt = $pdo->prepare('SELECT * FROM admins WHERE username = ? LIMIT 1');
        $stmt->execute([$username]);
        $admin = $stmt->fetch();

        if ($admin && password_verify($password, $admin['password'])) {
            return json_encode(['ok' => true, 'admin' => [
                'id' => $admin['id'],
                'username' => $admin['username'],
                'email' => $admin['email'],
                'api_key' => $admin['api_key']
            ]]);
        }

        if ($username === env('ADMIN_USER') && $password === env('ADMIN_PASS')) {
            return json_encode(['ok' => true, 'admin' => ['username' => $username]]);
        }

        http_response_code(401);
        return json_encode(['ok' => false, 'error' => 'invalid credentials']);
    }

    // CREATE ADMIN INVITATION (requires admin auth)
    if ($route === 'admin/invitations' && $method === 'POST') {
        require_admin();
        $data = get_raw_input();
        $email = $data['email'] ?? null;
        $expiresInHours = (int)($data['expires_in_hours'] ?? 48);
        
        if ($expiresInHours < 1 || $expiresInHours > 168) {
            http_response_code(400);
            return json_encode(['error' => 'expires_in_hours must be between 1 and 168']);
        }
        
        $token = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', time() + ($expiresInHours * 3600));
        
        $adminKey = $_SERVER['HTTP_X_ADMIN_KEY'] ?? '';
        $stmt = $pdo->prepare('SELECT id FROM admins WHERE api_key = ? LIMIT 1');
        $stmt->execute([$adminKey]);
        $admin = $stmt->fetch();
        
        if (!$admin) {
            http_response_code(404);
            return json_encode(['error' => 'Admin not found']);
        }
        
        try {
            $stmt = $pdo->prepare('INSERT INTO admin_invitations (token, created_by, email, expires_at) VALUES (?, ?, ?, ?)');
            $stmt->execute([$token, $admin['id'], $email, $expiresAt]);
            
            $invitationId = $pdo->lastInsertId();
            
            header('Content-Type: application/json');
            return json_encode([
                'ok' => true,
                'id' => $invitationId,
                'token' => $token,
                'expires_at' => $expiresAt,
                'invitation_link' => '/admin-register?token=' . $token
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            header('Content-Type: application/json');
            return json_encode(['error' => 'Failed to create invitation', 'message' => $e->getMessage()]);
        }
    }

    // GET ADMIN INVITATIONS (requires admin auth)
    if ($route === 'admin/invitations' && $method === 'GET') {
        require_admin();
        
        $adminKey = $_SERVER['HTTP_X_ADMIN_KEY'] ?? '';
        $stmt = $pdo->prepare('SELECT id FROM admins WHERE api_key = ? LIMIT 1');
        $stmt->execute([$adminKey]);
        $admin = $stmt->fetch();
        
        if (!$admin) {
            http_response_code(404);
            return json_encode(['error' => 'Admin not found']);
        }
        
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
        
        header('Content-Type: application/json');
        return json_encode(['invitations' => $invitations]);
    }

    // VERIFY INVITATION TOKEN (public)
    if (preg_match('#^admin/invitations/verify/([a-f0-9]+)$#', $route, $m) && $method === 'GET') {
        $token = $m[1];
        
        $stmt = $pdo->prepare('SELECT id, email, expires_at, used_at FROM admin_invitations WHERE token = ? LIMIT 1');
        $stmt->execute([$token]);
        $invitation = $stmt->fetch();
        
        if (!$invitation) {
            http_response_code(404);
            return json_encode(['valid' => false, 'error' => 'Invalid token']);
        }
        
        if ($invitation['used_at']) {
            http_response_code(400);
            return json_encode(['valid' => false, 'error' => 'Token already used']);
        }
        
        if (strtotime($invitation['expires_at']) < time()) {
            http_response_code(400);
            return json_encode(['valid' => false, 'error' => 'Token expired']);
        }
        
        return json_encode([
            'valid' => true,
            'email' => $invitation['email'],
            'expires_at' => $invitation['expires_at']
        ]);
    }

    // DELETE INVITATION (requires admin auth)
    if (preg_match('#^admin/invitations/(\d+)$#', $route, $m) && $method === 'DELETE') {
        require_admin();
        $id = (int)$m[1];
        
        $adminKey = $_SERVER['HTTP_X_ADMIN_KEY'] ?? '';
        $stmt = $pdo->prepare('SELECT id FROM admins WHERE api_key = ? LIMIT 1');
        $stmt->execute([$adminKey]);
        $admin = $stmt->fetch();
        
        if (!$admin) {
            http_response_code(404);
            return json_encode(['error' => 'Admin not found']);
        }
        
        $stmt = $pdo->prepare('DELETE FROM admin_invitations WHERE id = ? AND created_by = ?');
        $stmt->execute([$id, $admin['id']]);
        
        return json_encode(['ok' => true, 'deleted' => $stmt->rowCount()]);
    }

    // USER REGISTER
    if ($route === 'user/register' && $method === 'POST') {
        $data = get_raw_input();
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        $email = $data['email'] ?? null;

        if (!$username || !$password) {
            http_response_code(400);
            return json_encode(['error' => 'username and password required']);
        }

        if (strlen($password) < 6) {
            http_response_code(400);
            return json_encode(['error' => 'password must be at least 6 characters']);
        }

        // Check if username exists
        $stmt = $pdo->prepare('SELECT id FROM users WHERE username = ? LIMIT 1');
        $stmt->execute([$username]);
        if ($stmt->fetch()) {
            http_response_code(409);
            return json_encode(['error' => 'username already exists']);
        }

        // Create user
        $hashed = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare('INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())');
        $stmt->execute([$username, $email, $hashed]);

        $userId = $pdo->lastInsertId();
        
        return json_encode([
            'ok' => true,
            'user' => [
                'id' => $userId,
                'username' => $username,
                'email' => $email,
                'created_at' => date('Y-m-d H:i:s')
            ]
        ]);
    }

    // EVENTS GET
    if ($route === 'events' && $method === 'GET') {
        $stmt = $pdo->query('SELECT * FROM events ORDER BY start_date DESC');
        return json_encode(['events' => $stmt->fetchAll()]);
    }

    // EVENTS CREATE
    if ($route === 'events' && $method === 'POST') {
        require_admin();
        $data = get_raw_input();
        
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
            return json_encode(['id' => $pdo->lastInsertId()]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode(['error' => 'Database error', 'message' => $e->getMessage()]);
        }
    }

    // CATEGORIES
    if ($route === 'categories' && $method === 'GET') {
        $stmt = $pdo->query('SELECT * FROM categories ORDER BY name');
        return json_encode(['categories' => $stmt->fetchAll()]);
    }

    // CANDIDATES GET
    if ($route === 'candidates' && $method === 'GET') {
        $q = $_GET['q'] ?? null;
        if ($q) {
            $stmt = $pdo->prepare('SELECT * FROM candidates WHERE name LIKE ? ORDER BY name');
            $stmt->execute(['%'.$q.'%']);
        } else {
            $stmt = $pdo->query('SELECT * FROM candidates ORDER BY name');
        }
        return json_encode(['candidates' => $stmt->fetchAll()]);
    }

    // CANDIDATE CREATE
    if ($route === 'candidate' && $method === 'POST') {
        require_admin();
        
        $isMultipart = isset($_FILES['image']) && !empty($_FILES['image']['name']);
        
        if ($isMultipart) {
            $data = $_POST;
            $uploadResult = upload_image($_FILES['image'], 'candidate');
            if (!$uploadResult['success']) {
                http_response_code(400);
                return json_encode(['error' => 'Image upload failed', 'message' => $uploadResult['error']]);
            }
            $imageUrl = $uploadResult['url'];
        } else {
            $data = get_raw_input();
            $imageUrl = $data['image'] ?? null;
        }
        
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
            
            return json_encode([
                'id' => $candidateId,
                'image_url' => $imageUrl ?? null
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode(['error' => 'Database error', 'message' => $e->getMessage()]);
        }
    }

    // USER LOGIN
    if ($route === 'user/login' && $method === 'POST') {
        $data = get_raw_input();
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        
        if (!$username || !$password) {
            http_response_code(400);
            return json_encode(['error' => 'username and password required']);
        }
        
        $stmt = $pdo->prepare('SELECT * FROM users WHERE username = ? LIMIT 1');
        $stmt->execute([$username]);
        $user = $stmt->fetch();
        
        if (!$user || !password_verify($password, $user['password'])) {
            http_response_code(401);
            return json_encode(['ok' => false, 'error' => 'invalid credentials']);
        }
        
        $stmt = $pdo->prepare('UPDATE users SET last_login = NOW() WHERE id = ?');
        $stmt->execute([$user['id']]);
        
        return json_encode([
            'ok' => true,
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'role' => $user['role'] ?? 'user',
                'login_at' => date('Y-m-d H:i:s')
            ]
        ]);
    }

    // VOTE
    if ($route === 'vote' && $method === 'POST') {
        $data = get_raw_input();
        $candidate_id = $data['candidate_id'] ?? null;
        if (!$candidate_id) {
            http_response_code(400);
            return json_encode(['error' => 'candidate_id required']);
        }

        $visitor = get_visitor_id();
        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        $ip_hash = hash_ip($ip);

        $stmt = $pdo->prepare('SELECT id, candidate_id FROM votes WHERE visitor_id = ? OR ip_hash = ? LIMIT 1');
        $stmt->execute([$visitor, $ip_hash]);
        $found = $stmt->fetch();
        if ($found) {
            http_response_code(409);
            return json_encode(['ok' => false, 'error' => 'already_voted', 'voted_for' => $found['candidate_id']]);
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
            http_response_code(500);
            return json_encode(['error' => 'db_error', 'msg' => $e->getMessage()]);
        }

        return json_encode(['ok' => true]);
    }

    // VOTES STATS
    if ($route === 'votes/stats' && $method === 'GET') {
        require_admin();
        
        $stmt = $pdo->query('SELECT COUNT(*) as total FROM votes');
        $totalVotes = $stmt->fetch()['total'];
        
        $stmt = $pdo->query('SELECT c.id, c.name, c.votes, COUNT(v.id) as actual_votes 
                             FROM candidates c 
                             LEFT JOIN votes v ON c.id = v.candidate_id 
                             GROUP BY c.id 
                             ORDER BY c.votes DESC');
        $candidates = $stmt->fetchAll();
        
        return json_encode([
            'total_votes' => $totalVotes,
            'candidates' => $candidates
        ]);
    }

    // VOTES SYNC
    if ($route === 'votes/sync' && $method === 'POST') {
        require_admin();
        
        try {
            $pdo->beginTransaction();
            $stmt = $pdo->query('UPDATE candidates c 
                                SET votes = (
                                  SELECT COUNT(*) 
                                  FROM votes v 
                                  WHERE v.candidate_id = c.id
                                )');
            $pdo->commit();
            return json_encode(['ok' => true, 'message' => 'Vote counts synchronized']);
        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            return json_encode(['error' => 'sync_failed', 'message' => $e->getMessage()]);
        }
    }

    // SHARE CREATE
    if ($route === 'share/create' && $method === 'POST') {
        require_admin();
        $data = get_raw_input();
        $candidate_id = $data['candidate_id'] ?? null;
        if (!$candidate_id) {
            http_response_code(400);
            return json_encode(['error' => 'candidate_id required']);
        }
        $token = bin2hex(random_bytes(12));
        $stmt = $pdo->prepare('INSERT INTO share_links (candidate_id, token, created_at) VALUES (?, ?, NOW())');
        $stmt->execute([$candidate_id, $token]);
        return json_encode(['token' => $token, 'url' => (env('FRONTEND_URL') ?? '') . '/share/' . $token]);
    }

    // SHARE RESOLVE
    if (preg_match('#^share/([a-f0-9]+)$#', $route, $m) && $method === 'GET') {
        $token = $m[1];
        $stmt = $pdo->prepare('SELECT * FROM share_links WHERE token = ? LIMIT 1');
        $stmt->execute([$token]);
        $link = $stmt->fetch();
        if (!$link) {
            http_response_code(404);
            return json_encode(['error' => 'not_found']);
        }
        $stmt = $pdo->prepare('SELECT * FROM candidates WHERE id = ? LIMIT 1');
        $stmt->execute([$link['candidate_id']]);
        $candidate = $stmt->fetch();
        return json_encode(['candidate' => $candidate]);
    }

    // EVENT GET SINGLE
    if (preg_match('#^event/(\d+)$#', $route, $m) && $method === 'GET') {
        $id = (int)$m[1];
        $stmt = $pdo->prepare('SELECT * FROM events WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $event = $stmt->fetch();
        if (!$event) {
            http_response_code(404);
            return json_encode(['error' => 'not_found']);
        }
        return json_encode(['event' => $event]);
    }

    // EVENT UPDATE
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
        if (empty($fields)) {
            http_response_code(400);
            return json_encode(['ok' => false, 'error' => 'no_fields']);
        }
        $params[] = $id;
        $sql = 'UPDATE events SET ' . implode(', ', $fields) . ' WHERE id = ?';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return json_encode(['ok' => true]);
    }

    // EVENT DELETE
    if (preg_match('#^event/(\d+)$#', $route, $m) && $method === 'DELETE') {
        require_admin();
        $id = (int)$m[1];
        $stmt = $pdo->prepare('DELETE FROM events WHERE id = ?');
        $stmt->execute([$id]);
        return json_encode(['ok' => true]);
    }

    // CANDIDATE GET SINGLE
    if (preg_match('#^candidate/(\d+)$#', $route, $m) && $method === 'GET') {
        $id = (int)$m[1];
        $stmt = $pdo->prepare('SELECT * FROM candidates WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $candidate = $stmt->fetch();
        if (!$candidate) {
            http_response_code(404);
            return json_encode(['error' => 'not_found']);
        }
        return json_encode(['candidate' => $candidate]);
    }

    // CANDIDATE UPDATE
    if (preg_match('#^candidate/(\d+)$#', $route, $m) && $method === 'PUT') {
        require_admin();
        $id = (int)$m[1];
        $data = get_raw_input();
        
        $stmt = $pdo->prepare('SELECT * FROM candidates WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $current = $stmt->fetch();
        if (!$current) {
            http_response_code(404);
            return json_encode(['error' => 'candidate not found']);
        }
        
        $currentExtra = [];
        if ($current['extra']) {
            $currentExtra = json_decode($current['extra'], true) ?? [];
        }
        
        if (array_key_exists('extra', $data)) {
            $newExtra = is_string($data['extra']) ? json_decode($data['extra'], true) : $data['extra'];
            $currentExtra = array_merge($currentExtra, $newExtra ?? []);
        }
        
        $fields = [];
        $params = [];
        foreach (['name','category_id','bio','image'] as $f) {
            if (array_key_exists($f, $data)) {
                $fields[] = "$f = ?";
                $params[] = $data[$f];
            }
        }
        
        $fields[] = "extra = ?";
        $params[] = json_encode($currentExtra);
        
        if (empty($fields)) {
            http_response_code(400);
            return json_encode(['ok' => false, 'error' => 'no_fields']);
        }
        $params[] = $id;
        $sql = 'UPDATE candidates SET ' . implode(', ', $fields) . ' WHERE id = ?';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        $stmt = $pdo->prepare('SELECT * FROM candidates WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $updated = $stmt->fetch();
        return json_encode(['ok' => true, 'candidate' => $updated]);
    }

    // CANDIDATE DELETE
    if (preg_match('#^candidate/(\d+)$#', $route, $m) && $method === 'DELETE') {
        require_admin();
        $id = (int)$m[1];
        $stmt = $pdo->prepare('DELETE FROM candidates WHERE id = ?');
        $stmt->execute([$id]);
        return json_encode(['ok' => true]);
    }

    // DEFAULT
    http_response_code(404);
    return json_encode(['error' => 'Unknown route']);
}
