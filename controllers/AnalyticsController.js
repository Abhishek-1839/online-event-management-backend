// controllers/AnalyticsController.js

const Ticket = require('../models/Ticket');
const Event = require('../models/event');

// Get event analytics
exports.getEventAnalytics = async (req, res) => {
  try {
    const events = await Event.find().exec();
    const analytics = await Promise.all(events.map(async (event) => {
      const tickets = await Ticket.find({ event: event._id }).exec();
      const ticketSales = tickets.reduce((total, ticket) => total + ticket.price, 0);
      const attendance = tickets.length;
      return {
        eventId: event._id,
        title: event.title,
        ticketSales,
        attendance,
        revenue: ticketSales,
      };
    }));
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event analytics' });
  }
};
