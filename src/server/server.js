const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'pinterest-clone-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pinterest-clone', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User model
const userSchema = new mongoose.Schema({
  githubId: String,
  username: String,
  displayName: String,
  profileUrl: String,
  avatarUrl: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Pin model
const pinSchema = new mongoose.Schema({
  imageUrl: String,
  description: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const Pin = mongoose.model('Pin', pinSchema);

// Passport GitHub strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:3000/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ githubId: profile.id });
    
    if (user) {
      return done(null, user);
    } else {
      user = new User({
        githubId: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        profileUrl: profile.profileUrl,
        avatarUrl: profile.photos[0].value
      });
      await user.save();
      return done(null, user);
    }
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Authentication middleware
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
};

// Routes
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

app.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.redirect('/');
  });
});

app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Pin routes
app.post('/api/pins', ensureAuthenticated, async (req, res) => {
  try {
    const { imageUrl, description } = req.body;
    const pin = new Pin({
      imageUrl,
      description,
      userId: req.user._id
    });
    await pin.save();
    res.json(pin);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create pin' });
  }
});

app.get('/api/pins', ensureAuthenticated, async (req, res) => {
  try {
    const pins = await Pin.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(pins);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pins' });
  }
});

app.get('/api/users/:username/pins', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const pins = await Pin.find({ userId: user._id }).sort({ createdAt: -1 });
    res.json({ user: { username: user.username, displayName: user.displayName }, pins });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user pins' });
  }
});

app.delete('/api/pins/:id', ensureAuthenticated, async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id);
    if (!pin) {
      return res.status(404).json({ error: 'Pin not found' });
    }
    if (pin.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this pin' });
    }
    await Pin.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pin deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete pin' });
  }
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/../../public/index.html');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

