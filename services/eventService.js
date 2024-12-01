const Event = require('../models/Event');
const User = require('../models/User');

// Service to create an event
exports.createEvent = async (eventData, organizerId) => {
  try {
    // Step 1: Create the event
    const event = new Event({
      ...eventData,
      organizer: organizerId
    });
    const newEvent = await event.save();

    // Step 2: Find the organizer by ID
    const organizer = await User.findUserById(organizerId);
    if (!organizer) {
      throw new Error('Organizer not found');
    }

    // Step 3: Add the newly created event ID to the organizer's `createdEvents` field
    organizer.createdEvents.push(newEvent._id);
    await organizer.save();

    return newEvent;
  } catch (error) {
    console.error('Error creating event:', error.message);
    throw error;
  }
};

// Service to get all events
exports.getAllEvents = async () => {
  return Event.find().populate('organizer', 'username email');
};

// Service to get an event by ID
exports.getEventById = async (eventId) => {
  return Event.findById(eventId).populate('organizer', 'username email');
};

// Service to update an event
exports.updateEvent = async (eventId, eventData, userId) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error('Event not found');
  }

  // Check if user has permission to update (is organizer or admin)
  const user = await User.findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  if (user.role !== 'admin' && event.organizer.toString() !== userId) {
    throw new Error('You do not have permission to update this event');
  }

  // Proceed with updating the event if validation passes
  return Event.findOneAndUpdate(
    { _id: eventId },
    eventData,
    { new: true }
  );
};

// Service to delete an event
exports.deleteEvent = async (eventId, userId) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error('Event not found');
  }

  // Check if user has permission to delete (is organizer or admin)
  const user = await User.findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  if (user.role !== 'admin' && event.organizer.toString() !== userId) {
    throw new Error('You do not have permission to delete this event');
  }

  // Proceed with deleting the event if validation passes
  await event.deleteOne();
  return true;
};
