const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const gameController = require('../controllers/gameController');

// @route   POST /api/games/create
// @desc    Create a new game and invite players
router.post('/create', auth, gameController.createGame);

// @route   POST /api/games/edit
// @desc    Edit a game (creator only)
router.post('/edit', auth, gameController.editGame);

// @route   POST /api/games/accept
// @desc    Accept a game invitation
router.post('/accept', auth, gameController.acceptInvite);

// @route   POST /api/games/decline
// @desc    Decline a game invitation
router.post('/decline', auth, gameController.declineInvite);

// @route   POST /api/games/leave
// @desc    Leave a game
router.post('/leave', auth, gameController.leaveGame);

// @route   POST /api/games/remove
// @desc    Remove a player from a game (creator only)
router.post('/remove', auth, gameController.removePlayer);

// @route   GET /api/games/my
// @desc    Get all games for the user
router.get('/my', auth, gameController.getUserGames);

// @route   POST /api/games/search
// @desc    Comprehensive search for games via body JSON
router.post('/search', gameController.searchGames);

// @route   GET /api/games/invitations
// @desc    Get all invitations for the current user (optional ?inviteStatus=pending)
router.get('/invitations', auth, gameController.getMyInvitations);

// @route   POST /api/games/invite
// @desc    Invite a user to a game (creator only)
router.post('/invite', auth, gameController.inviteUser);

module.exports = router;
