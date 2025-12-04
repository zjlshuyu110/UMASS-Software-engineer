const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  category: { type: String, enum: ['game', 'request', 'invitation'], required: true },
  type: { type: String, enum: ['accept', 'reject', 'join'], required: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  unread: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);