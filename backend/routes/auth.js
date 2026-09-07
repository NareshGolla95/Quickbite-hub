const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Admin fixed credentials logic
const ADMIN_EMAIL = 'quickbitehub95@gmail..com';
const ADMIN_PASSWORD = 'quickbit@95';

// Login Route for all roles
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (role === 'admin') {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const token = jwt.sign({ id: 'admin_id', role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, user: { name: 'Admin', email, role: 'admin' } });
      } else {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }
    }

    // For user and delivery
    const user = await User.findOne({ email, role });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, location: user.location } });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, location, bikeNumber, photo } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name, email, password: hashedPassword, role, phone, location, bikeNumber, photo
    });

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, location: user.location } });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
