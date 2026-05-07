const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    upiId: {
      type: String,
      unique: true,
    },
    upiPin: {
      type: String, // hashed 4 or 6 digit PIN
      default: null,
    },
    upiPinSet: {
      type: Boolean,
      default: false,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Hash UPI PIN before saving
userSchema.methods.setUpiPin = async function (pin) {
  const salt = await bcrypt.genSalt(12);
  this.upiPin = await bcrypt.hash(pin, salt);
  this.upiPinSet = true;
  await this.save();
};

// Compare UPI PIN
userSchema.methods.compareUpiPin = async function (pin) {
  if (!this.upiPin) return false;
  return bcrypt.compare(pin, this.upiPin);
};

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.upiPin;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
