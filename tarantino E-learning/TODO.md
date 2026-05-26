# E-Learning Platform TODO

## Current Progress
- [x] Contact layout task (main site)
- [ ] Complete E-Learning API & Schema

## Schema Fixes & API Completion
- [ ] 1. Update elearning.sql: Add missing `students` table, ALTER users for `display_name` & `class`, align notes/quizzes fields
- [ ] 2. Import updated SQL to DB
- [ ] 3. Test all API endpoints (auth, students, quizzes, notes)
- [ ] 4. Integrate JS fetch in dashboards (student-dashboard.html, admin-dashboard.html)
- [ ] 5. Add quiz results/submissions tables & endpoints if needed
- [ ] 6. Frontend polish & testing

## Testing
- Start WAMP, phpMyAdmin -> import elearning.sql
- Test: POST /api/auth.php?action=register, GET /api/students.php?action=list (teacher login first)

