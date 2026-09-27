const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ success: false, message: 'Email is already registered' });

    const hashedPassword = await bcrypt.hash(String(password), 10);
    const user = await User.create({ name: String(name).trim(), email: normalizedEmail, password: hashedPassword });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Email is already registered' });
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });

    const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(String(password), user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret || secret.startsWith('replace_with_')) {
      return res.status(500).json({ success: false, message: 'JWT_SECRET is not configured' });
    }

    const token = jwt.sign({ userId: user._id.toString() }, secret, { expiresIn: '7d' });
    return res.json({
      success: true,
      message: 'Login successful',
      data: { token, user: { _id: user._id, name: user.name, email: user.email } },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/profile', requireAuth, async (req, res) => {
  res.json({ success: true, data: { _id: req.user._id, name: req.user.name, email: req.user.email } });
});

module.exports = router;
