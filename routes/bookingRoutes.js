// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookingController');

const { protect, adminMiddleware } = require('../middleware/authmiddleware');

// Public route - anyone can create a booking
router.post('/', createBooking);

// Admin routes (protected)
router.get('/', protect, adminMiddleware, getAllBookings);
router.put('/:id/status', protect, adminMiddleware, updateBookingStatus);
router.put('/:id/cancel', protect, adminMiddleware, cancelBooking);

module.exports = router;