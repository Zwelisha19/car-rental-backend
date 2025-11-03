const Vehicle = require('../models/vehicle');
const cloudinary = require('../config/cloudinary');

// @desc    Get all vehicles with frontend-compatible filters
// @route   GET /api/vehicles
// @access  Public
const getVehicles = async (req, res) => {
  try {
    const { type, price_min, price_max, transmission, fuel, passengers } = req.query;

    const filter = { available: true };
    
    // Frontend-compatible filters
    if (type) filter.type = new RegExp(type, 'i');
    if (transmission) filter.transmission = transmission;
    if (fuel) filter.fuel = fuel;
    if (passengers) filter.passengers = { $gte: parseInt(passengers) };
    
    // Price range filter
    if (price_min || price_max) {
      filter.price = {};
      if (price_min) filter.price.$gte = parseInt(price_min);
      if (price_max) filter.price.$lte = parseInt(price_max);
    }

    const vehicles = await Vehicle.find(filter);
    
    // Transform data to match frontend structure
    const transformedVehicles = vehicles.map(vehicle => ({
      id: vehicle._id,
      name: vehicle.name,
      type: vehicle.type,
      image: vehicle.image,
      price: vehicle.price,
      passengers: vehicle.passengers,
      transmission: vehicle.transmission,
      fuel: vehicle.fuel,
      luggage: vehicle.luggage,
      rating: vehicle.rating,
      reviews: vehicle.reviews,
      featured: vehicle.featured,
      available: vehicle.available // ADDED THIS LINE
    }));

    res.json(transformedVehicles);
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get vehicle by ID (frontend compatible)
// @route   GET /api/vehicles/:id
// @access  Public
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    
    // Transform to frontend structure
    const transformedVehicle = {
      id: vehicle._id,
      name: vehicle.name,
      type: vehicle.type,
      image: vehicle.image,
      price: vehicle.price,
      passengers: vehicle.passengers,
      transmission: vehicle.transmission,
      fuel: vehicle.fuel,
      luggage: vehicle.luggage,
      rating: vehicle.rating,
      reviews: vehicle.reviews,
      featured: vehicle.featured,
      available: vehicle.available
    };

    res.json(transformedVehicle);
  } catch (error) {
    console.error('Get vehicle by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add new vehicle (admin only)
// @route   POST /api/vehicles
// @access  Admin
const addVehicle = async (req, res) => {
  try {
    const {
      name,
      type,
      imageBase64,
      price,
      passengers,
      transmission,
      fuel,
      luggage,
      rating,
      reviews,
      featured,
      available
    } = req.body;

    // Check if vehicle with same name exists
    const existingVehicle = await Vehicle.findOne({ name });
    if (existingVehicle) {
      return res.status(400).json({ message: 'Vehicle with this name already exists' });
    }

    // Upload image to Cloudinary if base64 is provided
    let imageUrl = '';
    if (imageBase64) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
          folder: 'vehicles',
          resource_type: 'image'
        });
        imageUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(400).json({ message: 'Failed to upload image' });
      }
    } else {
      return res.status(400).json({ message: 'Vehicle image is required' });
    }

    const vehicleData = {
      name,
      type,
      image: imageUrl,
      price,
      passengers,
      transmission,
      fuel,
      luggage,
      rating: rating || 4.5,
      reviews: reviews || 0,
      featured: featured || false,
      available: available !== undefined ? available : true
    };

    const vehicle = await Vehicle.create(vehicleData);
    
    // Return transformed vehicle
    const transformedVehicle = {
      id: vehicle._id,
      name: vehicle.name,
      type: vehicle.type,
      image: vehicle.image,
      price: vehicle.price,
      passengers: vehicle.passengers,
      transmission: vehicle.transmission,
      fuel: vehicle.fuel,
      luggage: vehicle.luggage,
      rating: vehicle.rating,
      reviews: vehicle.reviews,
      featured: vehicle.featured,
      available: vehicle.available // ADDED THIS LINE
    };

    res.status(201).json(transformedVehicle);
  } catch (error) {
    console.error('Add vehicle error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update vehicle (admin only)
// @route   PUT /api/vehicles/:id
// @access  Admin
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    // Handle image update if new base64 image is provided
    if (req.body.imageBase64) {
      try {
        // Upload new image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(req.body.imageBase64, {
          folder: 'vehicles',
          resource_type: 'image'
        });
        
        // Update the image URL
        req.body.image = uploadResponse.secure_url;
        
        // Delete the old image from Cloudinary if it exists
        if (vehicle.image) {
          const publicId = vehicle.image.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`vehicles/${publicId}`);
        }
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(400).json({ message: 'Failed to upload image' });
      }
    }

    // Remove imageBase64 from req.body as we don't want to store it in the database
    delete req.body.imageBase64;

    // Update only provided fields
    const updatableFields = [
      'name', 'type', 'image', 'price', 'passengers', 'transmission', 
      'fuel', 'luggage', 'rating', 'reviews', 'featured', 'available'
    ];

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        vehicle[field] = req.body[field];
      }
    });

    await vehicle.save();

    // Return transformed vehicle
    const transformedVehicle = {
      id: vehicle._id,
      name: vehicle.name,
      type: vehicle.type,
      image: vehicle.image,
      price: vehicle.price,
      passengers: vehicle.passengers,
      transmission: vehicle.transmission,
      fuel: vehicle.fuel,
      luggage: vehicle.luggage,
      rating: vehicle.rating,
      reviews: vehicle.reviews,
      featured: vehicle.featured,
      available: vehicle.available // ADDED THIS LINE
    };

    res.json(transformedVehicle);
  } catch (error) {
    console.error('Update vehicle error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete vehicle (admin only)
// @route   DELETE /api/vehicles/:id
// @access  Admin
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    // Delete image from Cloudinary if it exists
    if (vehicle.image) {
      try {
        const publicId = vehicle.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`vehicles/${publicId}`);
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
        // Continue with vehicle deletion even if image deletion fails
      }
    }

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