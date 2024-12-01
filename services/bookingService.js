const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');

// Service to create a booking for an event
exports.createBooking = async (bookingData, userId) => {
  const { eventId, numberOfTickets } = bookingData;

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error('Event not found');
  }

  // Calculate total price
  const totalPrice = event.ticketPrice * numberOfTickets;

  // Create a new booking
  const booking = new Booking({
    event: eventId,
    user: userId,
    ticketCount: numberOfTickets,
    totalPrice,
    status: 'reserved', // Default status as per schema
  });

  return booking.save();
};

// Service to get all bookings for a specific user
exports.getUserBookings = async (userId) => {
  return Booking.find({ user: userId }).populate('event', 'title date location');
};

// Service to mark a booking as paid
exports.markAsPaid = async (bookingId, userId) => {
  const booking = await Booking.findOne({ _id: bookingId, user: userId });
  if (!booking) {
    throw new Error('Booking not found');
  }
  
  // Mock payment processing logic here
  booking.status = 'paid';
  return booking.save();
};

// Service to delete a booking by ID
exports.deleteBooking = async (bookingId, userId) => {
  // find the booking
  const result = await Booking.findById(bookingId);
  if (!result) {
    throw new Error('Booking not found');
  }

  // find the event
  const event = await Event.findById(result.event);
  if (!event) {
    throw new Error('Event not found');
  }
  
  // find the user
  const user = await User.findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  // check if the user is an admin or is the organizer of that event
  if (user.role !== 'admin' && event.organizer.toString() !== userId) {
    throw new Error('You do not have permission to delete this booking');
  }

  // if yes delete, return true
  await result.deleteOne();
  return true;
};

