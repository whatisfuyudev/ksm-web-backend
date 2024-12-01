const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    trim: true,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model for the organizer
    required: true,
  },
  ticketsAvailable: {
    type: Number,
    required: true,
    min: 0,
  },
  ticketPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  reservations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking', // Reference to Booking model for reservations
  }],
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
