
// === utils/jwt.js ===
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

exports.generateToken = (userId) => jwt.sign({ id: userId }, SECRET, { expiresIn: '7d' });
exports.verifyToken = (token) => jwt.verify(token, SECRET);

console.log("✅ JWT_SECRET loaded:", !!process.env.JWT_SECRET);
