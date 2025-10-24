const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPEmail(email, otp) {
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
    subject: 'Your OTP for UMASS Sports App',
    text: `Your OTP is: ${otp}`
  });
}

exports.signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!username) return res.status(400).json({ msg: 'Username is required.' });
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      let conflict = (user.email === email) ? 'Email' : 'Username';
      return res.status(400).json({ msg: `${conflict} already exists` });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000;
    user = new User({ name, username, email, password: hashedPassword, isVerified: false, otp, otpExpires });
    await user.save();
    await sendOTPEmail(email, otp);
    res.status(201).json({ msg: 'Signup successful. Please verify your email with the OTP sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.verify = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }
    if (user.isVerified) {
      return res.status(400).json({ msg: 'User already verified' });
    }
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be username OR email
    if (!identifier || !password)
      return res.status(400).json({ msg: 'Both identifier and password are required.' });
    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
    if (!user)
      return res.status(400).json({ msg: 'Invalid credentials' });
    if (!user.isVerified)
      return res.status(400).json({ msg: 'Please verify your email before logging in.' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: 'Invalid credentials' });
    const payload = { user: { id: user.id, username: user.username } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
