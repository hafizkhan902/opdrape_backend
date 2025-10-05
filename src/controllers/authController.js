const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Safe defaults to prevent 500 errors when environment is missing
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_dev_secret';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

const authController = {
  register: async (req, res) => {
    try {
      const { email, password, name } = req.body;

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user
      user = new User({
        email,
        password,
        name
      });

      await user.save();

      // Create JWT token
      const token = jwt.sign(
        { userId: user._id },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
      );

      res.status(201).json({ 
        success: true,
        token,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          isAdmin: user.role === 'admin'
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Verify password
      let isMatch = false;
      try {
        isMatch = await user.comparePassword(password);
      } catch (err) {
        console.error('Password compare error:', err);
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Create JWT token
      const token = jwt.sign(
        { userId: user._id },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
      );

      // Update last login (non-blocking)
      user.lastLogin = new Date();
      user.save().catch(() => {});

      // Send success response with user data and token
      res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          isAdmin: user.role === 'admin'
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = authController; 