const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Event = require('../models/event');
const { sendEmail } = require('../utils/email'); // Assuming you have a mailer utility

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET; // Set this to your actual Stripe Webhook secret

const router = express.Router();

// Stripe webhook handler
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        // Verify the Stripe webhook signature
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const ticketId = session.metadata.ticketId;
      

        console.log('Received checkout.session.completed event for ticket:', ticketId);

    try {
        const ticket = await Ticket.findById(ticketId);
        if (ticket) {
          console.log('Found ticket:', ticket);
          ticket.paymentStatus = 'paid';
          await ticket.save();
          console.log('Payment status updated to paid for ticket:', ticketId);
        } else {
          console.error('Ticket not found for ID:', ticketId);
        }
        const purchaser = await User.findById(ticket.purchaser);
        const eventDetails = await Event.findById(ticket.event);
        
        if (purchaser && eventDetails) {
            await sendEmail(
                purchaser.email,
                `Ticket Purchase Confirmation for ${eventDetails.title}`,
                `Your payment for the event ${eventDetails.title} has been successful.`
            );
        }

        console.log('Payment successful and ticket confirmed');
      } catch (error) {
        console.error('Error updating payment status:', error);
      }
        // Send confirmation email
       
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
});

module.exports = router;
