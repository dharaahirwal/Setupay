const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { User, Transaction } = require('../models');
const { sequelize } = require('../config/database');
const { protect } = require('../middleware/auth');
const { Op } = require('sequelize');

// @route   GET /api/payment/balance
// @desc    Get current user balance
// @access  Private
router.get('/balance', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: ['balance'] });
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
      where: {
        [Op.or]: [
          { upiId: query.trim() },
          { username: query.trim() },
          { phone: query.trim() },
        ],
        id: { [Op.ne]: req.user.id }, // exclude self
        isActive: true,
      },
      attributes: ['id', 'username', 'fullName', 'upiId', 'phone', 'profilePicture']
    });

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

    // Start a transaction
    const t = await sequelize.transaction();

    try {
      const { receiverUpiId, amount, upiPin, note } = req.body;
      const parsedAmount = parseFloat(amount);

      // Fetch sender with PIN (with lock for update)
      const sender = await User.findByPk(req.user.id, { 
        transaction: t,
        lock: t.LOCK.UPDATE 
      });

      if (!sender.upiPinSet) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: 'Please set your UPI PIN first',
        });
      }

      // Verify UPI PIN
      const pinValid = await sender.compareUpiPin(upiPin);
      if (!pinValid) {
        await t.rollback();
        return res.status(401).json({
          success: false,
          message: 'Incorrect UPI PIN',
        });
      }

      // Check balance
      if (parseFloat(sender.balance) < parsedAmount) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: 'Insufficient balance',
        });
      }

      // Find receiver (with lock for update)
      const receiver = await User.findOne({
        where: {
          [Op.or]: [{ upiId: receiverUpiId }, { username: receiverUpiId }],
          isActive: true,
        },
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      if (!receiver) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: 'Receiver not found',
        });
      }

      if (receiver.id === sender.id) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: 'Cannot send money to yourself',
        });
      }

      // Record balances before
      const senderBalanceBefore = parseFloat(sender.balance);
      const receiverBalanceBefore = parseFloat(receiver.balance);

      // Deduct from sender
      sender.balance = parseFloat((senderBalanceBefore - parsedAmount).toFixed(2));
      await sender.save({ transaction: t });

      // Add to receiver
      receiver.balance = parseFloat((receiverBalanceBefore + parsedAmount).toFixed(2));
      await receiver.save({ transaction: t });

      // Create transaction record
      const transaction = await Transaction.create({
        senderId: sender.id,
        receiverId: receiver.id,
        amount: parsedAmount,
        type: 'send',
        status: 'success',
        note: note || '',
        senderBalanceBefore,
        senderBalanceAfter: sender.balance,
        receiverBalanceBefore,
        receiverBalanceAfter: receiver.balance,
      }, { transaction: t });

      // Commit transaction
      await t.commit();

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
      await t.rollback();
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
    const offset = (page - 1) * limit;

    const { count, rows: transactions } = await Transaction.findAndCountAll({
      where: {
        [Op.or]: [{ senderId: req.user.id }, { receiverId: req.user.id }],
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'fullName', 'upiId', 'profilePicture']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'username', 'fullName', 'upiId', 'profilePicture']
        }
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit
    });

    // Format transactions from user's perspective
    const formatted = transactions.map((t) => {
      const isSender = t.senderId === req.user.id;
      return {
        id: t.id,
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
        total: count,
        pages: Math.ceil(count / limit),
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
      where: {
        transactionId: req.params.id,
        [Op.or]: [{ senderId: req.user.id }, { receiverId: req.user.id }],
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'fullName', 'upiId']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'username', 'fullName', 'upiId']
        }
      ]
    });

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
