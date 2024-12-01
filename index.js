const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/config'); // Import config file

// Import route files
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const { authenticateToken } = require('./middleware/authMiddleware'); // Authentication middleware

const app = express();
const PORT = config.app.port; // Access port from config

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Routes for User Registration & Authentication
app.use('/auth', authRoutes);

// Routes for Event Management (with token authentication)
app.use('/events', authenticateToken, eventRoutes);

// Routes for Booking & Reservation Management (with token authentication)
app.use('/bookings', authenticateToken, bookingRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
