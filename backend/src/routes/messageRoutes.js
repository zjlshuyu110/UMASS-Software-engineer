const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const messageController = require('../controllers/messageController');

// @route   POST /api/messages/send
// @desc    Send a message
router.post('/send', auth, messageController.sendMessage);

// @route   GET /api/messages/conversations
// @desc    Get all conversations
router.get('/conversations', auth, messageController.getConversations);

// @route   GET /api/messages/conversation/:userId
// @desc    Get conversation with specific user
router.get('/conversation/:userId', auth, messageController.getConversationWithUser);

// @route   GET /api/messages/unread-count
// @desc    Get unread message count
router.get('/unread-count', auth, messageController.getUnreadCount);

// @route   PUT /api/messages/mark-read/:messageId
// @desc    Mark message as read
router.put('/mark-read/:messageId', auth, messageController.markAsRead);

module.exports = router;
