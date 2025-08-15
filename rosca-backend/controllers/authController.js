// === controllers/authController.js ===
const { User } = require('../models');
const bcrypt = require('bcrypt');
const { generateToken } = require('../../utils/jwt');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, picture } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user, using default picture if none provided
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      picture: picture || 'https://randomuser.me/api/portraits/lego/1.jpg', // default placeholder
    });

    // Optionally return token or user info
    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      picture: newUser.picture
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

    const match = await bcrypt.compare(password, user.hashed_password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials.' });

    const token = generateToken(user.id);
    res.json({ token, userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login.' });
  }
};
