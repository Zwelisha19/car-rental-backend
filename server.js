
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const adminAuthRoutes = require('./routes/adminAuth');
const adminRoutes = require('./routes/adminRoutes');

//const userAuthRoutes = require('./routes/userAuth');
const userRoutes = require('./routes/userRoutes');

const vehicleRoutes = require('./routes/vehicleRoutes'); // ✅ new

const bookingRoutes = require('./routes/bookingRoutes');

const contactRoutes = require('./routes/contactRoutes');
console.log('Contact routes loaded:', contactRoutes);

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
// app.use(express.json());
app.use(express.json({ limit: '50mb' })); 

app.use(cors());

app.get('/', (req, res) => {
  res.send('🚗 Car Rental API is running!');
});

// Admin Routes
app.use('/api/admin', adminAuthRoutes); // POST /api/admin/login
app.use('/api/admin', adminRoutes);     // GET /api/admin/dashboard

//User Routes
// app.use('/api/users', userAuthRoutes); // POST /api/users/register, POST /api/users/login
app.use('/api/users', userRoutes);     // GET /api/users/dashboard

//vehicle Routes
app.use('/api/vehicles', vehicleRoutes);  

//bookings Routes
app.use('/api/bookings', bookingRoutes);

app.use('/api/contact', contactRoutes);

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));


