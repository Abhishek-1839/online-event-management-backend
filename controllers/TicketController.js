const TicketType = require('../models/TicketType');
const Ticket = require('../models/Ticket');
const Event = require('../models/event');
const User = require('../models/User');
const stripe = require('../utils/stripe');
const nodemailer = require('nodemailer'); // Nodemailer for sending emails
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


    // Create a new ticket
    const ticket = new Ticket({
      event: event._id,
      purchaser: purchaser._id,
      paymentMethod,
      ticketType: ticketTypeData._id,
      paymentStatus: 'pending'
    });


    await ticket.save();


// const product = await stripe.products.create({
//       name: `Ticket for ${event.title}`,
//       description: `Ticket type: ${ticketTypeData.name}`
//     });
// console.log(product);
//     const price = await stripe.prices.create({
//       unit_amount: ticketTypeData.price * 100, // Convert price to cents
//       currency: 'USD',
//       product: product.id
//     });

    // if (price) {
    //   console.log(`Product ID: ${product.id}, Price ID: ${price.id}`);
    //   res.json({
    //     ticket,
    //     message: "Ticket order created and Stripe product/price created.",
    //     stripe: { productId: product.id, priceId: price.id }
    //   });

    res.json({
      ticket,
      message: "Ticket order created."
    });
    // } else {
    //   return res.status(500).json({ error: 'Error in Stripe payment creation' });
    // }
  } catch (err) {
    console.error('Error in creating ticket order:', err);
    res.status(500).json({ error: 'Failed to create ticket order' });
  }
};

// Confirm payment and update ticket status
exports.confirmPayment = async (req, res) => {
  const ticketId = req.params.id;
  const { paymentIntentId } = req.body;

  try {
    const ticket = await Ticket.findById(ticketId).exec();
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // // Generate signature to verify the payment
    // const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    //   .update(`${razorpayOrderId}|${paymentId}`)
    //   .digest('hex');

    // if (generatedSignature === signature) {
    //   ticket.paymentStatus = 'paid';
    //   ticket.paymentIntentId = paymentId;
    //   await ticket.save();
    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      ticket.paymentStatus = 'paid';
      await ticket.save();

      // Send confirmation email
      const purchaser = await User.findById(ticket.purchaser);
      const event = await Event.findById(ticket.event);
      await sendEmail(
        purchaser.email,
        `Ticket Purchase Confirmation for ${event.title}`,
        `Your payment for the event ${event.title} has been successful.`
      );

      res.json({ message: 'Payment successful and ticket confirmed', ticket });
    } else {
      res.status(400).json({ error: 'Payment verification failed' });
    }
  } catch (err) {
    console.error(err);
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

// exports.createTicketOrder = async (req, res) => {
//   const { eventId, purchaserId, ticketType } = req.body;
//   try {
//     const event = await Event.findById(eventId).exec();
//     const purchaser = await User.findById(purchaserId).exec();
//     const ticketTypeData = await TicketType.findById(ticketType).exec();
    
//     if (!event || !purchaser || !ticketTypeData) {
//       return res.status(404).json({ error: 'Event, user, or ticket type not found' });
//     }

//     const ticket = new Ticket({
//       event: event._id,
//       purchaser: purchaser._id,
//       paymentMethod: req.body.paymentMethod,
//       ticketType: ticketTypeData._id
//     });

//     const amount = ticketTypeData.price * 100; // convert to paise

//     const order = await razorpay.orders.create({
//       amount,
//       currency: 'INR',
//       receipt: `Ticket ${ticketTypeData.name} for event ${event.title}`
//     });

//     ticket.razorpayOrderId = order.id;
//     await ticket.save();

//     res.json({ ticket, order });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to create ticket' });
//   }
// };

// exports.confirmPayment = async (req, res) => {
//   const ticketId = req.params.id;
//   const { paymentId, signature } = req.body;

//   try {
//     const ticket = await Ticket.findById(ticketId).exec();
//     if (!ticket) {
//       return res.status(404).json({ error: 'Ticket not found' });
//     }

//     const payment = await razorpay.payments.fetch(ticket.razorpayOrderId);

//     if (payment.status === 'captured') {
//       ticket.paymentStatus = 'paid';
//       ticket.paymentIntentId = paymentId; // Store payment ID
//       await ticket.save();
//       res.json({ ticket });
//     } else {
//       res.status(500).json({ error: 'Payment failed' });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to process payment' });
//   }
// };
