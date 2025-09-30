const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Game = require('../models/Game');
require('dotenv').config();

let app, token1, token2, user1, user2, gameId;

beforeAll(async () => {
  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/auth', require('../routes/authRoutes'));
  app.use('/api/games', require('../routes/gameRoutes'));
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // Create and verify two users
  user1 = new User({ name: 'User One', email: 'user1@example.com', password: 'hashed', isVerified: true });
  user2 = new User({ name: 'User Two', email: 'user2@example.com', password: 'hashed', isVerified: true });
  await user1.save();
  await user2.save();
  // Mock JWTs (bypass login for test)
  const jwt = require('jsonwebtoken');
  token1 = jwt.sign({ user: { id: user1._id } }, process.env.JWT_SECRET);
  token2 = jwt.sign({ user: { id: user2._id } }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await User.deleteMany({});
  await Game.deleteMany({});
  await mongoose.connection.close();
});

describe('Game API', () => {
  it('should create a game and send invites', async () => {
    const res = await request(app)
      .post('/api/games/create')
      .set('x-auth-token', token1)
      .send({ name: 'Test Match', sportType: 'Soccer', inviteEmails: [user2.email] });
    expect(res.statusCode).toBe(201);
    expect(res.body.game).toBeDefined();
    gameId = res.body.game._id;
  });

  it('user2 should accept the invite', async () => {
    const res = await request(app)
      .post('/api/games/accept')
      .set('x-auth-token', token2)
      .send({ gameId });
    expect(res.statusCode).toBe(200);
    expect(res.body.game.players.length).toBe(2);
  });

  it('user2 should leave the game', async () => {
    const res = await request(app)
      .post('/api/games/leave')
      .set('x-auth-token', token2)
      .send({ gameId });
    expect(res.statusCode).toBe(200);
    expect(res.body.game.players.length).toBe(1);
  });

  it('creator should remove a player (should fail if not present)', async () => {
    const res = await request(app)
      .post('/api/games/remove')
      .set('x-auth-token', token1)
      .send({ gameId, playerId: user2._id });
    expect(res.statusCode).toBe(200);
  });

  it('should get all games for user1', async () => {
    const res = await request(app)
      .get('/api/games/my')
      .set('x-auth-token', token1);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.games)).toBe(true);
  });
});
