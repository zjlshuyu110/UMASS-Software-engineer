const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: true,
    trim: true
  },
  messageType: {
    type: String,
    enum: ['text', 'game_invite', 'system'],
    default: 'text'
  },
  relatedGame: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

// Index for faster queries
MessageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
MessageSchema.index({ receiver: 1, isRead: 1 });

module.exports = mongoose.model('Message', MessageSchema);
