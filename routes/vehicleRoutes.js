
const express = require('express');
const {
  getVehicles,
  getVehicleById,
  addVehicle,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicleController');

const { protect, adminMiddleware } = require('../middleware/authmiddleware');
const upload = require('../middleware/upload'); // Multer Cloudinary storage

const router = express.Router();

// Public routes
router.get('/', getVehicles);           // GET all vehicles
router.get('/:id', getVehicleById);     // GET vehicle by ID

// Admin-protected routes
router.post('/', protect, adminMiddleware, upload.single('image'), addVehicle); // Add vehicle
router.put('/:id', protect, adminMiddleware, upload.single('image'), updateVehicle); // Update vehicle
router.delete('/:id', protect, adminMiddleware, deleteVehicle); // Delete vehicle

module.exports = router;
