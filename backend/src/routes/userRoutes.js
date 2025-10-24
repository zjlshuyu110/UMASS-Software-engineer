const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

// @route   GET /api/users/profile
// @desc    Get user profile
router.get('/profile', auth, userController.getProfile);

// @route   PUT /api/users/profile
// @desc    Edit user profile
router.put('/profile', auth, userController.editProfile);

// @route   POST /api/users/request-join
// @desc    Request to join a game
router.post('/request-join', auth, userController.requestToJoin);

module.exports = router;
