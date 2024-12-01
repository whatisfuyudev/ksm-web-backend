const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // assuming you use bcrypt or bcryptjs for password hashing

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    maxLength: 80,
  },
  role: {
    type: String,
    enum: ['attendee', 'organizer', 'admin'],
    default: 'attendee',
  },
  createdEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event', // assuming you have an Event model
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Password hashing middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Static method to find a user by ID
userSchema.statics.findUserById = async function (id) {
  try {
    const user = await this.findById(id);
    if (!user) {
      console.log('User not found');
      return null;
    }
    return user;
  } catch (error) {
    console.error('Error finding user:', error.message);
    throw error;
  }
};

const User = mongoose.model('User', userSchema);
module.exports = User;
