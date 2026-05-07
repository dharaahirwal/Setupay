require('dotenv').config();
const { sequelize, connectDB } = require('./config/database');
const { User } = require('./models');

const seedUsers = async () => {
  try {
    await connectDB();

    // Sync database (create tables)
    await sequelize.sync({ force: true });
    console.log('✅ Database synced (tables created)');

    // Create test users
    const users = [
      {
        username: '__.dharaa._',
        password: 'dhara2005',
        fullName: 'Dhara Ahirwal',
        phone: '9876543210',
        email: 'dhara@example.com',
        upiId: 'dhara@upi',
        balance: 10000.00,
        upiPinSet: false,
      },
      {
        username: 'adityasingh03rajput',
        password: 'aditya2005',
        fullName: 'Aditya Singh Rajput',
        phone: '9876543211',
        email: 'aditya@example.com',
        upiId: 'aditya@upi',
        balance: 15000.00,
        upiPinSet: false,
      },
      {
        username: 'testuser1',
        password: 'test123',
        fullName: 'Test User One',
        phone: '9876543212',
        email: 'test1@example.com',
        upiId: 'test1@upi',
        balance: 5000.00,
        upiPinSet: false,
      },
    ];

    for (const userData of users) {
      const user = await User.create(userData);
      console.log(`✅ Created user: ${user.username} (Balance: ₹${user.balance})`);
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('1. Username: __.dharaa._     | Password: dhara2005  | Balance: ₹10,000');
    console.log('2. Username: adityasingh03rajput | Password: aditya2005 | Balance: ₹15,000');
    console.log('3. Username: testuser1       | Password: test123    | Balance: ₹5,000');
    console.log('\n⚠️  Remember to set UPI PIN in Settings before sending money!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedUsers();
