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

const RequestSchema = new mongoose.Schema({
  email: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  requestedAt: { type: Date, default: Date.now }
});

const GameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sportType: { type: String, enum: SPORTS_ENUM, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  invitations: [InvitationSchema],
  requests: [RequestSchema],
  status: { type: String, enum: ['open', 'in_progress', 'completed', 'cancelled'], default: 'open' },
  maxPlayers: { type: Number, required: true },
  location: { type: String, required: true },
  startAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', GameSchema);
module.exports.SPORTS_ENUM = SPORTS_ENUM;
