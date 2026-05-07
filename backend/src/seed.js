require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedUsers = [
  {
    username: '__.dharaa._',
    password: 'dhara2005',
    fullName: 'Dhara',
    phone: '9000000001',
    email: 'dharaa@payapp.com',
    upiId: '__.dharaa._@dbl',
    balance: 2000,
  },
  {
    username: 'adityasingh03rajput',
    password: 'aditya2005',
    fullName: 'Aditya Singh Rajput',
    phone: '9000000002',
    email: 'aditya@payapp.com',
    upiId: 'adityasingh03rajput@dbl',
    balance: 200000,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create users (passwords will be hashed by pre-save hook)
    for (const userData of seedUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${user.username} | UPI: ${user.upiId} | Balance: ₹${user.balance}`);
    }

    console.log('\n✅ Seed completed successfully!');
    console.log('\nAccounts:');
    console.log('1. Username: __.dharaa._  | Password: dhara2005  | Balance: ₹2,000');
    console.log('2. Username: adityasingh03rajput | Password: aditya2005 | Balance: ₹2,00,000');
    console.log('\nNote: UPI PIN not set yet. Users must set it after first login.');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
