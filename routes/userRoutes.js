const express = require('express');
const { protect } = require('../middleware/authmiddleware');

const router = express.Router();

// Example: User dashboard
router.get('/dashboard', protect, (req, res) => {
  res.json({ message: `Welcome User ${req.user.id}` });
});

module.exports = router;
