const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Game = require('../models/Game');
require('dotenv').config();

let app, token, user, game;

beforeAll(async () => {
  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/users', require('../routes/userRoutes'));
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // Create a test user
  user = new User({ 
    name: 'Test User', 
    username: 'testuser', 
    email: 'test@example.com', 
    password: 'hashed', 
    isVerified: true 
  });
  await user.save();
  // Mock JWT
  const jwt = require('jsonwebtoken');
  token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET);
  // Create a test game
  game = new Game({ 
    name: 'Test Game', 
    sportType: 'Soccer', 
    creator: user._id, 
    players: [user._id] 
  });
  await game.save();
});

afterAll(async () => {
  await User.deleteMany({});
  await Game.deleteMany({});
  await mongoose.connection.close();
});

describe('User API', () => {
  it('should get user profile', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('x-auth-token', token);
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.username).toBe('testuser');
  });

  it('should edit user profile', async () => {
    const res = await request(app)
      .put('/api/users/profile')
      .set('x-auth-token', token)
      .send({ name: 'Updated Name', username: 'newusername' });
    expect(res.statusCode).toBe(200);
    expect(res.body.msg).toBe('Profile updated successfully');
  });

  it('should request to join a game', async () => {
    const res = await request(app)
      .post('/api/users/request-join')
      .set('x-auth-token', token)
      .send({ gameId: game._id });
    expect(res.statusCode).toBe(200);
    expect(res.body.msg).toBe('Join request sent to game creator');
  });

  it('should not allow joining a game already joined', async () => {
    const res = await request(app)
      .post('/api/users/request-join')
      .set('x-auth-token', token)
      .send({ gameId: game._id });
    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe('You are already a player in this game');
  });
});
