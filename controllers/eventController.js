const { validationResult } = require('express-validator');
const eventService = require('../services/eventService');

// Controller to create a new event
exports.createEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const newEvent = await eventService.createEvent(req.body, req.user.id);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await eventService.getAllEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to get a single event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to update an event
exports.updateEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const updatedEvent = await eventService.updateEvent(req.params.id, req.body, req.user.id);
    res.json(updatedEvent);
  } catch (error) {
    res.status(error.message === 'Event not found' ? 404 : 403).json({ error: error.message });
  }
};

// Controller to delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const deleted = await eventService.deleteEvent(req.params.id, req.user.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(error.message === 'Event not found' ? 404 : 403).json({ error: error.message });
  }
};
