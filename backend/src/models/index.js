const User = require('./User');
const Transaction = require('./Transaction');

// Define relationships
User.hasMany(Transaction, { 
  foreignKey: 'senderId', 
  as: 'sentTransactions' 
});

User.hasMany(Transaction, { 
  foreignKey: 'receiverId', 
  as: 'receivedTransactions' 
});

Transaction.belongsTo(User, { 
  foreignKey: 'senderId', 
  as: 'sender' 
});

Transaction.belongsTo(User, { 
  foreignKey: 'receiverId', 
  as: 'receiver' 
});

module.exports = {
  User,
  Transaction
};
