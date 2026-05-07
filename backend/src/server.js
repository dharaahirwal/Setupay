require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/database');

const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const userRoutes = require('./routes/user');

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Connect to PostgreSQL and start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Database connection error:', err);
  process.exit(1);
});

module.exports = app;
