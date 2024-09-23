const TicketType = require('../models/TicketType');
const Ticket = require('../models/Ticket');
const Event = require('../models/event');
const User = require('../models/User');
const stripe = require('../utils/stripe');
const { sendEmail } = require('../utils/email');
const dotenv = require('dotenv'); 
dotenv.config();

// Create a new ticket order
exports.createTicketOrder = async (req, res) => {
  const { eventId, purchaserId, paymentMethod } = req.body;
  const ticketTypeNamee = req.body.ticketTypeName.trim();
  try {

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    const purchaser = await User.findById(purchaserId);
    if (!purchaser) {
      return res.status(404).json({ error: 'User not found' });
    }
  

    const ticketTypeData = await TicketType.findOne({ name: { $regex: ticketTypeNamee, $options: 'i' } });
    if (!ticketTypeData) {
      console.log('TicketType not found:', ticketTypeNamee);
      return res.status(404).json({ error: 'TicketType not found' });
    }
    console.log('TicketType found:', ticketTypeData);



    if (!event || !purchaser || !ticketTypeData) {
      return res.status(404).json({ error: 'Event, user, or ticket type not found' });
    }

    res.json({
      message: "Ticket order created."
    });

  } catch (err) {
    console.error('Error in creating ticket order:', err);
    res.status(500).json({ error: 'Failed to create ticket order' });
  }
};

// Confirm payment and update ticket status
exports.confirmPayment = async (req, res) => {
  const ticketId = req.params.id;
  const sessionId = req.query.session_id;

  try {
    const ticket = await Ticket.findById(ticketId).exec();
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }


    const session = await stripe.checkout.sessions.retrieve(sessionId);
    // Extract the payment intent ID from the session
    const paymentIntentId = session.payment_intent;


    // Retrieve the payment intent details from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);


    if (paymentIntent.status === 'succeeded') {

      const ticket = await Ticket.findById(ticketId).exec();
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      ticket.paymentStatus = 'paid';
      await ticket.save();

      // Send confirmation email
      const purchaser = await User.findById(ticket.purchaser);
      const event = await Event.findById(ticket.event);
      // Use the imported sendEmail function
      await sendEmail(
        purchaser.email,
        `Ticket Purchase Confirmation for ${event.title}`,
        `Your payment for the event ${event.title} has been successful.`
      );

       return res.json({ message: 'Payment successful and ticket confirmed', ticket });
    } else {
      return res.status(400).json({ error: 'Payment was not successful' });
    }
  } catch (err) {
  console.error('Error confirming payment:', err);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
};
exports.getAllTicketTypes = async (req, res) => {
  try {
    const ticketTypes = await TicketType.find().exec();
    res.json(ticketTypes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ticket types' });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().exec();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().exec();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Controller to get payment status of a ticket
exports.getPaymentStatus = async (req, res) => {
  try {
    const ticketId = req.params.id; // Get the ticket ID from the request params
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Send the payment status back to the client
    res.status(200).json({ status: ticket.paymentStatus });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.getTicketIdBySession = async (req, res) => {
  const { sessionId } = req.params; // Get the session ID from the request params

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId); // Retrieve the session from Stripe

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const ticketId = session.metadata.ticketId; // Get the ticketId from the session's metadata
    if (!ticketId) {
      return res.status(404).json({ error: 'Ticket ID not found in session metadata' });
    }
    // Return the ticketId to the frontend
    res.status(200).json({ ticketId });
  } catch (error) {
    console.error('Error fetching session from Stripe:', error);
    res.status(500).json({ error: 'Failed to retrieve session' });
  }
};
