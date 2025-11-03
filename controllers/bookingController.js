const Booking = require('../models/booking');
const Vehicle = require('../models/vehicle');
const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public
const createBooking = async (req, res) => {
  try {
    const { 
      vehicleId, 
      vehicleName,
      fullName, 
      email, 
      phone, 
      pickupDate, 
      returnDate, 
      location, 
      specialRequests,
      totalPrice,
      paymentId,
      paymentStatus      
    } = req.body;

    // Validate required fields
    if (!vehicleId || !fullName || !email || !phone || !pickupDate || !returnDate || !location) {
      return res.status(400).json({ 
        message: 'Vehicle, personal details, dates, and location are required' 
      });
    }

    const start = new Date(pickupDate);
    const end = new Date(returnDate);

    if (start >= end) {
      return res.status(400).json({ message: 'Return date must be after pickup date' });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (!vehicle.available) {
      return res.status(400).json({ message: 'Vehicle is not available for booking' });
    }

    // Calculate total price if not provided
    const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const calculatedTotalPrice = totalPrice || (durationDays * vehicle.price);

    // Create booking
    const booking = await Booking.create({
      vehicle: vehicleId,
      vehicleName: vehicleName || vehicle.name,
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      pickupDate: start,
      returnDate: end,
      pickupLocation: location,
      specialRequests: specialRequests || '',
      totalPrice: calculatedTotalPrice,
      paymentId: paymentId || 'manual',
      paymentStatus: paymentStatus || 'completed', 
      status: 'confirmed',
    });

    // Update vehicle availability
    vehicle.available = false;
    await vehicle.save();

    // Send emails
    await sendCustomerConfirmationEmail(booking, vehicle);
    await sendAdminNotificationEmail(booking, vehicle);

    res.status(201).json({
      message: 'Booking created successfully! Confirmation email sent.',
      booking: {
        id: booking._id,
        vehicleName: booking.vehicleName,
        customerName: booking.customerName,
        pickupDate: booking.pickupDate,
        returnDate: booking.returnDate,
        totalPrice: booking.totalPrice,
        status: booking.status
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Email function for customer confirmation
const sendCustomerConfirmationEmail = async (booking, vehicle) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.customerEmail,
      subject: `Booking Confirmation - ${booking.vehicleName}`,
      html: `
        <h2>Booking Confirmation</h2>
        <p>Dear ${booking.customerName},</p>
        <p>Your booking has been confirmed! Here are your booking details:</p>
        
        <h3>Vehicle Details:</h3>
        <ul>
          <li><strong>Vehicle:</strong> ${booking.vehicleName}</li>
          <li><strong>Pick-up Date:</strong> ${booking.pickupDate.toDateString()}</li>
          <li><strong>Return Date:</strong> ${booking.returnDate.toDateString()}</li>
          <li><strong>Pick-up Location:</strong> ${booking.pickupLocation}</li>
          <li><strong>Total Price:</strong> R${booking.totalPrice}</li>
        </ul>

        <h3>Contact Information:</h3>
        <ul>
          <li><strong>Name:</strong> ${booking.customerName}</li>
          <li><strong>Email:</strong> ${booking.customerEmail}</li>
          <li><strong>Phone:</strong> ${booking.customerPhone}</li>
        </ul>

        ${booking.specialRequests ? `
        <h3>Special Requests:</h3>
        <p>${booking.specialRequests}</p>
        ` : ''}

        <p>Thank you for choosing DriveNow!</p>
        <p>If you have any questions, please contact us at support@drivenow.com</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to customer');
  } catch (error) {
    console.error('Error sending customer email:', error);
  }
};

// Email function for admin notification
const sendAdminNotificationEmail = async (booking, vehicle) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Booking - ${booking.vehicleName}`,
      html: `
        <h2>New Booking Received</h2>
        
        <h3>Customer Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${booking.customerName}</li>
          <li><strong>Email:</strong> ${booking.customerEmail}</li>
          <li><strong>Phone:</strong> ${booking.customerPhone}</li>
        </ul>

        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Vehicle:</strong> ${booking.vehicleName}</li>
          <li><strong>Pick-up Date:</strong> ${booking.pickupDate.toDateString()}</li>
          <li><strong>Return Date:</strong> ${booking.returnDate.toDateString()}</li>
          <li><strong>Pick-up Location:</strong> ${booking.pickupLocation}</li>
          <li><strong>Total Price:</strong> R${booking.totalPrice}</li>
          <li><strong>Booking ID:</strong> ${booking._id}</li>
        </ul>

        ${booking.specialRequests ? `
        <h3>Special Requests:</h3>
        <p>${booking.specialRequests}</p>
        ` : ''}

        <p>Please prepare the vehicle and contact the customer if needed.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Notification email sent to admin');
  } catch (error) {
    console.error('Error sending admin email:', error);
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private (Admin)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('vehicle')
      .sort({ createdAt: -1 }); // Sort by newest first
    res.json(bookings);
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('vehicle');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be one of: ' + validStatuses.join(', ') });
    }

    booking.status = status;
    await booking.save();

    // Update vehicle availability based on status
    if (booking.vehicle) {
      if (status === 'cancelled' || status === 'completed') {
        booking.vehicle.available = true;
      } else if (status === 'confirmed' || status === 'active') {
        booking.vehicle.available = false;
      }
      await booking.vehicle.save();
    }

    res.json({ 
      message: 'Booking status updated successfully', 
      booking: {
        id: booking._id,
        status: booking.status,
        vehicleName: booking.vehicleName,
        customerName: booking.customerName
      }
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Admin)
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('vehicle');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Make vehicle available again
    if (booking.vehicle) {
      booking.vehicle.available = true;
      await booking.vehicle.save();
    }

    res.json({ 
      message: 'Booking cancelled successfully', 
      booking: {
        id: booking._id,
        status: booking.status,
        vehicleName: booking.vehicleName,
        customerName: booking.customerName
      }
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  cancelBooking,
  updateBookingStatus
};