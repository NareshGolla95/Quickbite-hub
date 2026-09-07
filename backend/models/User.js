const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user', 'delivery'], required: true },
  phone: { type: String },
  location: { type: String },
  bikeNumber: { type: String },
  photo: { type: String } // primarily for delivery
});

module.exports = mongoose.model('User', userSchema);
