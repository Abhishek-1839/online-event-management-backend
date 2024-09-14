const express = require('express');
const router = express.Router();
const TicketTypeController = require('../controllers/TicketTypeController');

// Define routes for ticket type operations
router.post('/', TicketTypeController.createTicketType);
router.get('/', TicketTypeController.getAllTicketTypes);
router.get('/:id', TicketTypeController.getTicketTypeById);
router.put('/:id', TicketTypeController.updateTicketType);
router.delete('/:id', TicketTypeController.deleteTicketType);

module.exports = router;
