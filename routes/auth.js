const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/usersControllers.js')

// User registration
router.post('/register', register);

// User login
router.post('/login', login);

module.exports = router;
