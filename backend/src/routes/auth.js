const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { protect } = require('../middleware/auth');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { username, password } = req.body;

      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password',
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password',
        });
      }

      user.lastLogin = new Date();
      await user.save();

      const token = generateToken(user.id);

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          phone: user.phone,
          email: user.email,
          upiId: user.upiId,
          upiPinSet: user.upiPinSet,
          balance: user.balance,
          profilePicture: user.profilePicture,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/auth/set-upi-pin
// @desc    Set or change UPI PIN
// @access  Private
router.post(
  '/set-upi-pin',
  protect,
  [
    body('pin')
      .isLength({ min: 4, max: 6 })
      .isNumeric()
      .withMessage('PIN must be 4 or 6 digits'),
    body('password').notEmpty().withMessage('Account password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { pin, password } = req.body;

      // Fetch user with password for verification
      const user = await User.findByPk(req.user.id);
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Incorrect account password',
        });
      }

      await user.setUpiPin(pin);

      res.json({
        success: true,
        message: 'UPI PIN set successfully',
        upiPinSet: true,
      });
    } catch (error) {
      console.error('Set UPI PIN error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// @route   POST /api/auth/change-password
// @desc    Change account password
// @access  Private
router.post(
  '/change-password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findByPk(req.user.id);

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect',
        });
      }

      user.password = newPassword;
      await user.save();

      res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

module.exports = router;
