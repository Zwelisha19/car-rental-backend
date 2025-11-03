
// routes/adminRoutes.js
const express = require('express');
const { protect, adminMiddleware } = require('../middleware/authmiddleware');

const router = express.Router();

// Example admin-only route
router.get('/dashboard', protect, adminMiddleware, (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.id}` });
});

module.exports = router;
