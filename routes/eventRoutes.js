const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { verifyOrganizer, verifyAdminOrOrganizer } = require('../middleware/roleMiddleware');
const { body, param } = require('express-validator');


/*
example json data:
{
  "title": "Music Concert 2024",
  "description": "A live music event featuring top artists.",
  "date": "2024-12-25T18:00:00Z",
  "location": "Central Park, New York",
  "ticketsAvailable": 500,
  "ticketPrice": 49.99
}
*/
// Event Management Routes
router.post(
  '/',
  [
    verifyAdminOrOrganizer,
    body('title').notEmpty().withMessage('Title is required'),
    body('date').isISO8601().withMessage('Date is required in ISO8601 format'),
    body('location').notEmpty().withMessage('Location is required'),
    body('ticketsAvailable').isInt({ min: 0 }).withMessage('Tickets available should be a non-negative integer'),
    body('ticketPrice').isFloat({ min: 0 }).withMessage('Ticket price should be a non-negative number')
  ],
  eventController.createEvent
);

router.get('/', eventController.getAllEvents);

router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid event ID')],
  eventController.getEventById
);

router.put(
  '/:id',
  [
    verifyAdminOrOrganizer,
    param('id').isMongoId().withMessage('Invalid event ID'),
    body('title').optional().notEmpty().withMessage('Title is required'),
    body('date').optional().isISO8601().withMessage('Date is required in ISO8601 format'),
    body('location').optional().notEmpty().withMessage('Location is required'),
    body('ticketsAvailable').optional().isInt({ min: 0 }).withMessage('Tickets available should be a non-negative integer'),
    body('ticketPrice').optional().isFloat({ min: 0 }).withMessage('Ticket price should be a non-negative number')
  ],
  eventController.updateEvent
);

router.delete(
  '/:id',
  [verifyAdminOrOrganizer, param('id').isMongoId().withMessage('Invalid event ID')],
  eventController.deleteEvent
);

module.exports = router;
