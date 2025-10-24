const User = require('../models/User');
const Game = require('../models/Game');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

async function sendInviteRequestEmail(creatorEmail, requesterName, gameName) {
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: creatorEmail,
    subject: `Game Join Request: ${gameName}`,
    text: `${requesterName} has requested to join your game: ${gameName} on UMASS Sports App.`
  });
}

exports.editProfile = async (req, res) => {
  try {
    const { name, username, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Check current password if changing password
    if (newPassword && currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Current password is incorrect' });
    }

    // Check username uniqueness if changing
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) return res.status(400).json({ msg: 'Username already exists' });
    }

    // Check email uniqueness if changing
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ msg: 'Email already exists' });
    }

    // Update fields
    if (name) user.name = name;
    if (username) user.username = username;
    if (email) user.email = email;
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    res.json({ msg: 'Profile updated successfully', user: { id: user._id, name: user.name, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.requestToJoin = async (req, res) => {
  try {
    const { gameId } = req.body;
    const requester = await User.findById(req.user.id);
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ msg: 'Game not found' });
    
    // Check if user is already a player
    if (game.players.includes(requester._id)) {
      return res.status(400).json({ msg: 'You are already a player in this game' });
    }

    // Check if user is already invited
    const existingInvite = game.invitations.find(inv => inv.email === requester.email);
    if (existingInvite) {
      return res.status(400).json({ msg: 'You already have a pending invitation for this game' });
    }

    // Get creator info and send email
    const creator = await User.findById(game.creator);
    await sendInviteRequestEmail(creator.email, requester.name, game.name);
    
    res.json({ msg: 'Join request sent to game creator' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp -otpExpires');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
