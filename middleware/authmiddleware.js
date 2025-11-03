// middleware/authmiddleware.js
const jwt = require('jsonwebtoken');

// Protect routes
const protect = (req, res, next) => {
  let token = req.headers.authorization;

  console.log('Authorization header:', token); // debug

  if (token && token.startsWith('Bearer ')) {
    token = token.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
      req.user = decoded; // { id, role }
      next();
    } catch (error) {
      console.error('JWT verify error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Only admins
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Admins only access' });
  }
};

module.exports = { protect, adminMiddleware };
