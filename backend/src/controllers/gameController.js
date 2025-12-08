const Game = require('../models/Game');
const User = require('../models/User');
const Notification = require('../models/Notif');
const nodemailer = require('nodemailer');

async function sendInviteEmail(email, gameName, inviter) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Game Invitation: ${gameName}`,
    text: `${inviter} has invited you to join the game: ${gameName} on UMASS Sports App.`
  });
}

exports.createGame = async (req, res) => {
  try {
    const { name, sportType, inviteEmails, maxPlayers, location, startAt } = req.body;
    const creator = req.user.id;
    const game = new Game({
      name,
      sportType,
      creator,
      players: [creator],
      invitations: (inviteEmails || []).map(email => ({ email })),
      maxPlayers,
      location,
      startAt: startAt ? new Date(startAt) : new Date()
    });
    await game.save();
    // Notify invited players
    for (const email of inviteEmails || []) {
      await sendInviteEmail(email, name, req.user.name || 'A user');
      const user = await User.findOne({ email: email });
      if (!user) continue;
      // Send notification to the invited player
      const notification = new Notification({
        user: user._id,
        game: game._id,
        category: 'invitation',
        type: 'join',
        title: req.user.name + ' has invited you to join the game',
        date: new Date()
      });
      await notification.save();
    }
    
    res.status(201).json({ msg: 'Game created and invitations sent.', game });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.acceptInvite = async (req, res) => {
  try {
    const { gameId } = req.body;
    const user = await User.findById(req.user.id);
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ msg: 'Game not found' });
    const invite = game.invitations.find(i => i.email === user.email);
    if (!invite || invite.status !== 'pending') return res.status(400).json({ msg: 'No pending invitation' });
    invite.status = 'accepted';
    game.players.push(user._id);
    await game.save();
    
    // Populate players and creator to return formatted data
    const populatedGame = await Game.findById(gameId).populate('creator players');
    const gameObj = populatedGame.toObject();
    
    // Format players with sport_interests
    const formattedPlayers = gameObj.players.map(player => {
      const playerObj = {
        _id: player._id,
        name: player.name,
        email: player.email,
        age: player.age,
        sport_interests: player.sport_interests ? Object.fromEntries(player.sport_interests) : {}
      };
      return playerObj;
    });
    
    // Format creator
    const formattedCreator = {
      _id: gameObj.creator._id,
      name: gameObj.creator.name,
      email: gameObj.creator.email,
      age: gameObj.creator.age,
      sport_interests: gameObj.creator.sport_interests ? Object.fromEntries(gameObj.creator.sport_interests) : {}
    };
    
    // Format requests with user data for pending requests
    const formattedRequests = await Promise.all(
      gameObj.requests
        .filter(req => req.status === 'pending')
        .map(async (request) => {
          const requestUser = await User.findOne({ email: request.email });
          if (requestUser) {
            return {
              _id: requestUser._id,
              email: request.email,
              name: requestUser.name,
              age: requestUser.age,
              sport_interests: requestUser.sport_interests ? Object.fromEntries(requestUser.sport_interests) : {},
              status: request.status,
              requestedAt: request.requestedAt
            };
          }
          return {
            email: request.email,
            name: request.email, // Fallback to email if user not found
            age: 0,
            sport_interests: {},
            status: request.status,
            requestedAt: request.requestedAt
          };
        })
    );
    
    // Determine userRole for the current user (now a player)
    const creatorId = gameObj.creator._id ? gameObj.creator._id.toString() : gameObj.creator.toString();
    let userRole = null;
    if (creatorId === user._id.toString()) {
      userRole = 'creator';
    } else if (formattedPlayers.some(p => p._id.toString() === user._id.toString())) {
      userRole = 'player';
    }

    // Send notification to the creator
    const notification = new Notification({
      user: gameObj.creator._id,
      game: gameId,
      category: 'invitation',
      type: 'accept',
      title: user.name + ' has accepted your invitation to join the game',
      date: new Date()
    });
    await notification.save();

    res.json({ 
      msg: 'Joined the game', 
      game: {
        ...gameObj,
        creator: formattedCreator,
        players: formattedPlayers,
        requests: formattedRequests,
        userRole
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.declineInvite = async (req, res) => {
  try {
    const { gameId } = req.body;
    const user = await User.findById(req.user.id);
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ msg: 'Game not found' });
    const invite = game.invitations.find(i => i.email === user.email);
    if (!invite || invite.status !== 'pending') return res.status(400).json({ msg: 'No pending invitation' });
    invite.status = 'declined';
    await game.save();
    
    // Populate players and creator to return formatted data
    const populatedGame = await Game.findById(gameId).populate('creator players');
    const gameObj = populatedGame.toObject();
    
    // Format players with sport_interests
    const formattedPlayers = gameObj.players.map(player => {
      const playerObj = {
        _id: player._id,
        name: player.name,
        email: player.email,
        age: player.age,
        sport_interests: player.sport_interests ? Object.fromEntries(player.sport_interests) : {}
      };
      return playerObj;
    });
    
    // Format creator
    const formattedCreator = {
      _id: gameObj.creator._id,
      name: gameObj.creator.name,
      email: gameObj.creator.email,
      age: gameObj.creator.age,
      sport_interests: gameObj.creator.sport_interests ? Object.fromEntries(gameObj.creator.sport_interests) : {}
    };

    // Send notification to the creator
    const notification = new Notification({
      user: gameObj.creator._id,
      game: gameId,
      category: 'invitation',
      type: 'reject',
      title: user.name + ' has declined your invitation to join the game',
      date: new Date()
    });
    await notification.save();
    
    // Format requests with user data for pending requests
    const formattedRequests = await Promise.all(
      gameObj.requests
        .filter(req => req.status === 'pending')
        .map(async (request) => {
          const requestUser = await User.findOne({ email: request.email });
          if (requestUser) {
            return {
              _id: requestUser._id,
              email: request.email,
              name: requestUser.name,
              age: requestUser.age,
              sport_interests: requestUser.sport_interests ? Object.fromEntries(requestUser.sport_interests) : {},
              status: request.status,
              requestedAt: request.requestedAt
            };
          }
          return {
            email: request.email,
            name: request.email, // Fallback to email if user not found
            age: 0,
            sport_interests: {},
            status: request.status,
            requestedAt: request.requestedAt
          };
        })
    );
    
    res.json({ 
      msg: 'Declined the invitation', 
      game: {
        ...gameObj,
        creator: formattedCreator,
        players: formattedPlayers,
        requests: formattedRequests
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.leaveGame = async (req, res) => {
  try {
    const { gameId } = req.body;
    const userId = req.user.id;
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ msg: 'Game not found' });
    if (game.creator.toString() === userId) return res.status(400).json({ msg: 'Creator cannot leave the game' });
    game.players = game.players.filter(id => id.toString() !== userId);
    await game.save();
    res.json({ msg: 'Left the game', game });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.removePlayer = async (req, res) => {
  try {
    const { gameId, playerId } = req.body;
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ msg: 'Game not found' });
    if (game.creator.toString() !== req.user.id) return res.status(403).json({ msg: 'Only creator can remove players' });
    game.players = game.players.filter(id => id.toString() !== playerId);
    await game.save();
    res.json({ msg: 'Player removed', game });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getUserGames = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const games = await Game.find({
      $or: [
        { creator: user._id },
        { players: user._id },
        { 'invitations.email': user.email },
        { 'requests.email': user.email }
      ]
    }).populate('creator players');
    
    // Add userRole field to each game based on priority: creator > player > invited > requester
    const gamesWithRole = games.map(game => {
      let userRole = null;
      const gameObj = game.toObject();
      
      // Check if user is creator (handle both populated and unpopulated cases)
      const creatorId = game.creator._id ? game.creator._id.toString() : game.creator.toString();
      if (creatorId === user._id.toString()) {
        userRole = 'creator';
      }
      // Check if user is a player
      else if (game.players.some(p => {
        const playerId = p._id ? p._id.toString() : p.toString();
        return playerId === user._id.toString();
      })) {
        userRole = 'player';
      }
      // Check if user has a pending invitation
      else if (game.invitations.some(i => i.email === user.email && i.status === 'pending')) {
        userRole = 'invited';
      }
      // Check if user has a pending request
      else if (game.requests.some(r => r.email === user.email && r.status === 'pending')) {
        userRole = 'requester';
      }
      
      return { ...gameObj, userRole };
    });
    
    res.json({ games: gamesWithRole });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.id);
    
    const game = await Game.findById(id).populate('creator players');
    if (!game) {
      return res.status(404).json({ msg: 'Game not found' });
    }
    
    // Determine userRole for the current user
    let userRole = null;
    const creatorId = game.creator._id ? game.creator._id.toString() : game.creator.toString();
    if (creatorId === user._id.toString()) {
      userRole = 'creator';
    }
    // Check if user is a player
    else if (game.players.some(p => {
      const playerId = p._id ? p._id.toString() : p.toString();
      return playerId === user._id.toString();
    })) {
      userRole = 'player';
    }
    // Check if user has a pending invitation
    else if (game.invitations.some(i => i.email === user.email && i.status === 'pending')) {
      userRole = 'invited';
    }
    // Check if user has a pending request
    else if (game.requests.some(r => r.email === user.email && r.status === 'pending')) {
      userRole = 'requester';
    }
    
    // Format players with sport_interests
    const gameObj = game.toObject();
    const formattedPlayers = gameObj.players.map(player => {
      const playerObj = {
        _id: player._id,
        name: player.name,
        email: player.email,
        age: player.age,
        sport_interests: player.sport_interests ? Object.fromEntries(player.sport_interests) : {}
      };
      return playerObj;
    });
    
    // Format creator
    const formattedCreator = {
      _id: gameObj.creator._id,
      name: gameObj.creator.name,
      email: gameObj.creator.email,
      age: gameObj.creator.age,
      sport_interests: gameObj.creator.sport_interests ? Object.fromEntries(gameObj.creator.sport_interests) : {}
    };
    
    // Format requests with user data for pending requests
    const formattedRequests = await Promise.all(
      gameObj.requests
        .filter(req => req.status === 'pending')
        .map(async (request) => {
          const requestUser = await User.findOne({ email: request.email });
          if (requestUser) {
            return {
              _id: requestUser._id,
              email: request.email,
              name: requestUser.name,
              age: requestUser.age,
              sport_interests: requestUser.sport_interests ? Object.fromEntries(requestUser.sport_interests) : {},
              status: request.status,
              requestedAt: request.requestedAt
            };
          }
          return {
            email: request.email,
            name: request.email, // Fallback to email if user not found
            age: 0,
            sport_interests: {},
            status: request.status,
            requestedAt: request.requestedAt
          };
        })
    );
    
    res.json({ 
      game: {
        ...gameObj,
        creator: formattedCreator,
        players: formattedPlayers,
        requests: formattedRequests,
        userRole
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getGameBySportType = async (req, res) => {
  try {
    const { sportType } = req.query;
    const games = await Game.find({ sportType });
    res.json({ games });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.searchGames = async (req, res) => {
  try {
    const { sport, name, location, status } = req.query;
    const now = new Date();
    
    // Build search query
    let query = {};
    
    // Filter by sport type
    if (sport && sport !== 'all') {
      query.sportType = sport;
    }
    
    // Search by game name (case-insensitive)
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    
    // Filter by location (case-insensitive)
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    // Filter by status (default to 'open' games only)
    query.status = status || 'open';

    // Filter by date
    query.startAt = {
      $gte: now
    }
    
    const games = await Game.find(query)
      .populate('creator', 'name email')
      .populate('players', 'name email')
      .sort({ startAt: 1, createdAt: -1 })
      .limit(100);
    
    res.json({ games, count: games.length });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getAllRecentGames = async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 }).limit(10);
    res.json({ games });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getGamesNext24Hours = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    const games = await Game.find({
      startAt: {
        $gte: now,
        $lte: next24Hours
      },
      status: { $ne: 'cancelled' }
    })
    .populate('creator players')
    .sort({ startAt: 1 });
    
    // Add userRole field to each game based on priority: creator > player > invited > requester
    const gamesWithRole = games.map(game => {
      let userRole = null;
      const gameObj = game.toObject();
      
      // Check if user is creator (handle both populated and unpopulated cases)
      const creatorId = game.creator._id ? game.creator._id.toString() : game.creator.toString();
      if (creatorId === user._id.toString()) {
        userRole = 'creator';
      }
      // Check if user is a player
      else if (game.players.some(p => {
        const playerId = p._id ? p._id.toString() : p.toString();
        return playerId === user._id.toString();
      })) {
        userRole = 'player';
      }
      // Check if user has a pending invitation
      else if (game.invitations.some(i => i.email === user.email && i.status === 'pending')) {
        userRole = 'invited';
      }
      // Check if user has a pending request
      else if (game.requests.some(r => r.email === user.email && r.status === 'pending')) {
        userRole = 'requester';
      }
      
      return { ...gameObj, userRole };
    });
    
    res.json({ games: gamesWithRole });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.sendRequest = async (req, res) => {
  try {
    const { gameId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ msg: 'Game not found' });
    
    // Check if user is already a player
    const isPlayer = game.players.some(playerId => playerId.toString() === req.user.id);
    if (isPlayer) return res.status(400).json({ msg: 'You are already a player in this game' });
    
    // Check if there's already a pending request from this email
    const existingRequest = game.requests.find(r => r.email === user.email && r.status === 'pending');
    if (existingRequest) return res.status(400).json({ msg: 'You already have a pending request for this game' });
    
    // Add request to game
    game.requests.push({ email: user.email, status: 'pending' });
    await game.save();

    // Send notification to the creator
    const requesterName = user.name || 'A user';
    const notification = new Notification({
      user: game.creator,
      game: gameId,
      category: 'request',
      type: 'join',
      title: requesterName + ' has requested to join the game',
      date: new Date()
    });
    await notification.save();
    res.json({ msg: 'Request sent successfully', game });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const { gameId, requestEmail } = req.body;
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ msg: 'Game not found' });
    
    // Check if user is the creator
    if (game.creator.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Only the game creator can accept requests' });
    }
    
    // Find the request
    const request = game.requests.find(r => r.email === requestEmail && r.status === 'pending');
    if (!request) return res.status(400).json({ msg: 'No pending request found for this email' });
    
    // Find user by email and add to players
    const requestedUser = await User.findOne({ email: requestEmail });
    if (!requestedUser) return res.status(404).json({ msg: 'User not found' });
    
    // Check if user is already a player
    const isPlayer = game.players.some(playerId => playerId.toString() === requestedUser._id.toString());
    if (isPlayer) {
      // Remove the request since user is already a player
      game.requests = game.requests.filter(r => r.email !== requestEmail || r.status !== 'pending');
      await game.save();
      return res.status(400).json({ msg: 'User is already a player in this game' });
    }
    
    // Update request status and add user to players
    request.status = 'accepted';
    game.players.push(requestedUser._id);
    await game.save();
    
    // Populate creator to get name for notification
    const creator = await User.findById(game.creator);
    const creatorName = creator ? (creator.name || creator.email || 'The game creator') : 'The game creator';
    
    // Send notification to the user
    const notification = new Notification({
      user: requestedUser._id,
      game: gameId,
      category: 'request',
      type: 'accept',
      title: creatorName + ' has accepted your request to join the game',
      date: new Date()
    });
    await notification.save();
    // Populate players and creator to return formatted data
    const populatedGame = await Game.findById(gameId).populate('creator players');
    const gameObj = populatedGame.toObject();
    
    // Format players with sport_interests
    const formattedPlayers = gameObj.players.map(player => {
      const playerObj = {
        _id: player._id,
        name: player.name,
        email: player.email,
        age: player.age,
        sport_interests: player.sport_interests ? Object.fromEntries(player.sport_interests) : {}
      };
      return playerObj;
    });
    
    // Format creator
    const formattedCreator = {
      _id: gameObj.creator._id,
      name: gameObj.creator.name,
      email: gameObj.creator.email,
      age: gameObj.creator.age,
      sport_interests: gameObj.creator.sport_interests ? Object.fromEntries(gameObj.creator.sport_interests) : {}
    };
    
    // Format requests with user data for pending requests
    const formattedRequests = await Promise.all(
      gameObj.requests
        .filter(req => req.status === 'pending')
        .map(async (request) => {
          const requestUser = await User.findOne({ email: request.email });
          if (requestUser) {
            return {
              _id: requestUser._id,
              email: request.email,
              name: requestUser.name,
              age: requestUser.age,
              sport_interests: requestUser.sport_interests ? Object.fromEntries(requestUser.sport_interests) : {},
              status: request.status,
              requestedAt: request.requestedAt
            };
          }
          return {
            email: request.email,
            name: request.email, // Fallback to email if user not found
            age: 0,
            sport_interests: {},
            status: request.status,
            requestedAt: request.requestedAt
          };
        })
    );
    
    res.json({ 
      msg: 'Request accepted successfully', 
      game: {
        ...gameObj,
        creator: formattedCreator,
        players: formattedPlayers,
        requests: formattedRequests
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const { gameId, requestEmail } = req.body;
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ msg: 'Game not found' });
    
    // Check if user is the creator
    if (game.creator.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Only the game creator can reject requests' });
    }
    
    // Find the request
    const request = game.requests.find(r => r.email === requestEmail && r.status === 'pending');
    if (!request) return res.status(400).json({ msg: 'No pending request found for this email' });
    
    // Update request status to declined
    request.status = 'declined';
    await game.save();
    
    // Find user by email for notification
    const requestedUser = await User.findOne({ email: requestEmail });
    
    // Populate players and creator to return formatted data
    const populatedGame = await Game.findById(gameId).populate('creator players');
    const gameObj = populatedGame.toObject();
    
    // Send notification to the user
    if (requestedUser) {
      const creatorName = gameObj.creator.name || 'The game creator';
      const notification = new Notification({
        user: requestedUser._id,
        game: gameId,
        category: 'request',
        type: 'reject',
        title: creatorName + ' has rejected your request to join the game',
        date: new Date()
      });
      await notification.save();
    }

    // Format players with sport_interests
    const formattedPlayers = gameObj.players.map(player => {
      const playerObj = {
        _id: player._id,
        name: player.name,
        email: player.email,
        age: player.age,
        sport_interests: player.sport_interests ? Object.fromEntries(player.sport_interests) : {}
      };
      return playerObj;
    });
    
    // Format creator
    const formattedCreator = {
      _id: gameObj.creator._id,
      name: gameObj.creator.name,
      email: gameObj.creator.email,
      age: gameObj.creator.age,
      sport_interests: gameObj.creator.sport_interests ? Object.fromEntries(gameObj.creator.sport_interests) : {}
    };
    
    // Format requests with user data for pending requests
    const formattedRequests = await Promise.all(
      gameObj.requests
        .filter(req => req.status === 'pending')
        .map(async (request) => {
          const requestUser = await User.findOne({ email: request.email });
          if (requestUser) {
            return {
              _id: requestUser._id,
              email: request.email,
              name: requestUser.name,
              age: requestUser.age,
              sport_interests: requestUser.sport_interests ? Object.fromEntries(requestUser.sport_interests) : {},
              status: request.status,
              requestedAt: request.requestedAt
            };
          }
          return {
            email: request.email,
            name: request.email, // Fallback to email if user not found
            age: 0,
            sport_interests: {},
            status: request.status,
            requestedAt: request.requestedAt
          };
        })
    );
    
    res.json({ 
      msg: 'Request rejected successfully', 
      game: {
        ...gameObj,
        creator: formattedCreator,
        players: formattedPlayers,
        requests: formattedRequests
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};