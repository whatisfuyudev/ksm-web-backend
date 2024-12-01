const User = require('../models/User');

// Middleware to verify if the user is an organizer
const verifyOrganizer = async (req, res, next) => {
  const targetUser = await User.findUserById(req.user.id);

  if (targetUser.role === 'organizer') return next();
  res.status(403).json({ message: 'Access denied: organizers only' });
};

// Middleware to verify if the user is an admin or organizer
const verifyAdminOrOrganizer = async (req, res, next) => {
  const targetUser = await User.findUserById(req.user.id);

  if (['admin', 'organizer'].includes(targetUser.role)) return next();
  res.status(403).json({ message: 'Access denied: organizers or admins only' });
};

// Middleware to verify if the user is an attendee
const verifyUser = async (req, res, next) => {
  const targetUser = await User.findUserById(req.user.id);

  if (targetUser.role === 'attendee') return next();
  res.status(403).json({ message: 'Access denied: attendees only' });
};

module.exports = { verifyOrganizer, verifyAdminOrOrganizer, verifyUser };
