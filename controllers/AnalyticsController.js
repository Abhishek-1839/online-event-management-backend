// controllers/AnalyticsController.js
const Ticket = require('../models/Ticket');
const Event = require('../models/event');


// Get event analytics, accessible only by admin
exports.getEventAnalytics = async (req, res) => {
  try {
    console.log("Received request for event analytics");
    const events = await Event.find().exec();
    if (!events) {
      console.log("No events found");
      return res.status(404).json({ error: 'No events found' });
    }

    const analytics = await Promise.all(
      events.map(async (event) => {
        const tickets = await Ticket.find({ event: event._id }).exec();
        const pendingTickets = await Ticket.find({ event: event._id, paymentStatus: "pending" }).exec();
        const ticketSales = tickets.reduce((total, ticket) => total + ticket.price, 0);
        const attendance = tickets.length;
        return {
          eventId: event._id,
          title: event.title,
          paymentstatus:pendingTickets.length,
          ticketSales,
          attendance,
          revenue: ticketSales,
        };
      })
    );
    console.log("Analytics data:", analytics);
    res.json(analytics);
  } catch (err) {
    console.error('Error fetching event analytics:', err);
    res.status(500).json({ error: 'Failed to fetch event analytics' });
  }
};
