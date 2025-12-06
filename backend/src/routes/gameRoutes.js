const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const gameController = require('../controllers/gameController');

// @route   POST /api/games/create
// @desc    Create a new game and invite players
router.post('/create', auth, gameController.createGame);

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

// @route   GET /api/games/search
// @desc    Search and filter games
router.get('/search', auth, gameController.searchGames);

// @route   GET /api/games/sport
// @desc    Get games by sport type
router.get('/sport', auth, gameController.getGameBySportType);

// @route   GET /api/games/soon
// @desc    Get games happening in the next 24 hours
router.get('/soon', auth, gameController.getGamesNext24Hours);

// @route   GET /api/games/:id
// @desc    Get a game by ID with populated player data
router.get('/:id', auth, gameController.getGameById);

// @route   POST /api/games/request
// @desc    Send a request to join a game
router.post('/request', auth, gameController.sendRequest);

// @route   POST /api/games/accept-request
// @desc    Accept a request to join a game (creator only)
router.post('/accept-request', auth, gameController.acceptRequest);

// @route   POST /api/games/reject-request
// @desc    Reject a request to join a game (creator only)
router.post('/reject-request', auth, gameController.rejectRequest);

module.exports = router;
