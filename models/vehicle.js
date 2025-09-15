const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  make: { type: String, required: true },       // e.g., Toyota
  model: { type: String, required: true },      // e.g., Camry
  year: { type: Number, required: true },       // e.g., 2023
  licensePlate: { type: String, required: true, unique: true },
  type: { type: String, enum: ['economy', 'SUV', 'luxury', 'minivan'], required: true },
  pricePerDay: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
  location: { type: String, required: true },
    seats: { type: Number, default: 4 },                 // e.g., 5 seats
  transmission: { type: String, enum: ['manual', 'automatic'], default: 'automatic' },
  fuelType: { type: String, enum: ['petrol', 'diesel', 'hybrid', 'electric'], default: 'petrol' },
  imageUrl: { type: String },                          // optional vehicle image
  description: { type: String },  
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
