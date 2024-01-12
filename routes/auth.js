const express = require('express');
const router = express.Router();
const { getRegister, getLogin, postRegister, postLogin } = require('../controllers/usersControllers.js')

// User registration
router.get('/register', getRegister)
router.post('/api/register', postRegister);

// User login
router.get('/login', getLogin);
router.post('/api/login', postLogin);

module.exports = router;
