const TicketType = require('../models/TicketType');

// Create a new ticket type
exports.createTicketType = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const ticketType = new TicketType({ name, description, price });
    await ticketType.save();
    res.status(201).json(ticketType);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create ticket type' });
  }
};

// Get all ticket types
exports.getAllTicketTypes = async (req, res) => {
  try {
    const ticketTypes = await TicketType.find().exec();
    res.json(ticketTypes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ticket types' });
  }
};

// Get ticket type by ID
exports.getTicketTypeById = async (req, res) => {
  try {
    const ticketType = await TicketType.findById(req.params.id).exec();
    if (!ticketType) {
      return res.status(404).json({ error: 'Ticket type not found' });
    }
    res.json(ticketType);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ticket type' });
  }
};

// Update a ticket type
exports.updateTicketType = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const ticketType = await TicketType.findByIdAndUpdate(
      req.params.id,
      { name, description, price },
      { new: true }
    ).exec();

    if (!ticketType) {
      return res.status(404).json({ error: 'Ticket type not found' });
    }

    res.json(ticketType);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update ticket type' });
  }
};

// Delete a ticket type
exports.deleteTicketType = async (req, res) => {
  try {
    const ticketType = await TicketType.findByIdAndDelete(req.params.id).exec();
    if (!ticketType) {
      return res.status(404).json({ error: 'Ticket type not found' });
    }
    res.json({ message: 'Ticket type deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete ticket type' });
  }
};
