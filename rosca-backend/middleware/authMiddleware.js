
// === middleware/authMiddleware.js ===
const { verifyToken } = require('../../utils/jwt');
const { User } = require('../models');

exports.authenticate = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Token missing' });

    try {
        const decoded = verifyToken(token);
        req.user = await User.findByPk(decoded.id);
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1]; // Expect: "Bearer <token>"
  if (!token) return res.status(401).json({ error: 'Malformed token' });

  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded.id }; // attach user id to request
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
