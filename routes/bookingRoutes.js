const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const bookingController = require('../controllers/bookingController');
const {verifyUser, verifyAdminOrOrganizer} = require('../middleware/roleMiddleware'); // Middleware to authenticate user

/**
{
  "eventId": "672d314413ec83bd607b4a0a",
  "numberOfTickets": 2
}
*/
// Create a booking/reservation for an event
router.post(
  '/',
  verifyUser,
  [
    body('eventId').notEmpty().withMessage('Event ID is required'),
    body('numberOfTickets').isInt({ min: 1 }).withMessage('Number of tickets should be at least 1')
  ],
  bookingController.createBooking
);

// Get all bookings for a specific user
router.get('/', verifyUser, bookingController.getUserBookings);

// Delete a booking by ID - Only accessible to admin users
router.delete('/:bookingId', verifyAdminOrOrganizer, bookingController.deleteBooking);

// Mark a booking as paid (implement payment processing here)
router.post('/:bookingId/pay', verifyUser, bookingController.markAsPaid);




module.exports = router;
