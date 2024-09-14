const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registration');

// Create a registration
router.post('/registrations', registrationController.createRegistration);

// Get all registrations for a user
router.get('/registrations', registrationController.getRegistrations);

// Delete a registration
router.delete('/registrations/:id', registrationController.deleteRegistration);

module.exports = router;
