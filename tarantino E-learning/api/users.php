<?php
require_once 'config.php';

$action = $_GET['action'] ?? '';

if ($action === 'profile' && isLoggedIn()) {
    $stmt = $pdo->prepare("SELECT id, role, display_name, email, class FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($user ?: ['error' => 'User not found']);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
}
?>
