// require('dotenv').config();
// const express = require('express');
// const connectDB = require('./config/db');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Connect DB
// connectDB();

// // Middleware
// app.use(express.json());

// // Default route
// app.get('/', (req, res) => {
//   res.send('🚗 Car Rental API is running and DB is connected!');
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });


// require('dotenv').config();
// const express = require('express');
// const connectDB = require('./config/db');

// // Import routes
// const adminRoutes = require('./routes/adminRoutes');
// const adminAuthRoutes = require('./routes/adminAuth'); // for login

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Connect DB
// connectDB();

// // Middleware
// app.use(express.json());

// // Default route
// app.get('/', (req, res) => {
//   res.send('🚗 Car Rental API is running and DB is connected!');
// });

// // Use Routes
// app.use('/api/admin', adminAuthRoutes);   // e.g. POST /api/admin/login
// app.use('/api/admin', adminRoutes);       // e.g. GET /api/admin/dashboard

// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });



require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const adminAuthRoutes = require('./routes/adminAuth');
const adminRoutes = require('./routes/adminRoutes');

const userAuthRoutes = require('./routes/userAuth');
const userRoutes = require('./routes/userRoutes');

const vehicleRoutes = require('./routes/vehicleRoutes'); // ✅ new

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('🚗 Car Rental API is running!');
});

// Admin Routes
app.use('/api/admin', adminAuthRoutes); // POST /api/admin/login
app.use('/api/admin', adminRoutes);     // GET /api/admin/dashboard

//User Routes
app.use('/api/users', userAuthRoutes); // POST /api/users/register, POST /api/users/login
app.use('/api/users', userRoutes);     // GET /api/users/dashboard

//vehicle
app.use('/api/vehicles', vehicleRoutes);  

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
