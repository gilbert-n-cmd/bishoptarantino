<?php
session_start();

// Database configuration (WAMP default)
define('DB_HOST', 'localhost:3306');
define('DB_NAME', 'elearning');
define('DB_USER', 'root');
define('DB_PASS', '');

// Create connection
try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Helper: Check if logged in
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

// Helper: Get current user role
function getUserRole($pdo) {
    if (!isLoggedIn()) return null;
    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    return $stmt->fetchColumn();
}

// Helper: Require role
function requireRole($pdo, $roles) {
    $role = getUserRole($pdo);
    if (!$role || !in_array($role, (array)$roles)) {
        http_response_code(403);
        echo json_encode(['error' => 'Access denied']);
        exit;
    }
}

// Set JSON headers
header('Content-Type: application/json');
?>
