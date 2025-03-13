const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: '/placeholder.svg',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
  familyId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Family',
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
