const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/groups', require('./groupRoutes'));
router.use('/payments', require('./paymentRoutes'));


module.exports = router;
