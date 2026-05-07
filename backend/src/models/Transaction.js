const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      default: () => uuidv4(),
      unique: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    type: {
      type: String,
      enum: ['send', 'receive', 'request'],
      default: 'send',
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'reversed'],
      default: 'pending',
    },
    note: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    upiRef: {
      type: String,
      default: () => 'UPI' + Date.now() + Math.floor(Math.random() * 10000),
    },
    senderBalanceBefore: { type: Number },
    senderBalanceAfter: { type: Number },
    receiverBalanceBefore: { type: Number },
    receiverBalanceAfter: { type: Number },
  },
  { timestamps: true }
);

// Index for fast queries
transactionSchema.index({ sender: 1, createdAt: -1 });
transactionSchema.index({ receiver: 1, createdAt: -1 });
transactionSchema.index({ transactionId: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
