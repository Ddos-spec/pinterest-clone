const express = require('express');
const { body, validationResult } = require('express-validator');
const Image = require('../models/Image');
const router = express.Router();

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
};

// Get all images (public endpoint)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const images = await Image.find()
      .populate('owner', 'username displayName avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Image.countDocuments();
    
    res.json({
      images,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Get images by user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const images = await Image.find({ owner: userId })
      .populate('owner', 'username displayName avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Image.countDocuments({ owner: userId });
    
    res.json({
      images,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user images:', error);
    res.status(500).json({ error: 'Failed to fetch user images' });
  }
});

// Create new image (authenticated users only)
router.post('/', 
  requireAuth,
  [
    body('url').isURL().withMessage('Valid URL is required'),
    body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title must be 1-100 characters'),
    body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { url, title, description } = req.body;

      const image = new Image({
        url,
        title,
        description: description || '',
        owner: req.user._id,
        ownerName: req.user.displayName || req.user.username
      });

      await image.save();
      
      // Populate owner information before sending response
      await image.populate('owner', 'username displayName avatarUrl');

      res.status(201).json(image);
    } catch (error) {
      console.error('Error creating image:', error);
      res.status(500).json({ error: 'Failed to create image' });
    }
  }
);

// Delete image (owner only)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const image = await Image.findById(id);
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    // Check if user owns the image
    if (image.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this image' });
    }
    
    await Image.findByIdAndDelete(id);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Toggle like on image (authenticated users only)
router.post('/:id/like', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const image = await Image.findById(id);
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    const isLiked = image.likes.includes(userId);
    
    if (isLiked) {
      // Unlike
      image.likes = image.likes.filter(like => like.toString() !== userId.toString());
      image.likesCount = Math.max(0, image.likesCount - 1);
    } else {
      // Like
      image.likes.push(userId);
      image.likesCount += 1;
    }
    
    await image.save();
    
    res.json({ 
      liked: !isLiked, 
      likesCount: image.likesCount 
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

module.exports = router;

