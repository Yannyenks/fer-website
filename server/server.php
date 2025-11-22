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


    // Handle preflight
    if ($method === 'OPTIONS') {
        http_response_code(204);
        return '';
    }

    $path = '/' . ltrim($route, '/');
    echo "Requested path: " . htmlspecialchars($path) . "<br>";

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
    // NON API ROOT = default
    // =============================================
    if (!str_starts_with($path, '/api/')) {
        return "OK";
    }

    // API ROUTING
    $pdo = db_connect();
    $route = substr($path, strlen('/api/'));

    // =============================================
    // ROUTES
    // =============================================

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

    // EVENTS GET
    if ($route === 'events' && $method === 'GET') {
        $stmt = $pdo->query('SELECT * FROM events ORDER BY start_date DESC');
        return json_encode(['events' => $stmt->fetchAll()]);
    }


    // DEFAULT
    http_response_code(404);
    return json_encode(['error' => 'Unknown route']);
}
