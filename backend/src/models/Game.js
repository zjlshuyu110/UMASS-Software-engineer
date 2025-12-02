const mongoose = require('mongoose');

const SPORTS_ENUM = [
  'Soccer', 'Basketball', 'Baseball', 'Football', 'Tennis', 'Volleyball', 'Cricket', 'Hockey', 'Rugby',
  'Table Tennis', 'Badminton', 'Golf', 'Softball', 'Lacrosse', 'Ultimate Frisbee', 'Track', 'Swimming',
  'Wrestling', 'Rowing', 'Field Hockey', 'Other'
];

const InvitationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  invitedAt: { type: Date, default: Date.now }
});

const GameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sportType: { type: String, enum: SPORTS_ENUM, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  maxPlayers: { type: Number, default: 10 },
  invitations: [InvitationSchema],
  status: { type: String, enum: ['open', 'in_progress', 'completed', 'cancelled'], default: 'open' },
  location: { type: String },
  startAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', GameSchema);
module.exports.SPORTS_ENUM = SPORTS_ENUM;
