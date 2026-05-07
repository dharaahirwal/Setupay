const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

// @route   GET /api/payment/balance
// @desc    Get current user balance
// @access  Private
router.get('/balance', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('balance');
    res.json({ success: true, balance: user.balance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/payment/search-user
// @desc    Search user by UPI ID, username, or phone
// @access  Private
router.get('/search-user', protect, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters',
      });
    }

    const user = await User.findOne({
      $or: [
        { upiId: query.trim() },
        { username: query.trim() },
        { phone: query.trim() },
      ],
      _id: { $ne: req.user._id }, // exclude self
      isActive: true,
    }).select('username fullName upiId phone profilePicture');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/payment/send
// @desc    Send money to another user
// @access  Private
router.post(
  '/send',
  protect,
  [
    body('receiverUpiId').notEmpty().withMessage('Receiver UPI ID is required'),
    body('amount')
      .isFloat({ min: 1 })
      .withMessage('Amount must be at least ₹1'),
    body('upiPin')
      .isLength({ min: 4, max: 6 })
      .isNumeric()
      .withMessage('Valid UPI PIN required'),
    body('note').optional().isLength({ max: 200 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { receiverUpiId, amount, upiPin, note } = req.body;
      const parsedAmount = parseFloat(amount);

      // Fetch sender with PIN
      const sender = await User.findById(req.user._id);

      if (!sender.upiPinSet) {
        return res.status(400).json({
          success: false,
          message: 'Please set your UPI PIN first',
        });
      }

      // Verify UPI PIN
      const pinValid = await sender.compareUpiPin(upiPin);
      if (!pinValid) {
        return res.status(401).json({
          success: false,
          message: 'Incorrect UPI PIN',
        });
      }

      // Check balance
      if (sender.balance < parsedAmount) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient balance',
        });
      }

      // Find receiver
      const receiver = await User.findOne({
        $or: [{ upiId: receiverUpiId }, { username: receiverUpiId }],
        isActive: true,
      });

      if (!receiver) {
        return res.status(404).json({
          success: false,
          message: 'Receiver not found',
        });
      }

      if (receiver._id.toString() === sender._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Cannot send money to yourself',
        });
      }

      // Record balances before
      const senderBalanceBefore = sender.balance;
      const receiverBalanceBefore = receiver.balance;

      // Deduct from sender
      sender.balance = parseFloat((sender.balance - parsedAmount).toFixed(2));
      await sender.save();

      // Add to receiver
      receiver.balance = parseFloat(
        (receiver.balance + parsedAmount).toFixed(2)
      );
      await receiver.save();

      // Create transaction record
      const transaction = new Transaction({
        sender: sender._id,
        receiver: receiver._id,
        amount: parsedAmount,
        type: 'send',
        status: 'success',
        note: note || '',
        senderBalanceBefore,
        senderBalanceAfter: sender.balance,
        receiverBalanceBefore,
        receiverBalanceAfter: receiver.balance,
      });
      await transaction.save();

      res.json({
        success: true,
        message: `₹${parsedAmount} sent successfully to ${receiver.fullName}`,
        transaction: {
          transactionId: transaction.transactionId,
          upiRef: transaction.upiRef,
          amount: parsedAmount,
          receiver: {
            name: receiver.fullName,
            upiId: receiver.upiId,
          },
          status: 'success',
          timestamp: transaction.createdAt,
        },
        newBalance: sender.balance,
      });
    } catch (error) {
      console.error('Send money error:', error);
      res.status(500).json({ success: false, message: 'Transaction failed' });
    }
  }
);

// @route   GET /api/payment/transactions
// @desc    Get transaction history
// @access  Private
router.get('/transactions', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate('sender', 'username fullName upiId profilePicture')
      .populate('receiver', 'username fullName upiId profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    });

    // Format transactions from user's perspective
    const formatted = transactions.map((t) => {
      const isSender = t.sender._id.toString() === req.user._id.toString();
      return {
        id: t._id,
        transactionId: t.transactionId,
        upiRef: t.upiRef,
        type: isSender ? 'debit' : 'credit',
        amount: t.amount,
        status: t.status,
        note: t.note,
        counterparty: isSender
          ? { name: t.receiver.fullName, upiId: t.receiver.upiId, username: t.receiver.username }
          : { name: t.sender.fullName, upiId: t.sender.upiId, username: t.sender.username },
        balanceBefore: isSender ? t.senderBalanceBefore : t.receiverBalanceBefore,
        balanceAfter: isSender ? t.senderBalanceAfter : t.receiverBalanceAfter,
        timestamp: t.createdAt,
      };
    });

    res.json({
      success: true,
      transactions: formatted,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Transactions error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/payment/transaction/:id
// @desc    Get single transaction detail
// @access  Private
router.get('/transaction/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      transactionId: req.params.id,
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate('sender', 'username fullName upiId')
      .populate('receiver', 'username fullName upiId');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
