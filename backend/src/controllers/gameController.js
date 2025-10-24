const Game = require('../models/Game');
const User = require('../models/User');
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
    const { name, sportType, inviteEmails } = req.body;
    const creator = req.user.id;
    const game = new Game({
      name,
      sportType,
      creator,
      players: [creator],
      invitations: (inviteEmails || []).map(email => ({ email }))
    });
    await game.save();
    // Notify invited players
    for (const email of inviteEmails || []) {
      await sendInviteEmail(email, name, req.user.name || 'A user');
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
    res.json({ msg: 'Joined the game', game });
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
    res.json({ msg: 'Declined the invitation', game });
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
        { 'invitations.email': user.email }
      ]
    }).populate('creator players');
    res.json({ games });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.inviteUser = async (req, res) => {
  try {
    const { gameId, userEmail, username } = req.body;
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ msg: 'Game not found' });
    
    // Check if current user is the creator
    if (game.creator.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Only the creator can invite users' });
    }

    // Find user by email or username
    let userToInvite;
    if (userEmail) {
      userToInvite = await User.findOne({ email: userEmail.toLowerCase() });
    } else if (username) {
      userToInvite = await User.findOne({ username: username.toLowerCase() });
    } else {
      return res.status(400).json({ msg: 'Either userEmail or username is required' });
    }

    if (!userToInvite) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if user is already a player
    if (game.players.includes(userToInvite._id)) {
      return res.status(400).json({ msg: 'User is already a player in this game' });
    }

    // Check if user is already invited
    const existingInvite = game.invitations.find(inv => inv.email === userToInvite.email);
    if (existingInvite) {
      return res.status(400).json({ msg: 'User already has a pending invitation for this game' });
    }

    // Add invitation
    game.invitations.push({ email: userToInvite.email });
    await game.save();

    // Send email notification
    await sendInviteEmail(userToInvite.email, game.name, req.user.name || 'A user');
    
    res.json({ msg: 'Invitation sent successfully', game });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

/**
 * Search for games based on filters:
 * - name (partial, case-insensitive)
 * - sportType (exact)
 * - status (exact)
 * - playerEmail (find games where this email is a player)
 * - creatorEmail (games created by this email)
 * - invitedEmail (games where this email is invited, with optional invitation status)
 * - dateFrom/dateTo (game creation date range)
 * - supports combinations and paginated results
**/
exports.searchGames = async (req, res) => {
  try {
    const {
      name,
      sportType,
      status,
      playerEmail,
      creatorEmail,
      invitedEmail,
      inviteStatus,
      dateFrom,
      dateTo,
      page = 1,
      pageSize = 20
    } = req.query;
    const query = {};
    if (name) query.name = { $regex: name, $options: 'i' };
    if (sportType) query.sportType = sportType;
    if (status) query.status = status;
    // Creator by email filter
    if (creatorEmail) {
      const creator = await User.findOne({ email: creatorEmail.toLowerCase() });
      if (creator) query.creator = creator._id;
      else return res.json({ games: [] });
    }
    // Players by email filter
    if (playerEmail) {
      const player = await User.findOne({ email: playerEmail.toLowerCase() });
      if (player) query.players = player._id;
      else return res.json({ games: [] });
    }
    // Invitation filter
    if (invitedEmail) {
      let invitationQuery = { 'invitations.email': invitedEmail.toLowerCase() };
      if (inviteStatus) invitationQuery['invitations.status'] = inviteStatus;
      Object.assign(query, invitationQuery);
    }
    // Date range
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    let dbQuery = Game.find(query).populate('creator players');
    dbQuery = dbQuery.skip(skip).limit(parseInt(pageSize));
    const games = await dbQuery.exec();
    res.json({ games });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
