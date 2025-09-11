// const express = require('express');
// const User = require('../models/User');
// const generateToken = require('../config/auth');

// const router = express.Router();

// // @desc    Register new user
// // @route   POST /api/users/register
// // @access  Public
// router.post('/register', async (req, res) => {
//   try {
//     const { name, email, password, phoneNumber, driverLicense } = req.body; // 📌 added phoneNumber

//     const userExists = await User.findOne({ email });
//     if (userExists) return res.status(400).json({ message: 'User already exists' });

//     const user = await User.create({ name, email, password, phoneNumber, driverLicense }); // 📌 include phoneNumber

//     res.status(201).json({
//       token: generateToken(user._id, 'user'),
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phoneNumber: user.phoneNumber, // 📌 return phoneNumber
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
//         phoneNumber: user.phoneNumber, // 📌 return phoneNumber
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;




/*
const express = require('express');
const User = require('../models/User');
const generateToken = require('../config/auth');

const router = express.Router();

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, surname, email, password, driverLicense, phoneNumber } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, surname, email, password, driverLicense, phoneNumber });

    res.status(201).json({
      token: generateToken(user._id, 'user'),
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        phoneNumber: user.phoneNumber,
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
        surname: user.surname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

*/






// // routes/userAuth.js  (replace your current register route with this)
// const express = require('express');
// const User = require('../models/User');
// const generateToken = require('../config/auth');

// const router = express.Router();

// // Password validation regex:
// // - at least 8 characters
// // - at least one lowercase letter
// // - at least one uppercase letter
// // - at least one digit
// // - at least one special character
// const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
// const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // Simple E.164-ish phone regex (optional field)
// const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

// // @desc    Register new user
// // @route   POST /api/users/register
// // @access  Public
// router.post('/register', async (req, res) => {
//   try {
//     let { name, surname, email, password, driverLicense, phoneNumber } = req.body || {};

//     // Basic required fields
//     if (!name || !surname || !email || !password) {
//       return res.status(400).json({ message: 'name, surname, email and password are required' });
//     }

//     // Normalize & trim
//     name = String(name).trim();
//     surname = String(surname).trim();
//     email = String(email).trim().toLowerCase();
//     password = String(password);
//     driverLicense = driverLicense ? String(driverLicense).trim() : undefined;
//     phoneNumber = phoneNumber ? String(phoneNumber).trim() : undefined;

//     // Email format
//     if (!EMAIL_REGEX.test(email)) {
//       return res.status(400).json({ message: 'Invalid email format' });
//     }

//     // Password strength
//     if (!PASSWORD_REGEX.test(password)) {
//       return res.status(400).json({
//         message:
//           'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number and one special character'
//       });
//     }

//     // Optional phone validation
//     if (phoneNumber && !PHONE_REGEX.test(phoneNumber)) {
//       return res.status(400).json({
//         message: 'Invalid phone number format. Use international format, e.g. +1234567890'
//       });
//     }

//     // Check if email already exists (case-insensitive)
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: 'User already exists with that email' });
//     }

//     // Create new user (model's pre-save hook should hash password)
//     const user = await User.create({
//       name,
//       surname,
//       email,
//       password,
//       driverLicense,
//       phoneNumber
//     });

//     return res.status(201).json({
//       token: generateToken(user._id, 'user'),
//       user: {
//         id: user._id,
//         name: user.name,
//         surname: user.surname,
//         email: user.email,
//         phoneNumber: user.phoneNumber,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     // handle duplicate key error (race condition)
//     if (error.code === 11000 && error.keyValue && error.keyValue.email) {
//       return res.status(400).json({ message: 'Email already registered' });
//     }

//     console.error('Register error:', error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;





const express = require('express');
const User = require('../models/User');
const generateToken = require('../config/auth');

const router = express.Router();

// Password validation regex
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

// -------------------- REGISTER --------------------
router.post('/register', async (req, res) => {
  try {
    let { name, surname, email, password, driverLicense, phoneNumber } = req.body || {};

    if (!name || !surname || !email || !password) {
      return res.status(400).json({ message: 'name, surname, email and password are required' });
    }

    name = String(name).trim();
    surname = String(surname).trim();
    email = String(email).trim().toLowerCase();
    password = String(password);
    driverLicense = driverLicense ? String(driverLicense).trim() : undefined;
    phoneNumber = phoneNumber ? String(phoneNumber).trim() : undefined;

    if (!EMAIL_REGEX.test(email)) return res.status(400).json({ message: 'Invalid email format' });
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number and one special character'
      });
    }
    if (phoneNumber && !PHONE_REGEX.test(phoneNumber)) {
      return res.status(400).json({
        message: 'Invalid phone number format. Use international format, e.g. +1234567890'
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists with that email' });

    const user = await User.create({ name, surname, email, password, driverLicense, phoneNumber });

    return res.status(201).json({
      token: generateToken(user._id, 'user'),
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });
  } catch (error) {
    if (error.code === 11000 && error.keyValue && error.keyValue.email) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// -------------------- LOGIN --------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    return res.json({
      token: generateToken(user._id, 'user'),
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
