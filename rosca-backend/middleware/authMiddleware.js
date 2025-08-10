
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