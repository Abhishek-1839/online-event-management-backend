const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

// Get all registrations
router.get('/registrations', adminController.getAllRegistrations);

module.exports = router;
