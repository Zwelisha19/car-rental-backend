
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  passengers: {
    type: Number,
    required: true
  },
  transmission: {
    type: String,
    required: true,
    enum: ['Automatic', 'Manual']
  },
  fuel: {
    type: String,
    required: true,
    enum: ['Gasoline', 'Diesel', 'Electric', 'Hybrid']
  },
  luggage: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  reviews: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);