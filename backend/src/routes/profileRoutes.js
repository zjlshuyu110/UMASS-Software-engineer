const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const profileController = require('../controllers/profileController');

// @route   GET /api/profile/check
// @desc    Check if user has a profile
router.get('/check', auth, profileController.checkProfile);

// @route   POST /api/profile
// @desc    Create/set user profile
router.post('/', auth, profileController.createProfile);

// @route   GET /api/profile
// @desc    Get user profile
router.get('/', auth, profileController.getProfile);

// @route   PUT /api/profile
// @desc    Update user profile
router.put('/', auth, profileController.updateProfile);

module.exports = router;

