const express = require('express');
const User = require('../models/User');
const Image = require('../models/Image');
const router = express.Router();

// Get all users (public endpoint)
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
      .select('username displayName avatarUrl createdAt')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user profile by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id)
      .select('username displayName avatarUrl createdAt');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get user's image count
    const imageCount = await Image.countDocuments({ owner: id });
    
    res.json({
      ...user.toObject(),
      imageCount
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get user profile by username
router.get('/username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username })
      .select('username displayName avatarUrl createdAt');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get user's image count
    const imageCount = await Image.countDocuments({ owner: user._id });
    
    res.json({
      ...user.toObject(),
      imageCount
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = router;

