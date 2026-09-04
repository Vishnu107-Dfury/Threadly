const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  displayName: String,
  photoURL: String,
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
