<?php
require_once 'config.php';

requireRole($pdo, ['teacher', 'admin']);

$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch ($action) {
    case 'list':
        $stmt = $pdo->prepare("
            SELECT * FROM students 
            ORDER BY class ASC, name ASC
        ");
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;
        
    case 'create':
        if ($_POST['name'] && $_POST['email'] && $_POST['class']) {
            $stmt = $pdo->prepare("
                INSERT INTO students (name, email, class, teacher_id) 
                VALUES (?, ?, ?, ?)
            ");
            $stmt->execute([
                $_POST['name'],
                $_POST['email'],
                $_POST['class'],
                $_SESSION['user_id']
            ]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        }
        break;
        
    case 'delete':
        if ($_GET['id']) {
            $stmt = $pdo->prepare("DELETE FROM students WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode(['success' => true, 'deleted' => $stmt->rowCount() > 0]);
        }
        break;
        
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
}
?>
