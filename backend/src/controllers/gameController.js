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
