// services/authService.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const config = require('../config/config'); // Import config file


/*
example json for register
{
  "username": "john_doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123",
  "role": "organizer",
  "createdEvents": []
}
*/
exports.register = async (data) => {
  const user = await User.create({ ...data, password: data.password });
  return user;
};

/* 
example json for logging in
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123"
}
*/
exports.login = async (data, res) => {
  const user = await User.findOne({ email: data.email });

  // Check if user exists and the password is correct
  if (!user || !await bcrypt.compare(data.password, user.password)) {
    throw new Error('Invalid email or password');
  }

  return jwt.sign({ id: user._id }, config.jwt.secret, { expiresIn: '1d' });
};

