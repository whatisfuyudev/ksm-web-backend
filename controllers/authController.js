// controllers/authController.js
const authService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const user = await authService.register(req.body, res);
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const token = await authService.login(req.body, res);
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
