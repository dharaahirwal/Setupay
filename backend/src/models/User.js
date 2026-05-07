const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  upiId: {
    type: DataTypes.STRING,
    unique: true
  },
  upiPin: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  upiPinSet: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  balance: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  profilePicture: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    defaultValue: null
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance methods
User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

User.prototype.setUpiPin = async function (pin) {
  const salt = await bcrypt.genSalt(12);
  this.upiPin = await bcrypt.hash(pin, salt);
  this.upiPinSet = true;
  await this.save();
};

User.prototype.compareUpiPin = async function (pin) {
  if (!this.upiPin) return false;
  return bcrypt.compare(pin, this.upiPin);
};

// Remove sensitive fields from JSON output
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  delete values.upiPin;
  return values;
};

module.exports = User;
