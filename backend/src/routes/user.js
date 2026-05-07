const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { protect } = require('../middleware/auth');
const { Op } = require('sequelize');

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  protect,
  [
    body('fullName').optional().notEmpty().withMessage('Full name cannot be empty'),
    body('email').optional().isEmail().withMessage('Invalid email'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { fullName, email } = req.body;
      const user = await User.findByPk(req.user.id);
      
      if (fullName) user.fullName = fullName;
      if (email) user.email = email;
      
      await user.save();

      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// @route   GET /api/user/contacts
// @desc    Get all users (for contact list)
// @access  Private
router.get('/contacts', protect, async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        id: { [Op.ne]: req.user.id },
        isActive: true,
      },
      attributes: ['id', 'username', 'fullName', 'upiId', 'phone', 'profilePicture']
    });

    res.json({ success: true, contacts: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
