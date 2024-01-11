const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const { resetPassword, logout, translateLanguage } = require('../controllers/usersControllers')

// Protected route
router.post('/resetpassword', verifyToken, resetPassword)

// Translate Language route
router.post('/translate-language', verifyToken, translateLanguage)

// Logout Route
router.get('/logout', verifyToken, logout);

module.exports = router;