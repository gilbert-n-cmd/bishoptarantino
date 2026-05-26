<?php
require_once 'config.php';

requireRole($pdo, ['teacher', 'admin']);

$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch ($action) {
    case 'list':
        $stmt = $pdo->prepare("
            SELECT n.*, u.display_name as teacher 
            FROM notes n 
            LEFT JOIN users u ON n.teacher_id = u.id 
            ORDER BY n.timestamp DESC
        ");
        $stmt->execute();
        $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($notes);
        break;
        
    case 'create':
        if ($_POST['title'] && $_POST['link']) {
            $stmt = $pdo->prepare("
                INSERT INTO notes (title, link, description, pdf_url, youtube_link, class_level, teacher_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $_POST['title'],
                $_POST['link'],
                $_POST['description'] ?? null,
                $_POST['pdf_url'] ?? null,
                $_POST['youtube_link'] ?? null,
                $_POST['class'] ?? null,
                $_SESSION['user_id']
            ]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        }
        break;
        
    case 'delete':
        if ($_GET['id']) {
            $stmt = $pdo->prepare("DELETE FROM notes WHERE id = ? AND teacher_id = ?");
            $stmt->execute([$_GET['id'], $_SESSION['user_id']]);
            echo json_encode(['success' => true, 'deleted' => $stmt->rowCount() > 0]);
        }
        break;
        
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
}
?>
