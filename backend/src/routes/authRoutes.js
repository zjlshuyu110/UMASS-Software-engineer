const express = require('express');
const router = express.Router();
const { signup, login, verify } = require('../controllers/authController');

// @route   POST /api/auth/signup
// @desc    Register user
router.post('/signup', signup);

// @route   POST /api/auth/verify
// @desc    Verify user with OTP
router.post('/verify', verify);

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', login);

module.exports = router;
