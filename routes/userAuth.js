// const express = require('express');
// const User = require('../models/User');
// const generateToken = require('../config/auth');

// const router = express.Router();

// // @desc    Register new user
// // @route   POST /api/users/register
// // @access  Public
// router.post('/register', async (req, res) => {
//   try {
//     const { name, email, password, driverLicense } = req.body;

//     const userExists = await User.findOne({ email });
//     if (userExists) return res.status(400).json({ message: 'User already exists' });

//     const user = await User.create({ name, email, password, driverLicense });

//     res.status(201).json({
//       token: generateToken(user._id, 'user'),
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @desc    User login
// // @route   POST /api/users/login
// // @access  Public
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//     const isMatch = await user.matchPassword(password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//     res.json({
//       token: generateToken(user._id, 'user'),
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;




const express = require('express');
const User = require('../models/User');
const generateToken = require('../config/auth');

const router = express.Router();

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phoneNumber, driverLicense } = req.body; // 📌 added phoneNumber

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, phoneNumber, driverLicense }); // 📌 include phoneNumber

    res.status(201).json({
      token: generateToken(user._id, 'user'),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber, // 📌 return phoneNumber
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    User login
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({
      token: generateToken(user._id, 'user'),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber, // 📌 return phoneNumber
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

