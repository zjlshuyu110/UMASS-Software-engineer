const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

let app;

beforeAll(async () => {
  app = express();
  app.use(express.json());
  app.use('/api/auth', require('../routes/authRoutes'));
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Auth Endpoints', () => {
  const userData = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'testpassword'
  };

  it('should signup a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(userData);
    expect(res.statusCode).toEqual(201);
    expect(res.body.token).toBeDefined();
  });

  it('should not signup with existing email', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(userData);
    expect(res.statusCode).toEqual(400);
    expect(res.body.msg).toBe('User already exists');
  });

  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: userData.email, password: userData.password });
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
  });

  it('should not login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: userData.email, password: 'wrongpassword' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.msg).toBe('Invalid credentials');
  });
});
