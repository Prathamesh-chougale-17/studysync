const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Register user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Simple validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create salt & hash
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hash
    });

    // Save user
    const savedUser = await newUser.save();

    // Create token
    const token = jwt.sign(
      { id: savedUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        streak: savedUser.streak
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    // Check for existing user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        streak: user.streak
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get user data
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update streak
router.post('/activity', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const now = new Date();
    const lastActive = new Date(user.lastActive);
    
    // Check if last activity was yesterday
    const isYesterday = (
      lastActive.getDate() === now.getDate() - 1 &&
      lastActive.getMonth() === now.getMonth() &&
      lastActive.getFullYear() === now.getFullYear()
    );
    
    // Check if last activity was today
    const isToday = (
      lastActive.getDate() === now.getDate() &&
      lastActive.getMonth() === now.getMonth() &&
      lastActive.getFullYear() === now.getFullYear()
    );
    
    // If last activity was yesterday, increment streak
    if (isYesterday) {
      user.streak += 1;
    } 
    // If last activity was more than a day ago and not today, reset streak
    else if (!isToday) {
      user.streak = 1;
    }
    
    // Update last active date
    user.lastActive = now;
    
    await user.save();
    
    res.json({
      streak: user.streak,
      lastActive: user.lastActive
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get streak information
router.get('/streak', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      streak: user.streak,
      lastActive: user.lastActive
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;