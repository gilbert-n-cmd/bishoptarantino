<?php
require_once 'config.php';

$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch ($action) {
    case 'login':
        if ($_POST['email'] && $_POST['password']) {
            $stmt = $pdo->prepare("SELECT id, role, display_name, password_hash FROM users WHERE email = ?");
            $stmt->execute([$_POST['email']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user && password_verify($_POST['password'], $user['password_hash'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['role'] = $user['role'];
                $_SESSION['display_name'] = $user['display_name'] ?? $_POST['email'];
                echo json_encode(['success' => true, 'role' => $user['role'], 'name' => $_SESSION['display_name']]);
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid credentials']);
            }
        }
        break;
        
    case 'register':
        if ($_POST['email'] && $_POST['password'] && $_POST['role']) {
            // Check if exists
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$_POST['email']]);
            if ($stmt->fetch()) {
                http_response_code(409);
                echo json_encode(['error' => 'Email already exists']);
                break;
            }
            
            $hash = password_hash($_POST['password'], PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO users (role, email, password_hash, display_name) VALUES (?, ?, ?, ?)");
            $stmt->execute([$_POST['role'], $_POST['email'], $hash, $_POST['name'] ?? $_POST['email']]);
            
            $user_id = $pdo->lastInsertId();
            $_SESSION['user_id'] = $user_id;
            $_SESSION['role'] = $_POST['role'];
            echo json_encode(['success' => true, 'user_id' => $user_id]);
        }
        break;
        
    case 'logout':
        session_destroy();
        echo json_encode(['success' => true]);
        break;
        
    case 'get_user':
        if (isLoggedIn()) {
            $stmt = $pdo->prepare("SELECT id, role, display_name, email FROM users WHERE id = ?");
            $stmt->execute([$_SESSION['user_id']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($user ?: ['error' => 'User not found']);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Not logged in']);
        }
        break;
        
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
}
?>
