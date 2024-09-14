const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/TicketController');
const authMiddleware = require('../middleware/auth');

// Define routes for ticket operations
router.get('/ticket-types', TicketController.getAllTicketTypes);
router.get('/events', TicketController.getAllEvents);
router.get('/users', TicketController.getAllUsers);
router.post('/tickets', TicketController.createTicketOrder);
router.post('/tickets/:id', TicketController.confirmPayment);


module.exports = router;
