import { Router } from 'express';
import User from '../models/User';
import { requireAuth } from '../middlewares/auth';

const r = Router();

r.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.userId)
    .select('email username name year age hasProfile');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user, hasProfile: !!user.hasProfile });
});

r.post('/profile', requireAuth, async (req, res) => {
  const { name, year, age } = req.body || {};
  if (!name) return res.status(400).json({ message: 'name is required' });
  if (age != null && (Number.isNaN(+age) || age < 10 || age > 120))
    return res.status(400).json({ message: 'invalid age' });

  const user = await User.findByIdAndUpdate(
    req.userId,
    { name, year, age, hasProfile: true },
    { new: true }
  ).select('email username name year age hasProfile');

  res.status(201).json({ user });
});

export default r;
