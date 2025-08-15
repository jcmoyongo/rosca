const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/authValidators');

// Register
router.post('/register', validate(registerSchema), authController.register);

// Login
router.post('/login', validate(loginSchema), authController.login);

module.exports = router;
// === routes/authRoutes.js ===