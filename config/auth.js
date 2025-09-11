// const jwt = require('jsonwebtoken');

// const generateToken = (id, role) => {
//   return jwt.sign({ id, role }, process.env.JWT_SECRET, {
//     expiresIn: '30d'
//   });
// };

// module.exports = generateToken;


// config/auth.js
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET || 'supersecret';
  return jwt.sign({ id, role }, secret, { expiresIn: '30d' });
};

module.exports = generateToken;
