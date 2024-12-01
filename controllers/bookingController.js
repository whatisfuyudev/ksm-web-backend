const { validationResult } = require('express-validator');
const bookingService = require('../services/bookingService');

// Controller to create a new booking
exports.createBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const booking = await bookingService.createBooking(req.body, req.user.id);
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to get all bookings for a specific user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getUserBookings(req.user.id);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to mark a booking as paid
exports.markAsPaid = async (req, res) => {
  try {
    const paymentResult = await bookingService.markAsPaid(req.params.bookingId, req.user.id);
    if (!paymentResult) return res.status(404).json({ message: 'Booking not found or not authorized' });
    res.json({ message: 'Booking marked as paid' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to delete a booking by ID
exports.deleteBooking = async (req, res) => {
  try {
    const deleted = await bookingService.deleteBooking(req.params.bookingId, req.user.id);
    if (!deleted) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};