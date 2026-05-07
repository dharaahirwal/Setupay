const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  transactionId: {
    type: DataTypes.STRING,
    unique: true,
    defaultValue: () => uuidv4()
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 1
    }
  },
  type: {
    type: DataTypes.ENUM('send', 'receive', 'request'),
    defaultValue: 'send'
  },
  status: {
    type: DataTypes.ENUM('pending', 'success', 'failed', 'reversed'),
    defaultValue: 'pending'
  },
  note: {
    type: DataTypes.STRING(200)
  },
  upiRef: {
    type: DataTypes.STRING,
    defaultValue: () => 'UPI' + Date.now() + Math.floor(Math.random() * 10000)
  },
  senderBalanceBefore: {
    type: DataTypes.DECIMAL(10, 2)
  },
  senderBalanceAfter: {
    type: DataTypes.DECIMAL(10, 2)
  },
  receiverBalanceBefore: {
    type: DataTypes.DECIMAL(10, 2)
  },
  receiverBalanceAfter: {
    type: DataTypes.DECIMAL(10, 2)
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['senderId', 'createdAt'] },
    { fields: ['receiverId', 'createdAt'] },
    { fields: ['transactionId'] }
  ]
});

module.exports = Transaction;
