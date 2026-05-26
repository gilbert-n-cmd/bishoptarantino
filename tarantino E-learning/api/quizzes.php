<?php
require_once 'config.php';

requireRole($pdo, ['teacher', 'admin']);

$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch ($action) {
    case 'list':
        $stmt = $pdo->prepare("
            SELECT q.*, u.display_name as teacher 
            FROM quizzes q 
            LEFT JOIN users u ON q.teacher_id = u.id 
            ORDER BY q.open_time ASC
        ");
        $stmt->execute();
        $quizzes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        // Add status for frontend
        foreach ($quizzes as &$quiz) {
            $now = new DateTime();
            $open = new DateTime($quiz['open_time']);
            $close = new DateTime($quiz['close_time']);
            if ($now < $open) {
                $quiz['status'] = 'upcoming';
            } elseif ($now > $close) {
                $quiz['status'] = 'expired';
            } else {
                $quiz['status'] = 'active-quiz';
            }
            $quiz['start'] = $open->format('c');
            $quiz['end'] = $close->format('c');
        }
        echo json_encode($quizzes);
        break;
        
    case 'create':
        if ($_POST['title'] && $_POST['link'] && $_POST['open_time'] && $_POST['close_time']) {
            $stmt = $pdo->prepare("
                INSERT INTO quizzes (title, description, link, open_time, close_time, teacher_id) 
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $_POST['title'],
                $_POST['description'] ?? null,
                $_POST['link'],
                $_POST['open_time'],
                $_POST['close_time'],
                $_SESSION['user_id']
            ]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        }
        break;
        
    case 'delete':
        if ($_GET['id']) {
            $stmt = $pdo->prepare("DELETE FROM quizzes WHERE id = ? AND teacher_id = ?");
            $stmt->execute([$_GET['id'], $_SESSION['user_id']]);
            echo json_encode(['success' => true, 'deleted' => $stmt->rowCount() > 0]);
        }
        break;
        
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
}
?>
