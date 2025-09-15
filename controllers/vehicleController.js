const Vehicle = require('../models/vehicle');

// @desc    Get all vehicles (optional filters)
// @route   GET /api/vehicles
// @access  Public
const getVehicles = async (req, res) => {
  try {
    const { type, location, transmission, fuelType } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (location) filter.location = location;
    if (transmission) filter.transmission = transmission;
    if (fuelType) filter.fuelType = fuelType;

    const vehicles = await Vehicle.find(filter);
    res.json(vehicles);
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Public
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (error) {
    console.error('Get vehicle by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add new vehicle
// @route   POST /api/vehicles
// @access  Admin
const addVehicle = async (req, res) => {
  try {
    const {
      make,
      model,
      year,
      licensePlate,
      type,
      pricePerDay,
      location,
      seats,
      transmission,
      fuelType,
      imageUrl,
      description
    } = req.body;

    const existingVehicle = await Vehicle.findOne({ licensePlate });
    if (existingVehicle) {
      return res.status(400).json({ message: 'Vehicle with this license plate already exists' });
    }

    const vehicle = await Vehicle.create({
      make,
      model,
      year,
      licensePlate,
      type,
      pricePerDay,
      location,
      seats,
      transmission,
      fuelType,
      imageUrl,
      description
    });

    res.status(201).json(vehicle);
  } catch (error) {
    console.error('Add vehicle error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Admin
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    Object.assign(vehicle, req.body);
    await vehicle.save();
    res.json(vehicle);
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Admin
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    await vehicle.deleteOne();
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getVehicles,
  getVehicleById,
  addVehicle,
  updateVehicle,
  deleteVehicle
};
