// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const paymentMiddleware = require("../middlewares/paymentsMiddleware");
const paymentController = require("../controllers/paymentController");

// Submit a contribution
router.post("/contribute", authMiddleware, paymentMiddleware, paymentController.submitContribution);

module.exports = router;
