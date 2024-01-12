const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const { getResetPassword, logout, postTranslateLanguage, postResetPassword, getTranslateLanguage } = require('../controllers/usersControllers')

// Protected route
router.get('/resetpassword', verifyToken, getResetPassword)
router.post('/api/resetpassword', verifyToken, postResetPassword)

// Translate Language route
router.get('/translate-language', verifyToken, getTranslateLanguage)
router.post('/api/translate-language', verifyToken, postTranslateLanguage)

// Logout Route
router.get('/logout', verifyToken, logout);

module.exports = router;