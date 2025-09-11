// const express = require('express');
// const bcrypt = require('bcryptjs');
// const Admin = require('../models/admin');
// const generateToken = require('../config/auth'); // your JWT generator

// const router = express.Router();

// // @desc    Admin Login
// // @route   POST /api/admin/login
// // @access  Public
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const admin = await Admin.findOne({ email });
//     if (!admin) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     res.json({
//       token: generateToken(admin._id, 'admin'), // ✅ uses your helper
//       admin: {
//         id: admin._id,
//         name: admin.name,
//         email: admin.email,
//         role: admin.role,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;


// routes/adminAuth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin'); // your Admin model
const generateToken = require('../config/auth'); // correct JWT import

const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({
      token: generateToken(admin._id, 'admin'),
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
