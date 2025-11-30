const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String
  },
  otpExpires: {
    type: Date
  },
  display_picture: {
    type: String
  },
  age: {
    type: Number
  },
  sport_interests: {
    type: Map,
    of: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
