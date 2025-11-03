const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  vehicleName: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  // CHANGED: startDate → pickupDate
  pickupDate: {
    type: Date,
    required: true,
  },
  // CHANGED: endDate → returnDate
  returnDate: {
    type: Date,
    required: true,
  },
  pickupLocation: {
    type: String,
    required: true
  },
  specialRequests: {
    type: String,
    default: ''
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed', // CHANGED from 'pending' to 'confirmed'
  },
  paymentId: {
    type: String,
    default: 'manual'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed'
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);