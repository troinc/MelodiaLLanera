const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Import the controller
// const { authenticateToken } = require('../middleware/authMiddleware'); // We'll create this later

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/logout (Optional: depends on session/token strategy)
// router.post('/logout', authenticateToken, authController.logout);

// GET /api/auth/session (Example: to check if user is logged in)
// router.get('/session', authenticateToken, authController.checkSession);

// Placeholder route
router.get('/', (req, res) => {
    res.json({ message: 'Auth routes are working!' });
});


module.exports = router;
