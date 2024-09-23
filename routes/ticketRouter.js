const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/TicketController');
const authMiddleware = require('../middleware/auth');

// Define routes for ticket operations
router.get('/ticket-types', TicketController.getAllTicketTypes);
router.get('/events', TicketController.getAllEvents);
router.get('/users', TicketController.getAllUsers);
router.post('/tickets', TicketController.createTicketOrder);
router.post('/tickets/:id/confirmPayment', TicketController.confirmPayment);
// In your routes file (e.g., routes/tickets.js or similar)
router.get('/tickets/:id/status', TicketController.getPaymentStatus);
// Add a new route to fetch the ticket ID by session ID
router.get('/tickets/session/:sessionId', TicketController.getTicketIdBySession);


module.exports = router;
