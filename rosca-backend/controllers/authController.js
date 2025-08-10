// === controllers/authController.js ===
const { User } = require('../models');
const bcrypt = require('bcrypt');
const { generateToken } = require('../../utils/jwt');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({ name, email, hashed_password: hashedPassword });
        res.json({ token: generateToken(user.id), userId: user.id });
    } catch (err) {
        res.status(400).json({ error: 'Email already registered.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

    const match = await bcrypt.compare(password, user.hashed_password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials.' });

    res.json({ token: generateToken(user.id), userId: user.id });
};